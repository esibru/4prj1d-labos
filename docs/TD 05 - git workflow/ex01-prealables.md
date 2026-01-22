# Préalables et mise en place

![Exemple d'évolution d'un projet.](/img/example.png)

Évolution possible d'un projet.

1.  Alice crée d'abord un premier *commit* avec un fichier simple :
    l'image d'un cercle rouge.

2.  Ensuite, Bob ajoute un nouveau *commit* avec l'image d'Alice et un
    nouveau fichier contenant un carré mauve.

3.  Carole modifie le carré mauve de Bob en triangle.

4.  Pendant ce temps, Alice, dans un nouveau *commit*, change la couleur
    de son cercle, sans être au courant des changements de Bob et
    Carole.

5.  Enfin, les deux équipes se rendent compte de leur dispersion et
    créent un nouveau *commit* avec les améliorations de chacun.

:::info Rappels
Pour permettre l'accès à l'historique d'un projet, `git` doit conserver toutes ces données de manière structurée. L'espace de stockage contenant toutes ces données est nommé **dépôt** (*repository*).

Les éléments principaux composant un dépôt sont les **soumissions** (*commits*). Chaque *commit* contient l'ensemble des fichiers et leurs contenus qui composaient le projet à un moment donné. Un *commit* contient également une série de méta-données comme une date de création, le nom du créateur et une description. Pour pouvoir les identifier, les *commits* possèdent tous une clé unique.
:::

:::warning `git` _versus_ service web associé 
Pour partager facilement un dépôt entre plusieurs personnes, celui-ci
doit leur être accessible. Pour faciliter cette gestion et l'hébergement
d'un dépôt, plusieurs services web ont vu le jour pour conserver un
dépôt centralisé. Citons *Github*, *GitLab*, et *Bitbucket*.

**Attention de ne pas confondre le logiciel `git` et un service web associé.**
:::


## Notions de contrôle de version

Si vous avez déjà écrit un document un peu long, vous vous êtes sans doute déjà trouvé dans la situation où, après une grosse modification, vous changez d'avis et décidez que la version précédente était meilleure.

La façon la plus courante de s'en sortir est simplement de faire des copies de votre travail avant (ou après) chaque modification importante. Si vous écrivez un fichier `monTravail.txt` et que tout va bien, les versions se succèdent simplement et ça doit donner ceci :

```
monTravail-version-du-3-juin.txt
monTravail-version-du-12-juin.txt
monTravail-version-du-13-juin.txt
monTravail.txt <= Ceci est la version finale.
```

Cela fonctionne assez bien mais nous verrons que même dans ce cas simple, Git peut nous aider. Et puis, en pratique, il est plus probable que vous obteniez une situation, plutôt comme celle-ci (dans l'ordre chronologique) :

```
monTravail-version-du-3-juin.txt
monTravail-version-du-12-juin.txt
monTravail-version-finale.txt
monTravail-version-finale-avec-remerciements.txt
monTravail-version-finale-corrigée.txt
monTravail-version-finale-corrigée-avec-remerciements.txt
monTravail-version-vraiment-finale.txt
monTravail.txt <= Hm, à quoi ça correspond déjà ?
```

:::info
Notre manière de travailler n'est généralement pas **linéaire** mais se représente plutôt sous forme d'un **arbre** comme nous pouvons le voir dans la figure suivante.

![Exemple d'évolution des versions d'un document.](/img/montravailNonLineaire.png)
:::

## Environnement de travail

:::info 
`git` est probablement déjà installé sur votre environnement et ceci est un rappel.
:::

- sous MS Windows, installez **Git Bash** ;
- sous Linux, installez `git` en utilisant le votre gestionnaire de paquet. Un simple `apt install git` devrait suffire pour les *debian like* ;
- sous Mac OS, faites comme d'habitude.

Une commande `git` est de la forme :

```bash
git <command> [options]
```

À chaque commande (`command`) correspondent des options éventuelles (`options`).

`git` est conçu de manière à ce qu'un **dépôt** corresponde à un **répertoire**. Il est donc nécessaire de travailler dans un **répertoire dédié** à son projet.

Nous allons initialiser un dépôt dans le répertoire de travail ce qui aura pour effet de créer un répertoire caché contenant effectivement le dépôt `git`. Ce répertoire contiendra les différents *commits*. 

Le répertoire courant est appelé **répertoire de travail** (*working
directory*). Nous y reviendrons.

:::note Exercice
Création d'un premier dépôt _Hello world_
:::

Créez un répertoire de travail et initialisez le dépôt _git_. 

```bash 
mkdir  /elsewhere 
cd  /elsewhere
git init
```

:::tip 
Si vous entrez d'abord la commande `mkdir …`, vous pouvez obtenir la seconde commande en tapant `cd` suivi de `Alt-.` (c'est-à-dire maintenir la touche `Alt` enfoncée et taper le caractère `.`).

Cette combinaison insère le dernier argument de la dernière commande de l'historique. Dans ce cas, le nom du répertoire.

Une utilisation itérée permet de remonter dans l'historique.
:::

Vous pouvez constater qu'aucune modification n'est apportée au répertoire **excepté** pour les fichiers cachés. 

:::note Exercice
Exécutez la commande 

```bash
tree . -a -L 1
```
… et constatez la différence. 
:::

## Configuration globale

Pour bien se présenter à l'avenir, c'est bien de configurer son nom et son adresse mail. 

Par exemple Juste Leblanc, étudiant à l'école configurera son environnement comme suit : 

```bash 
git config --global user.name "Juste Leblanc"
git config --global user.email jleblanc@etu.he2b.be
```

Cette configuration globale est écrite dans `$HOME/.gitconfig`. 