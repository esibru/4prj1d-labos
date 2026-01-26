# Exercice 1 - Création de Thread

Il existe (au moins) trois manières différentes de créer un fil 
d'exécution (_thread_) en JAVA : 
- par **dérivation** (héritage).
- par **implémentation d'une interface**.
- par **composition**.

Analysez ces différents modes de créations.

## Héritage

Créez la classe `MyThread` qui hérite de la classe `Thread`.

```java showLineNumbers title="MyThread.java"
/**
 * Création d'une classe thread par dérivation de la classe Thread
 */
public class MyThread extends Thread {

    private String name;

    public MyThread(String s) {
        this.name = s;
    }

    public void run() {
        for (int i = 0; i < 10; ++i) {
            for (int j = 0; j < 50000; ++j) ;
            System.out.println("MyThread: " + name + " : " + i);
        }
    }
}
```

Cette classe est composée d'un attribut `name` stockant le nom de la thread, 
d'un constructeur `MyThread(String s)` qui initialise l'attribut `name` 
avec la valeur passée en paramètre et d'une méthode `run()` contenant
le code à exécuter par la thread.

Testez `MyThread` en créant et exécutant la classe `TestMyThread`.

```java showLineNumbers title="TestMyThread.java"
/**
 * Classe de test de la classe MyThread
 */
public class TestMyThread {

    public static void main(String[] args) {
        MyThread t = new MyThread("one");
        t.start();
        // t.run();
        for (int i = 0; i < 10; ++i) {
            for (int j = 0; j < 50000; ++j) ;
            System.out.println("TestMyThread: " + i);
        }
    }
}
```

:::note Exercice A

Répondez aux questions suivantes concernant les classes `MyThread` et `TestMyThread`.

1. Comment la thread est-elle créée et exécutée ?
1. Quelle est l'utilité de la méthode `start()` ? Ou est-elle implémentée ?
1. Changez la valeur maximale de la variable d'itération `j` de la méthode `run()` 
dans la classe `MyThread`. Que constatez-vous après plusieurs exécutions ?
1. Changez l'appel de la méthode `start()` par celui de la méthode `run()` 
dans la classe `TestMyThread`. Quelles sont les conséquences sur l'exécution du programme ?
1. Changez l'instanciation de la thread `MyThread t = new MyThread("one");` 
par une expression lambda et vérifiez que vous obtenez un résultat identique.

```java
Thread t = new Thread(() -> {
            for (int i = 0; i < 10; ++i) {
                for (int j = 0; j < 50000; ++j) ;
                System.out.println("MyThread: lambda: " + i);
            }
        })
```

:::

:::info Création et exécution d'un objet Thread : `start()` et `run()`

- Pour créer une thread, il suffit d'instancier un objet qui étend la classe *Thread* 
et d'appeler sa méthode `start()`. Cette méthode, héritée de la classe *Thread*, associe 
les ressources systèmes nécessaires à l'exécution de la thread et démarre son exécution 
en invoquant sa méthode `run()`. Deux threads sont dés lors exécutées en parallèle : 
la thread parent (main) et la thread enfant fraîchement créée. 
Il est interdit d'appeler plusieurs fois la méthode `start()` d'un même objet Thread.
- La méthode `run()` contient par réécriture le code à exécuter. 
Cette méthode correspond à la méthode main de la thread. 
Elle est supposée se terminer normalement avant la destruction de la thread supportant 
son exécution.
- Il convient de noter que si la méthode `run()` est directement appelée, 
celle-ci s'exécute dans la thread courante. 
Afin de créer un nouveau fil d'exécution, il faut utiliser la méthode `start()`.

:::

## Implémentation de l'interface Runnable

Créez la classe `MyRunnable` qui implémente l'interface `Runnable`.


```java showLineNumbers title="MyRunnable.java"
/**
 * Création d'une classe thread par implémentation de l'interface Runnable
 */
public class MyRunnable implements Runnable {

    private String name;

    public MyRunnable(String name) {
        this.name = name;
    }

    public void run() {
        for (int i = 0; i < 10; ++i) {
            for (int j = 0; j < 10000000; ++j) ;
            System.out.println("MyRunnable: " + name + " : " + i);
        }
    }
}
```

