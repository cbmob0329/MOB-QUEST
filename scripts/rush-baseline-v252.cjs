// Read-only baseline test preload. Does not replace any working files.
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..'),read=fs.readFileSync;
const files=new Map(['index.html','js/game.js','css/style.css'].map(p=>[path.join(root,p),path.join(root,'artifacts/rush-v252/backup',p.replaceAll('/','_'))]));
fs.readFileSync=function(file,...args){return read.call(this,typeof file==='string'?(files.get(path.resolve(file))||file):file,...args);};
