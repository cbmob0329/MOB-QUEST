// Reuse the complete story/battle regression, saving this revision's captures separately.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.join(__dirname,'nightmare-v239.cjs');
const code=fs.readFileSync(file,'utf8').replaceAll('artifacts/nightmare-v239','artifacts/nightmare-v241/full');
const test=new Module(file,module);test.filename=file;test.paths=module.paths;test._compile(code,file);
