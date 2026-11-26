/* Study BFA · Revision readability · presentation only, original academic text preserved. */
(()=>{'use strict';
const ABBR=new Set(['dr','mme','m','mr','mrs','ms','pr','prof','ex','cf','art','fig','p','n','no','vol','éd','ed','st','ste']);
const normalize=value=>String(value||'').replace(/\s+/gu,' ').trim();
function splitIdeas(value){
 const raw=String(value||'');
 if(/\r?\n/u.test(raw))return raw.split(/\r?\n/u).flatMap(v=>splitIdeas(v)).filter(Boolean);
 const text=normalize(raw),parts=[];let start=0;
 for(let i=0;i<text.length;i++){
  const ch=text[i];if(!'.!?;'.includes(ch))continue;
  let stop=i+1;while(stop<text.length&&/[»”"’')]/u.test(text[stop]))stop++;
  if(!/\s/u.test(text[stop]||''))continue;
  let next=stop;while(next<text.length&&/\s/u.test(text[next]))next++;
  if(next>=text.length)continue;
  if(ch!==';'&&!/[A-ZÀ-ÖØ-Þ«“"'(]/u.test(text[next]))continue;
  if(ch==='.'){
   const numeral=text.slice(start,i).match(/(?:^|[\s(])(?:\d{1,2}|[IVX]{1,5})$/u);
   if(numeral)continue;
   const word=text.slice(start,i).match(/([\p{L}]+)$/u);
   if(word&&ABBR.has(word[1].toLowerCase()))continue;
   if(/[A-Z]/u.test(text[i-1]||'')&&/[A-Z]/u.test(text[i-2]||''))continue;
  }
  const s=text.slice(start,stop).trim();if(s)parts.push(s);
  start=next;i=next-1;
 }
 if(text.slice(start).trim())parts.push(text.slice(start).trim());
 return parts.length?parts:[text];
}
function isFormula(value){
 return /(?:[=≈≠≤≥×÷]| \/\s)/u.test(value) && value.length<=420;
}
function isolate(value){
 const result=[];
 for(const sentence of splitIdeas(value)){
  // Explicit introductory text must not be part of the mathematical expression.
  const m=sentence.match(/^(.{5,150}?:)\s+(.+[=≈]\s*.+)$/u);
  if(m&&!isFormula(m[1])&&isFormula(m[2]))result.push(m[1],m[2]);
  else result.push(sentence);
 }
 return result;
}
function makeLine(value){
 const p=document.createElement('p');p.className='sb-revision-line';
 if(isFormula(value)||/\s=\s/u.test(value)||(/\s\/\s/u.test(value)&&!/[.!?]$/u.test(value)&&value.length<220)||/^(?:Repère du cours|Seuil|Attention|Règle)\s*:/iu.test(value)||/^(?:CMUP|CAF|BFR|FRNG|TVA|EBE|VA|COÛT|Coût|Résultat|RÉSULTAT|Stock final|Valeur des sorties)\b[^.]{0,120}=/iu.test(value))p.classList.add('sb-revision-formula');
 const match=value.match(/^([^:]{2,64}:)(\s+)(.+)$/u);
 if(match&&!match[1].includes('://')){
  const strong=document.createElement('strong');strong.textContent=match[1];
  p.append(strong,document.createTextNode(match[2]+match[3]));
 }else p.textContent=value;
 return p;
}
function formatParagraph(p){
 if(!p||p.dataset.sbFormatted)return;
 const raw=p.textContent;const original=normalize(raw);if(!original)return;
 const parts=isolate(raw);
 if(parts.length===1){const line=makeLine(parts[0]);line.dataset.sbFormatted='1';p.replaceWith(line);return;}
 if(normalize(parts.join(' '))!==original)return;
 const group=document.createElement('div');group.className='sb-revision-lines';group.dataset.sbFormatted='1';
 parts.forEach(s=>group.append(makeLine(s)));p.replaceWith(group);
}
function refresh(){document.querySelectorAll('#ai-revision .sb-revision-prose > p, .be-sheet-prose > p').forEach(formatParagraph);}
document.addEventListener('DOMContentLoaded',()=>{
 refresh();
 const sheet=document.getElementById('ai-revision');
 if(sheet&&window.MutationObserver){const watcher=new MutationObserver(refresh);watcher.observe(sheet,{childList:true,subtree:true});}
});
window.StudyBFARevisionStructure={splitIdeas:isolate,refresh,isFormula};
})();