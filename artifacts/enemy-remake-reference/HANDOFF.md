# Reference preparation result

UPDATE: First remake batch is now complete. See `../enemy-remake-batch01/README.md`, `validation.json` and `library-results.json`. Official direct Library create succeeded after prepared uploads proved unavailable. Both contact sheets, four cached originals, batch preview and completed ZIP are saved in Library. Only local xattr application failed because Windows Python has no `os.setxattr`. The earlier blocker and unstarted-generation notes below describe the initial handoff, not the current state.

- 150 PNG originals cached. Natural numeric order 01 through 152; 63 and 130 are absent. Do not rescan source.
- All 150 contain transparent pixels. Each canvas dimension pair is unique; width range 223–1254 px, height range 222–1251 px.
- Longest edge distribution: below 512 px = 27; 512–1023 px = 87; at least 1024 px = 36.
- No byte-identical duplicates (SHA-256). Visual variants exist: e.g. 04/131 winged slimes; 148/149 black cats in different poses; fire/ice/water variants and equipment differences throughout. These are not interchangeable files.
- Two inspected contact sheets: first 80 files and remaining 70 files. Labels are original filenames, including numeric gaps.
- First four canvases: 01 431x316; 02 460x391; 03 1230x1174; 04 961x625. See inventory for alpha and alpha>0 visible bounds.
- `MOB-STORY-reference-first4.zip` contains both contact sheets, first four untouched originals, inventory CSV/JSON, summary and character notes. This is a reference ZIP, NOT a completed remake batch.
- Full cached originals remain in `originals/`; use these only for all subsequent reference inspection.

## Library blocker

Official Library skill and current upload helper were used for one ordered seven-file request: two sheets, four originals and reference ZIP. Initial sandbox invocation failed before an app call with permission denied on the app connection. Retried with elevated execution, which was permitted; the official helper then reported `Library prepare_uploads is not available` and exited 1. No success response, Library IDs or finalized upload results exist. No direct-create fallback or custom upload workaround was attempted, as the Library prepared-flow instructions prohibit switching a started helper write to direct actions.

Parent should regard Library delivery as NOT COMPLETED, and use the local paths if accessible or complete an official transfer in an environment supporting prepared uploads. This is an unavailable capability, not an auto-review rejection or pending approval.

## Generation

Built-in `image_gen` is exposed in this tool catalog and the imagegen skill was read. No image generation call was made in this optional first-batch phase, to conserve credits and hand off the required initial audit first. Local-path support and final-output retrieval have not been tested. Do not claim that generation is unavailable or that remakes are complete. No paid API fallback was used. No browser, git commit/push, original overwrite or game-code modification occurred.
