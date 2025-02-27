# Exercice 1 - JDBC - Connexion

## try-with-resource



## Dépendance et driver du SGBD

En fonction du SGBD cible, vous devrez dynamiquement 2 charger le driver adapté.
Ce driver est une dépendance de votre projet. Par exemple pour ajouter le driver de
SQLite à un projet maven il suffit d’ajouter la dépendance suivante au pom.xml :

```xml showLineNumbers title="pom.xml"
<dependency>
    <groupId>org.xerial</groupId>
    <artifactId>sqlite-jdbc</artifactId>
    <version>3.46.1.2</version>
</dependency>
```


## Connexion à une base de données embarquée

```java showLineNumbers
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class SQLiteInMemory {
    public static void main(String[] args) {
        String url = "jdbc:sqlite::memory:";

        try (Connection conn = DriverManager.getConnection(url)) {
            if (conn != null) {
                System.out.println("Connexion à SQLite établie !");
            }
        } catch (SQLException e) {
            System.out.println("Erreur de connexion : " + e.getMessage());
        }
    }
}
```

Remarquez le format de l’adresse jdbc:sqlite:data/sqlite::memory:


## Connexion à une base de données persistée dans un fichier

```java showLineNumbers
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class SQLiteConnection {
    public static void main(String[] args) {
        String dbPath = "external-data/demo.db";

        Path path = Paths.get(dbPath);
        if (Files.notExists(path)) {
            System.out.println("Fichier SQLite inexistant : " + path.toAbsolutePath());
            System.exit(-1);
        }

        String url = "jdbc:sqlite:" + dbPath;
        try (Connection conn = DriverManager.getConnection(url)) {
            if (conn != null) {
                System.out.println("Connexion à SQLite établie !");
            }
        } catch (SQLException e) {
            System.out.println("Erreur de connexion : " + e.getMessage());
        }

    }
}
```

Remarquez le format de l’adresse jdbc:sqlite:data/sqlite/external-data/demo.db