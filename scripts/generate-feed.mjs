#!/usr/bin/env node
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {resolve, dirname, join} from 'node:path';
import {generateDiscovery} from '../dist/feed.js';
const args = process.argv.slice(2);
try {
  if (args.length !== 4 || args[0] !== '--config' || args[2] !== '--output') throw new Error('Usage: web-respect-feed --config <approved-config.json> --output <new-review-directory>');
  const files = generateDiscovery(JSON.parse(await readFile(resolve(args[1]), 'utf8')));
  const output = resolve(args[3]);
  await mkdir(output); // Exclusive creation: an existing directory is never overwritten.
  for (const [path, file] of Object.entries(files)) {
    const destination = join(output, path);
    await mkdir(dirname(destination), {recursive:true});
    await writeFile(destination, file.body, {flag:'wx'});
  }
  console.log('Discovery files prepared for review. Merge existing sitemap/robots policies before deploying.');
} catch (error) { console.error(error.message); process.exitCode = 1; }