Testez `MyRunnable` en créant et exécutant la classe `TestMyRunnable`.

```java showLineNumbers title="TestMyRunnable.java"
/**
 * Classe de test de la classe MyRunnable
 */
public class TestMyRunnable {

    public static void main(String[] args) {
        MyRunnable r = new MyRunnable("one");
        Thread t = new Thread(r);
        t.start();
        for (int i = 0; i < 10; ++i) {
            for (int j = 0; j < 10000000; ++j) ;
            System.out.println("TestMyRunnable: " + i);
        }
    }
}
```

:::note Exercice B

Répondez aux questions suivantes concernant les classes `MyRunnable` et `TestMyRunnable`.

1. Comment la thread est-elle créée et exécutée ? 
1. Quelles sont les différences avec l'exemple précédent ?

:::

:::info L'interface `Runnable`

L'interface fonctionnelle `Runnable` est une interface possédant une seule méthode : `run()`. 
Une instance de la classe implémentant cette interface peut être passée comme argument de construction d'un objet `Thread`. 
La thread exécutera la méthode `run()` après l'appel de sa méthode `start()`.

:::


## Création par composition

:::note Exercice C

Reprenez l'exemple de la classe `MyThread` créant une thread par héritage 
et adaptez-le de sorte à définir la classe `My-Thread-Composition`, pour créer 
une thread obtenue par **composition**.

:::

:::info Ordre d'exécution des programmes multithreadés

- Contrairement aux programmes rencontrés jusqu'à présent, l'ordre d'exécution des programmes multithreadés n'est pas séquentiel et ne peut dés lors être déterminé à l'avance. En effet, le _**scheduler**_ (**ordonnanceur**) du système d'exploitation (et non pas la JVM) gère l'exécution des différentes threads. Il va essayer d'optimiser la parallélisation et donc l'ordre d'exécution des différentes instructions. Une thread peut donc être interrompue pour donner la main à une autre thread à n'importe quel moment de l'exécution de la méthode `run()`. Les conséquences que cela implique sont discutées dans la suite de TD.
- Ce concept de parallélisme des tâches est déjà bien présent au 
niveau des systèmes d'exploitation. On parle d'ailleurs de système 
d'exploitation multi-tâches gérant l'exécution de plusieurs processus 
(*process*). Les communications entre les différents processus sont 
rudimentaires: *pipes*, mémoires partagées.

:::

## _The new way_ (JDK 21)

Depuis JDK21, Java a ajouté un [_builder_ dans la classe `Thead`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Thread.Builder.html) pour créer une _thread_ d'une autre manière. 

La création d'une _thread_ peut s'écrire : 

```java showlinenumbers
Thread.ofPlatform().start( () -> {
    for (int i = 0; i < 10; ++i) {
        for (int j = 0; j < 50000; ++j) ;
        System.out.println("MyThread: new way: " + i);
    }
});
```

La méthode `ofPlatform` signale que l'on crée et lance une _thread_ classique ; une _thread_ « plateforme ». C'est-à-dire une _thread_ comme présentée précédemment et qui est associée à l'OS (_operating system_). JDK21 introduit la notion de _virtual thread_ (processus léger virtuel) : ce sont des _threads_ légères utilisant les _threads_ de la plateforme.

Là où les _threads platform_ correspondent à des _threads_ du système d'exploitation, les _virtual threads_ sont gérés par la JVM (_java virtual machine_). Plusieurs _threads_ virtuelles correspondent à une seule _thread_ plateforme et c'est la JVM qui gère l'ordonnancement et la création des _threads_ plateformes associées. Les _virtuals threads_ sont moins coûteux en mémoire, peuvent être plus nombreuses et demandent moins de ressources systèmes pour être instanciées. 

**Exemple de création d'une virtual thread :**

```java
// Avec Thread.ofVirtual()
Thread vThread = Thread.ofVirtual().start(() -> {
    for (int i = 0; i < 10; i++) {
        System.out.println("Virtual Thread: " + i);
    }
});

// Ou directement avec startVirtualThread()
Thread.startVirtualThread(() -> {
    System.out.println("Virtual Thread en action !");
});
```

[La documentation Java](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Thread.html)  
[Du JDK18 au JDK22](https://blog.namok.be/2025-02-19-jdk18-jdk22.html)
