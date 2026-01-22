# Exercice 1 - Suivre ses fichiers, les soumettre…

Pour ce premier exercice, nous supposons que la personne travaille **seule**.

:::info Préalable
Nous supposons nous trouver dans un répertoire dans lequel la seule commande `git` ayant été exécutée est : 

```bash
git init
```
:::

Ajoutez dans ce répertoire un programme, dans le langage de votre choix, affichant _Hello word_ dans la console. 

La commande `git status` montre l'état du répertoire courant. Dans notre
cas, `git` devrait nous dire que le répertoire en question contient des
fichiers... et qu'ils ne sont pas suivis (*tracked*). `git` s'attend à
ce qu'on lui dise précisément quels fichiers il doit enregistrer.

```bash 
Sur la branche main

    Aucun commit

    Fichiers non suivis:
      (utilisez "git add <fichier>..." pour inclure dans ce qui sera validé)
        Hello.java

    aucune modification ajoutée à la validation mais des fichiers 
    non suivis sont présents (utilisez "git add" pour les suivre)
```

:::warning
Si `git init` crée une branche principale nommée _master_ et pas _main_, c'est bien de la renommer. Cette commande devrait suffire : 
```bash
git branch -m master main
```
:::

La commande `git add` permet d'ajouter des fichiers à la liste des fichiers que l'on suit.

