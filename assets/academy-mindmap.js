(function(){'use strict';
function render(host,detail,title,branches){if(!host||!detail)return;
host.replaceChildren();host.className='sb-map-accessible';
const heading=document.createElement('div');heading.className='sb-map-core';heading.textContent=title;host.append(heading);
const tree=document.createElement('div');tree.className='sb-map-tree';host.append(tree);
const items=Array.isArray(branches)?branches:[];
function select(i){tree.querySelectorAll('button').forEach((b,j)=>{b.setAttribute('aria-pressed',String(i===j));b.classList.toggle('is-selected',i===j)});detail.replaceChildren();const h=document.createElement('strong');h.textContent=items[i][0];const p=document.createElement('p');p.textContent=items[i][1];detail.append(h,p)}
items.forEach(([label,description],i)=>{const b=document.createElement('button');b.type='button';b.className='sb-map-node';b.setAttribute('aria-pressed','false');const name=document.createElement('strong');name.textContent=label;const text=document.createElement('span');text.textContent=description;b.append(name,text);b.addEventListener('click',()=>select(i));tree.append(b)});
detail.classList.add('be-map-detail');if(items.length)select(0);
}
window.StudyBFAAcademyMap={render};})();