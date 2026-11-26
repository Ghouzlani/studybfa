// On-demand PDF output for the three revision units of chapter 3.
// One authoritative chapter-to-file map, no browser print step required.
const UNITS = [{"title":"Ratios de rentabilité et de structure financière","notes":[["Définition et utilisation","Un ratio est le rapport entre deux grandeurs significatives.\nIl complète le bilan, le CPC et l’ESG ; comparer dans le temps ou avec des entreprises du même secteur."],["Rentabilité commerciale nette","Résultat net / CA HT\nInterprétation : résultat net dégagé par dirham de chiffre d’affaires."],["Rentabilité commerciale brute","EBE / CA HT\nInterprétation : performance commerciale avant les effets du financement, des investissements et du non-courant."],["Rentabilité économique brute","EBE / Capitaux investis\nCapitaux investis = Immobilisations + BFR structurel\nInterprétation : rendement des moyens engagés."],["Rentabilité financière","Résultat net / Capitaux propres\nInterprétation : rendement des fonds propres."],["Rentabilité pour les actionnaires","Dividendes distribués / Capital social (ou personnel)\nInterprétation : dividendes rapportés au capital."],["Ratio de fonds de roulement","Ressources stables / Immobilisations\nRepère du cours : > 1. Les ressources stables couvrent alors les immobilisations."],["Endettement global","Total des dettes / Total du passif\nInterprétation : part du passif financée par la dette."],["Structure de l’endettement","Dettes de financement / Total des dettes\nInterprétation : poids des dettes de financement dans l’endettement global."],["Coût de l’endettement","Charges financières / Total des dettes\nInterprétation : coût des dettes selon le ratio du support."],["Autonomie financière","Capitaux propres / Financement permanent\nRepère du cours : > 50 %."],["Capacité de remboursement (1)","Capitaux propres / Dettes de financement\nRepère du cours : > 1 en principe."],["Capacité de remboursement (2)","Dettes de financement / CAF\nInterprétation : nombre d’années théoriques de CAF. Repère du cours : ne pas dépasser 4 à 5 fois."]]},{"title":"Ratios d’activité, valeur ajoutée et liquidité","notes":[["Principe des ratios d’activité","Les durées du cours sont calculées sur 360 jours.\nStock moyen = (Stock initial + Stock final) / 2 (lorsque seules ces deux valeurs sont disponibles)."],["Stock de marchandises","(Stock moyen de marchandises / Achats revendus de marchandises) × 360\nDurée moyenne du stockage commercial, en jours."],["Stock de matières et fournitures","(Stock moyen de matières et fournitures / Achats consommés de matières et fournitures) × 360\nDurée moyenne du stockage industriel, en jours."],["Stock de produits en cours","(Stock moyen de produits en cours / Production vendue) × 360\nDurée de stockage selon le support."],["Stock de produits finis","(Stock moyen de produits finis / Production vendue) × 360\nDurée de stockage selon le support."],["Délai clients","(En-cours clients / Ventes TTC) × 360\nDélai d’encaissement en jours."],["Délai fournisseurs","(En-cours fournisseurs / Achats TTC) × 360\nDélai de paiement en jours."],["Part du personnel","Charges de personnel / Valeur ajoutée\nPart de la richesse créée destinée au personnel."],["Part de l’État","(IS + Impôts et taxes) / Valeur ajoutée\nPart destinée à l’État."],["Part des bailleurs de fonds","Charges financières / Valeur ajoutée\nPart destinée aux bailleurs de fonds."],["Part des actionnaires","Dividendes / Valeur ajoutée\nPart destinée aux actionnaires."],["Part de l’entreprise","Autofinancement / Valeur ajoutée\nPart conservée par l’entreprise."],["Liquidité générale","Actif circulant / Dettes à court terme (DCT)\nMesure la couverture des engagements à court terme."],["Liquidité relative","(Créances de l’actif circulant + Trésorerie) / DCT\nExclut les stocks."],["Liquidité immédiate","Trésorerie / DCT\nMesure la couverture par la seule trésorerie."]]},{"title":"Rentabilité économique, financière et effet de levier","notes":[["Principe","L’effet de levier explique l’incidence de l’endettement sur la rentabilité des capitaux propres."],["Actif économique","Actif économique = Immobilisations corporelles et incorporelles d’exploitation + Biens en crédit-bail d’exploitation + Besoin de financement de l’exploitation\nLe cours présente également la définition générale : actifs immobilisés + BFR."],["Rentabilité économique brute (ROI)","EBE / Actif économique brut (ou net)\nLe support mentionne aussi le résultat net après impôt / actif économique brut (ou net)."],["Rentabilité économique retenue pour le levier","Re = Résultat d’exploitation / Actif économique\nConvention donnée à la page 18 du support."],["ROA","Résultat net / Actif total\nNe pas confondre avec Re."],["Rentabilité financière","Rcp = Résultat net / Capitaux propres\nRendement des fonds propres."],["Formule du professeur (page 21)","Rcp = Re + (Re − i) × (D / CP) × (1 − t)\nD : dettes totales ; CP : capitaux propres ; i : taux d’intérêt moyen avant IS ; t : taux d’impôt.\nAttention : la page 21 définit Re après IS, alors que la page 18 utilise le résultat d’exploitation. Clarifier la convention avec le professeur avant application numérique ; ne pas mélanger les taux avant et après impôt."],["Lecture du terme de levier","Re > i : terme positif.\nRe = i : terme nul.\nRe < i : terme négatif.\nCes signes supposent D / CP positif et un taux d’impôt inférieur à 100 %."],["Limite","Une rentabilité financière accrue ne garantit pas la capacité de remboursement. Examiner également la CAF et le niveau d’endettement."]]}];
const CP1252 = { 0x20ac:128,0x201a:130,0x0192:131,0x201e:132,0x2026:133,
0x2020:134,0x2021:135,0x02c6:136,0x2030:137,0x0160:138,0x2039:139,
0x0152:140,0x017d:142,0x2018:145,0x2019:146,0x201c:147,0x201d:148,
0x2022:149,0x2013:150,0x2014:151,0x02dc:152,0x2122:153,0x0161:154,
0x203a:155,0x0153:156,0x017e:158,0x0178:159 };
function bytes(s) {
  const out=[];
  for(const c of s.replace(/−/g,'–').replace(/→/g,'>')) { const n=c.codePointAt(0);
    if(n<256)out.push(n);
    else if(CP1252[n])out.push(CP1252[n]);
    else out.push(63);
  }
  return new Uint8Array(out);
}
function esc(s) {return String(s).replace(/\\/g,"\\\\").replace(/\(/g,"\\(").replace(/\)/g,"\\)");}
function chunks(text,max=92){
 const words=String(text).split(/\s+/);const lines=[];let line="";
 for(const word of words){if((line+" "+word).trim().length>max&&line){lines.push(line);line=word;}else line+=(line?" ":"")+word;}
 if(line)lines.push(line);return lines;
}
function pdf(index, unit=UNITS[index], subject='ANALYSE FINANCIERE', chapter='CHAPITRE 3 - LA METHODE DES RATIOS', prefix='Partie '){
 const W=595,H=842,left=52,bottom=58;
 const pages=[];let cmds=[],y=H-128;
 function push(){if(cmds.length){pages.push(cmds.join("\n"));cmds=[];}}
 function newPage(){
   push();y=H-128;
   cmds.push("0.075 0.18 0.29 rg 0 768 595 74 re f");
   cmds.push('BT /B 20 Tf 1 1 1 rg 52 799 Td (StudyBFA) Tj ET');
   cmds.push('BT /R 9 Tf 0.83 0.90 0.95 rg 52 783 Td ('+esc('FICHE DE REVISION - '+subject)+') Tj ET');
   cmds.push('0.80 0.87 0.91 RG 52 54 m 543 54 l S');
 }
 function line(text,size=11,bold=false,color="0.10 0.20 0.30",leading=16){
  if(y<bottom+leading)newPage();
  cmds.push("BT /"+(bold?"B":"R")+" "+size+" Tf "+color+" rg 52 "+y+" Td ("+esc(text)+") Tj ET");
  y-=leading;
 }
 newPage();
 line(chapter,10,true,"0.20 0.39 0.53",25);
 for(const t of chunks(prefix+(index+1)+" - "+unit.title,45))line(t,17,true,"0.075 0.18 0.29",24);
 y-=13;
 for(const [heading,body] of unit.notes){
  const lines=body.split('\n').flatMap((part)=>chunks(part,77).map(t=>({t,bold:/[=×]| \/ |^(Repère|Attention)/u.test(part)})));
  if(y < bottom+35+lines.length*16)newPage();
  for(const h of chunks(heading,65))line(h,13,true,"0.08 0.29 0.44",21);
  for(const item of lines)line(item.t,11,item.bold,item.bold?"0.08 0.29 0.44":"0.14 0.20 0.29",16);
  y-=12;
 }
 push();
 let objects=[""];const add=s=>(objects.push(s),objects.length-1);
 const fontR=add("<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman /Encoding /WinAnsiEncoding >>");
 const fontB=add("<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold /Encoding /WinAnsiEncoding >>");
 const pageIds=[],contentIds=[];
 for(const content of pages){contentIds.push(add("<< /Length "+bytes(content).length+" >>\nstream\n"+content+"\nendstream"));pageIds.push(add("PENDING"));}
 const pageTree=add("PENDING");
 const catalog=add("<< /Type /Catalog /Pages "+pageTree+" 0 R >>");
 for(let i=0;i<pageIds.length;i++)objects[pageIds[i]]="<< /Type /Page /Parent "+pageTree+" 0 R /MediaBox [0 0 595 842] /Resources << /Font << /R "+fontR+" 0 R /B "+fontB+" 0 R >> >> /Contents "+contentIds[i]+" 0 R >>";
 objects[pageTree]="<< /Type /Pages /Count "+pageIds.length+" /Kids ["+pageIds.map(n=>n+" 0 R").join(" ")+"] >>";
 const header="%PDF-1.4\n%\xE2\xE3\xCF\xD3\n",out=[bytes(header)];let offset=out[0].length;const offsets=[0];
 for(let i=1;i<objects.length;i++){offsets.push(offset);const part=bytes(i+" 0 obj\n"+objects[i]+"\nendobj\n");out.push(part);offset+=part.length;}
 const xref=offset;
 let trailer="xref\n0 "+objects.length+"\n0000000000 65535 f \n";
 for(let i=1;i<objects.length;i++)trailer+=String(offsets[i]).padStart(10,"0")+" 00000 n \n";
 trailer+="trailer\n<< /Size "+objects.length+" /Root "+catalog+" 0 R >>\nstartxref\n"+xref+"\n%%EOF\n";
 out.push(bytes(trailer));
 const all=new Uint8Array(out.reduce((n,a)=>n+a.length,0));let at=0;
 for(const part of out){all.set(part,at);at+=part.length;}
 return all;
}
export function renderRatioPDF(index) {
 if(index<0||index>=UNITS.length)return new Response("Not found",{status:404});
 const data=pdf(index);
 return new Response(data,{headers:{"Content-Type":"application/pdf","Content-Disposition":"attachment; filename=\"StudyBFA-Analyse-financiere-Chapitre-3-Partie-"+(index+1)+".pdf\"","Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
}

export function renderStudyPDF(unit,index,subject,chapter,filename){
 if(!unit||!Array.isArray(unit.notes))return new Response("Fiche introuvable",{status:404});
 return new Response(pdf(index,unit,subject,chapter,"Chapitre "),{headers:{"Content-Type":"application/pdf","Content-Disposition":"attachment; filename=\""+filename+"\"","Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
}