:::note Exercice
Ajoutez les fichiers à suivre. (Dans mon cas, il s'agit du fichier `Hello.java` contenant mon _Hello world_)

```bash 
git add Hello.java
```
:::

Constatez la différence lorsque vous entrez la commande `git status`. 

À ce stade, nous avons déclaré notre intention de suivre ce fichier. Il reste maintenant à sauvegarder cette première version de notre projet. C'est-à-dire faire un *commit*.

:::warning Remarque
Il est possible d'écrire un nom de fichier comme argument de la commande `add` mais également un nom de répertoire. 

Par exemple `git add .` ajoute le répertoire courant. 
:::

## *commit*

```
git commit
Commite les changements en ouvrant l'éditeur par défaut.

    -m <message>  
    Commite directement les changements en utilisant 
    le message passé en paramètre comme message de commit. 
```

Lorsque l'on fait un *commit*, c'est une bonne pratique d'y associer une
description : un commentaire précisant l'objet de ce *commit*. 
Dans certains cas, cette description peut se composer d'une **description
courte** et d'une **description longue**.

-   la commande `git commit -m "description courte"` permet de faire la
    sauvegarde avec cette description ;
-   la commande `git commit` seule, lancera l'éditeur de texte configuré 
    par la variable d'environnement `EDITOR` et il sera alors possible
    d'écrire une description courte suivie d'une description longue (les
    deux étant séparées d'une ligne).

La description courte ne **dépassera pas les 50 caractères** et il existe quelques règles de bonnes pratiques. Voici **7** règles pour de bons messages de commits : 

1.  Sépare le sujet du corps avec une ligne blanche.
2.  Limite le sujet à 50 caractères.
3.  Capitalise la ligne du sujet.
4.  Ne termine pas la ligne du sujet avec un point.
5.  Utilise l'impératif dans la ligne du sujet.
6.  Coupe les lignes de la description longue à 72 caractères.
7.  Utilise la description longue pour expliquer « quoi » et « pourquoi » mais pas « comment ».

[Lire la version longue, en anglais](https://chris.beams.io/posts/git-commit)

Un *commit* est un enregistrement de l'état de votre répertoire de travail à un moment donné. Dans un *commit*, se trouvent les informations suivantes :

-   l'état du répertoire de travail ;
-   l'auteur du *commit* ;
-   le nom du *commit* qui précède (*commit* parent)

Comment `git` sait-il, au moment de créer un nouveau *commit*, quel est le *commit* qui précède ? Grâce à la notion de « *commit* courant », au moment de créer un nouveau *commit*, `git`, entre autres choses, désigne le *commit* courant comme étant le parent du nouveau *commit* et le nouveau *commit* devient le *commit* courant.

:::note Exercice - Faire son premier commit
Entrez la commande suivante
```bash 
git commit -m "Create yet another hello world"
```
:::

Constatez les changements dans le répertoire courant _via_ `git status`.

## Ignorer des fichiers

Il arrive d'avoir des fichiers que l'on ne veut pas suivre avec `git`.
Il s'agit généralement des fichiers « qui peuvent être générés ». Dans le cas d'un projet Java avec Maven, c'est typiquement le cas du répertoire `target`.

Pour qu'un répertoire ou des fichiers ne soient pas suivis, il suffit d'ajouter leurs noms dans un fichier `.gitignore`.

:::note  Exercice - Ajouter un fichier .gitignore
Ignorez tous les fichiers `.class` (le _bytecode_) du répertoire. 

- Ajoutez un fichier `.gitignore` contenant `*.class`
- Ajoutez le fichier `.gitignore` aux fichiers suivis
- Faites un *commit* portant un nom représentatif
:::

:::tip 
Pour ignorer **tous** les fichiers `.class` c'est-à-dire ceux du répertoire courant et de tous les sous répertoires, écrivez ce qui suit dans votre fichier `.gitignore`.
```conf
**/*.class
```
:::

Pour vous aider à générer le fichier `.gitignore` *qui va bien* dans des cas plus complexes, vous pouvez consulter et utiliser le site [gitignore.io](http://gitignore.io). Il suffira de préciser les technologies utilisées et le site proposera un fichier `.gitignore` consistant qu'il suffira de copier.

## Consulter l'historique

La commande `log` de git permet de voir l'historique des *commits*. 
Chaque *commit* est présenté chronologiquement, du dernier au premier, avec son identifiant, son auteur, sa date de création et son message. 

Par exemple un *commit* pourrait être :

```bash
commit f3893355ae31c94f940684d148fe621e8310952b
Author: Pierre Bettens (pbt) <pbettens@he2b.be>
Date:   Mon Sep 13 15:04:04 2021 +0200

    yet another first commit  
```

```bash
git log

    -n nombre
        Affiche les 'nombre' dernier commits.
    --oneline
        Historique sur une ligne avec un identifiant court.
    --all 
        Liste toutes les références.
    --graph 
        Représente graphiquement l'historique des commits 
        et des branches.
    --name-status
        Affiche pour chaque commit la liste des fichiers 
        et leur état
        Quelques états sont (en anglais) : Added (A), 
        Copied (C), Deleted (D), Modified (M), 
        Renamed (R), have their type (i.e. regular file, 
        symlink, submodule…) changed (T), 
        are Unmerged (U)
    (…)
```

:::note Exercice - Observer l'historique des commits
Comptez le nombre de *commits* de votre dépôt. Dans quelle période de temps (date et heure) les *commits* ont-ils été créés ?

Comparez les identifiants complets aux identifiants courts.
:::

L'option `–name-status` affiche, pour chaque *commit* la liste des fichiers et leur statut. Par exemple, si pour un *commit* on a :

```bash
9f35c98 Une petite description
    A logo.png 
    D logo.jpg 
    M code.c 
    R100 avant.txt apres.txt 
```
Ceci veut dire :

1.  le fichier `logo.png` a été ajouté ;
2.  le fichier `logo.jpg` a été supprimé ;
3.  le code C se trouvant dans le fichier `code.c` a été modifié ;
4.  le fichier `avant.txt` a été renommé en `apres.txt`. Les deux     fichiers sont 100% identiques. Ils n'ont pas subi de modification. (git détecte parfois un renommage alors que vous avez simplement supprimé un fichier et créé un autre identique ou très similaire. Cela n'a aucune importance pour git.)

## Comparaison de *commits*

La commande `diff` de `git` permet de vérifier quelles modifications ont été apportées aux fichiers.

```bash
git diff <id1> <id2>
    Compare le commit id1 avec le commit id2
    id1 et id2 sont les premiers caractères identifiants un commit
```

:::note Exercice - Utilisation de diff

- Créez un fichier `README.md` contenant un titre et le mot *blue*. Faire un `git add` et un *commit*.
- Modifiez le fichier `README.md` en remplaçant le mot *blue* par *yellow*. Faire un `git add` et un *commit*.
- Modifiez une fois encore le fichier `README.md` en remplaçant le mot *yellow* par *red*. Ne pas faire de *commit*.
:::

Un `git status` donnera ceci 

```bash
Sur la branche master
Modifications qui ne seront pas validées :
  (utilisez "git add <fichier>..." pour mettre à jour 
  ce qui sera validé)
  (utilisez "git restore <fichier>..." pour annuler 
  les modifications 
  dans le répertoire de travail)
    modifié :         README.md
aucune modification n'a été ajoutée à la validation 
(utilisez "git add" ou "git commit -a")
```

tandis que `git log --name-status --oneline` aura cette allure

![Résultat d'une commande git log](/img/git-log.png)

:::note Exercice 
- Comparez le contenu du fichier `README.md` entre les derniers *commits* (à l'aide d'un `git diff…`).  
- Notez la différence entre les deux commandes : `git diff id1 id2` et `git diff id2 id1`.
:::

Le dernier *commit*, en plus de son identifiant, a comme nom symbolique `HEAD`. Les *commits* précédents peuvent être identifiés par : `HEAD~1`, `HEAD~2`, `HEAD~3`, etc.

La modification « *red* » du fichier `README.md` n'est pas **validée** (*not staged* en anglais) et le `git status` nous informe à ce sujet. 

Nous avons parlé du *répertoire de travail* et des modifications qui ont été soumises (*commitées*) (celles qui se trouvent effectivement dans le dépôt). En fait, il existe **3 zones** dans un dépôt `git`.

:::warning Zone de travail - zone de transit - dépôt 

Il existe trois zones dans un dépôt git :

-   la **zone de travail** (*working directory*) est celle du disque
    dur, du répertoire de travail, celle dans laquelle nous effectuons
    les modifications;

-   la **zone de transit** (*staging area* ou encore *index*) est une
    zone entre la zone de travail et le dépôt dans laquelle on
    « charge » les changements de la zone de travail qui seront envoyés
    au prochain *commit*.

    Cette zone permet de construire ses *commits* indépendamment des
    modifications effectuées. Par exemple, lors de l'ajout d'une
    nouvelle fonctionnalité, il est possible de faire toutes les
    modifications de code jusqu'à ce que la tâche soit effectuée et
    commiter ensuite les changements par petits groupes d'ajouts plus
    simples à comprendre par la suite.

-   le **dépôt** (*git directory* ou *repository*) proprement dit
    contenant tous les *commits*.

Attention, nous parlons ici de *dépôt local*. Nous parlerons plus tard
de synchronisation avec un autre dépôt, un *dépôt distant* (_remote_).
:::

:::note Exercice - Modification de dépôt
Les dernières modifications du fichier `README.md` (les modifications « *red* ») ne sont pas validées. C'est normal.

- Ajoutez les changements à la zone de transit (_staging_) avec `git add README.md` et observez l'état de votre dépôt avec `git status`.
:::

Les modifications sont maintenant validées et prêtes à être soumises. Elles sont passées de la zone de travail (*working directory*) à la zone de transit (*staging area*).

![État du dépôt lors de l'ajout d'un fichier à la zone de transit](/img/depot-git-add.png)  
_Image : État du dépôt lors de l'ajout d'un fichier à la zone de transit._

## Comparaison de *commits* et de zones

Nous avons déjà vu comment comparer des *commits* entre eux. Voyons comment comparer la zone de travail, la zone de transit et des *commits*. 

![Différentes commandes de comparaisons](/img/depot-git-diff.png)  
_Image : Différentes commandes de comparaisons._

```bash
git diff
    Compare la zone de transit avec la zone de travail
git diff --staged
    Compare le dernier commit avec la zone de transit
git diff <id>
    Compare le commit id avec la zone de travail
git diff --staged <id>
    Compare le commit id avec la zone de transit
git diff <id1> <id2>
    Compare le commit id1 avec le commit id2
```

Normalement votre fichier `README.md` est en zone de transit (*staged*), il a été ajouté.


:::note Exercice - Comparaison zones
- Comparez la zone de transit avec le dernier *commit* avec  
`git diff --staged`.
:::

Git vous montre que « *yellow* » déjà soumis (*commité*) est (sera ?) remplacé par « *red* ».

:::note Exercice - Comparaison zones (suite)
- Modifiez (une dernière fois) le fichier `README.md` en remplaçant « *red* » par « *green* » et comparez la zone de travail et la zone de transit avec `git diff`.
- Comparez la zone de travail avec le dernier *commit* (qui s'appelle HEAD) avec  
`git diff HEAD`.
:::

