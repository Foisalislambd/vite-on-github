import { execSync } from 'node:child_process';
import { log } from './logger.js';

export function runCommand(command: string, cwd: string, silent = false): void {
  log.dim(`  $ ${command}`);
  execSync(command, {
    cwd,
    stdio: silent ? 'pipe' : 'inherit',
    encoding: 'utf-8',
  });
}
