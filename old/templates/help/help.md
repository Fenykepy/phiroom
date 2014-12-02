## Premiers pas
### Tout ce que vous devez savoir sur Phiroom
#### À propos de Phiroom
Phiroom est un logiciel de gestion de photos en ligne destiné aux photographes.


#### Le glossaire de Phiroom

Phiroom est livré avec un peu de vocabulaire qu'il est bon de préciser dès maintenant afin d'éviter d'éventuelles confusions : 

- **Dossiers** :
    - Dans la bibliothèque un dossier représente un répertoire physique présent sur le disque dur du serveur. Les images listées lorsque l'on clique sur le lien vers un dossier sont celles présentes physiquement dans ce repertoire ainsi que ses sous répertoires ;
    - Il est possible de créer de nouveaux dossiers, de les renommer et de les déplacer ;
    - La hiérarchie de dossiers est stockée en base de donnée. Afin de ne pas créer de conflits entre la base de donnée et la hiérarchie physique sur le disque il est conseillé de manipuler les dossiers via l'interface de phiroom. Il est néanmoins possible d'ajouter un nouveau dossier avec du contenu par ftp ou n'importe quel autre moyen et de l'ajouter ensuite dans la base avec la commande `importer un dossier (existant))`. Le dossier et ses sous-dossiers, ainsi que les images qu'ils contiennent si elles sont au bon format seront alors ajoutés à la bibliothèque ;
    - Supprimer une image d'un dossier revient à la supprimer complètement de la bibliothèque et du disque sur le serveur ;
    - Il n'est pas possible de classer les images d'un dossier avec un ordre personnalisé ;
    - Il n'est possible de supprimer un dossier que s'il est vidé de toutes ses images au préalable ;
    - Les dossiers ne sont accessibles qu'aux administrateurs du site.

- **Collections** :
    - Dans la bibliothèque une collection est une sorte de dossier virtuel. Une collection existe en base de donnée, mais n'est pas présente sur physiquement le disque dur du serveur. C'est l'équivalent d'un « album » dans certains logiciels de catalogages d'images ;
    - Les images placées dans une collection restent dans leur dossier d'origine ;
    - Effacer une image d'une collection ne supprime pas l'image de la bibliothèque, mais l'enlève simplement de la collection ;
    - #Il est possible de classer les images d'une collection avec un ordre personnalisé ;
    - #Il est possible de donner l'accès à une collection particulière à certains utilisateurs inscrits. Dans ce cas l'utilisateur aura accès à toutes les images de la collection (mais sans pouvoir les modifier) ;

- **Ensembles de collections** :
    - Les ensembles de collections sont des containers pour collections pour permettre d'organiser les collections ;
    - Un container de collection ne peut contenir d'images ;
    - #Il est possible de donner l'accès à un ensemble de collections particulier à certains utilisateurs inscrits. Dans ce cas l'utilisateur aura accès à toutes les images des collections contenues dans cet ensemble (mais sans pouvoir les modifier) ;
    - Il est possible (est souhaitable) de créer une hiérarchie d'ensemble de collections ;
    - Il n'est possible de supprimer un ensemble de collections que s'il est vidé de toutes collection au préalable.

- **Articles** :
    - Un article est tout simplement un post de blog ;
    - Le contenu des articles s'écrit en langage markup ;
    - Il est possible de définir une partie de l'article comme étant son résumé, le marqueur « [...] » délimite alors la fin du résumé ;
    - Le marqueur sera supprimé de l'article et du résumé, remplacé par « … » dans ce dernier.
    - Les articles peuvent contenir des images placées dans le texte (flottantes à droite, à gauche ou centrées), mais ne peuvent pas contenir de galeries (groupe de photos présentées dans une « lightbox » ).
    - Les articles sont classés par date de publication dans la vue par défaut (le plus récent en haut), mais il est aussi possible d'y accèder par catégories, par mot-clés, ou de les filtrer suivant une date particulière.

- **Galeries** :
    - Une galerie est similaire en tous points à un article à ceci près qu'elle contient un groupe de photos présentées dans une lightbox ;
    - Le résumé d'une galerie est toujours composé des six premières images du groupe de photos, précédées du résumé défini dans le corps l'article lui-même.

- **Image du jour** :
    - Une image du jour est une galerie ne contenant qu'une seule image que l'on souhaite mettre en avant, liée à un jour particulier ;
    - Il est possible de naviguer parmi les images du jour de jours en jours via un menu de navigation spécial ;
    - Une image ne peut être image du jour que pour une seule date.

- **Portfolios** :
    - Par ce que le classement par date de publication n'est certainement pas le moyen le plus adapté de montrer une sélections des meilleures images à son public le module portfolio a été mise en place ;
    - Il s'agit encore une fois d'une galerie, dont le design peut néanmoins être différent, publiée sur une page à part ;
    - Il est possible de créer autant de portfolios que souhaité. Deux approches différentes peuvent être :
        - Créer un seul portofolio contenant uniquement ses meilleures images ;
        - Créer un nombre limité  de portfolios classés par sujets ou n'importe quel autre critères ;
    - Les portfolios bénéficient d'une mise en page différente des galeries.

### Tutoriel

### Question fréquentes

## Le module bibliothèque
### Importer des images
#### Importer des images depuis un dossier présent sur le serveur
#### Uploader et Importer des images depuis votre ordinateur (via http)

### Gestion des dossiers
#### Créer un nouveau dossier
#### Renommer un dossier
#### Déplacer un dossier
#### Supprimer un dossier
#### Déplacer une image vers un dossier

### Gestion des ensembles de collections
#### Créer un nouvel ensemble de collections
#### Renommer un ensemble de collections
#### Supprimer un ensemble de collections


### Gestion des collections
### Gestion des articles
### Gestion des galeries
### Gestion des images du jour
### Gestion des portfolios

### Gestion des métadonnées
#### Noter les images
#### Appliquer des libellés de couleur
#### Modifier le titre d'une image
#### Modifier la légende d'une image


## Le module weblog
### Lister les articles et galeries
#### Liste par ordre chronologique inversé
#### Liste par catégories
#### Liste par mot-clé
#### Liste par date

### Gestion des articles et des galeries
#### Ajouter un article
#### Ajouter une galerie
#### Modifier un article ou une galerie
#### Supprimer un article ou une galerie

### Gestion des catégories
#### Ajouter une catégorie
#### Renommer une catégorie

non implémenté

#### Supprimer une catégorie

non implémenté

### Gestion des mots-clés
#### Ajouter des mots-clés
#### Renommer un mot-clé

non implémenté

#### Supprimer un mot-clé

non implémenté


## Le module image du jour
### Gestion des images du jour
#### Ajout d'une image du jour
#### Modification d'une image du jour
#### Suppression d'une image du jour
#### Ajout automatique d'image du jour

non implémenté



## Le module portfolio
### Gestion des portfolios
#### Ajout d'un portfolio
#### Modification d'un portfolio
#### Suppression d'un portfolio


