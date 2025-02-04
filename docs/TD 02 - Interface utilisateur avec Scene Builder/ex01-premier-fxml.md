# Exercice 01 - Premier FXML

## Modification un fichier FXML

Créez un **projet Java** à l'aide d'IntelliJ intitulé
`HelloApplication` dont le groupID est `be.esi.prj`.

:::warning

Attention dans ce premier exercice ne créez pas un projet JavaFX 
via les Generators de l'écran de création de IntelliJ.
L'objectif est de comprendre comment sont chargés les fichiers
sans utiliser le code proposé par IntelliJ.

:::

Ajoutez les **dépendances** à votre projet concernant JavaFX 
et les fichiers FXML.

```xml title='pom.xml' showLineNumbers
<dependencies>
    <dependency>
        <groupId>org.openjfx</groupId>
        <artifactId>javafx-controls</artifactId>
        <version>17.0.12</version>
    </dependency>
    <dependency>
        <groupId>org.openjfx</groupId>
        <artifactId>javafx-fxml</artifactId>
        <version>17.0.12</version>
    </dependency>
</dependencies>
```

Ensuite dans le dossier `src/main/resources` créez le fichier :

```xml title='hello.fxml' showLineNumbers
<?xml version="1.0" encoding="UTF-8"?>

<?import javafx.geometry.Insets?>
<?import javafx.scene.control.Label?>
<?import javafx.scene.layout.VBox?>

<?import javafx.scene.control.Button?>
<VBox alignment="CENTER" spacing="20.0" 
        xmlns:fx="http://javafx.com/fxml" 
        >
    <padding>
        <Insets bottom="20.0" left="20.0" right="20.0" top="20.0"/>
    </padding>

    <Label />
    <Button text="Hello!" />
</VBox>
```

:::note Exercice a

Ouvrez le fichier `hello.fxml` dans Scene Builder et modifiez :
- La valeur du texte affiché par le libellé en "Hello World".
- La taille de la police du libellé en 14.
- La couleur de la police du libellé en rouge.

:::

Ajoutez le fichier `modules-info.java`

```java showLineNumbers title="modules-info.java"
module be.esi.prj {
    requires javafx.controls;
    requires javafx.fxml;

    opens be.esi.prj to javafx.fxml;
    exports be.esi.prj;
}
```

:::note

Le fichier `module-info.java` est utilisé dans les projets Java
pour définir les dépendances et les accès aux packages. 
Par exemple `opens be.esi.prj to javafx.fxml;` permet au module 
`javafx.fxml` d'accéder aux classes du package `be.esi.prj`.
Le contenu des fichiers `modules-info.java` sera détaillé
dans un futur TD.

:::

## Chargement d'un fichier FXML

Modifiez le `main` de votre application `HelloApplication`
avec le code qui charge le fichier fxml.

```java showLineNumbers title="Main.java"
package be.esi.prj;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.io.IOException;
import java.net.URL;

public class Main extends Application {
    @Override
    public void start(Stage stage) throws IOException {
        URL resource = Main.class.getResource("/hello.fxml");
        FXMLLoader fxmlLoader = new FXMLLoader(resource);
        Parent root = fxmlLoader.load();
        Scene scene = new Scene(root, 640, 800);
        stage.setTitle("Hello!");
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch();
    }
}
```

:::note Exercice b

1. Vérifiez en executant l'application que le fichier `hello.fxml` est chargé.
1. Affichez le `classpath` dans le terminal via la
propriété système `java.class.path`.
1. Affichez via la classe `Files` la liste des fichiers présents
dans le dossier resources. 
1. Vérifiez que `hello.fxml` est présent dans cette liste.
1. Si vous changez l'instruction qui instancie l'url en 
`URL resource = Main.class.getResource("hello.fxml");`
où devez-vous déplacer le fichier `hello.fxml` ?
:::