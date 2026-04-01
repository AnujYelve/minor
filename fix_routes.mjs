import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('route.js') || file.endsWith('route.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./app/api');
let count = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('export const dynamic = "force-dynamic";') && !content.includes("export const dynamic = 'force-dynamic';")) {
    content = 'export const dynamic = "force-dynamic";\n' + content;
    fs.writeFileSync(file, content, 'utf8');
    count++;
    console.log(`Updated ${file}`);
  }
});

console.log(`\nUpdated ${count} files.`);
