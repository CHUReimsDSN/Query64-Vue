const fs = require('fs');
const path = require('path');

const docsDir = path.resolve('docs/api');
const layout = 'default';

function walkDir(dir, callback) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (entry.isFile() && fullPath.endsWith('.md')) {
      callback(fullPath);
    }
  });
}

let filesCount = 0

walkDir(docsDir, (filePath) => {
  const name = path.basename(filePath, '.md');
  const content = fs.readFileSync(filePath, 'utf8');

  // Front matter Jekyll
  const frontMatter = `---
layout: ${layout}
title: ${name}
nav_order: 1
parent: API
---

`;

  if (!content.startsWith('---')) {
    fs.writeFileSync(filePath, frontMatter + content);
    filesCount++;
  }
});
console.log(`Done ! (${filesCount} files)`)