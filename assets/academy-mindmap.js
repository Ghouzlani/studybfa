/* Traditional connected mind map shared across all completed subjects.
   Data remains in each subject's existing chapter map arrays. */
(function(){
"use strict";
const palette=["#467fbd","#9373c8","#1f9388","#d59a40","#cc7584","#7995a3"];
function render(container, detailEl, title, branches){
 container.replaceChildren();
 container.classList.add("academy-map-host");
 const stage=document.createElement("div");stage.className="academy-map-stage";
 const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
 svg.setAttribute("viewBox","0 0 1000 710");svg.setAttribute("aria-hidden","true");
 svg.classList.add("academy-map-lines");
 const center=document.createElement("div");center.className="academy-map-center";center.textContent=title;
 stage.append(svg,center);
 const nodes=[];
 const n=branches.length;
 branches.forEach(([name,desc],i)=>{
   const side=i%2===0?0:1, row=Math.floor(i/2);
   const rows=Math.ceil(n/2);
   const y=rows===1?50:(12+row*76/(rows-1));
   const box=document.createElement("button");box.type="button";box.className="academy-map-branch";
   box.style.setProperty("--branch-color",palette[i%palette.length]);
   box.style.left=side===0?"3%":"73%";
   box.style.top=y+"%";
   box.style.transform="translateY(-50%)";
   const heading=document.createElement("strong");heading.textContent=name;
   const text=document.createElement("span");text.textContent=desc;
   box.append(heading,text);
   box.setAttribute("aria-pressed","false");
   box.addEventListener("click",()=>select(i));
   stage.append(box);nodes.push(box);
   const line=document.createElementNS("http://www.w3.org/2000/svg","path");
   const endX=side===0?300:730;
   const endY=y*7.1;
   const startX=side===0?420:580;
   line.setAttribute("d",`M ${startX} 355 Q ${side===0?355:645} ${endY} ${endX} ${endY}`);
   line.setAttribute("fill","none");line.setAttribute("stroke",palette[i%palette.length]);
   line.setAttribute("stroke-width","6");line.setAttribute("stroke-linecap","round");
   line.classList.add("academy-map-line");
   svg.append(line);
 });
 container.append(stage);
 function select(i){
  nodes.forEach((b,j)=>{b.classList.toggle("active",i===j);b.setAttribute("aria-pressed",String(i===j))});
  const [name,desc]=branches[i];
  detailEl.textContent=name+" — "+desc;
  detailEl.classList.add("academy-map-explanation");
 }
 if(nodes.length)select(0);
}
window.StudyBFAAcademyMap={render};
})();
