// Update only game code and this patch's CSS. Preserve independently authored inline data/styles.
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8').replace(/\r\n/g,'\n');
let game=read('js/game.js');
const versions=[172,173].filter(v=>game.includes(`// STORY_V${v}_DATA_BEGIN`));
for(const v of versions){
 const data=JSON.parse(read(`js/story-v${v}.json`));
 const compact='{events:{\n'+Object.entries(data.events).map(([k,event])=>JSON.stringify(k)+':'+JSON.stringify(event)).join(',\n')+'\n},battle:'+JSON.stringify(data.battle)+'}';
 game=game.replace(new RegExp(`// STORY_V${v}_DATA_BEGIN[\\s\\S]*?// STORY_V${v}_DATA_END`),`// STORY_V${v}_DATA_BEGIN\nconst STORY_V${v} = `+compact+`;\n// STORY_V${v}_DATA_END`);
}
fs.writeFileSync(path.join(root,'js/game.js'),game);
let html=read('index.html');const start=html.indexOf("(() => {\n'use strict';"),end=html.indexOf('</script>',start);
if(start<0||end<start)throw Error('Game script boundary missing');
html=html.slice(0,start)+game.trim()+'\n'+html.slice(end);
for(const v of versions){
 const css=`<style id="storyV${v}Style">\n`+read(`css/story-v${v}.css`).trim()+'\n</style>';
 if(html.includes(`<style id="storyV${v}Style">`))html=html.replace(new RegExp(`<style id="storyV${v}Style">[\\s\\S]*?</style>`),css);
 else html=html.replace('</head>',css+'\n</head>');
}
fs.writeFileSync(path.join(root,'index.html'),html);
