# Exercice 3 - Démon

Créez la classe `DaemondThread` qui hérite de la classe `Thread`,
analysez la et exécutez la.

```java showLineNumbers title="DaemonThread.java"
/**
 * Exemple de thread demon ou utilisateur
 */
public class DaemonThread extends Thread {

    public void run() {
        for (int n = 0; n < 42; ++n) {
            System.out.println("DaemonThread: run " + n);
            try {
                sleep(420);
            } catch (InterruptedException e) {
                System.out.println("DaemonThread thread: exception " + e);
            }
        }
    }

    public static void main(String[] args) {
        DaemonThread d;
        d = new DaemonThread();
        d.setDaemon(true);
        d.start();
        try {
            System.out.println("DaemonThread main: i do nothing during a while");
            sleep(7110);
            // d.join();
        } catch (InterruptedException e) {
            System.out.println("DaemonThread: exception " + e);
        }
    }
}
```

:::note Exercice A

Répondez aux questions suivantes concernant la classe `DaemonThread`.

- Quel comportement observez-vous ?
- Que se passe-t-il si vous changez l'appel de la méthode `sleep(7110)` par `sleep(0)` ?
- Décommentez l'instruction `d.join()`, que se passe-t-il ?

:::

:::info

- Il existe deux catégories de threads: les threads utilisateurs 
(comme le `main` et toutes les threads rencontrées jusqu'ici) 
et les démons (`dæmons`).
- Lorsque les seules threads en exécution sont des démons, elles 
sont brutalement arrêtées (attention: à n'importe quel moment de 
leur `run` !) et l'application prend fin. Les threads 
utilisateurs 
perdurent quant à elles jusqu'à la sortie de leur `run`.
- Le type d'une thread est, par défaut, celui de la thread qui 
l'a créée. Avant l'exécution de la méthode `start` d'une
thread, sa méthode `setDaemon(boolean)` permet de fixer 
sa catégorie.
- Il est possible de demander à une thread d'attendre la fin d'une autre thread. C'est la méthode `join` qui s'en charge. 	

:::

## Avantages et inconvénients du multithreading

Au même titre que la programmation récursive, le multithreading 
est un style de programmation qui s'avère très efficace 
algorithmiquement lorsqu'il est utilisé judicieusement. Il permet,
par exemple, d'améliorer les performances d'un programme en 
limitant les blocages dus aux traitements longs. Les tâches 
spécifiques peuvent être séparées et s'exécuter chacune dans 
un fil (affichage de l'interface graphique, impression, téléchargement, 
etc.). 

Il s'agit cependant d'user de cette technique avec précaution. 
Un nombre trop important de *threads* risque en effet de dégrader 
les performances en demandant beaucoup de traitements au 
processeur. Les données étant partagées par toutes les threads 
d'un *process*, il faut veiller à préserver leur cohérence en 
"synchronisant"\fg\" leurs accès par les fils d'exécutions 
concurrents. 
Le débogage ne sort pas indemne de la programmation 
multi-fils, l'ordre d'exécution des différentes threads n'étant pas 
contrôlé absolument.