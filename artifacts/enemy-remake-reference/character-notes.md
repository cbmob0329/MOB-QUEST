# MOB STORY enemy reference cache

Source: `C:\Users\CB-Me\Documents\GitHub\MOB-QUEST\enemy`

Original files were enumerated once and each image read once to create `originals/`. All subsequent inspection must use this cache. Do not overwrite source files or game code. Do not use browser verification. Keep generation economical; avoid repeated exploratory batches. Finished assets should preserve original filenames, canvas dimensions, transparency, approximate visible size and body proportions, and be delivered in small ZIP batches from a separate output directory.

`inventory.csv` and `inventory.json` record dimensions, alpha pixel counts, the bounding rectangle of all pixels with alpha > 0, and original-byte SHA-256. Bounding rectangles include floating particles and equipment, not just the main torso. Identical hashes identify byte-identical originals; visually similar variants require inspecting contact sheets.

## First four originals (visually inspected)

- `01.png`: lime green slime, broad squat body with rounded lobes, small surrounding green bubbles, large yellow/gold round goggles with olive dark lenses and pale reflections. No mouth. Preserve goggles, bubbles, green palette and squat silhouette.
- `02.png`: stocky gray rock golem, large rounded boulder head/body, segmented fists and feet, floating rock chips, round yellow/gold goggles and yellow side/joint accents. No mouth. Preserve rocky limbs and yellow details; no added weapon.
- `03.png`: cyan frog-costumed warrior; two large frog eyes on hood, darker cyan spots, black face with intense blue eyes behind dark/silver round glasses, cyan face covering, tied drawstrings, circular chest emblem, frog fingers/toes. Holds large dark circular shield with cyan rim and center on image right. Preserve shield, costume, glasses, cords and emblem. Do not interpret the hood opening as a new mouth.
- `04.png`: squat sky-blue slime with two ball-tipped antennae, dark blue bat wings, yellow/gold round goggles and dark blue lenses. No mouth. Preserve both wings and antennae, blue palette and rounded lower lobes.

Generation prompt policy: polish the original cartoon linework and shading while preserving character identity, equipment, palette, body proportions and apparent size. Poses may change, but no added mouths, missing equipment, text, backdrop or extra characters. Request genuine transparent PNG. Check against cached original before accepting. No generated output has been accepted in this reference-preparation phase.
