// User-saved approved v1 only; never downloads or substitutes artwork.
const fs=require('node:fs'),crypto=require('node:crypto'),p='mqicon/mob-holo-professor-v254.png';
if(!fs.existsSync(p))throw Error('Save approved v1 PNG to '+p+' first');
const hash=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');if(hash!=='1d2767b3c4640fbeb1d362026c146ccd9cb2efef17f098a426e3201f3ff57f3d')throw Error('Approved v1 hash does not match; inspect before changing this guard');
const d=JSON.parse(fs.readFileSync('js/rush-v254.json','utf8'));d.narrator.image=p;fs.writeFileSync('js/rush-v254.json',JSON.stringify(d,null,2)+'\n');require('./build-v254.cjs');console.log('Approved v1 connected');
