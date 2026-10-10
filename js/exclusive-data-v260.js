(()=>{
 const rows=[
 ['denden','denden-thunder-whip','デンデン・サンダーウィップ',15,34,'雷','physical','dendenWhip','attacks',6,'敵全体に雷属性物理中ダメージ / 敵1体につき技の会心率7%（最大35%）'],
 ['denden','denden-storm','デンデン・ゴロゴロ・ドッカーン!!',60,62,'雷','physical','dendenCharge','finishers',1,'今ターン回避率0%・被ダメージ10%増加 / 次ターン自動で雷物理全体→雷魔法全体→雷物理単体の3連撃'],
 ['yusha','twin-sword','モブツインソード',15,28,'光','physical','twin','attacks',0,'敵単体に通常攻撃の90%で2回攻撃'],
 ['yusha','fate-hit','運命の一撃',60,58,'光・火','physical','fate','finishers',0,'敵単体に光・火属性大ダメージ / 30%で極大ダメージ'],
 ['pink','pink-bonbon','ピンクボンボン',15,30,'光','magic','pinkHeal','support',0,'味方全体HP小回復 / 味方全体ダメージ軽減+5%（2ターン）'],
 ['pink','kingdom-refresh','キングダムリフレッシュ',60,54,'光','magic','kingHeal','support',1,'味方全体HP中回復 / 自身のダメージ軽減+5%（2ターン）'],
 ['money','double-money','ダブルマニー',15,34,'光','magic','double','support',2,'自身のMAG+10%（2ターン） / 次のターンに使う魔法を2回発動（追加消費なし）'],
 ['money','neon-field','ネオンフィールド',60,58,'光','magic','field','support',3,'味方全体MND+30%（2ターン） / 次ターンの自身の魔法会心率+30%'],
 ['desert','desert-nimo','デザート・ニモ',15,28,'地','physical','nimo','attacks',1,'敵単体に地属性小～中ダメージ / 次ターンの自身の会心率+10%'],
 ['desert','desert-force','デザート・フォース',60,48,'闇','physical','force','attacks',2,'敵単体に闇属性中ダメージ / 自身のHP10%回復'],
 ['nyoro','magma-net','マグマ・ネット',15,34,'火','physical','net','attacks',3,'敵全体に火属性小～中ダメージ / 各15%でひるみ'],
 ['nyoro','nyoro-road','ニョロ・ロード',60,56,'火','physical','road','support',4,'味方全体ATK・DEF+25%（2ターン）'],
 ['nekoku','kumanoko','クマノコヲミル',15,32,'水','magic','bear','support',5,'味方全体ダメージ軽減+7%（2ターン）'],
 ['nekoku','nekoku-launcher','ネコクー・ランチャー',60,58,'水','physical','launcher','attacks',4,'敵単体に水属性中ダメージ＋敵全体に水属性小～中ダメージ'],
 ['riro','riro-blizzard','リーロ・フブキ',15,38,'風','physical','blizzard','attacks',5,'敵全体に風属性中ダメージ / 自身の会心率+20%・SPD+50%（2ターン）'],
 ['riro','riro-organize','リーロ・オーガナイズ',60,50,'風','magic','organize','attacks',5,'敵全体のダメージ軽減率を10%ダウン（2ターン）'],
 ['tetsu','tetsu-form','モブテツの型',15,34,'地','physical','stance','tetsu',0,'壱式・弐式・参式を選択 / 次ターン自動攻撃'],
 ['tetsu','tetsu-zero','モブテツの型 零式',60,58,'風・地','physical','zero','tetsu',3,'敵単体に風属性・地属性の物理中ダメージを各1回'],
 ['jessie','flicker-bolt','フリッカー・ボルト',15,34,'雷','physical','flicker','attacks',6,'敵単体に雷属性小～中ダメージを2～3回連続で放つ'],
 ['jessie','neon-thunderbolt','ネオン・サンダーボルト',60,64,'雷・光','magic','thunder','finishers',1,'敵全体に雷・光属性魔法大ダメージ'],
 ['kaijin','kaijin-claw','怪人シャドークロー',15,30,'闇','physical','claw','attacks',7,'敵単体に闇属性中ダメージ / 自身のATK+15%（2ターン）'],
 ['kaijin','kaijin-break','怪人ドミネーション',60,62,'雷・闇','physical','dominion','finishers',2,'敵全体に雷・闇属性大ダメージ / 自身のダメージ軽減+10%（2ターン）'],
 ['lilith','rose-drain','ローズ・ドレイン',15,32,'闇','magic','drain','finishers',3,'敵単体に闇属性魔法中ダメージ / 自身のHP15%回復'],
 ['lilith','rose-tempest','ローズ・テンペスト',60,64,'闇・風','magic','tempest','finishers',3,'敵全体に闇・風属性魔法大ダメージ / 敵全体MND-15%（2ターン）']
 ];
 for(const [owner,id,name,level,cost,element,damageType,action,atlas,row,effect]of rows){const s={id:'exclusive-'+id,name,owner,exclusiveV260:true,level,cost,soulCost:1,ct:2,element,damageType,action,kind:'advanced',tier:level===15?'medium':'large',effectText:effect+' / ソウル1 / CT2ターン',cartoonV259:{atlas:'exclusive-'+atlas,row,boost:level===60?1.1:1},frames:[`skill4/v260/${atlas}.png`],mode:'cartoon259:exclusive-'+id};
  const old=MOB_DATA.techniqueCatalog.find(t=>t.id===s.id);if(old)Object.assign(old,s);else MOB_DATA.techniqueCatalog.push(s);
  const p=MOB_DATA.players.find(p=>p.id===owner);if(p&&!p.learnset.technique.some(r=>r.id===s.id))p.learnset.technique.push({id:s.id,level});
 }
 const pink=MOB_DATA.players.find(p=>p.id==='pink');for(const [id,level]of [['candy-neon',24],['candy-neon-piece',50],['star-pokkin-marshmallow',58]]){const old=pink.learnset.magic.find(r=>r.id===id);if(old)old.level=Math.min(old.level,level);else pink.learnset.magic.push({id,level});}
 for(const p of MOB_DATA.players){p.learnset.technique.sort((a,b)=>a.level-b.level);p.learnset.magic.sort((a,b)=>a.level-b.level);}
 MOB_DATA.players.find(p=>p.id==='nyoro').passive='ニョロは空を飛ぶ';
})();
