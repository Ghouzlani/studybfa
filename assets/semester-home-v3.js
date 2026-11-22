/* Study BFA — switch semester subjects inline on the homepage (no navigation). */
(()=>{'use strict';
document.addEventListener('DOMContentLoaded',()=>{
 const root=document.querySelector('.study-semester-home');
 if(!root)return;
 const tabs=[...root.querySelectorAll('[data-study-semester]')];
 const panels=new Map([1,2,3].map(n=>[n,document.getElementById('study-semester-panel-s'+n)]));
 if(tabs.length!==3||[...panels.values()].some(x=>!x))return;
 function select(n,focus){
  for(const tab of tabs){
   const active=Number(tab.dataset.studySemester)===n;
   tab.setAttribute('aria-selected',String(active));
   tab.tabIndex=active?0:-1;
   if(active&&focus)tab.focus();
  }
  for(const [id,panel] of panels)panel.hidden=id!==n;
 }
 tabs.forEach((tab,i)=>{
  tab.addEventListener('click',()=>select(Number(tab.dataset.studySemester),false));
  tab.addEventListener('keydown',event=>{
   let index;
   if(event.key==='ArrowRight')index=(i+1)%tabs.length;
   else if(event.key==='ArrowLeft')index=(i+tabs.length-1)%tabs.length;
   else if(event.key==='Home')index=0;
   else if(event.key==='End')index=tabs.length-1;
   else return;
   event.preventDefault();select(Number(tabs[index].dataset.studySemester),true);
  });
 });
});
})();