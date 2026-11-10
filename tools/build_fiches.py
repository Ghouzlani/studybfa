#!/usr/bin/env python3
"""Study BFA - génère les fiches de révision (web + PDF) depuis assets/*-content.js.
Usage (depuis la racine du site) :  python3 tools/build_fiches.py
Dépendance : pip install reportlab   (polices DejaVu requises)."""
import json, re, os, collections
from xml.sax.saxutils import escape as esc
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle, KeepTogether
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

SUBJECTS = {  # fichier de contenu -> (slug = data-matiere, nom affiché)
 'ai-content.js': ('intelligence-artificielle', 'Intelligence artificielle'),
 'comptabilite-gestion-content.js': ('comptabilite-gestion', 'Comptabilité de gestion'),
 'entrepreneuriat-content.js': ('entrepreneuriat-business-plan', 'Entrepreneuriat & Business Plan'),
 'erp-content.js': ('systeme-information-erp', 'Système d’information & ERP'),
 'fiscalite-content.js': ('fiscalite', 'Fiscalité'),
 'tec-content.js': ('tec', 'TEC')}
# Remarques de relecture à ne pas publier dans les fiches (à supprimer aussi du fichier source)
DROP = [r'\s*Attention : le résultat de 6 533,33 DH[^.]*\.']

# ---------- classification des notes ----------
def segs(t): return [s.strip() for s in re.split(r';\s+', t) if s.strip()]
def sent(t): return [s.strip() for s in re.split(r'(?<=[.!?])\s+(?=[A-ZÀ-ÝÉ0-9])', t) if s.strip()]
PAIR = re.compile(r'^([^:]{2,60}?)\s*:\s+(.+)$', re.S)
def pairs(t):
    for parts in (segs(t), sent(t)):
        if len(parts) >= 2:
            ps = [PAIR.match(p.rstrip('.')) for p in parts]
            if all(ps): return [[m.group(1).strip(), m.group(2).strip()] for m in ps]
    return None
FORM = re.compile(r'^(?:([^:=.;]{3,50}):\s+)?([^.;:]{2,90}=[^.;]{2,130}?)(?:\.\s*|$)(.*)$', re.S)

def classify(title, text):
    title = re.sub(r'^\d+\.\s*', '', title).strip(); T = title.lower(); b = {'title': title}
    if re.match(r'(à retenir|prudence|attention|ne pas confondre)', T): return {**b, 'type': 'tip', 'text': text}
    if T.startswith('référence'): return {**b, 'type': 'ref', 'text': text}
    if T.startswith('exemple'):
        rows = [x for s in sent(text) for x in segs(s)]
        return {'type': 'example', 'title': re.sub(r'^exemple\s*:?\s*', '', title, flags=re.I), 'rows': rows}
    m = FORM.match(text)
    if m: return {**b, 'type': 'formula', 'lead': (m.group(1) or '').strip(), 'formula': m.group(2).strip(), 'text': m.group(3).strip()}
    if '→' in text:
        parts = [p.strip(' .') for p in text.split('→')]
        if 3 <= len(parts) <= 9: return {**b, 'type': 'flow', 'parts': parts}
    p = pairs(text)
    if p and 2 <= len(p) <= 8:
        if re.search(r'comparaison|différence|\bvs\b', T) and len(p) <= 3: return {**b, 'type': 'compare', 'items': p}
        if re.search(r'niveaux|couches|sous-systèmes', T) and len(p) == 3: return {**b, 'type': 'stack', 'items': p}
        return {**b, 'type': 'cards', 'items': p}
    s = segs(text)
    if len(s) >= 3:
        num = all(re.match(r'\d+\.\s', x) for x in s)
        return {**b, 'type': 'list', 'numbered': num, 'items': [re.sub(r'^\d+\.\s*', '', x) for x in s]}
    return {**b, 'type': 'text', 'text': text}

def load(f):
    t = open('assets/' + f, encoding='utf-8').read()
    return json.loads(t[t.index('=') + 1:].rstrip().rstrip(';'))

