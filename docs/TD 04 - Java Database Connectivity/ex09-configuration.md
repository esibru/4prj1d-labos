# Exercice 9 - Fichier properties

Il est courant d’utiliser un fichier `.properties` pour stocker 
les paramètres de connexion (URL, utilisateur, mot de passe) à 
une base de données en Java. 
Cela permet d'externaliser la configuration et d'éviter de coder
en dur les informations sensibles.
Un fichier `.properties` peut être édité par un administrateur 
système sans modifier le code Java.

Ce fichier présent dans les **ressources du projet** peut 
prendre la forme suivante

```properties showLineNumbers title="database.properties"
db.url=jdbc:sqlite:externat-data/demo.db
db.user=admin
db.password=secret
```

Si vous souhaitez utiliser ce fichier de configuration au sein 
de votre projet, grâce à l'implémentation du pattern Repository, 
et a son respect du principe SOLID, seule la classe 
`ConnectionManager` doit être modifiée.

Comme Java dispose d'une classe spécifique pour gérer les 
fichiers properties, la modification n'est pas très complexe
à mettre en place.

```java showLineNumbers title="ConnectionManager.java"
import java.io.FileInputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

class ConnectionManager {
    // highlight-next-line
    private static Properties properties = null;

    private static Connection connection;

    // highlight-start
    private static Properties loadProperties() {
        if (properties == null) {
            properties = new Properties();
            try (FileInputStream input = new FileInputStream("database.properties")) {
                properties.load(input);
            } catch (IOException e) {
                throw new RepositoryException("Properties illisible", e);
            }
        }
        return properties;
    }
    // highlight-end

    static Connection getConnection() {
        if (connection == null) {
            try {
                // highlight-start
                loadProperties();
                Properties config = loadProperties();
                String url = config.getProperty("db.url");
                String user = config.getProperty("db.user");
                String password = config.getProperty("db.password");
                connection = DriverManager.getConnection(url, user, password);
                // highlight-end
            } catch (SQLException ex) {
                throw new RepositoryException("Connexion impossible", ex);
            }
        }
        return connection;
    }

    static void close() {
        try {
            if (connection != null && !connection.isClosed()) {
                connection.close();
            }
        } catch (SQLException ex) {
            throw new RepositoryException("Fermeture impossible", ex);
        }
    }
}
```

:::note Exercice A : Configuration

Ajoutez le fichier `database.properties` aux ressources
de votre projet avec les valeurs utilisées pour se connecter à 
votre base de données SQLite. Si aucun utilisateur et aucun mot
de passe n'est défini laissé ces champs vides.

Modifiez la classe `ConnectionManager` pour utiliser les valeurs
de ce fichier properties pour se connecter et testez que votre
application puisse se connecter à la base de données SQLite.

:::