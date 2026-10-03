// Runs one browser at a time so other MOB projects retain priority.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),rows=[];
for(const file of ['tests/rush-data-v253.cjs','tests/rush-balance-v253.cjs','tests/rush-v253.cjs','tests/rush-save-v253.cjs','tests/rush-traits-v253.cjs','tests/rush-visual-v253.cjs','tests/rush-dialogue-flow-v253.cjs','tests/rush-medals-ui-v253.cjs','scripts/test-rush-regression-v253.cjs']){
 console.log('RUN '+file);const start=Date.now(),r=cp.spawnSync(process.execPath,[file],{cwd:root,encoding:'utf8',windowsHide:true,timeout:1800000,maxBuffer:5000000});
 const row={file,status:r.status,seconds:Math.round((Date.now()-start)/1000),stdout:r.stdout,stderr:r.stderr,error:r.error?.message};rows.push(row);fs.writeFileSync(path.join(root,'artifacts/rush-v253/verification.json'),JSON.stringify(rows,null,2));console.log(row.stdout);if(row.stderr)console.log(row.stderr);if(r.status!==0){process.exitCode=1;break;}
}
