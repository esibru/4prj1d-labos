# Exercice 02 - Le contrôleur

Pour ajoutez de l'interactivité à votre application, il faut lier du code
java à la vue FXML. Suivez les prochaines étapes de cet
exercice et créez le contrôleur Java de votre vue pour comprendre comment
associer du code Java à un fichier FXML.

## Création du contrôleur

Créez le contrôleur de `hello.fxml` dans le package `be.esi.prj`.

```java showLineNumbers title="HelloController.java"
// highlight-next-line
package be.esi.prj;

public class HelloController {

    public HelloController() {
        System.out.println("\tFXCONTROLLER | CONSTRUCTEUR");
    }
}
```

Associez ensuite le contrôleur au fichier FXML en modifiant le nœud racine :

```xml showLineNumbers title="hello.fxml"
<VBox alignment="CENTER" spacing="20.0"
      xmlns:fx="http://javafx.com/fxml"
      // highlight-next-line
      fx:controller="be.esi.prj.HelloController">
```

Puis associez le libellé de l'interface au contrôleur en ajoutant
l'attribut `welcomeText` à `HelloController`.

```java showLineNumbers title="HelloController.java"
package be.esi.prj;

import javafx.fxml.FXML;
import javafx.scene.control.Label;

public class HelloController {
    // highlight-next-line
    @FXML private Label welcomeText;

    public HelloController() {
        System.out.println("\tFXCONTROLLER | CONSTRUCTEUR");
    }
}
```

N'oubliez pas d'ajouter un identifiant portant le même nom que l'attribut
au libellé dans le fichier FXML.

```xml showLineNumbers
<VBox alignment="CENTER" spacing="20.0"
      xmlns:fx="http://javafx.com/fxml"
      fx:controller="be.esi.prj.HelloController">
    <padding>
        <Insets bottom="20.0" left="20.0" right="20.0" top="20.0"/>
    </padding>
    // highlight-next-line
    <Label fx:id="welcomeText"/>
    <Button text="Hello!"/>
</VBox>
```

:::note Exercice b

Écrivez sur une feuille l'ordre dans lequel sont exécutées les méthodes : 

1. `Parent root = fxmlLoader.load();`
1. `Scene scene = new Scene(root, 640, 800);`
1. `launch(args);`
1. `HelloController()`

Utilisez le debugger ou ajoutez des messages dans le terminal
via `System.out.println()` en cas de doute.

Quelle est la valeur de `welcomeText` lorsque le constructeur
de `HelloController` est terminé ?

:::

## Initialisation des attributs du contrôleur

La méthode `initialize()` d'un contrôleur FXML est une méthode appelée automatiquement 
après le chargement du fichier FXML et l'injection des composants définis dans celui-ci.
Elle est utilisée pour initialiser les composants et définir les comportements avant 
l'affichage de l'interface graphique. Elle ne prend **aucun paramètre** et **ne retourne aucune valeur**.

Ajoutez la méthode `initialize()` au contrôleur pour en comprendre l'utilité : 

```java showLineNumbers title="HelloController.java"
public void initialize() {
    System.out.println("\tFXCONTROLLER | INITIALIZE");
    welcomeText.setText("Hello World!");
}
```

:::note Exercice b

Écrivez sur une feuille l'ordre dans lequel sont exécutées les méthodes : 

1. `Parent root = fxmlLoader.load();`
1. `Scene scene = new Scene(root, 640, 800);`
1. `launch(args);`
1. `HelloController()`
1. `initialize()`

Quelle est la valeur de `welcomeText` lorsque la méthode 
`initialize()` est terminée ?

:::

## Appeler une méthode du contrôleur

Si vous souhaitez appeler une méthode du contrôleur à partir du `main`,
il faut récupérer la référence du contrôleur à partir du `FxmlLoader`.
Pour découvrir comment procéder, ajoutez la méthode suivante au contrôleur : 

```java showLineNumbers title="HelloController.java"
public void setMessage(String message) {
    welcomeText.setText(message);
}
```

Modifiez la méthode `start()` de l'application pour
appeler cette nouvelle méthode du contrôleur : 

```java showLineNumbers title="Main.java"
@Override
public void start(Stage stage) throws IOException {
    URL resource = Main.class.getResource("hello.fxml");
    FXMLLoader fxmlLoader = new FXMLLoader(resource);
    Parent root = fxmlLoader.load();
    // highlight-start
    HelloController helloController = fxmlLoader.getController();
    helloController.setMessage("Main send a message");
    // highlight-end
    Scene scene = new Scene(root, 640, 800);
    stage.setTitle("Hello!");
    stage.setScene(scene);
    stage.show();
}
```

## Supprimer fx:controller

L'association du contrôleur avec un fichier FXML peut être
effectué dynamiquement, autrement dit via une instruction java.

Testez cette mécanique en enlevant `fx:controller="be.esi.prj.HelloController"` 
du fichier FXML. 
Ensuite modifiez la méthode `start()` de l'application pour
créer le lien via la méthode `setController` : 

```java showLineNumbers
@Override
public void start(Stage stage) throws IOException {
    URL resource = Main.class.getResource("hello.fxml");
    FXMLLoader fxmlLoader = new FXMLLoader(resource);
    // highlight-start
    HelloController helloController = new HelloController();
    fxmlLoader.setController(helloController);
    // highlight-end
    Parent root = fxmlLoader.load();
    Scene scene = new Scene(root, 640, 800);
    stage.setTitle("Hello!");
    stage.setScene(scene);
    stage.show();
}
```

## Gestion des événements

Pour terminer la revue des possibilités d'interactions entre
le contrôleur et le fichier FXML, ajoutez un identifiant au bouton 
dans le fichier FXML.

```xml showLineNumbers title="hello.fxml"
    <Button fx:id="helloButton" text="Hello!"/>
```

Modifiez ensuite le contrôleur pour :  
- Ajouter l'attribut représentant le bouton.
- Mettre à jour la `méthode initialize()` pour initialiser 
la gestion des événements associée au bouton.
- Ajouter la méthode `onHelloButtonClick()` effectuant l'action.


```java showLineNumbers title="HelloController.java"
package be.esi.prj;

import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.Label;

public class HelloController {

    @FXML private Label welcomeText;
    // highlight-next-line
    @FXML private Button helloButton;

    public HelloController() {
        System.out.println("\tFXCONTROLLER | CONSTRUCTEUR");
    }

    public void initialize() {
        System.out.println("\tFXCONTROLLER | INITIALIZE");
        welcomeText.setText("Hello World!");
        // highlight-next-line
        helloButton.setOnAction(event -> {onHelloButtonClick();});
    }

    public void setMessage(String message) {
        welcomeText.setText(message);
    }
    // highlight-start
    protected void onHelloButtonClick() {
        welcomeText.setText("Welcome to JavaFX Application!");
    }
    // highlight-end
}
```




