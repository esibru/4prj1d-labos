# Exercice 2 - Travailler avec un dépôt distant

`git` permet de travailler en équipe. Il permet également de travailler en équipe tout seul ou toute seule… mais sur plusieurs machines. Il permet également de publier tout le dépôt (de manière publique, limitée ou privée) en utilisant un *serveur git* distant. Comme nous l'avons dit, à ces serveurs `git` sont associées des interfaces web pour faciliter la gestion et l'accès. Nous nous intéressons maintenant à **_gitesi_**, le serveur *GitLab* hébergé par l'école à l'adresse [git.esi-bru.be](https://git.esi-bru.be).

```bash
git push 
    Pousse à partir du dépôt local vers le dépôt distant. 
git pull
    Tire à partir du dépôt distant vers le dépôt local.
```

Nous avons un dépôt `git` **local** et nous voulons le synchroniser avec un serveur distant. 

:::info Rappel
Cette partie est un rappel et vous pouvez passer à la suite si vous êtes suffisamment familier avec ceci. 
:::

## Lier un dépôt local à un dépôt distant (*remote*)

Que faut-il faire ?

1.  Se connecter au *GitLab* *gitesi*.
2.  Se donner un moyen de s'identifier auprès du serveur `git` distant
    (pas auprès de l'interface *GitLab* mais auprès du serveur `git`
    sous-jacent) :

    -   en déposant une clé publique **ssh** sur le serveur *via*
        l'interface web.

        Pour créer une *paire de clés* :

        -   entrer la commande `ssh-keygen` dans un terminal sans entrer
            de phrase de passe (*passphrase*) et en validant les noms de
            fichiers par défaut qui se trouveront dans `~/.ssh` ;

        -   copier le contenu du fichier généré précédemment **avec
            comme extension `.pub`** (pour « clé publique ») sur le
            serveur *gitesi* à cet endroit :  
            *Profile / Preferences /
            SSH Keys / Add an SSH key* et valider ;

        -   dorénavant à partir de cette machine (qui connaît la clé
            privée) il est possible d'accéder au serveur en SSH et ce,
            sans devoir donner de mot de passe ;

    -   en fixant un mot de passe pour y accéder *en https* *via*
        l'interface web (ce mot de passe sera le même que celui de
        l'interface *GitLab*).

3.  Créer un nouveau projet *via* l'interface web. Pour ce faire : Cliquer
    sur le  
    `+ / Nouveau projet / Create blank project`

4.  *Ajouter le remote* c'est-à-dire, dire à git (en local) qu'il existe
    un serveur distant avec lequel il va se synchroniser. La commande
    est proposée par *GitLab*. Dans mon cas:

    ```bash
    git remote add origin git@git.esi-bru.be:pbt/yahelloworld.git
    ```

    :::tip 
    La commande ne donne pas de retour, pour vérifier que
    le *remote* est correct, entrez la commande `git remote -v`
    :::

5.  Déposer le projet sur le dépôt distant (*push*).

    ```bash
    git push origin master
    ```

    :::warning 
    Pour positionner le dépôt distant de manière définitive, utiliser
    l'option `–set-upstream` (ou `-u`) par ,au choix :

    ```bash
    git push --set-upstream origin master 
    git push -u origin master
    ```

    Le choix de *origin* comme nom de dépôt distant est libre. Par
    défaut, git propose *origin*.
    :::

6.  Vérifier sur *gitesi* que la page s'est mise à jour.

7.  Visualiser les *commits* sur l'interface web de *gitesi*.

:::note Exercice - ajout d'un dépôt distant
Ajoutez un projet sur _gitesi_ et synchronisez-le avec votre projet _Hello world_.
:::

## Gérer les conflits

Imaginons que l'on modifie le dépôt distant... dans ce cas le dépôt distant et le dépôt local ne seront plus synchronisés. Il faut ramener toutes les modifications du dépôt distant vers le dépôt local. Un `git pull` devrait adresser ce problème.

:::warning
Attention Lors d'un travail à plusieurs ou sur des machines différentes, il est **indispensable** de s'assurer que le dépôt local est à jour avec le dépôt distant en exécutant un `git pull` **avant** de commencer à travailler.
:::

Lorsque deux dépôts ne sont pas synchronisés, il faut **gérer les conflits**. `git` propose alors de *valider* ou *remiser* les modifications :

-   *remiser* les modifications consiste à utiliser la commande `stash`     pour enregistrer temporairement les modifications sur une « pile de     modifications » qui pourra être réutilisée par la suite ; 

-   *valider* les modifications consiste à faire un *commit* avant le     *pull*... qui sera suivi d'une fusion (*merge*) par la suite.

    Parfois une fusion (*merge*) se passe sans soucis et parfois, il est     nécessaire de régler les conflits manuellement. Dans ce cas, `git` marque les lignes du fichier qui sont en conflit. Il faut alors éditer le fichier et choisir les lignes qui conviennent.

:::note Exercice - Créer un conflit
Modifiez le fichier `README.md` _via_ l'interface web de _gitesi_.  
Faites un _commit_ (toujours _via_ l'interface web) et… 

… constatez et gérez les erreurs. 
:::

Pour rappel, le dépôt local contient déjà un fichier `README.md` dans le *working directory* et dans l'*index*.

**Le *pull* ne va pas bien se passer…**

Lorsque vous faites un `git pull`, vous pouvez constater l'erreur.

```bash
Mise à jour 02cc587..4b3514c
error: Vos modifications locales aux fichiers suivants seraient 
écrasées par la fusion :
    README.md
Veuillez valider ou remiser vos modifications avant la fusion.
Abandon
```

**Validez** les modifications faites dans l'exercice précédent, par un `git add README.md` suivi d'un *commit*.

Un `git pull` simple ne suffira pas car `git` ne peut régler le conflit sur le fichier ; le fichier local et le fichier distant sont « trop » différents. 

Exécutez `git pull –no-ff` qui va récupérer les données sur le dépôt distant et tenter la fusion (*merge*).

```bash
Fusion automatique de README.md
CONFLIT (contenu) : Conflit de fusion dans README.md
La fusion automatique a échoué ; réglez les conflits 
et validez le résultat.
```

Cette fois, c'est le *merge* qui pose problème et il faut régler les conflits en éditant le fichier.

Éditez le fichier `README.md` et modifiez

```vim
<<<<<<< HEAD
green
=======
Ce fichier readme devient un véritable arc-en-ciel.
>>>>>>> 4b3514c7f8492426335c6d98993f575d8feabd1d
```

en supprimant les **marqueurs de conflit** (_merge conflict markers_) et en choisissant la version qui nous convient. Ici, il suffit de laisser la ligne 

```vim
Ce fichier readme devient un véritable arc-en-ciel.
```

Validez le résultat par  
`git add README.md ; git commit -m "Solve conflict"`

Synchronisez avec le dépôt distant par un `git push`.

:::info Remarque 

Dans l'exercice, vous avez vu `<<<<<<<`, `=======` et `>>>>>>>` qui sont les **marqueurs de conflits** de `git` :

-   le premier marque le début du conflit et est suivi du *commit*
    concerné. Ici `HEAD` ;
-   le dernier marque la fin du conflit et est suivi du *commit*
    concerné. Ici `4b35…` ;
-   celui du milieu coupe la zone en deux :
    1.  celle du haut correspond à l'état de `HEAD` ;
    2.  celle du bas correspond au code introduit par le *commit*.

Comme vous l'avez vu, une manière de résoudre le conflit est de modifier
la zone entre les marqueurs et d'ensuite supprimer les marqueurs. Il
restera ensuite à valider (*add*) et soumettre (*commit*).
:::

## Cloner un dépôt distant

Lorsque l'on travaille avec une autre personne ou avec plusieurs machines ou simplement pour travailler localement sur un dépôt, il est nécessaire de le **cloner** c'est-à-dire rapatrier son contenu sur la machine pour y avoir accès. C'est la commande `clone` de git qui s'en charge.

Cette commande crée un répertoire et copie le dépôt. Dans le répertoire copié se trouve le *working directory* et un sous-répertoire `.git` contenant tout ce qui concerne git.

Après un _clone_, on peut vérifier le dépôt à *grands coups* de `ls -a`, `git status`, `git log`, `git remote -v`…

:::tip Conseil
Petite hygiène `git` Avant de quitter une machine :

-   valider (*add* et *commit*) les modifications ;
-   pousser (*push*) sur le serveur.

En arrivant sur une machine :

-   copier (*clone*) le dépôt **s'il n'est pas déjà présent** ;
-   mettre à jour le dépôt, le tirer (*pull*) ;
:::


