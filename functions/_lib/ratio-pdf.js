// On-demand PDF output for the three revision units of chapter 3.
// One authoritative chapter-to-file map, no browser print step required.
const UNITS = [{"title":"Ratios de rentabilité et de structure financière","notes":[["Méthode des ratios","Un ratio met en relation deux grandeurs financières significatives. Il complète le CPC, l’ESG et le bilan et sert à comparer des périodes, des entreprises ou des références sectorielles."],["Rentabilité commerciale","Rentabilité commerciale nette = résultat net / CA HT. Rentabilité commerciale d’exploitation = EBE / CA HT. La seconde mesure la performance de l’exploitation avant les effets des investissements, du financement et du non-courant."],["Rentabilité économique","Rentabilité économique brute = EBE / capitaux investis. Dans le cours, les capitaux investis correspondent aux immobilisations augmentées du BFR structurel : l’entreprise mesure le rendement des moyens utilisés."],["Rentabilité financière","Rentabilité financière des capitaux propres = résultat net / capitaux propres. Pour les actionnaires, le cours distingue aussi dividendes distribués / capital social (ou personnel)."],["Couverture des immobilisations","Ratio de fonds de roulement = ressources stables / immobilisations. Supérieur à 1 : les financements stables couvrent les immobilisations et peuvent contribuer au financement du cycle d’exploitation."],["Poids et structure des dettes","Endettement global = total des dettes / total passif. Structure de l’endettement = dettes de financement / total des dettes. Coût de l’endettement = charges financières / total des dettes."],["Autonomie financière","Autonomie financière = capitaux propres / financement permanent. Le support indique un seuil de référence supérieur à 50 % ; l’interprétation dépend aussi de la situation de l’entreprise."],["Capacité de remboursement","Capitaux propres / dettes de financement : en principe supérieur à 1 dans le cours. Dettes de financement / CAF : nombre d’années théoriques de CAF nécessaires au remboursement ; le support cite comme repère un plafond de 4 à 5 fois."]]},{"title":"Ratios d’activité, valeur ajoutée et liquidité","notes":[["Rotation des stocks : principe","Les durées sont exprimées en jours sur une année conventionnelle de 360 jours. Un délai de stockage plus long signifie davantage de ressources immobilisées en stock ; comparer à la nature de l’activité."],["Stocks d’une entreprise commerciale","Durée moyenne de stockage des marchandises = stock moyen de marchandises / achats revendus de marchandises × 360 jours."],["Stocks d’une entreprise industrielle","Matières et fournitures = stock moyen de matières et fournitures / achats consommés de matières et fournitures × 360 jours."],["En-cours et produits finis","En-cours = stock moyen de produits en cours / production vendue × 360 jours. Produits finis = stock moyen de produits finis / production vendue × 360 jours (formules du support)."],["Délais clients et fournisseurs","Délai clients = en-cours clients / ventes TTC × 360 jours. Délai fournisseurs = en-cours fournisseurs / achats TTC × 360 jours. Le premier renseigne sur l’encaissement ; le second sur le crédit obtenu."],["Répartition de la valeur ajoutée","Part du personnel = charges de personnel / VA. Part de l’État = (IS + impôts et taxes) / VA. Part des bailleurs de fonds = charges financières / VA."],["Actionnaires et entreprise","Part des actionnaires = dividendes / VA. Part de l’entreprise = autofinancement / VA. Ces ratios montrent les principales affectations de la richesse créée."],["Trois ratios de liquidité","Liquidité générale = actif circulant / dettes à court terme (DCT). Liquidité relative = (créances de l’actif circulant + trésorerie) / DCT. Liquidité immédiate = trésorerie / DCT. Ils évaluent la capacité à couvrir les engagements proches."]]},{"title":"Rentabilité économique, financière et effet de levier","notes":[["Notion d’effet de levier","L’endettement peut améliorer ou réduire la rentabilité des capitaux propres. Le levier dépend de l’écart entre la rentabilité économique et le coût de la dette ; il ne signifie pas qu’emprunter augmente toujours la rentabilité."],["Actif économique","L’actif économique regroupe les moyens nécessaires à l’exploitation : immobilisations corporelles et incorporelles d’exploitation, biens d’exploitation en crédit-bail et besoin de financement de l’exploitation. Le cours rappelle aussi la notion générale immobilisations + BFR."],["Rentabilité économique et ROI","Le support propose notamment EBE / actif économique brut (ou net), et résultat net après impôt / actif économique brut (ou net). Il retient pour l’étude du levier Re = résultat d’exploitation / actif économique."],["ROA : indicateur différent","ROA = résultat net / actif total. Il porte sur l’ensemble de l’actif, alors que Re selon le cours rapporte le résultat d’exploitation à l’actif économique."],["Rentabilité financière","Rcp = résultat net / capitaux propres. Elle mesure la rentabilité pour les apporteurs de capitaux propres et peut différer de Re sous l’influence de l’endettement."],["Formule de l’effet de levier (support)","Rcp = Re + (Re − i) × (D / CP) × (1 − t). D : dettes totales ; CP : capitaux propres ; i : taux d’intérêt moyen avant IS ; t : taux d’impôt. Le support précise que Re et Rcp sont des taux après IS : vérifier les conventions de calcul dans les exercices, car elles doivent être cohérentes."],["Effet positif, neutre ou négatif","Lorsque Re est supérieur à i, l’écart (Re − i) est positif et le levier peut améliorer Rcp selon la relation présentée. Si Re = i, le terme de levier est nul ; si Re < i, il est négatif."],["Interpréter sans automatisme","Un levier positif s’accompagne d’un risque accru de remboursement si l’endettement augmente. Examiner aussi la CAF, la capacité de remboursement et la stabilité des résultats."]]}];
const CP1252 = { 0x20ac:128,0x201a:130,0x0192:131,0x201e:132,0x2026:133,
0x2020:134,0x2021:135,0x02c6:136,0x2030:137,0x0160:138,0x2039:139,
0x0152:140,0x017d:142,0x2018:145,0x2019:146,0x201c:147,0x201d:148,
0x2022:149,0x2013:150,0x2014:151,0x02dc:152,0x2122:153,0x0161:154,
0x203a:155,0x0153:156,0x017e:158,0x0178:159 };
function bytes(s) {
  const out=[];
  for(const c of s) { const n=c.codePointAt(0);
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
function pdf(index){
 const unit=UNITS[index],W=595,H=842,left=52,bottom=58;
 const pages=[];let cmds=[],y=H-128;
 function push(){if(cmds.length){pages.push(cmds.join("\n"));cmds=[];}}
 function newPage(){
   push();y=H-128;
   cmds.push("0.075 0.18 0.29 rg 0 768 595 74 re f");
   cmds.push('BT /B 20 Tf 1 1 1 rg 52 799 Td (StudyBFA) Tj ET');
   cmds.push('BT /R 9 Tf 0.83 0.90 0.95 rg 52 783 Td (FICHE DE REVISION - ANALYSE FINANCIERE) Tj ET');
   cmds.push('0.80 0.87 0.91 RG 52 54 m 543 54 l S');
 }
 function line(text,size=11,bold=false,color="0.10 0.20 0.30",leading=16){
  if(y<bottom+leading)newPage();
  cmds.push("BT /"+(bold?"B":"R")+" "+size+" Tf "+color+" rg 52 "+y+" Td ("+esc(text)+") Tj ET");
  y-=leading;
 }
 newPage();
 line("CHAPITRE 3 - LA METHODE DES RATIOS",10,true,"0.20 0.39 0.53",25);
 for(const t of chunks("Partie "+(index+1)+" - "+unit.title,45))line(t,17,true,"0.075 0.18 0.29",24);
 y-=13;
 for(const [heading,body] of unit.notes){
  const lines=chunks(body,88);
  if(y < bottom+35+lines.length*16)newPage();
  line(heading,13,true,"0.08 0.29 0.44",21);
  for(const t of lines)line(t,11,false,"0.14 0.20 0.29",16);
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
