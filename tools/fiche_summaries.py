"""Academic revision-sheet blocks for the Study BFA published chapters.
The site and PDF share these exact blocks; each is distilled from the chapter's existing lesson notes.
This is not a separate claim of independent professor-source verification.
"""
def T(title,text):return dict(type='text',title=title,text=text)
def G(title,*items):return dict(type='cards',title=title,items=[list(x) for x in items])
def V(title,*parts):return dict(type='flow',title=title,parts=list(parts))
def F(title,formula,text='',lead=''):return dict(type='formula',title=title,formula=formula,lead=lead,text=text)
def E(title,*rows):return dict(type='example',title=title,rows=list(rows))
def I(title,*items):return dict(type='list',title=title,items=list(items),numbered=False)
def TIP(title,text):return dict(type='tip',title=title,text=text)
def R(text):return dict(type='ref',title='Référence',text=text)

def blocks(slug,idx,c):
 n=c['notes']
 def N(i):
  title,body=n[i-1];title=__import__('re').sub(r'^\d+\.\s*','',title)
  return T(title,body)
 s=(slug,idx)
 if s==('systeme-information-erp',1):return [
  N(1),G('Trois sources de données',('Internes','Produites ou détenues dans l’entreprise.'),('Externes achetées','Obtenues auprès de fournisseurs de données.'),('Externes publiques','Accessibles auprès de sources publiques.')),
  G('Base de données : vocabulaire',('Entité / table','Ensemble d’éléments homogènes.'),('Individu / ligne','Enregistrement correspondant à un élément.'),('Propriété / colonne','Attribut décrivant cet élément.'),('Clé primaire','Identifiant unique d’un enregistrement.')),
  G('Cardinalités',('1:1','Un enregistrement lié à un seul autre.'),('1:N','La clé étrangère se place en général côté N.'),('N:N','Plusieurs enregistrements de chaque côté.')),
  V('Concevoir un système d’information','Analyser l’existant','Définir les besoins','Concevoir la solution'),
  G('Sécuriser et rendre disponible',('Backup','Copie de sauvegarde facilitant la restauration.'),('Mirroring','Duplication ou réplication pour la disponibilité.'))]
 if s==('systeme-information-erp',2):return [
  N(1),G('Trois sous-systèmes de l’entreprise',('Décision / pilotage','Fixe objectifs et orientations.'),('Information','Collecte, traite et circule entre les fonctions.'),('Opérationnel','Exécute les activités.')),
  V('Les quatre fonctions du SI','Collecter','Mémoriser','Traiter','Diffuser'),
  G('Quatre notions numériques à distinguer',('Numérisation','Papier → fichier numérique.'),('Informatisation','Outils informatiques pour gérer les activités.'),('Digitalisation','Transformation des processus par le numérique.'),('Automatisation','Exécution automatique de tâches.')),
  G('Applications et interfaces',('CRM / SIM','Relation client / information marketing.'),('SIRH','Gestion et suivi des ressources humaines.'),('Front office / back office','Contact avec le client / activités internes.'),('Frontend / backend','Interface visible / logique côté serveur.'))]
 if s==('systeme-information-erp',3):return [
  T('Définition de l’ERP','ERP (Enterprise Resource Planning), ou PGI (Progiciel de Gestion Intégré) : solution standardisée reliant plusieurs fonctions de gestion grâce à une information cohérente.'),
  G('Fonctions et effets',('Gestion intégrée','Achats, ventes, stocks, comptabilité, finance, production, RH.'),('Base commune','Moins de saisies redondantes, meilleure cohérence des données.'),('Limites','Coûts, formation, paramétrage et adaptation des processus.')),
  G('Solutions citées dans le cours',('Propriétaires','SAP, Microsoft Dynamics, Oracle E-Business Suite, PeopleSoft.'),('Odoo','Community : open source ; Enterprise : commerciale.')),
  G('Quatre libertés du logiciel libre selon la FSF',('Liberté 0','Utiliser le programme pour tout usage.'),('Liberté 1','Étudier et modifier le code.'),('Liberté 2','Redistribuer des copies.'),('Liberté 3','Distribuer des versions modifiées.')),
  TIP('À ne pas confondre','Libre ne signifie pas nécessairement gratuit. Les prestations de paramétrage, de formation, de maintenance ou de support peuvent être payantes.'),
  T('Évolutions des SI','Mobilité, réseaux 3G/4G/5G et Wi-Fi, objets connectés (IoT) et cloud computing.')]
 if s==('systeme-information-erp',4):return [
  N(1),G('Trois modèles de service cloud',('IaaS','Infrastructure : serveurs, stockage et réseau.'),('PaaS','Plateforme de développement et d’exécution.'),('SaaS','Logiciel en ligne géré par le fournisseur.')),
  G('Qui gère quoi ?',('Système interne','L’entreprise gère infrastructure et logiciels.'),('IaaS','Le fournisseur gère surtout l’infrastructure.'),('PaaS','Le fournisseur gère aussi la plateforme.'),('SaaS','Le fournisseur exploite le logiciel.')),
  G('Opportunités et risques',('Avantages','Accès distant, ressources à la demande, mobilité et coûts variables.'),('Vigilance','Contrôle des données, confidentialité, conservation et suppression.')),
  TIP('Réflexe professionnel','Avant de choisir un service, examiner qui héberge les données, les conditions d’accès et la politique de conservation. Les sauvegardes ne dispensent pas de vérifications.')]
 if s==('systeme-information-erp',5):return [
  T('Processus métier','Enchaînement d’activités avec acteurs, début, fin, entrées et sorties mesurables. Il vise un résultat et une valeur ajoutée, de façon reproductible.'),
  G('Trois niveaux de détail',('Haut niveau','Grandes activités de l’entreprise.'),('Intermédiaire','Étapes principales du processus.'),('Élémentaire','Tâches les plus simples.')),
  V('Exemple de processus','Réception de la demande','Vérification','Validation','Résultat / suivi'),
  G('Workflow et pilotage',('Workflow','Automatisation totale ou partielle d’un processus selon des règles.'),('Traçabilité','Identifier actions, acteurs et dates.'),('Workflow Management','Piloter et suivre les circuits de travail.'),('BPM','Analyser, gérer et améliorer les processus métier.')),
  G('Apports de la digitalisation',('Données','Circulation, disponibilité et stockage.'),('Pilotage','Suivi des délais, transparence et indicateurs.'),('Risque humain','Accompagner la résistance au changement.')),
  TIP('Méthode','Avant d’automatiser un workflow, décrire ses étapes, décisions, responsabilités et informations circulantes.')]
 if s==('systeme-information-erp',6):return [
  G('Pourquoi utiliser un workflow ?',('Efficience','Moins de pertes et d’étapes inutiles ; meilleure coordination.'),('Fiabilité','Traçabilité, responsabilités définies, erreurs mieux maîtrisées.'),('Pilotage','Indicateurs, données utiles, suivi des clients internes et externes.')),
  T('Pareto (80/20)','Une petite part des causes peut expliquer une grande part des effets ; le rapport 80/20 est indicatif. Le workflow aide à cibler les activités prioritaires.'),
  T('LLM et agents IA dans le cours','Un LLM traite et génère du langage. Un agent IA peut employer un modèle et des outils pour exécuter une tâche. Exemples cités : n8n, Zapier, Dify, CrewAI et Lindy.'),
  G('Fonctionnalités utiles étudiées',('Modélisation','Représenter le processus, notamment avec BPMN.'),('Règles et intégrations','Enchaîner actions, données et applications.'),('Suivi','Échéances, alertes, indicateurs KPI.'),('Accès','Mobilité et cloud selon les besoins de l’organisation.')),
  TIP('À retenir','Le cloud et une notation BPMN sont des possibilités utiles étudiées ; ils ne sont pas obligatoires dans chaque logiciel de workflow.')]
 if s==('systeme-information-erp',7):return [
  T('BPMN','Business Process Model and Notation : notation graphique standardisée permettant de représenter un processus métier. Le cours cite aussi UML et Merise sans les développer.'),
  G('Trois types de modèles',('Processus','Activités et enchaînement interne.'),('Collaboration','Plusieurs participants et leurs échanges.'),('Chorégraphie','Interactions attendues entre participants.')),
  G('Acteurs et activités',('Piscine (pool)','Délimite un participant au processus.'),('Couloir (lane)','Rôle ou service au sein d’un participant.'),('Tâche','Activité élémentaire, nommée par un verbe d’action.'),('Sous-processus','Activité composée d’autres activités.')),
  G('Symboles des événements',('Début','Cercle à bord fin.'),('Intermédiaire','Double cercle.'),('Fin','Cercle à bord épais.')),
  V('Exemple simple','Début','Recevoir une demande','Valider la demande','Fin'),
  TIP('Flux à ne pas confondre','Flux de séquence : ordre des actions dans un même participant ; flux de message : communication entre participants.')]
 if s==('fiscalite',1):return [
  T('La TVA dans le cours','La taxe sur la valeur ajoutée (TVA) est un impôt indirect lié à des opérations imposables. L’entreprise facture la TVA sur ses ventes et peut déduire celle des achats admissibles.'),
  G('Deux taxes à distinguer',('TVA facturée','Collectée auprès des clients sur les ventes imposables.'),('TVA récupérable','TVA payée sur les achats et ouvrant légalement droit à déduction.')),
  G('Traitements des opérations',('Hors champ','L’opération n’entre pas dans le champ de la TVA.'),('Imposable','TVA facturée selon le régime applicable.'),('Exonérée sans droit','Pas de TVA facturée ni de déduction sur les achats concernés.'),('Exonérée avec droit','Pas de TVA facturée, droit à déduction possible.'),('En suspension','Traitement particulier sans facturation selon le régime légal.')),
  TIP('Ne pas confondre','« Hors champ » n’est pas synonyme de « exonérée » ; les exclusions de déduction sur certains achats s’examinent séparément (article 106 du CGI).')]
 if s==('fiscalite',2):return [
  G('Les trois notions-clés',('TVA facturée','Taxe portée sur une vente imposable.'),('TVA exigible','Taxe devenue payable selon la date prévue par le régime.'),('TVA déductible','TVA sur achats admise en déduction sous conditions.')),
  G('Régimes d’exigibilité étudiés',('Encaissements','Exigibilité au règlement reçu, même partiel (au prorata).'),('Débits','Régime optionnel : inscription de la créance, sous règles particulières.')),
  E('Exemple de règlement','Facture émise en mars ; 40 % encaissés en avril.', 'En régime des encaissements, TVA correspondante exigible en avril = 40 % de la TVA de la facture.'),
  G('Dates de paiement à distinguer',('Espèces','Moment de l’encaissement effectif.'),('Virement bancaire','Date du crédit effectif en compte.'),('Chèque certifié','Règle particulière donnée par le cours ; vérifier l’application.')),
  TIP('Droit à déduction','L’article 106 du CGI prévoit des exclusions et des limites : une TVA payée n’est donc pas nécessairement récupérable.')]
 if s==('fiscalite',3):return [
  F('Calcul de la TVA nette','TVA nette = TVA exigible − TVA déductible','Tenir compte, le cas échéant, des crédits antérieurs et des ajustements.'),
  G('Lecture du résultat',('Solde positif','TVA due à verser.'),('Solde négatif','Crédit de TVA, selon les règles de report.')),
  E('Application simple','TVA exigible : 18 000 DH ; TVA déductible : 14 500 DH.', 'TVA due = 18 000 − 14 500 = 3 500 DH.'),
  G('Conditions de règlement pour déduire',('Moyens étudiés','Virement, chèque non endossable, compensation et effet de commerce, selon les justificatifs.'),('Seuil quotidien du cours','5 000 DH par jour et par fournisseur.'),('Seuil mensuel du cours','50 000 DH par mois et par fournisseur.')),
  G('Rythme des déclarations : règle générale',('Mensuelle','CA taxable antérieur ≥ 1 000 000 DH.'),('Trimestrielle','CA taxable antérieur < 1 000 000 DH.')),
  TIP('Attention','Les seuils de 5 000 et 50 000 DH sont étudiés pour le droit à déduction lié aux règlements ; ils ne constituent pas des plafonds généraux de paiement. Cas particuliers possibles.')]
 if s==('fiscalite',4):return [
  T('Pourquoi le prorata ?','Une entreprise exerce des activités ouvrant droit à déduction et d’autres sans ce droit. Le prorata répartit la TVA sur les dépenses communes admissibles ; les dépenses exclusivement affectées et les exclusions suivent leurs règles.'),
  F('Prorata : formule pédagogique','PD = A ÷ (A + B) × 100','A et B doivent être calculés selon l’article 104, avec les montants fiscaux et, le cas échéant, les taxes théoriques prévus.'),
  E('Prorata et achat commun','A = 800 000 DH ; total = 1 000 000 DH : PD = 80 %.','TVA sur achat commun = 2 000 DH → TVA déductible = 2 000 × 80 % = 1 600 DH.'),
  G('Règles de déduction',('Dépense commune admise','TVA déductible = TVA sur facture × PD.'),('Dépense exclue','Une exclusion légale reste applicable, même avec un PD élevé.'),('Période','Le PD réel de l’année N sert en principe en N+1.')),
  E('Extraction du TTC','Achat de 360 000 DH TTC à 20 % : TVA = 360 000 × 20/120 = 60 000 DH.', 'Avec PD de 85 % : déduction = 51 000 DH ; reste non déductible = 9 000 DH.'),
  G('Régularisations étudiées',('Immobilisation meuble','Période de conservation du cours : 60 mois.'),('Immobilisation immeuble','Période de conservation du cours : dix ans.'),('Écart de prorata','Variation strictement supérieure à 5 points : régularisation selon le cas.')),
  TIP('Méthode d’examen','1. Vérifier la dépense et son droit à déduction. 2. Extraire la TVA du TTC. 3. Appliquer le PD si la dépense est commune. 4. Vérifier les éventuelles régularisations.')]
 if s==('fiscalite',5):return [
  T('Ce que taxe l’IS','L’impôt sur les sociétés (IS) porte sur le résultat fiscal. Le cours distingue les personnes imposables (article 2 du CGI) et la territorialité (article 5).'),
  F('Passage du résultat comptable au fiscal','RF = RC + réintégrations − déductions','RC = produits comptabilisés − charges comptabilisées. Les retraitements obéissent aux dispositions fiscales.'),
  G('Retraitements à comprendre',('Charge non déductible comptabilisée','Réintégration : augmente le RF.'),('Produit non imposable comptabilisé','Déduction extracomptable : diminue le RF.'),('Produit imposable non comptabilisé','Ajout au RF s’il est fiscalement exigible.')),
  E('Calcul complet','RC = 150 000 DH ; CND = 12 000 DH ; PNI = 5 000 DH ; PI non comptabilisé = 3 000 DH.', 'RF = 150 000 + 12 000 − 5 000 + 3 000 = 160 000 DH.'),
  G('Conditions générales des charges dans les notes',('Justification','Charge comptabilisée, justifiée et liée à l’exploitation.'),('Rattachement','Exercice concerné et charge supportée définitivement.'),('Modération','Montant non exagéré, selon les dispositions applicables.')),
  G('Cas à retenir',('Services / travaux','Service rendu ; travaux exécutés, sous conditions.'),('Cadeaux publicitaires (cours)','Livrés, marqués au nom/signe de l’entreprise, valeur unitaire < 100 DH TTC.')),
  TIP('Réflexe d’examen','Une charge déjà admise a réduit le RC : ne jamais la déduire une seconde fois lors du passage au RF.')]
 if s==('tec',1):return [
  G('Information et communication',('Information','Contenu : fait, donnée, connaissance.'),('Communication','Transmission et interprétation du message dans un contexte donné.')),
  T('Comprendre avant d’agir','Un message peut être exact mais trop vague pour être compris. Le destinataire interprète les mots selon son contexte ; la réception ne garantit pas la compréhension.'),
  V('Transformer une information en consigne','Identifier le problème','Préciser l’action','Nommer le responsable','Fixer le délai'),
  E('Exemple de consigne','Vague : « Faites le nécessaire lundi ».', 'Précis : « Vérifiez les 10 dossiers et envoyez la liste corrigée lundi avant 15 h ». '),
  TIP('Réflexe','Demander une reformulation ou une confirmation permet de vérifier le sens réellement compris.')]
 if s==('tec',2):return [
  G('Sept composantes du schéma étudié',('Émetteur + intention','Personne qui communique ; objectif recherché.'),('Message + canal/code','Contenu ; moyen et langue/signes employés.'),('Récepteur + interprétation','Personne qui reçoit et construit le sens.'),('Rétroaction','Retour qui aide à vérifier la compréhension.')),
  T('Le rôle du contexte','Le lieu, le moment, la situation et la relation entre les personnes influencent l’interprétation. Un même message peut être compris différemment.'),
  G('Modèles présentés en TEC',('Shannon–Weaver','Transmission et perturbations (« bruit »).'),('Approche interactionnelle','Questions et reformulations participent au sens.')),
  E('Différencier canal et code','Un responsable écrit un courriel en français.', 'Canal = courriel ; code = langue française.'),
  TIP('Attention','Le modèle de transmission est utile mais ne suffit pas à expliquer seul toute la communication humaine.')]
 if s==('tec',3):return [
  G('Les six fonctions de Jakobson',('Référentielle','Informer d’un fait : « Le serveur est indisponible ». '),('Expressive','Montrer un sentiment : « Je suis inquiet ». '),('Conative','Agir sur le destinataire : « Envoyez le dossier ». '),('Phatique','Maintenir le contact : « Vous m’entendez ? ». '),('Métalinguistique','Expliquer un code ou un mot : « KPI signifie… ». '),('Poétique','Mettre la forme en valeur, par exemple dans un slogan.')),
  G('Principaux obstacles étudiés',('Langage','Jargon, mots ambigus ou mal adaptés.'),('Canal et contexte','Moyen inadapté, perturbations ou timing.'),('Absence de retour','On ne vérifie pas ce qui a été compris.')),
  T('Enjeux de la communication','Informer, coordonner, convaincre et faciliter l’action. Adapter les mots au public sans changer les faits.'),
  TIP('Question utile','Dans une situation, repérer la fonction dominante du message et expliquer ce qui permet de la reconnaître.')]
 if s==('tec',4):return [
  G('Trois dimensions de la prise de parole',('Verbale','Vocabulaire, mots et structure des phrases.'),('Paraverbale','Voix : débit, pauses, volume, intonation.'),('Non verbale','Gestes, posture, regard et expressions.')),
  V('Présentation professionnelle','Parcours','Compétences','Expériences ou projets','Objectif'),
  T('Adapter son discours','À un interlocuteur non spécialiste, choisir des mots accessibles. Une présentation courte doit sélectionner les informations pertinentes plutôt que raconter tout le CV.'),
  G('Maîtriser son oral',('Rythme','Pauses et débit régulier pour laisser comprendre.'),('Préparation','Répéter à voix haute, chronométrer et structurer les transitions.')),
  TIP('Réflexe de préparation','Environ une minute de présentation : une idée par étape et seulement les éléments utiles au contexte professionnel.')]
 if s==('tec',5):return [
  G('Convaincre : trois leviers étudiés',('Ethos','Crédibilité et compétence perçue de l’orateur.'),('Logos','Raisonnement, données et preuves.'),('Pathos','Émotions et préoccupations du public.')),
  E('Identifier le logos','« Notre test a réduit les erreurs de saisie de 20 %. »', 'L’argument s’appuie principalement sur une preuve chiffrée.'),
  G('Expressions de réunion',('Faire un tour de table','Donner la parole successivement.'),('Remettre à plat','Réexaminer une question depuis le début.'),('Arrondir les angles','Apaiser les tensions.'),('Passer la main','Transmettre un dossier ou une responsabilité.'),('Mettre les bouchées doubles','Intensifier les efforts pour rattraper un retard.')),
  TIP('Réflexe','Pour convaincre en réunion : adapter les arguments au public et apporter des éléments vérifiables, sans promesses infondées.')]
 if s==('tec',6):return [
  G('Structure de l’exposé',('Introduction','Accroche, thème, problématique et plan.'),('Développement','Idées, explications, exemples et transitions.'),('Conclusion','Réponse à la problématique et synthèse.')),
  V('Pitch professionnel','Problème ou besoin','Solution','Valeur et preuve','Prochaine étape'),
  T('Thème et problématique','« Digitalisation des banques » est un thème. « Comment la digitalisation transforme-t-elle la relation client ? » est une problématique exploitable.'),
  T('Choisir et maîtriser le contenu','Pour un pitch d’une minute, conserver un message central et une preuve forte. Répéter avec chronomètre et ajuster le contenu, sans accélérer artificiellement.'),
  TIP('Réflexe','Un exposé explique un sujet ; un pitch doit rapidement faire comprendre l’intérêt d’une proposition.')]
 if s==('tec',7):return [
  G('Connecteurs logiques',('Addition','De plus, également.'),('Cause','Parce que, puisque.'),('Conséquence','Donc, en conséquence.'),('Opposition','Cependant, pourtant.'),('Ordre','D’abord, ensuite, enfin.')),
  G('Expliquer ou argumenter ?',('Expliquer','Rendre une idée, une méthode ou une procédure compréhensible.'),('Argumenter','Soutenir un point de vue à l’aide de raisons et de preuves.')),
  V('Construire un argument','Affirmer une position','Donner une raison','Apporter une preuve','Conclure'),
  E('Améliorer un argument faible','Faible : « Cet outil est meilleur. »', 'Plus solide : « Il réduit les relances, comme le montre le test pilote ». '),
  TIP('Reformulation','Exprimer une idée plus clairement ne signifie pas modifier les faits.')]
 if s==('tec',8):return [
  V('Répondre à une objection','Écouter','Reformuler la réserve','Répondre avec des faits','Proposer une suite'),
  G('Deux objections fréquentes',('Coût jugé élevé','Comparer le coût aux gains vérifiables.'),('Crainte du changement','Proposer test pilote, accompagnement ou formation.')),
  G('Maîtrise orale',('Voix','Débit régulier, pauses et transitions.'),('Crédibilité','Éviter les promesses non étayées.'),('Réunion','Clore avec décisions, responsables et échéances.')),
  E('Exemple de réponse','« Le budget est trop élevé. »', '« Quels postes vous préoccupent ? Comparons-les aux gains attendus. »'),
  TIP('À retenir','Ne pas neutraliser une objection avant de l’avoir correctement comprise : écouter et reformuler d’abord.')]
 if s==('intelligence-artificielle',1):return [
  T('Définition du cours','L’intelligence artificielle regroupe des techniques qui permettent à une machine d’effectuer certaines tâches associées au langage, à la perception, à la prédiction ou à l’apprentissage.'),
  G('Repères importants',('Test de Turing','Imitation conversationnelle dans un cadre donné ; pas une preuve générale d’intelligence.'),('ANI','Intelligence artificielle spécialisée.'),('AGI','Objectif de recherche d’une IA à capacités générales.')),
  G('Machine Learning et Deep Learning',('Machine Learning','Apprendre des régularités à partir de données.'),('Régression','Prédire un nombre : prix, montant.'),('Classification','Prédire une catégorie : fraude / non-fraude.'),('Deep Learning','Réseaux de neurones à plusieurs couches.')),
  G('Applications et risques',('Applications','Chatbots, voicebots, recommandations.'),('Risques','Deepfakes, désinformation, atteintes à la vie privée.'),('Impact économique','Transformation d’emplois et de tâches.')),
  TIP('Concevoir un projet','Partir d’un besoin réel et des données disponibles ; tester, évaluer et améliorer progressivement. Optimiste, pessimiste et réaliste sont des points de vue sur l’IA, pas des types de modèles.')]
 if s==('intelligence-artificielle',2):return [
  T('Qu’est-ce qu’un prompt ?','Une consigne adressée à un système d’IA générative : elle indique la tâche et oriente la réponse. Un LLM est un grand modèle de langage.'),
  G('Quatre composantes recommandées',('Instruction','Ce que l’IA doit accomplir.'),('Contexte','Pour qui et dans quelle situation.'),('Input data','Texte ou données fournis.'),('Output indication','Format, longueur et contraintes souhaités.')),
  E('Passer d’un prompt vague à un prompt utile','Vague : « Résume la TVA ».', 'Précis : « À partir de ce cours, résume les règles d’exigibilité en cinq points et donne un exemple ». '),
  G('Techniques mentionnées dans le cours',('Rôle','Préciser une fonction : « Agis comme un professeur ». '),('Format','Demander une liste, un tableau ou une synthèse.'),('Exemple','Montrer le type de réponse attendu.'),('Prompt chaining','Décomposer une tâche en demandes successives.')),
  TIP('Réflexe','La structure en quatre éléments est recommandée, non obligatoire. Après la réponse, vérifier les informations factuelles.')]
 if s==('comptabilite-gestion',1):return [
  T('Rôle de la comptabilité de gestion','Elle calcule et analyse les coûts pour planifier, contrôler et décider. Usage interne, généralement facultatif ; ses méthodes sont flexibles et ses informations confidentielles.'),
  G('Deux groupes à distinguer',('Méthodes de calcul des coûts','Coûts complets, variables, ABC, coût marginal, coût spécifique, etc.'),('Indicateur de performance','EVA : Economic Value Added, à distinguer des méthodes de coût.')),
  G('Trois catégories de charges',('Non incorporables','Charges de la comptabilité générale écartées des coûts.'),('Supplétives','Charges ajoutées en gestion sans charge comptable correspondante.'),('Calculées / ajustées','Usage, étalées, abonnées, selon les retraitements.')),
  F('Charges incorporables : formule simplifiée','CCG = CG − CNI + CS','Ajouter, le cas échéant, les différences d’incorporation : charges calculées ou ajustements.'),
  E('Exemple simple','CG = 100 000 DH ; CNI = 4 000 DH ; CS = 6 000 DH ; pas d’autre ajustement.', 'CCG = 100 000 − 4 000 + 6 000 = 102 000 DH.')]
 if s==('comptabilite-gestion',2):return [
  T('Définition d’un coût','Ensemble de charges associé à un objet déterminé : un produit, un service ou une activité.'),
  G('Trois critères de classification',('Champ d’application','Produit, service ou activité.'),('Contenu','Charges directes/indirectes et fixes/variables.'),('Moment','Coût préétabli (avant) ou constaté (après).')),
  V('Cycle d’une entreprise commerciale','Achat','Stockage','Distribution'),
  F('Coût d’achat','Prix net + frais directs + frais indirects imputés','Prix net = prix brut − RRR (rabais, remises et ristournes). Ne jamais compter deux fois le même transport.'),
  E('Exercice d’application','Prix brut HT = 20 000 DH ; remise 10 % ; transport direct = 1 000 DH ; approvisionnement imputé = 500 DH.', 'Coût d’achat = 18 000 + 1 000 + 500 = 19 500 DH.'),
  TIP('Méthode','Distinguer les frais directement attribuables à l’achat des frais d’approvisionnement répartis ; éviter le double comptage.')]
 if s==('entrepreneuriat-business-plan',1):return [
  T('Définition et objectif','L’entrepreneuriat consiste à chercher et exploiter une opportunité pour créer de la valeur dans l’incertitude. Shane et Venkataraman : découverte, évaluation et exploitation d’opportunités.'),
  G('Compétences et limites',('Compétences utiles','Créativité, initiative, adaptation et coordination des ressources.'),('Avantages possibles','Autonomie, réalisation d’un projet, innovation et emplois.'),('Contraintes','Risques financiers, concurrence, travail soutenu.')),
  G('Cinq formes d’innovation étudiées',('Produit','Produit nouveau ou qualité nouvelle.'),('Procédé','Nouvelle méthode de production.'),('Marché','Accès à un marché nouveau.'),('Approvisionnement','Nouvelle source de matières ou fournitures.'),('Organisation','Nouvelle organisation industrielle.')),
  G('Formes d’entrepreneuriat',('Nécessité / opportunité','Survie économique / occasion choisie.'),('Social / vert','Impact social / environnemental.'),('Technologique / féminin','Projet fondé sur la technologie / porté par des femmes.')),
  TIP('Réflexe','Un avantage possible n’est jamais un revenu garanti : l’incertitude et les risques restent présents.')]
 if s==('entrepreneuriat-business-plan',2):return [
  T('Business Plan','Dossier présentant le projet, son marché, son modèle économique, ses moyens, hypothèses financières, risques et faisabilité. Il ne garantit pas le succès.'),
  G('Deux fonctions du document',('Travail interne','Organiser objectifs, budget, suivi, décisions et coordination.'),('Communication externe','Présenter le projet aux banques, investisseurs ou partenaires.')),
  G('Trois typologies présentées',('Création','Lancement d’une nouvelle entreprise.'),('Gestion courante','Prévisions, coordination et suivi de l’activité.'),('Opérations exceptionnelles','Fusion-acquisition, transformation ou ouverture du capital.')),
  G('Deux outils à différencier',('Business Model','Comment l’entreprise crée de la valeur et des revenus.'),('Business Plan','Comment le projet est organisé, financé et développé.')),
  V('Préparer la diffusion','Présenter le projet','Vérifier les hypothèses','Vérifier les projections','Partager au destinataire'),
  TIP('Avant diffusion','Vérifier la cohérence et, si le contexte l’exige, faire valider en interne. Ce n’est pas une obligation générale à tout Business Plan.')]
 return [T(__import__('re').sub(r'^\d+\.\s*','',t),b) for t,b in n]
