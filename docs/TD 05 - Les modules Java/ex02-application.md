# Exercice 2 - Communication entre modules

Dans cet exercice, vous allez créer une application Maven décomposée en plusieurs modules qui interagissent entre eux.

## Création des modules
Créez un projet Maven `ModuleApp` avec un groupId `be.esi.prj`. Sélectionez la racine de ce projet, et ajoutez trois nouveau modules, nommés `hello`, `api` et `main`, en précisant bien que chacun utilise Maven. Le module `main` va contenir notre application principale ; les modules `hello` et `api` seront utilisé par celui-ci de diverses façons.

Le fichier `pom.xml` de `ModuleApp` devrait avoir l'apparence habituelle, à une exception près : une balise `<modules>` liste les sous-modules de l'application.

```xml title="ModuleApp/pom.xml"
<modules>
    <module>hello</module>
    <module>api</module>
    <module>app</module>
</modules>
```

Attention : il s'agit (pour l'instant) de modules Maven, pas de modules Java ! Ces notions sont distinctes, même s'il est possible d'établir des liens (et nous allons le faire).

Quant aux sous-modules, leur `pom.xml` contient une référence vers le parent : 

```xml
<parent>
    <groupId>be.esi.prj</groupId>
    <artifactId>ModulesApp</artifactId>
    <version>1.0-SNAPSHOT</version>
</parent>
```

## Une simple dépendance

Dans le module `hello`, créez un package `be.esi.prj.hello`. Créez-y une classe `HelloModules` avec la méthode suivante :

```java
public static void doSomething() {
    System.out.println("Hello, Modules!");
}
```

Créez ensuite la déclaration de module :

```java showLineNumbers title="hello/src/main/java/module-info.java"
module be.esi.prj.hello {
    exports be.esi.prj.hello to be.esi.prj.main;
}
```

Notre module est prêt à être importé. Dans le module `main`, créez un package `be.esi.prj.main` et une classe `MainApp` dans ce package. Elle contiendra votre méthode principale :

```java showLineNumbers title="MainApp.java"
package be.esi.prj.main;

import be.esi.prj.hello.HelloModules;

public class MainApp {
    public static void main(String[] args) {
        HelloModules.doSomething();
    }
}
```

Le package `be.esi.prj.hello` déclenche une erreur de compilation. Ajoutez-donc un `module-info.java` dans le module `main` avec la dépendance nécessaire : 

```java showLineNumbers title="main/src/main/java/module-info.java"
module be.esi.prj.main {
    requires be.esi.prj.hello;
}
```

Vous devrez aussi préciser d'ajouter la dépendance dans le fichier `pom.xml` de Maven (IntelliJ devrait être capable de le faire pour vous) :

```xml title="main/pom.xml"
<dependencies>
    <dependency>
        <groupId>be.esi.prj</groupId>
        <artifactId>hello</artifactId>
        <version>1.0-SNAPSHOT</version>
        <scope>compile</scope>
    </dependency>
</dependencies>
```

Une fois cela fait, lancez le programme : il doit bien afficher :

```
Hello, Modules!
```

## Un service
Très souvent, une API sera implémentée via une interface, et l'implémentation exacte de l'interface sera déterminée selon les circonstances (pour un cas très simple, pensez par exemple à l'utilisation des listes en Java). On pourrait importer le module qui définit l'implémentation via `requires`, mais cela introduit un couplage qu'on souhaitera parfois éviter. À la place, on se servira de _services_ pour créer un lien symbolique qui pourra être instancié à l'exécution.

Définissez d'abord une API. Dans le module `api`, créez un package `be.esi.prj.api` avec une interface `Service`.

```java showLineNumbers title="Service.java"
public interface Service {
    void performAction();
}
```

Il faudra bien sûr déclarer le module :

```java showLineNumbers title="api/src/main/java/module-info.java"
module be.esi.prj.api {
    exports be.esi.prj.api;
}
```

À présent, définissez une implémentation de ce service dans le module `hello`, nommé `HelloService`.

```java showLineNumbers title="HelloService.java"
package be.esi.prj.hello;

import be.esi.prj.api.Service;

public class HelloService implements Service {
    @Override
    public void performAction() {
        System.out.println("Hello from service action!");
    }
}
```

Mettez à jour la déclaration du module `hello` pour préciser que le module `api` est maintenant une dépendance, mais aussi qu'il fournit un service :

```java showLineNumbers title="hello/src/main/java/module-info.java"
module be.esi.prj.hello {
    exports be.esi.prj.hello to be.esi.prj.main;
    requires be.esi.prj.api;
    provides be.esi.prj.api.Service with be.esi.prj.hello.HelloService;
}
```


Il est maintenant possible d'utiliser le service créé dans le module `main`. Pour préciser qu'un service est employé, il faut le préciser dans `module-info` : 

```java showLineNumbers title="main/src/main/java/module-info.java"
module be.esi.prj.main {
    requires be.esi.prj.hello;
    requires be.esi.prj.api;

    uses be.esi.prj.api.Service;
}
```

Dans le code de la méthode principale, utilisez `ServiceLoader` (dans `java.util`) afin de charger le service déclaré :

```java
Service service = ServiceLoader
        .load(Service.class)
        .findFirst()
        .orElseThrow();
service.performAction();
```
:::note Exercice
Créez un nouveau module `bye` contenant une classe qui implémente également l'interface Service, par exemple avec la méthode suivante:
```
    @Override
    public void performAction() {
        System.out.println("Good-bye from service action!");
    }
```
Modifiez votre application pour que ce module soit utilisé en lieu et place de `hello`.
:::
