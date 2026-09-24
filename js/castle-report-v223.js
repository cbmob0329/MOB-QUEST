// Second rural clear: preserve each authored speech and line break.
CASTLE_REPORT_SCRIPTS_V126.rural2=[
 ['talk','king','おおー！\nおおー！！\n戻ったか！\nさすがのさすがの\nさすがは勇者じゃ！\nあっぱれじゃ！'],
 ['talk','pink','なんとか倒しましたが\nやはりレコードはありませんでした'],
 ['talk','king','そうか・・\nしかし、確実に前に進んでおる！'],
 ['talk','pink','はい！\n頑張るであります！'],
 ['handshake','王様と握手を交わした'],
 ['talk','king','次の目的地は再びネオン街じゃ！'],
 ['talk','king','新たなボスの名は\nモブネオンマスター！！','shout'],
 ['talk','jessie','確かなの？'],['talk','king','うむ'],
 ['talk','king','ネオン街だけでなく\n各地のエリアで名を残す\n強力なモンスターじゃ！'],
 ['talk','king','魔王城への\n重要なカギを握っておる'],
 ['talk','pink','ネオン街でありますか！'],
 ['talk','king','やつは各地の扉も管理しておる'],
 ['talk','king','やつを倒せば\n魔王城への扉も開かれるであろう！'],
 ['talk','jessie','とうとう来たのね'],['talk','money','知ってるの？'],
 ['talk','jessie','ええ\nとても強いモンスターよ'],
 ['last','pink','我々にお任せであります！\n行ってくるでありまーーす！']
];
async function ruralHandshakeV223(stage,text){endingCastV222(stage,['king','yusha']);const images=[...stage.querySelectorAll('.ending-person-v222 img')],dx=stage.clientWidth*.14;await Promise.all(images.map((img,i)=>animateV157(img,[{transform:'translateX(0)'},{transform:`translateX(${i?-dx:dx}px) translateY(0)`,offset:.3},{transform:`translateX(${i?-dx:dx}px) translateY(-9px)`,offset:.45},{transform:`translateX(${i?-dx:dx}px) translateY(0)`,offset:.6},{transform:`translateX(${i?-dx:dx}px) translateY(-9px)`,offset:.75},{transform:'translateX(0)'}],1500)));const wait=endingLineV222(stage,'king',text);stage.querySelector('.ending-bubble-v222 b').textContent='ナレーション';await wait;}
const reportSubmitBaseV223=submitAdventureReport;
submitAdventureReport=async function(){const report=state.adventure?.awaitingReport;if(report?.worldId!=='rural2')return reportSubmitBaseV223();if(castleReportBusy||storyBusy)return;castleReportBusy=true;const stage=document.createElement('section');stage.className='ending-stage-v222 rural-report-v223';stage.tabIndex=0;stage.setAttribute('aria-label','田舎町Ⅱの報告');stage.innerHTML='<div class="ending-cast-v222"></div><div class="ending-bubble-v222" hidden></div>';document.body.append(stage);try{for(const [kind,id,text,style]of CASTLE_REPORT_SCRIPTS_V126.rural2){if(kind==='handshake'){stage.querySelector('.ending-bubble-v222').hidden=true;await ruralHandshakeV223(stage,id);continue;}endingCastV222(stage,id==='king'?['king','pink']:['king',id]);if(kind==='last'){const bubble=stage.querySelector('.ending-bubble-v222');bubble.className='ending-bubble-v222';bubble.hidden=false;bubble.replaceChildren();const name=document.createElement('b'),line=document.createElement('p');name.textContent=player(id).name;line.textContent=text;bubble.append(name,line);await fixedDelay(1000);}else await endingLineV222(stage,id,text,style);}commitCastleReportProgressV126(report);stage.remove();renderCastle();showScreen('castle');}finally{stage.remove();castleReportBusy=false;}};
window.__mobBuildVersion='v223';
