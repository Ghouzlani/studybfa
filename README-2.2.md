# Study BFA Académie 2.2

Upload the **contents of this ZIP** to the root of the GitHub repository (not the ZIP itself).

## Changes
- **Home page redesigned** (`index.html`, new `assets/home.css`). The home page now loads one stylesheet instead of five overlapping ones. Hero illustration removed; each available subject lists its real chapter titles; subjects with no content yet are grouped under "Bientôt".
- **Bug fix:** the Entrepreneuriat & Business Plan page was tagged as the AI course, so its PDF button downloaded the wrong file. Fixed in the page and in `assets/studybfa-pdfs.js`.
- **Header:** the logo tile no longer overflows the header (home and subject pages). "ACADÉMIE" is now "Académie".
- **Theme toggle:** plain text "Mode clair / Mode sombre" (no emoji glyphs). On the home page the theme script loads without `defer`, which avoids a flash of the light theme.
- Subject pages (lessons, quizzes, flashcards, mind maps) are unchanged.

## Still to do
- The EST logo is still loaded from Wikimedia Commons. Bundle a local copy (e.g. `assets/logo-est.png`) once you have permission to use it.
- `academie-home.css` is no longer used by any page and can be deleted. `academie.css`, `academie-unified.css`, `studybfa-v2.css`, `studybfa-21.css` are still used by subject pages.
