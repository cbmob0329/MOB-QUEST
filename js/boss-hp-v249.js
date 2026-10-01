// Individual story encounters: do not multiply the shared boss profile, raids or event variants.
const BOSS_HP_V249={
 'boss-umidenden':1.8,
 'c-lilith-hell':1.5,'c-lilith-kirin':1.5,'c-lilith-kufu':1.5,'c-lilith-riva':1.5,
 'dc2-hell':1.5,'dc2-kirin':1.5,'dc2-kufu':1.5,'dc2-riva':1.5,
 'boss-lilith-castle':1.3,'dc2-lilith':1.3,
 'dc2-maou':1.6,'dc2-ulrilis':1.7,
 'boss-dragon':1.3,'boss-nepu':1.4,'boss-neomaster':1.4,
 'boss-dorafara':1.5,'boss-gladi':1.25,'book-kaijin-boss':1.3
};
// Scale at the common preview calculation so training previews, new waves and HP ratios agree.
const bossHpPreviewBaseV249=enemyStatPreview;
enemyStatPreview=function(t,...args){const stats=bossHpPreviewBaseV249(t,...args),factor=BOSS_HP_V249[t?.id];if(!factor||t.fixedHp)return stats;return{...stats,maxHp:Math.max(1,Math.round(stats.maxHp*factor))};};
window.__mobBuildVersion='v249';
