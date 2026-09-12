// Update only game code and this patch's CSS. Preserve independently authored inline data/styles.
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8').replace(/\r\n/g,'\n');
let game=read('js/game.js');const data=JSON.parse(read('js/story-v172.json'));
const compact='{events:{\n'+Object.entries(data.events).map(([k,v])=>JSON.stringify(k)+':'+JSON.stringify(v)).join(',\n')+'\n},battle:'+JSON.stringify(data.battle)+'}';
game=game.replace(/\/\/ STORY_V172_DATA_BEGIN[\s\S]*?\/\/ STORY_V172_DATA_END/,'// STORY_V172_DATA_BEGIN\nconst STORY_V172 = '+compact+';\n// STORY_V172_DATA_END');
fs.writeFileSync(path.join(root,'js/game.js'),game);
let html=read('index.html');const start=html.indexOf("(() => {\n'use strict';"),end=html.indexOf('</script>',start);
if(start<0||end<start)throw Error('Game script boundary missing');
html=html.slice(0,start)+game.trim()+'\n'+html.slice(end);
const css='<style id="storyV172Style">\n'+read('css/story-v172.css').trim()+'\n</style>';
if(html.includes('<style id="storyV172Style">'))html=html.replace(/<style id="storyV172Style">[\s\S]*?<\/style>/,css);
else html=html.replace('</head>',css+'\n</head>');
fs.writeFileSync(path.join(root,'index.html'),html);
