// Keep the deployed HTML and editable sources identical. No dependencies required.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const file = path.join(root, 'index.html');
let html = fs.readFileSync(file, 'utf8');
const tag = '<script id="mobQuestInlineData">';
const start = html.indexOf(tag) + tag.length;
const end = html.indexOf('</script>', start);
if (start < tag.length || end < start) throw new Error('Inline script boundary not found');
const data = fs.readFileSync(path.join(root, 'js/data.js'), 'utf8').trim();
const game = fs.readFileSync(path.join(root, 'js/game.js'), 'utf8').trim();
html = html.slice(0, start) + '\n' + data + '\n' + game + '\n' + html.slice(end);
fs.writeFileSync(file, html);
