const fs=require('node:fs'),path=require('node:path');
let chromium;
try{({chromium}=require('playwright'));}catch{({chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')));}
const root=path.resolve(__dirname,'..');
async function open(injection){
 const browser=await chromium.launch({headless:true,channel:'msedge'}),page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('http://mob.test/**',async route=>{
  const u=new URL(route.request().url()),file=path.resolve(root,'.'+(u.pathname==='/'?'/index.html':decodeURIComponent(u.pathname)));
  if(!file.startsWith(root+path.sep))return route.fulfill({status:403,body:''});
  try{if(file===path.join(root,'index.html'))return route.fulfill({contentType:'text/html; charset=utf-8',body:fs.readFileSync(file,'utf8').replace(/\}\)\(\);\s*<\/script>\s*<\/body>/,injection+'\n})();\n</script>\n</body>')});await route.fulfill({path:file});}catch{await route.fulfill({status:404,body:''});}
 });
 await page.goto('http://mob.test/',{waitUntil:'load'});return {browser,page,errors};
}
module.exports={open,root};
