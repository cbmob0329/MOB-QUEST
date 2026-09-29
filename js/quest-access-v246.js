// Test access is derived from test mode, never from saved story completion.
testAllQuestsV171=function(){return !!state.test?.enabled;};
const questOpenBaseV246=openV179;
openV179=function(key,d=0){return testAllQuestsV171()?Number.isInteger(d)&&d>=0&&!!STORY179[key]?.diffs[d]:questOpenBaseV246(key,d);};
const savannaOpenBaseV246=savannaOpenV174,hotOpenBaseV246=hotOpenV177,legendOpenBaseV246=legendOpenV218;
savannaOpenV174=function(d){return testAllQuestsV171()?Number.isInteger(d)&&d>=0&&d<SAVANNA_DIFFICULTIES_V174.length:savannaOpenBaseV246(d);};
hotOpenV177=function(d){return testAllQuestsV171()?Number.isInteger(d)&&d>=0&&d<HOT_DIFFICULTIES_V177.length:hotOpenBaseV246(d);};
legendOpenV218=function(q){return !!q&&(testAllQuestsV171()||legendOpenBaseV246(q));};
const settingsBaseV246=renderSettings;
renderSettings=function(...args){const result=settingsBaseV246(...args),button=$('[data-test-v171="allQuests"]');if(button){const label=document.createElement('p');label.textContent=testAllQuestsV171()?'全クエスト開放：ON（テストモード中は常時開放）':'全クエスト開放：OFF（テストモードで自動開放）';button.replaceWith(label);}return result;};

function questWorldOrderV246(world){const i=MOB_DATA.adventureWorlds.findIndex(w=>w.id===world);return i<0?MOB_DATA.adventureWorlds.length:i;}
function questStoryKeyV246(card){return card.dataset.story179||card.dataset.story230||card.dataset.story237||(card.hasAttribute('data-nightmare-v239')?'nightmare':card.hasAttribute('data-four-rematch')?'fourRematch':Object.keys(STORY179).find(key=>$('strong',card)?.textContent===STORY179[key].title));}
function questCardOrderV246(card){
 const story=questStoryKeyV246(card);if(story){const world=story==='savanna'?'rural':story==='hot'?'neon':STORY179[story]?.unlock;return questWorldOrderV246(world);}
 const boss=EVENT_BOSSES_V163.find(q=>q.key===card.dataset.eventBoss)||LEGENDS_V218.find(q=>q.key===card.dataset.legend);return boss?questWorldOrderV246(boss.world):Infinity;
}
const questMenuBaseV246=renderEventQuestsV163;
renderEventQuestsV163=function(...args){
 const result=questMenuBaseV246(...args),panel=$('#trainingFeaturePanel .event-panel-v163');if(!panel)return result;
 const grid=$('.quest-cards-v218',panel);if(grid){const cards=[...grid.children].filter(el=>el.tagName==='BUTTON');cards.sort((a,b)=>questCardOrderV246(a)-questCardOrderV246(b));for(const card of cards)grid.append(card);grid.scrollLeft=0;grid.dispatchEvent(new Event('scroll'));}
 if(testAllQuestsV171()){
  const nightmare=$('[data-nm-start]',panel);if(nightmare)nightmare.textContent='物語を始める（テスト）';
  const four=$('[data-four-start]',panel);if(four)four.textContent='ハードに挑戦する（テスト）';
 }
 return result;
};
