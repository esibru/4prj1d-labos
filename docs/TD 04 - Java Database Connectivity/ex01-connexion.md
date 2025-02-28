# Exercice 1 - Établir une connexion

Dans cette première section, vous allez explorer les bases de la 
connexion à une base de données SQLite en utilisant JDBC. 
Vous apprendrez comment configurer et utiliser le driver du 
SGBD, manipuler la classe DriverManager, et établir une connexion avec une base SQLite, aussi bien sur disque qu'en 
mémoire.

## Driver du SGBD

Selon le SGBD cible, il est nécessaire de charger dynamiquement 
le driver approprié. Ce driver est une dépendance de votre 
projet. Pour intégrer le driver SQLite dans un projet Maven, il 
suffit d'ajouter la dépendance suivante au fichier pom.xml :

```xml showLineNumbers title="pom.xml"
<dependency>
    <groupId>org.xerial</groupId>
    <artifactId>sqlite-jdbc</artifactId>
    <version>3.46.1.2</version>
</dependency>
```

Si vous utilisez PostgreSQL comme SGBD, vous devez ajouter
la dépendance suivante au pom.xml : 

```xml showLineNumbers title="pom.xml"
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.7.5</version>
</dependency>

```

:::info

Votre **code java** est écrit **indépendamment** du choix du **SGDB** et c’est durant l’exécution du programme,
lors de la connexion à la base de données, que le SGDB cible est annoncé.

:::

## La classe DriverManager

En Java, [la classe DriverManager](https://docs.oracle.com/en/java/javase/23/docs/api/java.sql/java/sql/DriverManager.html) 
est utilisée pour établir une 
connexion à une base de données.

```java
Connection conn = DriverManager.getConnection(url, user, password);
```

- `conn` est un objet de type `Connection`, qui représente la connexion active à la base de données.
- `DriverManager.getConnection()` établit la connexion en fonction des paramètres fournis.
- `url` est l’URL de la base de données (ex. : "jdbc:sqlite:database.db" pour SQLite).
- `user` et `password` sont les identifiants de connexion (facultatifs pour SQLite).


:::info Format d'une url JDBC

```java
jdbc:[SGBD]://[hôte]:[port]/[base_de_données]?paramètres
```

- **jdbc:** : Préfixe obligatoire indiquant l'utilisation de JDBC.
- **[SGBD]** : Indique le type de base de données (ex. : sqlite, mysql, postgresql).
- **//[hôte]:[port]** : Adresse du serveur de la base de données (non nécessaire pour SQLite).
- **/[base_de_données]** : Nom de la base de données (ou chemin du fichier pour SQLite).
- **?paramètres** : Options supplémentaires (ex. : encodage, mode SSL, etc.).

:::

## Connexion à une base de données SqLite

Pour se connecter à une base de données SqLite le format
de l'url est : 

```java
jdbc:sqlite:external-data/demo.db
```
Cette url ne possède ni hôte ni port car SQLite est un fichier 
local, `demo.db` dans cet exemple. Ce fichier est dans le
dossier `external-data`.

:::note Exercice A : Création de la bse de données

Créez la base de données **demo.db** dans le dossier **external-data**
avec l'aide des outils SqLite (commande *sqlite3* ou *Db browser for SqLite*).

Créez dans cette base de données la table USER.

```sql
CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)
```

Alimentez cette table avec les données suivantes.

```sql
INSERT INTO users (name) VALUES ('Charlie'), ('David')
```

:::

:::note Exercice B : Connexion à demo.db

Testez le code de connexion suivant : 

```java showLineNumbers
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

Si vous le souhaitez, avant la connexion vous pouvez
vérifier si le fichier est accessible via : 

```java showLineNumbers
Path path = Paths.get("external-data/demo.db");
if (Files.notExists(path)) {
    System.out.println("Fichier SQLite inexistant : " + path.toAbsolutePath());
    System.exit(-1);
}
```

SqLite créera un fichier demo.db vide si il n'existe pas.

:::


:::info try-with-resources

Lorsque vous travaillez avec des ressources comme des fichiers, 
des connexions réseau ou des bases de données, il est crucial de 
libérer ces ressources après utilisation pour éviter des fuites 
de ressources (ex. : fichiers bloqués, mémoire non libérée).

Le **try-with-resources** simplifie la gestion des ressources en 
fermant automatiquement les objets implémentant l'interface 
**AutoCloseable**.

```java
try (RessourceType nomDeLaRessource = new RessourceType(...)) {
    // Code utilisant la ressource
} catch (ExceptionType e) {
    // Gestion des exceptions
}

```

- `(RessourceType nomDeLaRessource = new RessourceType(...))`
    - La ressource est créée dans les parenthèses du try.
    - Elle doit implémenter l’interface `AutoCloseable` ou `Closeable`.
    - La fermeture automatique de la ressource est effectuée dès la sortie du bloc try.
- On utilise la ressource normalement à l’intérieur du try.
- `catch (ExceptionType e) { /* Code */ }`
    - Permet de gérer les erreurs qui peuvent survenir dans le try.

:::

## Connexion à une base de données SqLite en mémoire


SQLite permet d'utiliser une base de données en mémoire qui 
n'est pas sauvegardée sur le disque et disparaît lorsque la 
connexion est fermée.

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

Chaque nouvelle connexion crée une base vide. Si vous ouvrez une 
nouvelle connexion avec 
`DriverManager.getConnection ("jdbc:sqlite::memory:")`
, vous ne retrouverez pas les données de connexion la précédente.

Cette connexion en mémoire vous sera par exemple utile pour 
réaliser des tests unitaires.