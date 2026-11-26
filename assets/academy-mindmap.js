/* StudyBFA: concise concept maps with meaningful relationships and optional original detail. */
(function(){'use strict';
const english=[
 ["Sender → receiver","A sender encodes a message and uses a channel. The receiver interprets it and returns feedback."],
 ["Barriers → misunderstanding","Noise, jargon or stress may distort the intended meaning, causing delays, conflict and repeated work."],
 ["Feedback → shared understanding","Use precise language, an appropriate channel, active listening and clarification to close the gap."]
];
const arabic=[
 ["الإطار الدستوري","ينظم الدستور ممارسة السلطة وتطور منذ دستور 1962 إلى دستور 2011."],
 ["توزيع الاختصاصات","الملكية والحكومة والبرلمان والقضاء يمارسون اختصاصاتهم وفق الدستور والفصل والتوازن والتعاون بين السلط."],
 ["الحكامة والمشاركة","تسهم مؤسسات الحكامة وآليات المشاركة والرقابة في تدبير الشأن العام."]
];
function render(host,detail,title,branches){
 if(!host||!detail)return;
 if(host._mapObserver)host._mapObserver.disconnect();
 if(host._mapResize)window.removeEventListener('resize',host._mapResize);
 const slug=document.body.dataset.matiere||'',rtl=slug==='institutions-politiques-maroc',en=slug==='business-english';
 const active=document.querySelector('[data-ai-chapter].active'),index=Number(active?.dataset.aiChapter||0);
 const chapter=window.STUDY_BFA_AI?.[index];
 const items=Array.isArray(branches)?branches:[];
 const summary=chapter?.conceptLinks||(en?english:rtl&&index===5?arabic:items);
 const make=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e;};
 if(!document.getElementById('sb-concept-map-style')){
  const style=make('style');style.id='sb-concept-map-style';style.textContent=
  '.sb-concept-map{--tree-line:#9cb5cb;--tree-text:#173354;width:100%!important;max-width:100%;color:var(--tree-text);padding:12px 0 16px;box-sizing:border-box}.sb-concept-map *{box-sizing:border-box}.sb-concept-map .concept-root{max-width:580px;margin:0 auto;background:#173b65;color:white;text-align:center;padding:16px 20px;border-radius:12px;font-weight:700;font-size:1.12rem;line-height:1.4}.sb-concept-map .concept-branches{position:relative;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;padding-top:34px}.sb-concept-map .concept-branches:before{content:"";position:absolute;left:50%;top:0;height:17px;border-left:2px solid var(--tree-line)}.sb-concept-map .concept-branches:after{content:"";position:absolute;left:16.67%;right:16.67%;top:17px;border-top:2px solid var(--tree-line)}.sb-concept-map .concept-branch{min-width:0;position:relative;display:flex;flex-direction:column;text-align:start;background:#f7fbff;border:1px solid #b9cfdf;border-radius:10px;overflow-wrap:anywhere;padding:14px 13px;color:var(--tree-text);font:inherit;line-height:1.5}.sb-concept-map .concept-branch:before{content:"";position:absolute;bottom:100%;left:50%;height:17px;border-left:2px solid var(--tree-line)}.sb-concept-map .concept-branch strong{display:block;font-size:1rem;line-height:1.35;color:inherit;margin-bottom:9px}.sb-concept-map .concept-branch p{margin:0;color:inherit;line-height:1.55;font-size:.91rem}.sb-concept-map .concept-extra{margin-top:20px;border-top:1px solid var(--tree-line);padding-top:14px}.sb-concept-map .concept-extra summary{cursor:pointer;font-weight:700}.sb-concept-map .concept-extra dl{margin:.9rem 0;display:grid;gap:.75rem}.sb-concept-map .concept-extra dt{font-weight:700}.sb-concept-map .concept-extra dd{margin:0;line-height:1.6}.sb-concept-map .concept-extra div{padding:.5rem .75rem;border-inline-start:2px solid var(--tree-line)}html[data-theme="dark"] .sb-concept-map{--tree-text:#ecf4ff;--tree-line:#6f93b4}html[data-theme="dark"] .sb-concept-map .concept-branch{background:#172d45;border-color:#42617b}@media(max-width:700px){.sb-concept-map .concept-branches{grid-template-columns:1fr;padding:20px 0 0 18px;gap:13px}.sb-concept-map .concept-branches:before{left:4px;top:0;bottom:24px;height:auto}.sb-concept-map .concept-branches:after{left:4px;right:50%;top:0}.sb-concept-map .concept-branch:before{left:auto;inset-inline-end:100%;top:24px;width:14px;height:0;border-left:0;border-top:2px solid var(--tree-line)}.sb-concept-map[dir="rtl"] .concept-branches{padding:20px 18px 0 0}.sb-concept-map[dir="rtl"] .concept-branches:before{left:auto;right:4px}.sb-concept-map[dir="rtl"] .concept-branches:after{left:50%;right:4px}}';
  document.head.append(style);
 }
 host.replaceChildren();host.className='sb-concept-map';host.dir=rtl?'rtl':'ltr';
 host.append(make('div','concept-root',title));const tree=make('div','concept-branches');host.append(tree);
 summary.forEach(([heading,description])=>{const box=make('section','concept-branch');box.append(make('strong','',heading),make('p','',description));tree.append(box);});
 if(items.length&&summary!==items){const extra=make('details','concept-extra');extra.append(make('summary','',rtl?'تفاصيل إضافية':en?'Review key concepts':'Revoir les notions en détail'));const dl=make('dl');items.forEach(([name,desc])=>{const row=make('div');row.append(make('dt','',name),make('dd','',desc));dl.append(row);});extra.append(dl);host.append(extra);}
 detail.replaceChildren();detail.hidden=true;
}
window.StudyBFAAcademyMap={render};
})();
