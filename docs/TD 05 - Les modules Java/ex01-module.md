# Exercice 1 - Module Java

Un module Java consiste en un __ensemble de packages__ dont les propriétés sont bien définies, en particulier :
- un nom
- une liste de ses dépendances
- un point d'accès (API) public
- une liste des services offerts

Au cours de cet exercice, vous allez commencer par lire une déclaration de module réalisée lors d'un TD précédent afin de comprendre exactement son effet sur le module créé, 

## Déclaration de module

Reprenez l'application `HelloApplication` que vous avez créée au TD02. Dans cette applications, vous aviez ajouté un fichier `module-info.java` :

```java showLineNumbers title="module-info.java"
module be.esi.prj {
    requires javafx.controls;
    requires javafx.fxml;

    opens be.esi.prj to javafx.fxml;
    exports be.esi.prj;
}
```

Ce fichier déclare que vos packages forment un module, et définit les propriétés de celui-ci :
- Ligne 1 : Le module se nomme `be.esi.prj`
- Lignes 2 et 3 : Ses dépendances sont `javafx.controls` et `javafx.fxml`. Les types exportés par ces modules sont donc accessibles à notre module à l'exécution.
- Ligne 5 : On _ouvre_ l'accès à toutes les classes du __package__ `be.esi.prj` (y compris les classes non publiques) au module `javafx.fxml` via _réflexion_.
- Ligne 6 : Le __package__ `be.esi.prj` est _exporté_ par notre module : il s'agit du point d'accès à notre module. Les classes publiques de ce package sont donc accessibles à l'extérieur du module, alors que les autres packages sont _fortement encapsulés_  et donc inaccessibles.

## Export et réflexion
Par défaut, tous les types (classes, interfaces) définis dans un module sont inaccessibles en-dehors de ce module. Il faudra déclarer explicitement quels types nous souhaitons rendre accessibles.

Nous avons vu qu'il y a deux façons différentes de donner accès à notre package `be.esi.prj` : par réflexion via `open`, et par export via `export`.

:::note
En Java, la _réflexion_ fait référence à la pratique de consulter, __à l'exécution__, des informations concernant les classes, interfaces, attributs et méthodes de nos objets. Cette pratique est essentielle, par exemple, lorsque ces informations ne sont pas déterminées à la compilation.

La réflexion est utilisée par de nombreux frameworks, tels que JUnit ou Spring, quand ceux-ci ont besoin par exemple d'instancier des objets de façon dynamique. FXML, par exemple, se sert de la réflexion pour identifier la classe de contrôleur associé à un fichier FXML, et les attributs et méthodes de ce contrôleur annotés via `@FXML`.
:::

- `open` ouvre un package à la _réflexion_. Toutes les classes du package, quelle que soit leur visibilité, sont alors accessibles.
- `exports` définit un package comme _point d'accès_. Seules les classes _publiques_ du package sont rendues accessibles à la fois à la compilation et à l'exécution. Ces classes peuvent donc être _importées_ par les classes présentes dans d'autres modules.

Par défaut, un package ouvert ou exporté est accessible à tout module. Il est également possible de _qualifier_ cet accès via le mot-clé `to` suivi d'un nom de module, afin de ne donner accès qu'à ce module. Cela nous permet d'avoir un contrôle complet sur l'encapsulation de notre module.

:::note
De même manière qu'on s'efforce de rendre les attributs privés, et les types et méthodes en visibilité _package_ si possible, une bonne pratique est de limiter le nombre de points d'accès le plus possible.
:::

## Dépendance
Une dépendance permet d'accéder, à la compilation (via `import`) et à l'exécution, aux classes exportées par le module renseigné.

Il est également possible de préciser deux types de dépendances particulières : 
- `requires static` indique une dépendance _optionnelle à l'exécution_ : elle est nécessaire lors de la compilation mais pas à l'exécution. Ceci pourrait survenir dans un cas où la présence de la dépendance permet d'altérer le comportement du module (par exemple pour appeler un code plus efficace), mais si elle n'est pas présente, le code est capable de fonctionner sans ce code.
- `requires transitive` indique que les dépendances _de la dépendance_ sont aussi des dépendances de notre module. Cela permet d'éviter de devoir re-préciser ces dépendances via des `requires` supplémentaires. C'est notamment pertinent lorsque notre dépendance renvoie des résultats d'un type défini dans une de _ces_ dépendances. Par contre, c'est à éviter si nous avons besoin de ce deuxième module pour des comportements distincts de la dépendance déjà renseignée.

## Compiler un module

`module-info.java` est un fichier Java, même s'il ne définit pas une classe.

Consultez le `target` de votre projet. Dans le répertoire `classes`, vous y trouverez un fichier `module-info.class`, version compilée de `module-info.java`. IntelliJ est d'ailleurs capable de le décompiler comme tout autre fichier `.class`. Si vous compilez votre projet pour en faire une archive Java (`.jar`), le fichier `module-info.class` sera donc inclus, et l'archive contient donc comme un module. Cela veut aussi dire que chaque archive JAR ne contient au plus qu'un seul module.
