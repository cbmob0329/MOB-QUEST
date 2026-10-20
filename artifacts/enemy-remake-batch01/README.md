# MOB STORY enemy remake — batch 01

Four actual imagegen edits, one successful generation per character, using cached originals. No original assets or game code were overwritten. The Windows path form was rejected before generation; references were then supplied from the images loaded into the conversation. No extra variants or regenerations were requested.

Deliverables in `enemy/` retain filenames and canvas dimensions:
- 01.png: 431 x 316
- 02.png: 460 x 391
- 03.png: 1230 x 1174
- 04.png: 961 x 625

Generated alpha was preserved. Finalization uniformly scales the visible generated bounding rectangle into the corresponding original visible rectangle and centers it, keeping aspect ratio. `validation.json` records actual transparent, partial and opaque pixel counts and visible-size ratios. `batch01-preview.png` is a presentation preview on gray; the four deliverables have transparent backgrounds.

Prompt set (built-in imagegen, edit, transparent_background=true):
- Shared: carefully polish the existing cartoon character with consistent outlines, coherent construction and clean cel shading; preserve original short/squat proportions, near-full-canvas apparent size, identity, colors and all equipment. No new mouth, weapon, decoration, effect, ground, scenery or text. Whole character visible. One finished sprite, target original dimensions.
- 01: lime-green squat lobed slime, huge gold round goggles, olive dark lenses with pale highlights, existing small surrounding green bubbles; no mouth.
- 02: stocky gray rock golem, huge boulder head, segmented fists and feet, floating rock chips, round gold/yellow goggles with olive lenses, yellow side pieces and joint accents; no mouth.
- 03: cyan frog-costumed warrior, raised frog eyes and cyan spots on hood, black face, intense cyan eyes with dark/silver round goggles, cyan face covering with no added mouth; both tied drawstrings, chest emblem, frog fingers/toes, large dark shield on image right with cyan rim and center. Preserve original pose/composition and shield size.
- 04: squat sky-blue lobed slime, two ball-tipped antennae, both dark-blue bat wings, gold round goggles and dark blue lenses; no mouth, no new bubbles.

Visual acceptance: all four retained identifying features; 03 retained shield and costume details; 04 retained both wings and antennae. No browser verification was performed.
