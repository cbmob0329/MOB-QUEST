/* New skills use stable IDs; old upper skills retain IDs, names and battle power. */
(()=>{
 const tech=MOB_DATA.techniqueCatalog,magic=MOB_DATA.magicCatalog;
 const add=s=>{const old=tech.find(t=>t.id===s.id);if(old)Object.assign(old,s);else tech.push(s);return s;};
 const art=(s,atlas,row,boost=1)=>Object.assign(s,{cartoonV259:{atlas,row,boost},frames:[`skill4/v259/${atlas}.png`],mode:'cartoon259:'+s.id});
 const learn=(p,id,level)=>{const rows=p.learnset.technique;if(!rows.some(r=>r.id===id))rows.push({id,level});};
 const families=[['火','magsword','mag-blade','マグブレード','magmasword'],['水','nepusword','nepu-blade','ネプブレード','nepumasword'],['雷','torusword','toru-blade','トルブレード','torumasword'],['地','goresword','gore-blade','ゴレブレード','goremasword'],['風','hoku-sword','hoku-blade','ホクブレード','shippugiri'],['光','neosword','neo-blade','ネオブレード','neomasword'],['闇','mirasword','mira-blade','ミラブレード','miramasword'],['無','anosword','ano-blade','アノブレード','anomasword']];
 add(art({id:'hoku-sword',name:'ホクソード',element:'風',kind:'slash',tier:'small',cost:7,power:1.15,effectText:'敵単体に風属性小ダメージ'},'slash',4,.8));
 for(const [row,[element,low,id,name,high]] of families.entries()){
  add(art({id,name,element,kind:'slash',tier:'medium',cost:['雷','地','光','闇'].includes(element)?12:11,power:1.48,effectText:`敵単体に${element}属性中ダメージ`},'slash',row));
  const top=tech.find(s=>s.id===high);if(top){top.tier='large';top.effectText=`敵単体に${element}属性中～大ダメージ`+(top.priorityChance?' / 先制率40%':'');}
  for(const p of MOB_DATA.players){const upper=p.learnset.technique.find(r=>r.id===high);if(!upper)continue;
   if(element==='風'){upper.level=Math.max(upper.level,36);learn(p,low,6);}
   const lower=p.learnset.technique.find(r=>r.id===low);learn(p,id,Math.max((lower?.level||1)+6,Math.floor(((lower?.level||1)+upper.level)/2)));
  }
 }
 // Assign wind basics to the wind specialist as well as the hero.
 const riro=MOB_DATA.players.find(p=>p.id==='riro');if(riro)for(const [id,lv] of [['hoku-sword',6],['hoku-blade',22],['shippugiri',38]])learn(riro,id,lv);
 const foods=[['火','karamin','カラミン','atk','ATK',.10,.15],['水','urumiru','ウルミル','res','MND',.10,.15],['風','utanome','ウタノメ','spd','SPD',.10,.15],['雷','amepachi','アメパチ','crit','会心率',.05,.08],['地','daikono','ダイコノ','def','DEF',.10,.15],['光','konpei','コンペイ','mag','MAG',.10,.15],['闇','kakaomi','カカオミ','evade','回避率',.05,.08],['無','tansan','タンサン','damageCut','ダメージ軽減',.05,.08]];
 for(const [row,[element,id,name,key,label,small,large]] of foods.entries())for(const rank of [0,1])add(art({id:rank?'toku-'+id:id,name:rank?'トク'+name:name,element,kind:'advanced',tier:rank?'medium':'small',cost:rank?16:10,power:rank?1.5:1.1,selfBuffV259:{key,label,value:rank?large:small,turns:2,family:id},effectText:`敵単体に${element}属性${rank?'中':'小'}ダメージ / 自身の${label}+${Math.round((rank?large:small)*100)}%（2ターン）`},'food',row,rank?1.14:1));
 const sweeps=[['火','honomadrift','ホノマドリフト'],['水','naminoslide','ナミノスライド'],['雷','watapachiride','ワタパチライド'],['風','kazemawaltz','カゼマワルツ'],['地','goreroll','ゴレロール'],['光','kiramekispin','キラメキスピン'],['闇','kagecrescent','カゲクレセント'],['無','mob-swing','モブスイング']];
 for(const [row,[element,id,name]]of sweeps.entries())add(art({id,name,element,kind:'advanced',tier:'medium',target:'all',cost:22,power:1.38,effectText:`敵全体に${element}属性小～中ダメージ`},'sweep',row));
 for(const [row,id]of ['hono','honoma','honomagma'].entries()){const m=magic.find(s=>s.id===id);if(m)art(m,'fire',row,1+row*.1);}
 const fireDefault=magic.find(s=>s.id==='honoma');Object.assign(MOB_DATA.elements.火,{frames:[...fireDefault.frames],mode:fireDefault.mode});
 const assignments={yusha:[['konpei',14],['toku-konpei',34],['karamin',24],['toku-karamin',44],['kiramekispin',30]],pink:[['tansan',12],['toku-tansan',32],['daikono',24],['toku-daikono',44],['mob-swing',28]],desert:[['daikono',14],['toku-daikono',34],['kakaomi',26],['toku-kakaomi',46],['goreroll',30]],nyoro:[['karamin',16],['toku-karamin',36],['honomadrift',32]],nekoku:[['urumiru',18],['toku-urumiru',38],['naminoslide',34]],jessie:[['amepachi',16],['toku-amepachi',36],['watapachiride',30]],denden:[['amepachi',14],['toku-amepachi',34],['utanome',24],['toku-utanome',44],['watapachiride',28]],money:[['konpei',20],['toku-konpei',40],['kiramekispin',36]],riro:[['utanome',16],['toku-utanome',36],['kazemawaltz',30]],tetsu:[['daikono',12],['toku-daikono',32],['karamin',22],['toku-karamin',42],['goreroll',28]],lilith:[['kakaomi',20],['toku-kakaomi',40],['kagecrescent',36]],kaijin:[['kakaomi',14],['toku-kakaomi',34],['tansan',24],['toku-tansan',44],['kagecrescent',30]]};
 for(const p of MOB_DATA.players){for(const [id,lv]of assignments[p.id]||[])learn(p,id,lv);p.learnset.technique.sort((a,b)=>a.level-b.level);}
 const maxCosts={honomagma:36,nepumachun:36,torumaden:38,goremagardy:38,hokumawing:36,neomanipool:40,miramazone:40,anomaun:32,'neo-meteor-power':64};
 for(const m of magic)if(maxCosts[m.id])m.cost=maxCosts[m.id];
 const maxLevels={yusha:64,pink:60,desert:64,nyoro:60,nekoku:60,jessie:64,denden:66,money:60,riro:60,lilith:60,kaijin:66};
 for(const p of MOB_DATA.players)for(const r of p.learnset.magic)if(maxCosts[r.id])r.level=Math.max(r.level,r.id==='neo-meteor-power'?76:maxLevels[p.id]||64);
 for(const p of MOB_DATA.players)p.learnset.magic.sort((a,b)=>a.level-b.level);
 MOB_DATA.skillBalanceVersion=259;
})();
