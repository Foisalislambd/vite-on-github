import { execSync } from 'node:child_process';

export interface GitRemoteInfo {
  owner: string;
  repo: string;
  isUserSite: boolean;
}

export function detectGitRemote(cwd: string): GitRemoteInfo | null {
  try {
    const url = execSync('git remote get-url origin', {
      cwd,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();

    const match =
      url.match(/github\.com[:/]([^/]+)\/(.+?)(?:\.git)?$/i) ??
      url.match(/([^/]+)\/([^/]+?)(?:\.git)?$/);

    if (!match) return null;

    const owner = match[1];
    const repo = match[2].replace(/\.git$/, '');
    const isUserSite = repo === `${owner}.github.io`;

    return { owner, repo, isUserSite };
  } catch {
    return null;
  }
}