# ---------- PDF ----------
D = '/usr/share/fonts/truetype/dejavu/'
for n, f in [('S', 'DejaVuSans.ttf'), ('SB', 'DejaVuSans-Bold.ttf'), ('F', 'DejaVuSerif-Bold.ttf')]: pdfmetrics.registerFont(TTFont(n, D + f))
pdfmetrics.registerFontFamily('S', normal='S', bold='SB', italic='S', boldItalic='SB')
NAVY, BLUE, LIGHT, LINE = [colors.HexColor(x) for x in ('#173354', '#3478B8', '#EAF2FA', '#D5E0EC')]
INK, MUTED = colors.HexColor('#1F2D3D'), colors.HexColor('#5F7087')
AMB, AMBL, GRN, GRNL = [colors.HexColor(x) for x in ('#E0A526', '#FFF4DC', '#3E8E5A', '#EEF7F0')]
W = A4[0] - 36 * mm
def PS(n, **k): return ParagraphStyle(n, **{'fontName': 'S', 'fontSize': 9.3, 'leading': 13.2, 'textColor': INK, **k})
P_B, P_CELL = PS('b'), PS('c', fontSize=8.8, leading=12.2)
P_H = PS('h', fontName='SB', fontSize=10.5, textColor=NAVY, spaceBefore=9, spaceAfter=4)
P_SM = PS('sm', fontSize=8.5, textColor=MUTED, leading=12)
P_F = PS('f', fontName='F', fontSize=13, leading=18, textColor=NAVY, alignment=TA_CENTER)
P_CHIP = PS('chip', fontName='SB', fontSize=8.5, leading=11, alignment=TA_CENTER)
P_ARR = PS('arr', fontName='SB', fontSize=11, textColor=BLUE, alignment=TA_CENTER)
P_W, P_D = PS('w', fontName='SB', fontSize=8.8, textColor=colors.white), PS('d', fontName='SB', fontSize=8.8, textColor=NAVY)
P_G = PS('g', fontSize=8.5, textColor=MUTED, leading=12)
P_LG = PS('lg', fontName='SB', fontSize=7.5, textColor=GRN)
P_LI = PS('li', leftIndent=13, bulletIndent=1, spaceAfter=2)

def box(flow, bg, bar, w=W):
    t = Table([[flow]], colWidths=[w]); t.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), bg), ('LINEBEFORE', (0, 0), (0, -1), 3, bar), ('PADDING', (0, 0), (-1, -1), 8), ('LEFTPADDING', (0, 0), (-1, -1), 11)])); return t
def grid(items, cols=2):
    cells = [Paragraph('<b>%s</b><br/>%s' % (esc(a), esc(b)), P_CELL) for a, b in items]
    if len(cells) % cols: cells += [''] * (cols - len(cells) % cols)
    t = Table([cells[i:i + cols] for i in range(0, len(cells), cols)], colWidths=[W / cols] * cols)
    t.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), LIGHT), ('INNERGRID', (0, 0), (-1, -1), 2.5, colors.white), ('VALIGN', (0, 0), (-1, -1), 'TOP'), ('PADDING', (0, 0), (-1, -1), 7)])); return t
def flow(parts):
    out = []
    for k in range(0, len(parts), 4):
        ch = parts[k:k + 4]; aw = 7 * mm; cw = (W - aw * (len(ch) - 1)) / len(ch); cells, ws = [], []
        for i, p in enumerate(ch):
            if i: cells.append(Paragraph('→', P_ARR)); ws.append(aw)
            cells.append(Paragraph(esc(p), P_CHIP)); ws.append(cw)
        t = Table([cells], colWidths=ws); ts = [('VALIGN', (0, 0), (-1, -1), 'MIDDLE'), ('PADDING', (0, 0), (-1, -1), 6)]
        for i in range(0, len(cells), 2): ts += [('BACKGROUND', (i, 0), (i, 0), LIGHT), ('BOX', (i, 0), (i, 0), .6, LINE)]
        t.setStyle(TableStyle(ts)); out += [t, Spacer(1, 3)]
    return out
