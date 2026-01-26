# Exercice 6 - JavaFX

En JavaFX, toutes les mises à jour de l'interface graphique doivent être 
effectuées sur la **JavaFX Application Thread**. Lorsqu’une thread 
secondaire tente de modifier l’interface utilisateur directement, une 
exception de type ``IllegalStateException`` est levée avec le message :
**Not on FX application thread; currentThread = Thread-XX**.

Cet exercice vise à illustrer ce problème en exécutant un traitement en
arrière-plan qui tente de modifier l’interface utilisateur 
sans utiliser les bonnes pratiques. 
Ensuite, nous corrigerons cette erreur en utilisant la méthode `Platform.runLater()`.

## Création de l'exemple

Créez une application JavaFX avec la classe `Application` suivante : 

```java showLineNumbers title="DemoThreadJavaFX.java"

import javafx.application.Application;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

import java.io.IOException;

public class DemoThreadJavaFX extends Application {
    @Override
    public void start(Stage stage) {
        Label label = new Label("Cliquez sur le bouton pour démarrer le traitement.");
        Button button = new Button("Démarrer la thread");

        button.setOnAction(event -> {
            label.setText("Traitement terminé !");
        });

        VBox root = new VBox(label, button);
        root.setAlignment(Pos.CENTER);
        root.setSpacing(20);
        Scene scene = new Scene(root, 400, 300);

        stage.setTitle("Lanceur de thread");
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch();
    }
}
```

Testez cette application et vérifiez qu'une pression 
sur le bouton modifie le texte du libellé affiché.

:::note Exercice A

Affichez dans le terminal le nom et le statut des threads grâce à la méthode `Thread.getAllStackTraces()`.  
Vérifiez la présence de *JavaFX Application Thread* dans cette liste.

:::

## Ajout d'un traitement via une thread

Modifiez l'action associée au bouton pour que l'application
ait le comportement suivant : 

1. L'application affiche un bouton et un libellé.
1. Lorsque l’utilisateur clique sur le bouton, une thread secondaire est lancée pour simuler un traitement.
1. Cette thread tente de mettre à jour le libellé directement depuis la thread secondaire.

```java showLineNumbers title="Action associée au bouton"
button.setOnAction(event -> {
    Thread.startVirtualThread(() -> {
        try {
            System.out.println("Début du traitement de 2 secondes");
            Thread.sleep(2000);
            label.setText("Traitement terminé !");
            System.out.println("Fin du traitement de 2 secondes");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    });
})
```

Lorsque vous testez l'application, si vous appuyez sur le bouton, une
`IllegalStateException` est levée, car JavaFX interdit la modification de 
l'interface utilisateur en dehors du *JavaFX Application Thread*.

## Une solution avec la méthode Platform.runLater()

Une solution est de demander au *JavaFX Application Thread* 
d'effectuer la mise à jour du libellé, c'est à dire de prendre
en charge l'instruction `label.setText("Traitement terminé !");`. 

C'est le rôle de la méthode `Platform.runLater(Runnable runnable)`
qui permet d’exécuter une tâche (`Runnable`) sur ce *JavaFX Application Thread*, même si elle est appelée depuis une thread secondaire.

Pour vous en convaincre, modifiez l'instruction de mise à jour
du libellé via le code ci-dessous.

```java showLineNumbers=6"
Platform.runLater(()-> label.setText("Traitement terminé !"));
```

Testez l'application et vérifiez que l'exception n'est plus
envoyée.

:::info La classe Task

Si la tâche est longue et complexe, il est préférable d’utiliser 
`Task<Void>` qui offre des fonctionnalités avancées 
(comme `updateMessage()`  et `updateProgress()` ) pour mettre à 
jour l’interface utilisateur. 

[Consultez la documentation.](https://openjfx.io/javadoc/23/javafx.graphics/javafx/concurrent/Task.html)

:::