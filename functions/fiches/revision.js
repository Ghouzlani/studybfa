import {renderStudyPDF} from "../_lib/ratio-pdf.js";
// Read the exact data served to the learning page in the same deployment.
const SUBJECTS={
 "analyse-financiere":["analyse-financiere","ANALYSE FINANCIÈRE"],
 "comptabilite-gestion":["comptabilite-gestion","COMPTABILITÉ DE GESTION"],
 "fiscalite":["fiscalite","FISCALITÉ"],
 "marche-financier":["marche-financier","MARCHÉ FINANCIER"],
 "culture-entrepreneuriale":["culture-entrepreneuriale","CULTURE ENTREPRENEURIALE"],
 "management-organisations":["management-organisations","MANAGEMENT DES ORGANISATIONS"],
 "systeme-information-erp":["erp","SYSTÈMES D’INFORMATION ET ERP"],
 "intelligence-artificielle":["ai","INTELLIGENCE ARTIFICIELLE"],
 "entrepreneuriat-business-plan":["entrepreneuriat","ENTREPRENEURIAT ET BUSINESS PLAN"],
 "tec":["tec","TECHNIQUES D’EXPRESSION ET DE COMMUNICATION"]
};
const plain=s=>s.replace(/<[^>]*>/g,"").replace(/&amp;/g,"&").replace(/&nbsp;/g," ").replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").trim();
export async function onRequestGet({request,env}){
 const url=new URL(request.url),slug=url.searchParams.get("matiere"),raw=url.searchParams.get("chapitre");
 if(!/^[1-9]\d?$/.test(raw||""))return new Response("Fiche introuvable",{status:404});
 const i=Number(raw)-1;
 try{
 let unit,subject,label;
 if(slug==="business-english"){
  if(i!==0)return new Response("Fiche introuvable",{status:404});
  const res=await env.ASSETS.fetch(new URL("/matieres/business-english/",url));
  if(!res.ok)throw Error("Source not available");
  const html=await res.text(),section=html.match(/<div class="be-sheet be-sheet-prose">([\s\S]*?)<\/div>/i);
  if(!section)throw Error("Revision not available");
  const notes=[...section[1].matchAll(/<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/gi)].map(m=>[plain(m[1]),plain(m[2])]);
  if(!notes.length)throw Error("Revision empty");
  unit={title:"Workplace Communication",notes};subject="BUSINESS ENGLISH";label="CHAPTER 1";
 }else{
  if(!Object.hasOwn(SUBJECTS,slug))return new Response("Fiche introuvable",{status:404});
  const [file,name]=SUBJECTS[slug];
  const res=await env.ASSETS.fetch(new URL("/assets/"+file+"-content.js",url));
  if(!res.ok)throw Error("Source not available");
  const text=(await res.text()).trim();
  const match=text.match(/^window\.STUDY_BFA_AI\s*=\s*(\[[\s\S]*\]);?$/);
  if(!match)throw Error("Invalid source format");
  const units=JSON.parse(match[1]);unit=units[i];subject=name;
  if(!unit)return new Response("Fiche introuvable",{status:404});
  label=unit.label||("CHAPITRE "+(unit.number||i+1));
  if(slug==="analyse-financiere")label+=(i<4?" - PARTIE "+(i+1):i<7?" - PARTIE "+(i-3):" - PARTIE "+(i-6));
 }
 return renderStudyPDF(unit,i,subject,label,"StudyBFA-"+slug+"-fiche-"+(i+1)+".pdf");
 }catch(err){console.error("StudyBFA PDF:",String(err));return new Response("La fiche est momentanément indisponible. Réessayez ou signalez le problème.",{status:503,headers:{"Cache-Control":"no-store"}});}
}
