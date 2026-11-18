"""Plain-text revision sheets generated from current, reviewed chapter notes.

The data in assets/*-content.js remains the single academic source of truth.
No custom grids, decorative flows, duplicate summaries or unapproved
educational claims are introduced by the PDF generation step.
"""

import re


def blocks(slug, idx, chapter):
    """Return every existing section, in its original order and wording."""
    result = []
    for title, body in chapter.get("notes", []):
        title = re.sub(r"^\d+[.]\s*", "", str(title)).strip()
        body = str(body).strip()
        if title and body:
            result.append({"type": "text", "title": title, "text": body})
    return result
