MOB QUEST v15 HOME display normalization

- v14 ultimate / fast-cache behavior retained.
- Removed accumulated generated HOME scaling overrides from v10/v11/v12 sections.
- Added one canonical HOME layout.
- No per-character CSS scale/translate correction on HOME characters.
- Uploaded play/*.png canvas is treated as the source of truth.
- Added ?v=15 / ?mqv=15 cache-busting for CSS, JS and image assets so replacements with the same file name reload reliably.
