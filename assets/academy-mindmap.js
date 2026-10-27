
(function(){
'use strict';
const NS='http://www.w3.org/2000/svg';
const colors=['#397bd7','#8b5cf6','#0d9488','#db8a20','#d85470','#64748b'];
const positions=[[40,35],[640,35],[40,250],[640,250],[40,465],[640,465]];
const paths=[
'M450 325 Q280 320 220 115','M450 325 Q620 310 680 115',
'M450 325 Q300 325 220 330','M450 325 Q610 325 680 330',
'M450 325 Q300 390 220 545','M450 325 Q600 390 680 545'];
function svgEl(tag,attrs={}){const e=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);return e}
function wrapWords(value,max=17){const words=String(value).split(/\s+/),lines=[];let line='';for(const w of words){if(line&&line.length+w.length+1>max){lines.push(line);line=w}else line+=(line?' ':'')+w}if(line)lines.push(line);return lines}
function render(host,detail,title,branches){
 if(!host||!detail)return;
 host.replaceChildren();
 host.className='be-map-viewport academy-be-map-viewport';
 const canvas=document.createElement('div');canvas.className='academy-be-map-canvas';
 const svg=svgEl('svg',{viewBox:'0 0 900 660',role:'img','aria-label':'Carte mentale interactive de '+title});
 const wires=svgEl('g',{fill:'none','stroke-width':'5','stroke-linecap':'round'});
 const center=svgEl('rect',{x:315,y:278,width:270,height:94,rx:22,fill:'#173354'});
 const titleText=svgEl('text',{x:450,y:315,'text-anchor':'middle','font-size':21,'font-weight':'bold',fill:'#fff'});
 const titleLines=wrapWords(title,24).slice(0,3);
 titleText.setAttribute('y',String(327-(titleLines.length-1)*14));
 titleLines.forEach((line,j)=>{const t=svgEl('tspan',{x:450,dy:j===0?0:27});t.textContent=line;titleText.append(t)});
 const nodes=svgEl('g');
 const data=branches.slice(0,6);
 function select(i){
  Array.from(nodes.children).forEach((el,j)=>{el.classList.toggle('is-active',i===j);el.setAttribute('aria-pressed',String(i===j))});
  Array.from(wires.children).forEach((el,j)=>el.classList.toggle('is-active',i===j));
  detail.replaceChildren();
  const strong=document.createElement('strong');strong.textContent='✦ '+data[i][0];
  const p=document.createElement('p');p.textContent=data[i][1];
  detail.append(strong,p);
 }
 data.forEach(([label,description],i)=>{
  const color=colors[i], [x,y]=positions[i];
  const line=svgEl('path',{d:paths[i],stroke:color,class:'be-map-branch'});wires.append(line);
  const g=svgEl('g',{class:'map-node',role:'button',tabindex:'0','aria-label':label,'aria-pressed':'false'});
  const rect=svgEl('rect',{x,y,width:220,height:160,rx:17,fill:color,'fill-opacity':'.14',stroke:color,'stroke-width':3});
  g.append(rect);
  const head=svgEl('text',{x:x+14,y:y+29,'font-size':15,'font-weight':'bold',fill:color});
  head.textContent=String(label).toUpperCase().slice(0,27);g.append(head);
  const bulletLines=String(description).split(/[,;·]/).map(x=>x.trim()).filter(Boolean);
  const items=bulletLines.length>1?bulletLines.slice(0,3):wrapWords(description,24).slice(0,3);
  items.forEach((item,j)=>{
   const t=svgEl('text',{x:x+14,y:y+65+j*27,'font-size':13,fill:color});
   t.textContent='• '+item.slice(0,28);g.append(t);
  });
  g.addEventListener('click',()=>select(i));
  g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(i)}});
  nodes.append(g);
 });
 svg.append(wires,center,titleText,nodes);canvas.append(svg);host.append(canvas);
 // Same zoom controls as Business English, including horizontal scroll on narrow screens
 const tools=document.createElement('div');tools.className='be-map-tools academy-be-map-tools';
 let zoom=1;
 const actions=[['− Zoom out',-.2],['Reset',0],['+ Zoom in',.2]];
 actions.forEach(([label,delta])=>{const b=document.createElement('button');b.type='button';b.className='be-btn secondary';b.textContent=label;
 b.addEventListener('click',()=>{zoom=delta===0?1:Math.max(.65,Math.min(1.7,zoom+delta));canvas.style.width=(900*zoom)+'px';svg.style.width=(900*zoom)+'px';svg.style.height=(660*zoom)+'px'});
 tools.append(b)});
 host.parentElement.insertBefore(tools,host);
 host.parentElement.querySelectorAll('.academy-be-map-tools').forEach((el,i)=>{if(i>0)el.remove()});
 detail.classList.add('be-map-detail');
 if(data.length)select(0);
}
window.StudyBFAAcademyMap={render};
})();