def stack(items):
    sh = [NAVY, BLUE, colors.HexColor('#8FB6DD')]
    t = Table([[Paragraph('<b>%s</b>' % esc(a), P_W if i < 2 else P_D), Paragraph(esc(b), P_CELL)] for i, (a, b) in enumerate(items)], colWidths=[W * .3, W * .7])
    ts = [('VALIGN', (0, 0), (-1, -1), 'MIDDLE'), ('PADDING', (0, 0), (-1, -1), 8), ('LINEBELOW', (0, 0), (-1, -2), 2, colors.white)]
    for i in range(len(items)): ts += [('BACKGROUND', (0, i), (0, i), sh[i]), ('BACKGROUND', (1, i), (1, i), LIGHT)]
    t.setStyle(TableStyle(ts)); return t
def compare(items):
    t = Table([[Paragraph('<b>%s</b>' % esc(a), P_W) for a, _ in items], [Paragraph(esc(b), P_CELL) for _, b in items]], colWidths=[W / len(items)] * len(items))
    t.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, 0), NAVY), ('BACKGROUND', (0, 1), (-1, 1), LIGHT), ('INNERGRID', (0, 0), (-1, -1), 2, colors.white), ('VALIGN', (0, 0), (-1, -1), 'TOP'), ('PADDING', (0, 0), (-1, -1), 8)])); return t

def block(b):
    t = b['type']; h = Paragraph(esc(b.get('title', '')), P_H)
    if t == 'tip': return [KeepTogether([Spacer(1, 5), box(Paragraph('<b>%s</b><br/>%s' % (esc(b['title']), esc(b['text'])), P_B), AMBL, AMB)])]
    if t == 'ref': return [Spacer(1, 6), Paragraph(esc(b['text']), P_SM)]
    if t == 'example':
        rows = []
        for i, r in enumerate(b['rows']):
            k = r.rfind('=')
            s = esc(r[:k + 1]) + ' <b>' + esc(r[k + 1:].strip()) + '</b>' if (i and k > 0) else esc(r)
            rows.append(Paragraph(s, P_G if i == 0 else P_CELL))
        return [KeepTogether([Spacer(1, 5), box([Paragraph('EXEMPLE' + (' · ' + esc(b['title'].upper()) if b['title'] else ''), P_LG), Spacer(1, 3)] + rows, GRNL, GRN)])]
    body = {'text': lambda: [Paragraph(esc(b.get('text', '')), P_B)],
            'formula': lambda: ([Paragraph(esc(b['lead']), P_SM)] if b['lead'] else []) + [box(Paragraph(esc(b['formula']), P_F), LIGHT, BLUE)] + ([Spacer(1, 3), Paragraph(esc(b['text']), P_SM)] if b['text'] else []),
            'flow': lambda: flow(b.get('parts')), 'cards': lambda: [grid(b.get('items'))], 'stack': lambda: [stack(b.get('items'))], 'compare': lambda: [compare(b.get('items'))],
            'list': lambda: [Paragraph(esc(x), P_LI, bulletText=('%d.' % (i + 1)) if b.get('numbered') else '•') for i, x in enumerate(b.get('items', []))]}[t]()
    return [KeepTogether([h] + body[:2]), *body[2:]]

def make_pdf(path, subject, num, title, blocks):
    def deco(c, doc):
        c.saveState(); c.setFillColor(NAVY); c.rect(0, A4[1] - 14 * mm, A4[0], 14 * mm, stroke=0, fill=1); c.setFillColor(colors.white)
        c.setFont('F', 11); c.drawString(18 * mm, A4[1] - 9 * mm, 'Study BFA'); c.setFont('S', 7.5); c.drawRightString(A4[0] - 18 * mm, A4[1] - 9 * mm, subject.upper() + '  ·  FICHE DE RÉVISION')
        c.setFillColor(MUTED); c.setFont('S', 7); c.drawString(18 * mm, 9 * mm, 'Study BFA Académie · Projet pédagogique étudiant indépendant · Non officiel'); c.drawRightString(A4[0] - 18 * mm, 9 * mm, 'Chapitre %s · page %d' % (num, doc.page)); c.restoreState()
    doc = BaseDocTemplate(path, pagesize=A4, title='%s - Chapitre %s : %s' % (subject, num, title), author='Study BFA', subject='Fiche de révision')
    doc.addPageTemplates([PageTemplate(frames=[Frame(18 * mm, 15 * mm, W, A4[1] - 38 * mm, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)], onPage=deco)])
    story = [Paragraph('CHAPITRE %s' % num, PS('k', fontName='SB', fontSize=8, textColor=BLUE)), Spacer(1, 3), Paragraph(esc(title), PS('t', fontName='F', fontSize=19, leading=23, textColor=NAVY)),
             Spacer(1, 4), Paragraph('Aide-mémoire : les explications détaillées sont dans la vidéo du chapitre.', P_SM), Spacer(1, 4)]
    for b in blocks: story += block(b)
    doc.build(story)

