# Exercice 9 - Fichier properties

Il est courant d’utiliser un fichier .properties pour stocker les paramètres de connexion (URL, utilisateur, mot de passe) à une base de données en Java. 
Cela permet d'externaliser la configuration et d'éviter de coder en dur les informations sensibles.


```properties showLineNumbers title="database.properties"
db.url=jdbc:sqlite:database.db
db.user=admin
db.password=secret
```

✅ Séparation de la configuration et du code

    Permet de modifier les identifiants sans recompilation du programme.
    Facilite la gestion des environnements (développement, test, production).

✅ Sécurité améliorée

    Évite d’exposer des identifiants dans le code source.
    Peut être exclu du versionnement (.gitignore).

✅ Facilité d'administration

    Un fichier .properties peut être édité par un administrateur système sans modifier le code Java.
    Compatible avec les outils de déploiement (Docker, CI/CD, etc.).

```java showLineNumbers
import java.io.FileInputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

class ConnectionManager {
    private static Properties properties = null;

    private static Connection connection;

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

    static Connection getConnection() {
        if (connection == null) {
            try {
                loadProperties();
                Properties config = loadProperties();
                String url = config.getProperty("db.url");
                String user = config.getProperty("db.user");
                String password = config.getProperty("db.password");
                connection = DriverManager.getConnection(url, user, password);
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

Créez une base de données SqLite protégée par un user et
un password. 

Ajoutez le fichier database.properties aux ressources
de votre projet avec les valeurs utilisées pour se connecter à la base de données
SqLite créé à l'étape précédente.

Modifiez la classe ConnectionManager pour utiliser les valeurs
de ce fichier properties pour se connecter et testez que votre
application puisse se connecter à la base de données SqLite.

:::