# StudyBFA — Audit éditorial et navigation (18 novembre 2026)

## Navigation
Le menu déroulant remplace visuellement la grille volumineuse dans les sept pages multi-chapitres : Business English, Comptabilité de gestion, Entrepreneuriat, Fiscalité, Intelligence artificielle, Système d'information & ERP, TEC.
Les boutons de chapitre d'origine sont conservés dans le DOM pour les contrôleurs existants ; le sélecteur les active et reflète le chapitre sélectionné. Les pages à chapitre unique ne nécessitent pas de sélection.

## Audit des contenus disponibles dans le dépôt
| Matière | Chapitres | Fiches (sections) | Flashcards | Quiz |
| --- | ---: | ---: | ---: | ---: |
| SI & ERP | 10 | 99 | 123 | 107 |
| Fiscalité | 5 | 43 | 68 | 54 |
| TEC | 8 | 50 | 64 | 64 |
| Intelligence artificielle | 2 | 14 | 30 | 16 |
| Comptabilité de gestion | 2 | 14 | 24 | 16 |
| Entrepreneuriat et Business Plan | 2 | 12 | 24 | 16 |

Les trois autres matières (Analyse financière, Comptabilité approfondie et Marché financier) utilisent une autre structure de page. Business English dispose également d'un contrôleur propre.

## Modifications éditoriales effectuées
- SI & ERP : les fiches des chapitres 8, 9 et 10 ont été condensées, sans retirer les sujets abordés dans le support du professeur. Elles restent organisées en titres et paragraphes. Les cartes et quiz sont conservés.
- Fiscalité, chapitre 4 : les deux premières flashcards ont été reformulées pour distinguer dépenses communes, dépenses exclusivement affectées et droit à déduction ; la première question du quiz a été clarifiée.
- Les autres jeux de questions ont été inventoriés et contrôlés structurellement ; aucune réécriture massive sans comparaison aux cours sources n'a été entreprise.

## Travail pédagogique restant
Une validation exhaustive « ne rien oublier du cours du professeur » nécessite les supports pédagogiques correspondants pour chaque matière. Le code publié n'est pas une preuve suffisante que chaque formulation ou taux fiscal est fidèle à son support. Les passages de Fiscalité doivent en particulier être revérifiés avec le cours et les références fiscales applicables.
La génération PDF est lancée par GitHub Actions à partir des mêmes notes que les pages web, pour éviter les divergences entre fiches affichées et fichiers téléchargeables.

## Contrôles techniques
- Le sélecteur est accessible au clavier et fonctionne en thème clair/sombre.
- L'ancienne navigation reste disponible comme repli si le script ne charge pas.
- Les contrôleurs existants continuent de gérer les cartes, quiz, vidéos et cartes mentales.
- Une vérification de rendu réel sur mobile et ordinateur reste recommandée.
