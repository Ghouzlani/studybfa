document.addEventListener('DOMContentLoaded',()=>{
const chapters=window.STUDY_BFA_AI;
const $=id=>document.getElementById(id);
let ch=0,tab='video',card=0,flipped=false,qi=0,selected=-1,checked=false,score=0,done=false,missed=[];
function node(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e}
function chooseChapter(i){ch=i;card=0;flipped=false;qi=0;selected=-1;checked=false;score=0;done=false;missed=[];
document.querySelectorAll('[data-ai-chapter]').forEach(b=>{const active=+b.dataset.aiChapter===ch;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
$('ai-chapter-number').textContent='CHAPITRE '+(ch+1);$('ai-chapter-title').textContent=chapters[ch].title;
const rev=$('ai-revision');rev.replaceChildren();chapters[ch].notes.forEach(([title,body])=>{rev.append(node('h4','',title),node('p','',body))});
chooseTab('video')}
function chooseTab(t){tab=t;document.querySelectorAll('[data-ai-tab]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.aiTab===t)));
['video','cards','quiz','map'].forEach(x=>{$('ai-'+x).hidden=x!==t});if(t==='cards')renderCard();if(t==='quiz')renderQuiz();if(t==='map')renderMap()}
function renderCard(){const cards=chapters[ch].cards;const [q,a]=cards[card];$('ai-card-side').textContent=flipped?'RÉPONSE':'QUESTION';$('ai-card-text').textContent=flipped?a:q;$('ai-card').classList.toggle('flipped',flipped);$('ai-card-count').textContent=(card+1)+' / '+cards.length;$('ai-card-meter').style.width=(100*(card+1)/cards.length)+'%';$('ai-prev').disabled=card===0;$('ai-next').disabled=card===cards.length-1}
function renderQuiz(){const data=chapters[ch].quiz,body=$('ai-quiz-body');body.replaceChildren();$('ai-quiz-count').textContent=(qi+1)+' / '+data.length;$('ai-quiz-meter').style.width=(100*(qi+1)/data.length)+'%';if(done){body.append(node('h3','','Résultat : '+score+' / '+data.length),node('p','','Vous pouvez revoir vos erreurs puis recommencer.'));if(missed.length){const box=node('div','sb-mistake-review');box.append(node('h4','','Questions à revoir ('+missed.length+')'));missed.forEach(i=>{const q=data[i];box.append(node('p','',q[0]+' — '+q[3]))});body.append(box)}const b=node('button','ai-primary','Recommencer');b.addEventListener('click',()=>{qi=0;selected=-1;checked=false;score=0;done=false;missed=[];renderQuiz()});body.append(b);return}
const [q,options,correct,why]=data[qi];body.append(node('h3','',q));options.forEach((o,i)=>{const b=node('button','ai-option',String.fromCharCode(65+i)+'. '+o);if(selected===i)b.classList.add('selected');if(checked&&i===correct)b.classList.add('correct');if(checked&&selected===i&&i!==correct)b.classList.add('incorrect');b.disabled=checked;b.addEventListener('click',()=>{selected=i;renderQuiz()});body.append(b)});
if(checked){body.append(node('p','ai-feedback',(selected===correct?'Bonne réponse ! ':'À retenir : ')+why))}
const next=node('button','ai-primary',checked?(qi===data.length-1?'Voir le résultat':'Question suivante'):'Vérifier la réponse');next.disabled=selected<0;next.addEventListener('click',()=>{if(!checked){checked=true;if(selected===correct)score++;else if(!missed.includes(qi))missed.push(qi)}else if(qi===data.length-1){done=true}else{qi++;selected=-1;checked=false}renderQuiz()});body.append(next)}
function renderMap(){window.StudyBFAAcademyMap.render($('ai-map-body'),$('ai-map-detail'),chapters[ch].title,chapters[ch].map)}
document.querySelectorAll('[data-ai-chapter]').forEach(b=>b.addEventListener('click',()=>chooseChapter(+b.dataset.aiChapter)));
document.querySelectorAll('[data-ai-tab]').forEach(b=>b.addEventListener('click',()=>chooseTab(b.dataset.aiTab)));
$('ai-card').addEventListener('click',()=>{flipped=!flipped;renderCard()});
$('ai-prev').addEventListener('click',()=>{if(card>0){card--;flipped=false;renderCard()}});
$('ai-next').addEventListener('click',()=>{if(card<chapters[ch].cards.length-1){card++;flipped=false;renderCard()}});
chooseChapter(0);
});