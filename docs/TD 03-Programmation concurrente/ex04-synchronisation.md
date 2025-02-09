# Exercice 4 - Synchronisation

## Illustration du problème d'accès concurrent

Créez les classes `ToujoursPair`, `MyThread` et `Test`. 

```java showLineNumbers title="ToujoursPair.java"
/**
 * Petite classe pourvue de deux methodes simples
 *
 * Exemple inspire par Thinking in Java, 3rd Edition, Beta Copyright (c)2002 by
 * Bruce Eckel www.BruceEckel.com
 */
public class ToujoursPair {

    private int i = 0;

    public void nextI() {
        ++i;
        ++i;
    }

    public int getI() {
        return i;
    }
}
```


```java showLineNumbers title="MyThread.java"
/**
 * Thread accedant en lecture a une instance de ToujoursPair
 *
 * Exemple inspire par Thinking in Java, 3rd Edition, Beta Copyright (c)2002 by
 * Bruce Eckel www.BruceEckel.com
 */
public class MyThread extends Thread {

    ToujoursPair tp;

    public MyThread(ToujoursPair tp) {
        this.tp = tp;
    }

    public void run() {
        while (true) {
            int val = tp.getI();
            if (val % 2 != 0) {
                System.out.println("myThread : " + val);
                System.exit(0);
            }
        }
    }
}
```

```java showLineNumbers title="Test.java"
/**
 * Thread accedant en ecriture et lecture a une instance de ToujoursPair
 *
 * Exemple inspire par Thinking in Java, 3rd Edition, Beta Copyright (c)2002 by
 * Bruce Eckel www.BruceEckel.com
 */
public class Test {

    public static void main(String[] args) {
        ToujoursPair tp = new ToujoursPair();
        MyThread t = new MyThread(tp);
        t.start();
        while (true) {
            tp.nextI();
            if (tp.getI() % 1000000 == 0) {
                System.out.println(tp.getI());
            }
        }
    }
}
```

:::note Exercice A

Analysez ces trois classes et exécutez la classe `Test`.
- Que constatez-vous ? 
- Quelle est la cause de ce comportement ?

:::


:::info Accès concurrent

- La grande différence entre processus et threads est que ces dernières 
s'exécutent au sein d'un même programme. Cela implique que certains 
objets, certaines données sont automatiquement partagées par les 
différentes threads du programme. Dans l'exemple ci-dessus, la variable `tp`.
- Ce partage doit être contrôlé de sorte que deux threads accédant 
au même objet le font de manière cohérente ou, en d'autres termes, 
qu'une thread ne laisse ni ne trouve jamais un objet dans un état 
incohérent. Ainsi, si l'une modifie un attribut (`nextI()`) tandis que l'autre 
le consulte (`getI()`), il faut veiller à ce que les deux accès ne se chevauchent pas. 
Rappelons en effet que la méthode `run()` peut être interrompue 
**à tout moment** par le scheduler.					

:::

## Méthode synchronised

Pour pallier aux désagréments engendrés par le comportement 
mis en évidence dans l'exemple précédent, on peut utiliser le 
mot clé `synchronized` comme **modificateur de méthode**.

Créez les classes `MyObjet`, `MyThread` et `Test`.

```java showLineNumbers title="MyObject.java"
/**
 * Classe pourvue de deux methodes d'affichage : illustration de l'utilisation
 * du mot cle synchronized comme modificateur de methode.
 */
public class MyObject {

    private String name;

    public MyObject(String name) {
        this.name = name;
    }

    // public void show() {
    public synchronized void show() {
        String nom = Thread.currentThread().getName();
        System.out.println("My object: thread " + nom
                + ", objet  " + name + " in show");
        try {
            Thread.sleep(7000);
        } catch (InterruptedException e) {
        }
        System.out.println("My object: thread  " + nom
                + ",objet " + name + " out show");
    }

    // public void print() {
    public synchronized void print() {
        String nom = Thread.currentThread().getName();
        System.out.println("My object: thread  " + nom
                + ", objet " + name + " in print");
        try {
            Thread.sleep(7000);
        } catch (InterruptedException e) {
        }
        System.out.println("My object: thread " + nom
                + ", objet " + name + " out print");
    }
}
```

```java showLineNumbers title="MyThread.java"
/**
 * Thread utilisant une methode d'une instance de MyObject
 */
public class MyThread extends Thread {

    private MyObject myObject;

    public MyThread(String name, MyObject myObject) {
        super(name);
        this.myObject = myObject;
    }

    public void run() {
        String nom = Thread.currentThread().getName();
        System.out.println("My thread: thread  " + nom + " in run");
        myObject.show();
        System.out.println("My thread: thread " + nom + " out run");
    }
}
```

