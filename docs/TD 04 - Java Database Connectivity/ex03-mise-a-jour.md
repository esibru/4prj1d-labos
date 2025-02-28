# Exercice 3 -  Mise à jour de données

## Requêtes UPDATE

La différence essentielle avec une requête de selection est 
l’utilisation de la méthode
`Statement.executeUpdate()` , au lieu de 
`Statement.executeQuery()`. 
Cette nouvelle méthode permet d’exécuter
des mises à jour au sein d’une table **et** 
**retourne le nombre de records impactés** par cette mise à jour.

```java showLineNumbers
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class Update {
    public static void main(String[] args) {
        String url = "jdbc:sqlite:external-data/demo.db";

        String sql = """
                UPDATE users 
                    SET email = 'alice@student.he2b.be' 
                    WHERE id = 1
                """.stripIndent();

        try (Connection conn = DriverManager.getConnection(url);
             Statement stmt = conn.createStatement()) {

            int rowsUpdated = stmt.executeUpdate(sql);

            System.out.println("Nombre de lignes mises à jour : " 
                    + rowsUpdated);

        } catch (SQLException e) {
            System.out.println("Erreur : " + e.getMessage());
        }
    }
}
```

:::tip Text Blocks ou Chaînes de texte multilignes

Un text block est une chaîne littérale délimitée par trois 
guillemets doubles ("""), ce qui permet de conserver la 
structure d'indentation et les sauts de ligne du texte tel quel,
sans avoir à gérer les caractères d'échappement.

```java
String multilineString = """
        Ligne 1
        Ligne 2
        Ligne 3
        """;
```

Si vous souhaitez supprimer l'indentation dans la chaîne de 
caractères, vous pouvez utiliser la méthode 
`multilineString.stripIndent()`.

:::

## Requêtes INSERT

Pour insérer de nouveaux éléments dans une table, la méthode 
`Statement.executeUpdate()` est à nouveau utilisée. Toutefois, 
lors de l'insertion d'un nouvel utilisateur dans la table **Users**,
la clé primaire de cet utilisateur est générée automatiquement 
par la base de données grâce à l'attribut **AUTOINCREMENT**.

Il est nécessaire de récupérer cette clé générée afin que Java 
puisse retrouver l'utilisateur via une sélection dans la table 
**Users** en utilisant cet identifiant. Cette clé générée est 
conservée dans l'instance Statement utilisée pour la requête 
d'insertion. Pour obtenir la valeur de cette clé, on peut la 
récupérer via la méthode `Statement.getGeneratedKeys()`.

```java showLineNumbers
import java.sql.*;

public class InsertGeneratedKey {
    public static void main(String[] args) {
        String url = "jdbc:sqlite:external-data/demo.db";

        String sql = """
                        INSERT INTO 
                            users (name, age) 
                        VALUES 
                            ('Charlie', 35)
                """.stripIndent();

        try (Connection conn = DriverManager.getConnection(url);
             Statement stmt = conn.createStatement()) {
            
            int rowsInserted = stmt.executeUpdate(sql);
            System.out.println("Nombre de lignes insérées : " 
                    + rowsInserted);

            if (rowsInserted > 0) {
                
                try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                    
                    if (generatedKeys.next()) {
                        int newId = generatedKeys.getInt(1); 
                        System.out.println("Nouvel utilisateur inséré avec l'ID : " 
                                + newId);
                    }
                    
                }
            }
        } catch (SQLException e) {
            System.out.println("Erreur : " + e.getMessage());
        }
    }
}
```

:::warning Nombre de clés générées

La méthode **getGeneratedKeys()** retourne une liste de clés, 
une requête d’insertion pouvant insérer plusieurs éléments en 
une seule fois.

:::

## Requêtes DELETE

La suppression d'une donnée suit le même processus que la mise à
jour d'une donnée. La seule différence réside dans la 
modification de la requête, où l'instruction **DELETE** est 
utilisée à la place de l'instruction de mise à jour. 
En dehors de cela, il n'y a pas de différence notable.

```java showLineNumbers
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class Delete {
    public static void main(String[] args) {
        String url = "jdbc:sqlite:external-data/demo.db";

        String sql = "DELETE FROM users WHERE name = 'Charlie'";
        
        try (Connection conn = DriverManager.getConnection(url);
            Statement stmt = conn.createStatement()) {
            
            int rowsDeleted = stmt.executeUpdate(sql);
            
            System.out.println("Nombre de lignes supprimées : " 
                    + rowsDeleted);
            
        } catch (SQLException e) {
            System.out.println("Erreur : " + e.getMessage());
        }
    }
}
```

:::note Exercice A : Ajout et suppression

Développez un main qui permet de :
1. ajouter une commande dans la table Command
1. afficher le contenu de la table Command
1. supprimer la commande ajoutée de la table Command
1. afficher le contenu de la table Command

Adaptez la requête d'insertion à une table sans clé autogénérée.

:::