// Keep browser tests serial: other local projects have priority.
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const files=['quest-access-v246.cjs','event-v174.cjs','macaron-v247.cjs','story-balance-v244.cjs','boss-hp-v249.cjs','boss-edits-v250.cjs','enemy-abilities-v142.cjs','battle-animation-v251.cjs'];
const rows=[];for(const file of files){console.log('RUN '+file);const start=Date.now(),r=spawnSync(process.execPath,[path.join('tests',file)],{cwd:root,encoding:'utf8',timeout:180000,windowsHide:true});const row={file,status:r.status,seconds:Math.round((Date.now()-start)/1000),stdout:r.stdout,stderr:r.stderr,error:r.error?.message};rows.push(row);console.log((r.status===0?'PASS ':'FAIL ')+file);fs.writeFileSync(path.join(root,'artifacts/rush-v252/regression-results.json'),JSON.stringify(rows,null,2));}if(rows.some(r=>r.status!==0))process.exitCode=1;
