/* Accessible connected concept map for the six structured subjects. */
(function () {
  'use strict';
  const namespace='http://www.w3.org/2000/svg';
  function render(host, detail, title, branches) {
    if (!host || !detail) return;
    if (host._mapObserver) { host._mapObserver.disconnect(); host._mapObserver=null; }
    if (host._mapResize) { window.removeEventListener('resize',host._mapResize); host._mapResize=null; }
    host.replaceChildren();
    host.className='sb-map-accessible';
    const svg=document.createElementNS(namespace,'svg');
    svg.setAttribute('class','sb-map-connections');
    svg.setAttribute('aria-hidden','true');
    host.append(svg);
    const center=document.createElement('div');
    center.className='sb-map-core';
    center.textContent=title;
    host.append(center);
    const tree=document.createElement('div');
    tree.className='sb-map-tree';
    host.append(tree);
    const items=Array.isArray(branches)?branches:[];
    const nodes=[];
    function select(index) {
      nodes.forEach((button,i)=>{
        button.classList.toggle('is-selected',i===index);
        button.setAttribute('aria-pressed',String(i===index));
      });
      detail.replaceChildren();
      const h=document.createElement('strong');
      h.textContent=items[index][0];
      const p=document.createElement('p');
      p.textContent=items[index][1];
      detail.append(h,p);
    }
    items.forEach(([label], index) => {
      const button=document.createElement('button');
      button.type='button';
      button.className='sb-map-node';
      button.setAttribute('aria-pressed','false');
      button.textContent=label;
      button.addEventListener('click',()=>select(index));
      tree.append(button);nodes.push(button);
    });
    function connectors() {
      const hostRect=host.getBoundingClientRect();
      const origin=center.getBoundingClientRect();
      if(!hostRect.width||!origin.width) return;
      const width=hostRect.width,height=hostRect.height;
      svg.setAttribute('viewBox','0 0 '+width+' '+height);
      svg.replaceChildren();
      const startX=origin.left+origin.width/2-hostRect.left;
      const startY=origin.bottom-hostRect.top;
      nodes.forEach((node,i)=>{
        const rect=node.getBoundingClientRect();
        const endX=rect.left+rect.width/2-hostRect.left;
        const endY=rect.top-hostRect.top;
        const path=document.createElementNS(namespace,'path');
        const midY=startY+(endY-startY)*.45;
        path.setAttribute('d','M '+startX+' '+startY+' C '+startX+' '+midY+', '+endX+' '+midY+', '+endX+' '+endY);
        path.setAttribute('class','sb-map-link sb-map-link-'+i%4);
        svg.append(path);
      });
    }
    detail.classList.add('be-map-detail');
    if(items.length)select(0);
    host._mapResize=()=>connectors();
    window.addEventListener('resize',host._mapResize);
    if(typeof ResizeObserver==='function') {
      host._mapObserver=new ResizeObserver(connectors);
      host._mapObserver.observe(host);
    }
    requestAnimationFrame(connectors);
  }
  window.StudyBFAAcademyMap={render};
})();
