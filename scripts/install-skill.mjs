#!/usr/bin/env node
import {cp, lstat, mkdir, realpath} from 'node:fs/promises';
import {dirname, isAbsolute, join, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const args = process.argv.slice(2);
if (args.length !== 2 || args[0] !== '--target' || !args[1].trim()) {
  console.error('Usage: web-respect-skill --target <agent-skills-directory>');
  console.error('Copies the complete web-respect skill into an explicit directory. Existing skills are never overwritten.');
  process.exitCode = 1;
} else {
  try {
    const source = await realpath(join(dirname(fileURLToPath(import.meta.url)), '../skill/web-respect'));
    const target = resolve(args[1]);
    const destination = join(target, 'web-respect');
    const insideSource = candidate => {
      const rel = relative(source, candidate);
      return rel === '' || (!isAbsolute(rel) && rel !== '..' && !rel.startsWith('../') && !rel.startsWith('..\\'));
    };
    if (insideSource(destination)) throw new Error('Choose a target outside the distributed skill source; nothing was copied.');
    try {
      await lstat(destination);
      throw new Error('A web-respect entry already exists in the target. Review it before choosing a new target; nothing was overwritten.');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    // Exclusive directory creation also guards against concurrent installation.
    await mkdir(target, {recursive:true});
    if (insideSource(join(await realpath(target), 'web-respect'))) throw new Error('The target resolves inside the distributed skill source; nothing was copied.');
    await mkdir(destination);
    await cp(source, destination, {recursive:true, force:false, errorOnExist:true, dereference:false});
    console.log('Web Respect skill installed. Ask your agent to use $web-respect for the scoped audit or integration.');
  } catch (error) {
    const message = error.code ? `Installation failed (${error.code}); review the target and permissions. No existing skill was overwritten.` : error.message;
    console.error(message);
    process.exitCode = 1;
  }
}
