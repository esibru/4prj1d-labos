# Exercice 1 - Établir une connexion

Dans cette première section, vous allez explorer les classes 
permettant d'établir une connexion à une base de données SQLite en utilisant JDBC. 

**Java Database Connectivity** (JDBC) est une API permettant 
d’interagir avec des sources de données en exécutant des 
requêtes SQL. Elle offre l’avantage d’écrire un code indépendant 
du SGBD utilisé.
JDBC repose principalement sur des interfaces, qui sont 
implémentées différemment selon le SGBD auquel vous 
souhaitez accéder. 
Pour exécuter un programme utilisant JDBC, il est indispensable 
de disposer du driver JDBC correspondant au système de gestion 
de base de données cible.

## Driver du SGBD

Un Driver JDBC est un composant logiciel qui permet à une 
application Java de se connecter à une base de données 
spécifique. 
Il agit comme un intermédiaire entre l’API JDBC et le SGBD.
Chaque SGBD (MySQL, PostgreSQL, SQLite, Oracle,...) possède son 
propre driver JDBC, qui traduit les commandes Java en 
instructions compréhensibles par la base de données.

Selon le SGBD cible, il est nécessaire de charger 
**dynamiquement** le driver approprié. 
Ce driver est une dépendance de votre projet. 
Pour intégrer le driver SQLite dans un projet Maven, il 
suffit d'ajouter la dépendance suivante au fichier pom.xml :

```xml showLineNumbers title="pom.xml"
<dependency>
    <groupId>org.xerial</groupId>
    <artifactId>sqlite-jdbc</artifactId>
    <version>3.46.1.2</version>
</dependency>
```

:::info SQLite

SQLite est une bibliothèque écrite en langage C qui propose un moteur de base
de données relationnelle accessible par le langage SQL. L’intégralité de la base
de données (déclarations, tables, index et données) est stockée dans un fichier
indépendant de la plateforme.

Vous trouverez toutes les informations concernant SQLite sur le site [https://www.sqlite.org/index.html](https://www.sqlite.org/index.html).
On peut utiliser SQLite en mode console via l’installation de sqlite3 dont la 
documentation est accessible via ce lien [https://www.sqlite.org/cli.html](https://www.sqlite.org/cli.html).

On peut également utiliser l’outil DB Browser for SQLite qui propose une interface
plus "accessible". Installé à l’adresse : `C:\Program Files\DB Browser for SQLite` sur
les machines de l’école, vous pouvez le télécharger via [https://sqlitebrowser.org/](https://sqlitebrowser.org/).

:::


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
- `user` et `password` sont les identifiants de connexion, facultatifs pour SQLite.

:::info Format d'une url JDBC

```java
jdbc:[SGBD]://[hôte]:[port]/[base_de_données]?paramètres
```

- **jdbc:** : Préfixe obligatoire indiquant l'utilisation de JDBC.
- **[SGBD]** : Indique le type de base de données (ex. : sqlite, mysql, postgresql).
- **//[hôte]:[port]** : Adresse du serveur de la base de données, inutile pour SQLite.
- **/[base_de_données]** : Nom de la base de données ou chemin du fichier pour SQLite.
- **?paramètres** : Options supplémentaires (encodage, mode SSL,...).

:::

## Connexion à une base de données SQLite

Pour se connecter à une base de données SQLite le format
de l'url est : 

```java
jdbc:sqlite:external-data/demo.db
```
Cette url ne possède ni hôte ni port car SQLite est un fichier 
local, `demo.db` qui se trouve dans cet exemple dans le
dossier `external-data`.

:::note Exercice A : Création de la base de données

Créez la base de données **demo.db** dans le dossier **external-data**
avec l'aide des outils SQLite (commande *sqlite3* ou *Db browser for SQLite*).

Créez dans cette base de données la table USER.

```sql showLineNumbers
CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Clé primaire auto-incrémentée
    name TEXT NOT NULL,                    -- Nom de l'utilisateur (Texte)
    birth_date TEXT NOT NULL,              -- Date de naissance (Stockée en texte YYYY-MM-DD)
    height REAL,                           -- Taille en mètres (Nombre réel)
    is_active INTEGER NOT NULL DEFAULT 1   -- Actif (Boolean stocké en INTEGER : 0 = false, 1 = true)
);
```

Alimentez cette table avec les données suivantes.

```sql showLineNumbers
INSERT INTO Users (name, birth_date, height, is_active) VALUES 
('Alice', '1995-06-15', 1.68, 1),
('Bob', '1988-09-23', 1.82, 0),
('Charlie', '2000-12-05', 1.75, 1),
('Diana', '1992-03-11', 1.60, 1);
```

:::

:::warning Comment SQLite stocke les dates ?

SQLite n’a pas de type de données natif pour les dates et 
heures. Les dates peuvent être stockées sous trois formats 
possibles :

- Texte (format YYYY-MM-DD HH:MM:SS) : Couramment utilisé.
- Nombre entier (INTEGER) : Timestamp UNIX (secondes depuis 1970).
- Nombre réel (REAL) : Timestamp en jours julien.

:::

:::note Exercice B : Connexion à demo.db

Testez le code de connexion suivant : 

```java showLineNumbers title="SQLiteConnection.java"
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class SQLiteConnection {
    public static void main(String[] args) {
        String dbPath = "external-data/demo.db";

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

Remarquez que SqLite crée un fichier demo.db vide si il n'existe pas.

Si vous le souhaitez, avant la connexion, vous pouvez
vérifier si le fichier est accessible via : 

```java showLineNumbers
Path path = Paths.get(dbPath);
if (Files.notExists(path)) {
    System.out.println("Fichier SQLite inexistant : " + path.toAbsolutePath());
    System.exit(-1);
}
```

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
    - Elle doit implémenter l’interface `AutoCloseable`.
    - La fermeture automatique de la ressource est effectuée dès la sortie du bloc try.
- `catch (ExceptionType e) { /* Code */ }`
    - Permet de gérer les erreurs qui peuvent survenir dans le try.

:::

## Connexion à une base de données SQLite en mémoire


SQLite permet d'utiliser une base de données en mémoire qui 
n'est pas sauvegardée sur le disque et disparaît lorsque la 
connexion est fermée.

```java showLineNumbers title="SQLiteInMemory.java"

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

Chaque nouvelle connexion crée une base de données vide. 
Si vous ouvrez une nouvelle connexion avec 
`DriverManager.getConnection ("jdbc:sqlite::memory:")`
, vous ne retrouverez pas les données de connexion de la 
connexion précédente.

Cette connexion en mémoire vous sera par exemple utile pour 
réaliser des tests unitaires.