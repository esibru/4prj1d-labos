# Exercice 2 - Interruption

## Méthodes sleep et yield

La méthode `sleep` est une méthode statique de la classe 
`Thread` permettant de mettre en sommeil la thread 
*courante* durant un certain laps de temps.

Créez la classe `MyTimer` qui hérite de la classe `Thread`.

```java showLineNumbers title="MyTimer.java"
/**
 * Classe thread affichant un petit message a intervalle regulier : exemple
 * d'utilisation de la methode Thread.sleep
 */
public class MyTimer extends Thread {

    private int laps;
    public boolean shouldRun; // notez le public !

    public MyTimer(int laps) {
        this.laps = laps;
        shouldRun = true;
    }

    public void run() {
        while (shouldRun) {
            try {
                sleep(laps / 2);
                System.out.println("MyTimer: run");
                sleep(laps / 2);
            } catch (InterruptedException e) {
                System.out.println(e);
            }
        }
    }
}
```

Testez `MyTimer` en créant et exécutant la classe `TestMyTimer`.

```java showLineNumbers title="TestMyTimer.java"
/**
 * Classe de test de la classe MyTimer
 */
public class TestMyTimer {

    public static void main(String[] args) {
        MyTimer myTimer = new MyTimer(4000);
        myTimer.start();
        try {
            Thread.sleep(7011);
        } catch (InterruptedException e) {
            System.out.println("TestMyTimer: exception " + e);
        }
        myTimer.shouldRun = false;
        System.gc();
        System.out.println("TestMyTimer: gc called");
        System.out.println("TestMyTimer: end");
    }

}
```

:::note Exercice A

Répondez aux questions suivantes concernant les classes `MyTimer` et `TestMyTimer`.

- Remarquez les différents appels à la méthode `sleep()` dans les deux classes. 
À quel output vous attendez-vous après l'exécution de la méthode main ?
- Pourquoi l'appel de la méthode `sleep()` diffère selon la classe où elle est appelée ? 
- Qu'est ce qu'une `InterruptedException` ?
- Quand la thread `myTimer` cesse-t-elle de s'exécuter ?


:::


:::info Les méthodes sleep et yield

- La méthode `static sleep(long millis)` de la classe Thread 
permet de cesser l'exécution de la thread pour une durée de 
`millis` millisecondes. 
- L'exception `InterruptedException` est lancée lorsqu'une thread 
est en attente, endormie ou occupée et qu'elle est interrompue 
avant ou pendant son activité. 
- Signalons également la méthode statique `yield()` qui met la 
thread courante en pause, rend la main au `scheduler` (gestionnaire de 
threads du système d'exploitation) et permet à une autre thread 
de s'exécuter. Elle est donc équivalente à `sleep(0)`.

::: 

## Méthode interrupt()

Créez la classe `MyTimerInterrupt` qui hérite de la classe `Thread`.

```java showLineNumbers title="MyTimerInterrupt.java"
/**
 * Classe thread affichant un petit message a intervalle regulier : exemple
 * d'utilisation de la methode Thread.interrupted
 */
public class MyTimerInterrupt extends Thread {

    private int laps;

    public MyTimerInterrupt(int laps) {
        this.laps = laps;
    }

    @Override
    public void run() {
        while (!interrupted()) {
            try {
                System.out.println("MyTimer: not interrupted");
                sleep(laps);
            } catch (InterruptedException e) {
                System.out.println("MyTimer: exception " + e);
                return;   // essayer avec et sans ce return !
            }
        }
    }
}
```

Testez `MyTimerInterrupt` en créant et exécutant la classe `TestMyTimerInterrupt`.


```java showLineNumbers title="TestMyTimerInterrupt.java"
/**
 * Classe de test de la classe MyTimerInterrupt : utilisation de la methode
 * interrupt()
 */
public class TestMyTimerInterrupt {

    public static void main(String[] args) {
        MyTimerInterrupt myTimer = new MyTimerInterrupt(1000);
        myTimer.start();
        try {
            Thread.sleep(7011);
        } catch (InterruptedException e) {
            System.out.println("TestMytimer: exception " + e);
        }
        myTimer.interrupt();
    }
}
```

:::note Exercice B

Répondez aux questions suivantes concernant les classes `MyTimerInterrupt` et `TestMyTimerInterrupt`.

- Analysez et exécutez les deux classes. À quoi servent les 
méthodes `interrupted()` et `interrupt()` ?
- Exécutez la classe test en ayant auparavant commenté le 
`return` de la méthode `run`. 
Que se passe-t-il ? Quelle en est l'explication ? 

:::

:::info Les méthodes d'interruption

- La thread dont la méthode `interrupt` est appelée voit 
son drapeau (indicateur d'état) "interrompu" mis à vrai. 
Cette méthode n'interrompt ni directement ni brutalement la thread, 
elle demande à la thread de s'interrompre. 
- La valeur du drapeau "interrompu" peut être consultée au 
moyen de la méthode d'instance 
`isInterrupted()`. La valeur du drapeau n'est pas modifiée à 
cette occasion.
- Si la thread interrompue était bloquée par `sleep()`, 
`wait()` ou `join()` (Ces deux dernières 
méthodes concernent la synchronisation des threads et ne sont
pas abordées dans ce TD) : 
    - elle est réveillée,
    - une `InterruptedException` est lancée,
    - son indicateur d'état `interrompu` est mis à faux.

- D'autre part, la méthode statique `interrupted()` retourne 
la valeur du drapeau "interrompu" de la thread courante et 
le remet à faux.		

:::
