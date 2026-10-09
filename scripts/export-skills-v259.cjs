// New revision only: never overwrite the user's older edited tables.
const fs=require('node:fs'),path=require('node:path'),{open}=require('../tests/story-v172-harness.cjs');
const out=process.argv[2];if(!out)throw Error('Specify the local data output folder');
(async()=>{const x=await open('window.export259=()=>({techniques:MOB_DATA.techniqueCatalog,magic:MOB_DATA.magicCatalog,players:MOB_DATA.players.map(p=>({id:p.id,name:p.name,learnset:p.learnset}))});');try{
 const d=await x.page.evaluate(()=>export259());fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'魔法・特技・習得データ_v259.json'),JSON.stringify(d,null,2));
 const lines=['魔法・特技 追加・調整 v259','2026-10-09','', '【今回の調整】','基本属性特技：既存の上位技を3段階目として保持し、中間8技を追加。風はホクソード→ホクブレード→疾風斬り。','攻撃＋自身強化：全8属性×2段階。効果は使用ターンを含め2ターン。同系統の再使用は残り時間を更新し、効果量は加算しません。','全体特技：全8属性に小～中ダメージ技を追加。','最大魔法：単体はMP32～40、Lv60～66。ネオメテオパワーはMP64、Lv76。','', '【新規・変更特技】'];
 for(const s of d.techniques.filter(s=>s.cartoonV259))lines.push('',`ID: ${s.id}`,`名前: ${s.name}`,`属性: ${s.element}`,`消費MP: ${s.cost}`,`威力倍率: ${s.power}`,`効果: ${s.effectText}`,`演出: ${s.cartoonV259.atlas} / ${s.cartoonV259.row+1}段目`);
 lines.push('','【最大魔法】');for(const s of d.magic.filter(s=>s.tier==='large'&&!s.support))lines.push(`${s.name} / MP ${s.cost} / 威力 ${s.power}`);
 lines.push('','【キャラクター別・習得一覧】');for(const p of d.players){lines.push('',p.name,'特技');for(const r of p.learnset.technique){const s=d.techniques.find(s=>s.id===r.id);if(s)lines.push(`Lv.${r.level}　${s.name}　MP ${s.cost}　${s.effectText||s.element}`);}lines.push('魔法');for(const r of p.learnset.magic){const s=d.magic.find(s=>s.id===r.id);if(s)lines.push(`Lv.${r.level}　${s.name}　MP ${s.cost}`);}}
 fs.writeFileSync(path.join(out,'新技と習得一覧_v259.txt'),'\uFEFF'+lines.join('\r\n'));console.log('Exported '+out);
}finally{await x.browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