# ---------- JS web ----------
RENDER = r'''
(function(){'use strict';
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
function render(b){var t=b.type,w=el('section','sb-b sb-'+t);
if(t==='tip'){w.append(el('strong','',b.title),el('p','',b.text));return w}
if(t==='ref'){w.append(el('p','',b.text));return w}
if(b.title)w.append(el('h4','sb-h',b.title));
if(t==='text')w.append(el('p','',b.text));
else if(t==='formula'){if(b.lead)w.append(el('p','sb-lead',b.lead));w.append(el('div','sb-formula',b.formula));if(b.text)w.append(el('p','sb-note',b.text))}
else if(t==='example'){w.prepend(el('h4','sb-h','Exemple'+(b.title?' · '+b.title:'')));var u=el('div','sb-ex');b.rows.forEach(function(r,i){var p=el('p',i?'':'sb-given'),k=r.lastIndexOf('=');if(i&&k>0)p.append(document.createTextNode(r.slice(0,k+1)+' '),el('b','',r.slice(k+1).trim()));else p.textContent=r;u.append(p)});w.append(u)}
else if(t==='flow'){var f=el('div','sb-flow');b.parts.forEach(function(x,i){if(i)f.append(el('i','','→'));f.append(el('span','',x))});w.append(f)}
else if(t==='list'){var l=el(b.numbered?'ol':'ul','sb-list');b.items.forEach(function(x){l.append(el('li','',x))});w.append(l)}
else{var g=el('div','sb-grid');b.items.forEach(function(it,i){var c=el('div','sb-card sb-c'+i);c.append(el('b','',it[0]),el('span','',it[1]));g.append(c)});w.append(g)}
return w}
function mount(root){var d=window.STUDY_BFA_SHEETS,slug=document.body.dataset.matiere;if(!d||!d[slug])return;
var i=[].slice.call(document.querySelectorAll('[data-ai-chapter]')).findIndex(function(b){return b.classList.contains('active')});if(i<0)i=0;
var s=d[slug][i];if(!s)return;if(root.firstElementChild&&root.firstElementChild.classList.contains('sb-sheet')&&root.dataset.sbIdx===String(i))return;
var sh=el('div','sb-sheet');s.forEach(function(b){sh.append(render(b))});root.dataset.sbIdx=i;root.replaceChildren(sh)}
document.addEventListener('DOMContentLoaded',function(){var r=document.getElementById('ai-revision');if(!r)return;mount(r);new MutationObserver(function(){mount(r)}).observe(r,{childList:true})});
})();
'''

if __name__ == '__main__':
    sheets, stats, n_pdf = {}, collections.Counter(), 0
    os.makedirs('fiches', exist_ok=True)
    for f, (slug, name) in SUBJECTS.items():
        sheets[slug] = []
        for i, c in enumerate(load(f)):
            num = c.get('number', i + 1); blocks = []
            for n in c['notes']:
                text = n[1]
                for pat in DROP: text = re.sub(pat, '', text)
                blocks.append(classify(n[0], text.strip()))
            sheets[slug].append(blocks); stats.update(b['type'] for b in blocks)
            make_pdf('fiches/%s-chapitre-%s.pdf' % (slug, num), name, num, c['title'], blocks); n_pdf += 1
    js = 'window.STUDY_BFA_SHEETS=' + json.dumps(sheets, ensure_ascii=False, separators=(',', ':')) + ';' + RENDER
    open('assets/studybfa-revision-v210.js', 'w', encoding='utf-8').write(js)
    print('PDF générés :', n_pdf); print('Blocs par type :', dict(stats))
