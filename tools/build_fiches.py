#!/usr/bin/env python3
"""Build readable revision PDFs from the exact chapter notes used by StudyBFA.

Run from repository root:
    pip install reportlab
    python tools/build_fiches.py

No tables, presentation cards, auto-classified diagrams or second content source.
Business English remains a separate, previously approved hand-authored lesson.
"""
import json
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether

SUBJECTS = {
    "ai-content.js": ("intelligence-artificielle", "Intelligence artificielle"),
    "comptabilite-gestion-content.js": ("comptabilite-gestion", "Comptabilité de gestion"),
    "entrepreneuriat-content.js": ("entrepreneuriat-business-plan", "Entrepreneuriat & Business Plan"),
    "erp-content.js": ("systeme-information-erp", "Système d’information & ERP"),
    "fiscalite-content.js": ("fiscalite", "Fiscalité"),
    "tec-content.js": ("tec", "TEC"),
}
NAVY = colors.HexColor("#173354")
INK = colors.HexColor("#213249")
MUTED = colors.HexColor("#53657b")
LINE = colors.HexColor("#dce6f0")
PDF_WIDTH = A4[0] - 36 * mm

def font_paths():
    location = Path("/usr/share/fonts/truetype/dejavu")
    return location / "DejaVuSans.ttf", location / "DejaVuSans-Bold.ttf"

def configure_fonts():
    regular, bold = font_paths()
    if regular.exists() and bold.exists():
        pdfmetrics.registerFont(TTFont("BfaSans", str(regular)))
        pdfmetrics.registerFont(TTFont("BfaBold", str(bold)))
        return "BfaSans", "BfaBold"
    # The DejaVu fonts are installed on standard Ubuntu runner images.
    raise RuntimeError("Missing DejaVuSans font files; cannot safely render French accents")

def load_chapters(path):
    source = path.read_text(encoding="utf-8").strip()
    marker = "window.STUDY_BFA_AI="
    if not source.startswith(marker):
        raise ValueError("Unexpected content file layout: " + str(path))
    return json.loads(source[len(marker):].rstrip(";"))

def pdf_styles(normal, bold):
    return {
        "chapter": ParagraphStyle("chapter",fontName=bold,fontSize=9,leading=14,textColor=MUTED,spaceAfter=6),
        "title": ParagraphStyle("title",fontName=bold,fontSize=17,leading=24,textColor=NAVY,spaceAfter=16),
        "heading": ParagraphStyle("heading",fontName=bold,fontSize=11,leading=16,textColor=NAVY,spaceBefore=13,spaceAfter=5),
        "body": ParagraphStyle("body",fontName=normal,fontSize=10,leading=16,textColor=INK,alignment=TA_LEFT,spaceAfter=8),
    }

def draw_page(canvas, doc, label, normal, bold):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, A4[1]-13*mm, A4[0], 13*mm, stroke=0, fill=1)
    canvas.setFillColor(colors.white)
    canvas.setFont(bold, 10)
    canvas.drawString(18*mm, A4[1]-8.8*mm, "Study BFA")
    canvas.setFont(normal, 7)
    canvas.drawRightString(A4[0]-18*mm, A4[1]-8.8*mm, label)
    canvas.setStrokeColor(LINE)
    canvas.line(18*mm, 13*mm, A4[0]-18*mm, 13*mm)
    canvas.setFillColor(MUTED)
    canvas.setFont(normal, 7)
    canvas.drawString(18*mm, 9*mm, "Projet pédagogique étudiant indépendant · Non officiel")
    canvas.drawRightString(A4[0]-18*mm, 9*mm, f"Page {doc.page}")
    canvas.restoreState()

def make_pdf(destination, subject, number, title, notes, normal, bold):
    style = pdf_styles(normal, bold)
    doc = SimpleDocTemplate(str(destination),pagesize=A4,rightMargin=18*mm,leftMargin=18*mm,
                            topMargin=21*mm,bottomMargin=19*mm,
                            title=f"{subject} — Chapitre {number} : {title}",author="Study BFA")
    story = [Paragraph(f"CHAPITRE {number}",style["chapter"]),
             Paragraph(escape(title),style["title"])]
    for heading, body in notes:
        section = [
            Paragraph(escape(str(heading)),style["heading"]),
            Paragraph(escape(str(body)),style["body"]),
        ]
        story.append(KeepTogether(section))
    doc.build(story, onFirstPage=lambda c,d: draw_page(c,d,subject,normal,bold),
                    onLaterPages=lambda c,d: draw_page(c,d,subject,normal,bold))

def main():
    normal, bold = configure_fonts()
    target = Path("fiches")
    target.mkdir(exist_ok=True)
    count = 0
    for filename, (slug, subject) in SUBJECTS.items():
        chapters = load_chapters(Path("assets") / filename)
        for index, chapter in enumerate(chapters):
            number = chapter.get("number",index+1)
            notes = chapter.get("notes",[])
            if not notes:
                raise ValueError(f"Empty notes for {slug} chapter {number}")
            out = target / f"{slug}-chapitre-{number}.pdf"
            make_pdf(out,subject,number,chapter["title"],notes,normal,bold)
            count += 1
    assert count == 29, f"Expected 29 published subject PDFs, got {count}"
    print(f"Generated {count} prose-only PDFs from the same notes the website displays.")

if __name__ == "__main__":
    main()
