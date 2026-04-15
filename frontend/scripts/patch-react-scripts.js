const fs = require('fs');
const path = require('path');

const targetFile = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-scripts',
  'config',
  'webpackDevServer.config.js'
);

if (!fs.existsSync(targetFile)) {
  console.log('[patch-react-scripts] target file not found, skipping');
  process.exit(0);
}

const oldLine = "allowedHosts: disableFirewall ? 'all' : [allowedHost],";
const newLine =
  "allowedHosts: disableFirewall ? 'all' : ([allowedHost].filter(Boolean).length ? [allowedHost].filter(Boolean) : ['localhost']),";

const source = fs.readFileSync(targetFile, 'utf8');

if (source.includes(newLine)) {
  console.log('[patch-react-scripts] already patched');
  process.exit(0);
}

if (!source.includes(oldLine)) {
  console.log('[patch-react-scripts] expected pattern not found, skipping');
  process.exit(0);
}

const patched = source.replace(oldLine, newLine);
fs.writeFileSync(targetFile, patched, 'utf8');
console.log('[patch-react-scripts] patch applied');
