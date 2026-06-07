import * as p from '@clack/prompts';
import pc from 'picocolors';
import { join } from 'node:path';
import {
  buildCommand,
  detectProject,
  findRouterEntryFiles,
  installCommand,
} from '../utils/detect.js';
import { detectGitRemote } from '../utils/git.js';
import {
  ensureBuildScript,
  hasDevDependency,
  readPackageJson,
  writePackageJson,
} from '../utils/package-json.js';
import { createDefaultViteConfig, patchViteConfig } from '../utils/vite-config.js';
import { patchRouterFiles } from '../utils/router.js';
import { writeWorkflow } from '../utils/ci.js';
import { runCommand } from '../utils/exec.js';
import { fileExists } from '../utils/fs.js';
import type { InitOptions, InitResult } from '../types.js';

function getPagesUrl(owner: string, repo: string, isUserSite: boolean): string {
  if (isUserSite) return `https://${owner}.github.io/`;
  return `https://${owner}.github.io/${repo}/`;
}

export async function init(options: InitOptions = {}): Promise<InitResult> {
  const cwd = options.cwd ?? process.cwd();
  const steps: string[] = [];
  const warnings: string[] = [];

  const project = detectProject(cwd);
  if (!project) {
    return {
      success: false,
      steps,
      warnings: ['Not a Vite project — run this inside a folder with vite in package.json'],
    };
  }

  const gitRemote = detectGitRemote(cwd);
  let pagesUrl: string | undefined;

  if (!options.yes) {
    p.intro(pc.bgCyan(pc.black(' vite-on-github ')));

    const confirm = await p.confirm({
      message: `Prepare ${pc.bold(project.cwd)} for GitHub Pages?`,
      initialValue: true,
    });

    if (p.isCancel(confirm) || !confirm) {
      p.cancel('Setup cancelled.');
      process.exit(0);
    }
  }

  const spinner = p.spinner();
  let installOk = options.skipInstall;

  // 1. Install vite-basepath
  if (!options.skipInstall) {
    spinner.start('Installing vite-basepath…');
    const pkg = readPackageJson(project.packageJsonPath);
    const alreadyInstalled = pkg ? hasDevDependency(pkg, 'vite-basepath') : false;

    if (alreadyInstalled) {
      spinner.stop('vite-basepath already installed');
      steps.push('vite-basepath already present');
      installOk = true;
    } else {
      try {
        const cmd = installCommand(project.packageManager, ['vite-basepath']);
        runCommand(cmd, cwd, true);
        spinner.stop('Installed vite-basepath');
        steps.push('Installed vite-basepath');
        installOk = true;
      } catch {
        spinner.stop('Failed to install vite-basepath');
        warnings.push(
          'Could not install vite-basepath — install it manually, then run init again',
        );
      }
    }
  }

  // 2. Ensure build script
  spinner.start('Checking package.json…');
  const pkg = readPackageJson(project.packageJsonPath);
  if (pkg) {
    const addedBuild = ensureBuildScript(pkg);
    if (addedBuild) {
      writePackageJson(project.packageJsonPath, pkg);
      steps.push('Added build script to package.json');
    }
  }
  spinner.stop('package.json ready');

  // 3. Patch or create vite config (only when vite-basepath is available)
  if (!options.skipViteConfig && installOk) {
    spinner.start('Configuring Vite…');

    if (project.viteConfigPath) {
      const result = patchViteConfig(project.viteConfigPath);
      if (result.changed) {
        steps.push(result.message);
      } else if (!result.message.includes('already')) {
        warnings.push(result.message);
      } else {
        steps.push(result.message);
      }
    } else {
      const useTs = fileExists(join(cwd, 'tsconfig.json'));
      const created = createDefaultViteConfig(cwd, useTs, project.framework);
      steps.push(`Created ${created}`);
    }

    spinner.stop('Vite configured with vite-basepath');
  } else if (!options.skipViteConfig && !installOk) {
    warnings.push('Skipped vite config — install vite-basepath first');
  }

  // 4. Patch router if needed
  if (!options.skipRouter) {
    const needsRouter =
      (project.framework === 'react' && project.hasReactRouter) ||
      (project.framework === 'vue' && project.hasVueRouter);

    if (needsRouter) {
      spinner.start('Configuring client-side router…');
      const routerFiles = findRouterEntryFiles(cwd, project.framework);
      const results = patchRouterFiles(routerFiles, project.framework);

      for (const r of results) {
        if (r.changed) steps.push(r.message);
        else warnings.push(r.message);
      }

      if (results.length === 0) {
        warnings.push(
          `Found ${project.framework} router dependency but could not locate entry file — add basename={getBase()} manually`,
        );
      }

      spinner.stop('Router setup complete');
    }
  }

  // 5. Create GitHub Actions workflow
  if (!options.skipCi) {
    spinner.start('Creating GitHub Actions workflow…');
    const { path, created } = writeWorkflow({
      cwd,
      packageManager: project.packageManager,
      nodeVersion: options.nodeVersion,
      buildOutputDir: options.outDir,
    });
    steps.push(created ? `Created ${path}` : `Updated ${path}`);
    spinner.stop('CI workflow ready');
  }

  if (gitRemote) {
    pagesUrl = getPagesUrl(gitRemote.owner, gitRemote.repo, gitRemote.isUserSite);
  }

  return { success: true, steps, warnings, pagesUrl };
}

export function printSummary(result: InitResult, packageManager: string): void {
  if (!result.success) {
    p.log.error(result.warnings[0] ?? 'Setup failed');
    return;
  }

  p.note(
    [
      'Push your code to GitHub',
      'Go to repo → Settings → Pages',
      'Set Source to "GitHub Actions"',
      `Run ${pc.cyan(buildCommand(packageManager as 'npm'))} locally to verify`,
    ].join('\n'),
    'Next steps',
  );

  if (result.pagesUrl) {
    p.log.success(`Your site will be live at: ${pc.cyan(pc.underline(result.pagesUrl))}`);
  }

  if (result.warnings.length > 0) {
    p.log.warn('Notes:');
    for (const w of result.warnings) {
      p.log.message(`  • ${w}`);
    }
  }

  p.outro(pc.green('Done! Your Vite app is ready for GitHub Pages.'));
}
