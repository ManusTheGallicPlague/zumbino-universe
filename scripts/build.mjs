import { cp, mkdir, readdir, readFile, rm, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'dist');
await rm(out, {recursive: true, force: true});
await mkdir(out, {recursive: true});
for (const name of ['index.html', 'style.css', 'quality.css', 'script.js', 'universe.js']) {
  await cp(path.join(root, name), path.join(out, name));
}
await cp(path.join(root, 'assets'), path.join(out, 'assets'), {
  recursive: true, filter: source => !source.endsWith('.prompt.txt') && !source.endsWith('.DS_Store')
});
// Catch missing HTML/CSS assets before packaging. No runtime dependencies or remote fonts.
async function validate(dir) {
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const name = path.join(dir, entry.name);
    if (entry.isDirectory()) { await validate(name); continue; }
    if (!/\.(html|css)$/.test(name)) continue;
    const text = await readFile(name, 'utf8');
    const refs = [...text.matchAll(/(?:src|href)=["']([^"']+)["']|url\(['"]?([^)'"\s]+)['"]?\)/g)].map(m => m[1] || m[2]);
    for (const ref of refs) {
      if (/^(?:[a-z][a-z\d+.-]*:|#|\/\/)/i.test(decodeURIComponent(ref))) continue;
      const target = path.resolve(path.dirname(name), ref.split(/[?#]/)[0]);
      if (!(await stat(target).catch(() => null))?.isFile()) throw new Error(`Missing asset: ${ref} in ${name}`);
    }
  }
}
await validate(out);
console.log('Built dist/: static assets verified.');
