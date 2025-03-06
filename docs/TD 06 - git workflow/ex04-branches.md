# Exercice 3 - Travailler avec les branches

## Les branches 

En développement, il est rare que l'on travaille de manière linéaire. Il est possible qu'un développeur travaille sur une nouvelle fonctionnalité pendant qu'une autre développeuse travaille sur une deuxième fonctionnalité, qu'un troisième fasse de la correction de bugs pendant que la dernière finalise la dernière *release*.

Afin d'éviter des conflits, `git` propose une approche non linéaire du dépôt : les **branches** 

![Source https://www.atlassian.com/fr/git/tutorials/comparing-workflows/gitflow-workflow](/img/git-branch.png)  
_Source https://www.atlassian.com/fr/git/tutorials/comparing-workflows/gitflow-workflow_

Avec les branches, il sera possible d'une part de travailler dans des directions différentes mais aussi, de réconcilier / fusionner des changements. Les branches pourront alors se rejoindre. Par exemple, on pourra créer une branche pour développer une fonctionnalité et, dès lors que celle-ci est fonctionnelle, la branche contenant cette fonctionnalité sera fusionnée (*merge*) dans l'autre.

Une manière de travailler (un *workflow*) est d'avoir (extrait du *workflow* ***gitflow***) :

-   la branche `main` pour stocker l'historique officiel des versions du projet ;
-   la branche `develop` sert de branche d'intégration pour toutes les fonctionnalités ;
-   une branche par fonctionnalité (*feature*) créée à partir de `develop`. Quand une fonctionnalité est terminée elle est fusionnée dans `develop` ;
-   lorsque l'on prépare une livraison (*release*), on crée une branche   spécifique pour la release à partir de `develop`. Lorsque la *release* est prête, cette branche est fusionnée (*merge*) dans `main` et un numéro de version est attribué. Pour terminer, un *merge* est fait de la *release* vers `develop` qui a probablement avancé pendant la finalisation de la *release*.
-   …

`git` stocke ses données comme une série d'« instantanés » (*snapshots*) du projet. Un *commit* est un pointeur vers un instantané auquel sont ajoutées d'autres informations comme l'auteur, le message de *commit* et un ou des pointeurs vers les *commits* parents.

:::tip 
Une **branche** dans `git` peut être vue comme un *pointeur léger et déplaçable* vers un *commit*.
:::

```bash
git branch 
    Liste les branches actuelles (la branche courante 
    est en vert et avec une astérisque).
    --list <pattern> 
        Si un schéma est donné, liste les branches qui 
        correspondent au schéma.
    <branchname> 
        Crée une nouvelle branche.
    -d <branchname>
        Supprime la branche.
    (…)
```

:::note Exercice -  Se familiariser (graphiquement) avec les branches

Allez sur le site [learngitbranching.js.org](https://learngitbranching.js.org/?NODEMO) et entrez les commandes suivantes afin de visualiser l'effet (notez la présence d'une étoile '`*`' pour la branche courante) :

-   `git branch develop`
-   `git checkout develop`
-   `git commit`
-   `git commit`
-   `git checkout -b feature_1`
-   `git commit`
-   `git checkout develop`
-   `git checkout -b feature_2`
-   `git commit`
-   `git commit`
-   `git checkout develop`
-   `git merge feature_1`
-   `git branch -d feature_1`
-   `git merge feature_2`
:::

À `git branch` s'ajoutent les commandes : 

-   `git switch` pour passer d'une branche à une autre ;
-   `git merge` pour fusionner une branche dans une autre (c'est la branche courante qui avance) ;

```bash
git switch
    <branch> 
        Passe à une branche spécifiée. L'arbre de travail (working tree) et 
        l'index (index) sont mis à jour pour correspondre à la branche. 
        Tous les nouveaux commits seront ajoutés au sommet de cette branche. 
    -c <newbranch> 
        Crée une nouvelle branche <newbranch> et bascule 
        sur celle-ci. 
    (…)
```

```bash
git merge  
    <commit>
        Incorpore le <commit> dans la branche courante.
        (Rejoue les différents commits à partir du moment ou 
        les branches ont divergés)
    (…)
```

:::note Exercice - Création d'une branche
Dans votre projet, créez une branche `develop` et basculez sur celle-ci.

- Entrez cette commande
    ```bash
    git branch develop 
    git switch develop
    ```

    ou, plus rapide

    ```bash
    git switch -c develop
    ```
:::

Constatez la présence de la nouvelle branches avec `git branch`.

Cette nouvelle branche `develop` est une branche qui est actuellement locale. Elle ne se trouve pas sur le dépôt distant (ni ailleurs). Il existe d'ailleurs d'autres branches que les branches `main` et `develop`. En demandant gentiment --- avec l'option '`-a`' --- `git` nous donnera toutes les branches et l'on verra apparaitre les branches distantes (*remotes*).

:::note  Exercice - Les branches distantes
- Listez toutes les branches, même les distantes.

    ```bash
    git remote update git branch -a
    ```
:::

:::note Exercice - Pousser une branche
- Poussez la branche `develop` sur le dépôt.(Version option longue ou version option courte).

    ```bash
    git push --set-upstream origin develop 
    git push -u origin develop
    ```
:::

Constatez l'apparition d'une branche distante supplémentaire.

Un dépôt peut être modifié de plusieurs « endroits » différents sans que cela ne pose de problème… si l'on s'y prend bien en surveillant un peu l'état du dépôt.

Imaginons que le dépôt distant soit modifié. Comment s'en rendre compte ? Modifions la branche `develop` à partir de *gitesi* et voyons ce qu'il se passe localement.

:::note Exercice - Modification d'un dépôt distant et impacts locaux

- Modifiez la branche `develop` à partir de *gitesi* en modifiant le fichier `Hello.java` par exemple.
- Faites un `git remote update` pour mettre à jour sans faire de *pull*.
- Observez la différence entre ces deux *git log* :

    ```bash
    git log 
    git log --all
    ```
- Faites un `git pull`... et tout devrait bien se passer.
:::


:::info Rappel
Rappel `git log` a de belles options comme `oneline` et `graph`
:::

:::tip Astuce 
`git` permet de définir des *alias* pour éviter d'entrer de longues commandes.

Par exemple,  
`git config alias.lol ’log –graph –decorate –pretty=oneline –abbrev-commit –all’`  
permet d'entrer la commande `git lol` pour avoir un « bel » historique.
:::

Le `git remote update` met simplement à jour les différents *remotes* sans rien faire d'autre. Faire un `git pull` « comme à l'habitude » ne montrerait rien dans ce cas… puisque tout se passe bien.

:::info
`git pull` fait un `git fetch` pour aller chercher les modifications dans le dépôt suivi d'un `git merge` de la branche distante dans la branche locale.
:::

Nous avons déjà rencontré un conflit lors d'un *pull*. Nous allons maintenant nous mettre dans une situation de conflit entre deux branches distinctes.

## Résoudre un conflit

:::note Exercice - Résoudre un conflit 
Nous allons modifier le même fichier de deux endroits différents **et** dans deux branches différentes. Nous verrons comment résoudre (simplement) ce conflit.

- Modifiez `Main.java` sur la branche `origin/develop` du dépôt distant (sur *gitesi*) en changeant l'auteur de la classe par exemple et faire le *commit* en cliquant sur le bouton idoine.

- En local, créez une branche `release_license` issue de la branche `develop` et faites un _switch_ sur la branche.

    ```bash
    git switch develop 
    git switch -c release_license
    ```

- Modifiez localement la classe `Main.java` en modifiant, à nouveau, l'auteur et en ajoutant un commentaire. Par exemple, cette licence :

    ```
    Copyright <YEAR> <COPYRIGHT HOLDER>

    Permission is hereby granted, free of charge, to any person 
    obtaining a copy of this software and associated documentation 
    files (the "Software"), to deal in the Software without 
    restriction, including without limitation the rights to
    use, copy, modify, merge, publish, distribute, sublicense, 
    and/or sell copies of the Software, and to permit persons 
    to whom the Software is furnished to do so, subject to the 
    following conditions:

    The above copyright notice and this permission notice 
    shall be included in all copies or substantial portions 
    of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF 
    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
    PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
    COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
    ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR 
    THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    ```

- Validez le changement.

    ```bash
    git add src git commit -m "Add license"
    ```
:::

*À ce stade, tout diverge : release_license, develop et origin/develop*

:::note Exercice - Résoudre un conflit (suite)
- Faites un *switch* sur `develop` et un *pull* pour synchroniser `develop` et `origin/develop`.
- Consultez le fichier `Main.java` plusieurs fois en faisant alternativement des *switch* sur `develop` et `release_license`.
- En étant sur `develop`, tentez une fusion de la branche `release_license`.

    ```bash
    git merge release_license
    ```
:::

… la fusion échoue lamentablement :

```
Fusion automatique de 
src/main/java/pbt/yetanotherhelloworld/Main.java
CONFLIT (contenu) : Conflit de fusion dans 
src/main/java/pbt/yetanotherhelloworld/Main.java
La fusion automatique a échoué ; 
réglez les conflits et validez le résultat.            
```

:::note Exercice - Résoudre un conflit (suite de la suite)

- Réglez le conflit en éditant le fichier `Main.java` et, par exemple, laissez la licence, les deux auteurs et supprimez les marqueurs.

- Validez la résolution du conflit.

    ```bash
    git commit -a
    [develop e35d1f3] Merge branch 'release_license' into develop  

    ```

- Supprimez la branche `release_license`.

    ```bash
    git branch -d release_license
    ```

- Synchronisez le dépôt distant pour `origin/develop`.

    ```bash
    git push
    ```
:::

Tant que le conflit n'est pas réglé, `git status` le signale. 

:::info Remarque
Par rapport au dernier conflit, les marqueurs donnent le nom des branches et plus l'identifiant des *commits*.
:::

Nous allons maintenant fusionner la branche `develop` avec la branche `main`. La branche `develop` contient plusieurs *commits* représentatifs de la *release* que l'on vient d'implémenter. Nous voulons rassembler (*squash*) tous ces *commits* en un seul.

C'est le paramètre **squash** qui va adresser ce problème.

Nous aurons alors sur la branche `develop` l'histoire de la fonctionnalité implémentée et la branche `main` restera propre tout en signalant l'ajout. Nous allons taguer le premier *commit* de `master` **v1** et le nouveau **v2**.

:::note Exercice - Fusion avec rassemblement de *commits* 

Nous supposons que la branche `develop` contient plusieurs *commits* à intégrer dans la branche `main`.

- Se positionner sur la branche `main`
- Taguez HEAD

    ```bash
    git tag v1
    ```

- Fusionnez les branches **avec *squash***

    ```bash
    git merge --squash develop
    ```

- Faites le commit

    ```bash
    git commit
    ```

    L'éditeur s'ouvre et montre tous les messages de *commits* rassemblé. Il reste à reformater ce message et sauver.

- Taguez la v2 et pousser sur le dépôt.

    ```bash
    git tag v2 git push
    ```
:::

Pour terminer cet exercice, votre dépôt devrait avoir l'allure suivante : 

![Allure du dépôt à l'issue de l'exercice.](/img/git-hello-end.png)



