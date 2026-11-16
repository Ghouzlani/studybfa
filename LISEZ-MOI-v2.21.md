# Study BFA v2.21 — Corrections de relecture

Base : v2.20. Uniquement des corrections ; aucune refonte.

## Contenu
- Fiscalité ch. 5 : quiz 14 (question et réponse incohérentes avec la note : 160 000 DH et non 157 000 DH) ; cadeaux publicitaires « 100 DH au plus » (art. 10-I-B-1° du CGI : valeur unitaire maximale de 100 DH) et identification « raison sociale, nom, sigle ou marque ».
- Fiscalité ch. 4 : remarque de relecture (« 6 533,33 DH ») retirée du texte public ; question en double remplacée.
- IA ch. 2 : explication du quiz 1 qui citait « le troisième prompt » (faux depuis le mélange des réponses) ; numérotation des notes complétée (1, 3, 7).
- Comptabilité de gestion : formule du coût d'achat alignée sur la note détaillée ; quiz 3 du chapitre 2 (deux réponses possibles) corrigé ; « Cuisine interne » → « Comptabilité interne ».
- Entrepreneuriat ch. 2 : quiz 7 en double de quiz 6, remplacé.
- TEC ch. 2 : quiz 4 en double de quiz 6, remplacé.
- ERP ch. 7 : carte mentale « B. Activités » contredisait la note (la répétition n'est pas obligatoire) ; titre « B. » ajouté.
- Répartition des réponses des quiz rééquilibrée (la v2.20 laissait par ex. 7 bonnes réponses sur 11 en position A en ERP ch. 6).

## Pages
- ERP : « Six chapitres » → « Sept chapitres » (BPMN).
- IA et TEC : titres des boutons de chapitre alignés sur les titres affichés après clic.
- Comptabilité de gestion : « Gestion » → « gestion » ; TEC : titre de page aligné.
- Accueil : theme.js sans `defer` (évite le flash en mode clair pour les utilisateurs en mode sombre).
- Business English : « Review incorrect answers » repartait avec les mauvaises réponses déjà cochées.

## Régénération
Fiches web et 26 PDF régénérés avec tools/build_fiches.py. Paramètres de cache des scripts passés à v=220.