```java showLineNumbers title="Test.java"
/**
 * Thread utilisant une methode d'une instance de MyObject et instanciant une ou
 * deux nouvelles threads.
 */
public class Test {

    public static void main(String[] args) {
        MyObject mo1 = new MyObject("mo1");
        // MyObject mo2 = new MyObject("mo2");
        MyThread mt1 = new MyThread("mt1", mo1);
        // MyThread mt2 = new MyThread("mt2", mo2);

        mt1.start();
        // mt2.start();
        try {
            Thread.sleep(0L);
        } catch (InterruptedException e) {
        }
        mo1.print();
    }
}
```

:::note Exercice B

Répondez aux questions suivantes concernant les classes `MyObjet`, `MyThread` et `Test`.

- Après exécution, observez les entrées et sorties des méthodes 
`synchronized`, qu'observez-vous ?
- Testez les quatre combinaisons des signatures des méthodes 
`show` et `print`.
- Décommentez les commentaires relatifs à `mo2` et `mt2`.

:::

:::info
- L'effet du mot-clé `synchronized` peut être décrits 
de la manière suivante. Chaque objet en Java possède un verrou 
et une seule clé ouvrant ce verrou. 
    - Pour exécuter une méthode d'instance non
	`synchronized` d'un objet don-né, une thread ne doit **pas**
	posséder la clé de cet objet. 
    -  Par contre, si cette *méthode* est
	`synchronized`, la thread qui tente 
	de l'exécuter ne le peut que si la *clé* de l'objet est 
	*disponible*. 
- Si ce n'est pas le cas, elle attend que la clé soit accessible. 
Si la clé est disponible, elle s'en empare, lance l'exécution de 
la méthode, puis rend la clé lorsqu'elle retourne de cette méthode.
- Ceci implique que deux méthodes d'instance `synchronized` 
d'un même objet, ne peuvent pas être exécutées simultanément par 
deux threads. Les méthodes peuvent être différentes pour chaque 
thread, mais il peut également s'agir de la même méthode pour les deux. 
-  Lors d'appels imbriqués de méthodes synchronisées, la
thread ne rend la clé du verrou que lorsqu'elle sort de la méthode la plus
*externe*. On parle de *verrouillage réentrant*. 

:::

## Le bloc synchronised

La portée du mot clé `synchronized` peut être restreinte à un 
bloc. Dans ce cas il faut fournir en argument l'objet dont la clé du 
verrou est nécessaire pour y pénétrer. C'est objet peut être comparé au
`mutex`, le sémaphore d'exclusion mutuel. 

Créez les classes `MyObject`, `MyThread` et `Test`.

```java showLineNumbers title="MyObject.java"
/**
 * Classe pourvue d'une methode d'affichage avec des blocs synchronized sur
 * l'objet lui-meme ou sur une chaine de caracteres.
 */
public class MyObject {

    private Random rnd;

    public MyObject() {
        rnd = new Random();
    }

    public void fct() {
        String nom = Thread.currentThread().getName();
        System.out.println("MyObject: " + nom + " in fct");

        synchronized (this) {
            //synchronized("verrou") {
            System.out.println("MyObject: " + nom + " in bloc 1");
            try {
                Thread.sleep(rnd.nextInt(1000));
            } catch (InterruptedException e) {
            }
            System.out.println("MyObject: " + nom + " out bloc 1");
        }

        System.out.println("MyObject: " + nom + " between bloc 1 and bloc 2");
        try {
            Thread.sleep(rnd.nextInt(1000));
        } catch (InterruptedException e) {
        }

        synchronized (this) {
        // synchronized ("verrou") {
            System.out.println("MyObject: " + nom + " in bloc 2");
            try {
                Thread.sleep(rnd.nextInt(1000));
            } catch (InterruptedException e) {
            }
            System.out.println("MyObject: " + nom + " out bloc 2");
        }

        System.out.println("MyObject: " + nom + " out fct");
    }
}
```

```java showLineNumbers title="MyThread.java"
/**
 * Thread utilisant une methode d'une instace de MyObject.
 */
public class MyThread extends Thread {

    private MyObject myObject;

    public MyThread(String name, MyObject myObject) {
        super(name);
        this.myObject = myObject;
    }

    public void run() {
        String nom = Thread.currentThread().getName();
        System.out.println("MyThread: " + nom + " in run");
        myObject.fct();
        System.out.println("MyThread: " + nom + " out run");
    }
}
```

```java showLineNumbers title="Test.java"
/**
 * Classe de test instanciant deux threads utilisant une methode a blocs
 * synchronises d'un meme objet.
 */
public class Test {

    public static void main(String[] args) {

        MyObject mo = new MyObject();
        MyThread t1 = new MyThread("t1", mo);
        MyThread t2 = new MyThread("t2", mo);

        t1.start();
        Thread.yield();
        t2.start();
    }
}
```

:::note Exercice C

Testez l'exemple suivant en modifiant les objets de 
synchronisation des blocs `synchronized` de *fonction* 
(quatre combinaisons différentes sont possibles).

:::


:::info

Lorsque la synchronisation se fait sur une chaîne de caractères, 
on parle de synchronisation nommée. 
La synchronisation peut également
se faire sur **n'importe quel objet**.

:::
