# Exercice 2 - Requêtes de selection

Dans cette section vous allez apprendre comment exécuter
des requêtes de selection dans une base de données via JDBC.

Si vous souhaitez sélectionner tous les utilisateurs
de la table USER, vous devez suivre les étapes suivantes :

1. Vous connectez à SQLite :
    - `DriverManager.getConnection(url)`.
1. Créez une instance de la classe `Statement` permettant d'exécuter des requêtes SQL : 
    - `Statement stmt = conn.createStatement()`
1. Exécutez une requête **SELECT** pour récupérer les utilisateurs : 
    - `stmt.executeQuery(sql)`
1. Placez les résultats dans une variable de type `ResultSet` :
    - `ResultSet rs = stmt.executeQuery(sql)`
1. Parcourir les résultats de l'objet `Iterable` via `while (rs.next())`
1. Pour chaque ligne de l'objet `ResultSet` : 
    1. demander de retourner l’entier nommé **id**  : `int id = rs.getInt("id")`;
    1. demander de retourner le String nommé **name**  : `rs.getString("name")`;
    1. demander de retourner l’entier nommé **age**  : `int age = rs.getInt("age")`;    
    1. demander de retourner le String nommé **dateText**  : `rs.getString("created_at")`;
    1. convertir la date en un format utilisable : `LocalDateTime createdAt = LocalDateTime.parse(dateText, formatter);`

Vous pouvez tester le code ci-dessous qui reprend l'ensemble de 
ces instructions.

```java showLineNumbers title="Selection.java"
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Selection {
    public static void main(String[] args) {
        String url = "jdbc:sqlite:external-data/demo.db";

        String sql = "SELECT id, name, age, created_at FROM users";

        try (Connection conn = DriverManager.getConnection(url);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            // Format pour afficher la date si elle est en format texte
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

            System.out.println("Résultats de la requête :");
            while (rs.next()) {
                // Récupération des données avec les bons types
                int id = rs.getInt("id");
                String name = rs.getString("name");
                int age = rs.getInt("age");
                String dateText = rs.getString("created_at");

                // Conversion en LocalDateTime (si stocké en format texte)
                LocalDateTime createdAt = LocalDateTime.parse(dateText, formatter);

                // Affichage des résultats
                System.out.println("ID: " + id + " | Name: " + name + " | Age: " + age + " | Created At: " + createdAt);
            }

        } catch (SQLException e) {
            System.out.println("Erreur : " + e.getMessage());
        }
    }
}
```

:::tip try-with-resources

On peut ouvrir plusieurs ressources dans le même try-with-resources, elles seront fermées dans l’ordre inverse de leur ouverture.

:::

Toutes les informations complémentaires sont disponibles
via la documentation des classes [Statement](https://docs.oracle.com/en/java/javase/23/docs/api/java.sql/java/sql/Statement.html) 
et [ResultSet](https://docs.oracle.com/en/java/javase/23/docs/api/java.sql/java/sql/ResultSet.html).

:::note Exercice A : utilisation d'une WHERE clause

Modifiez la requête de selection pour n'afficher que
les utilisateurs dont le nom commence par la lettre A.

:::


:::note Exercice B : jointure

Modifiez la requête de selection pour afficher
tous les utilisateurs et toutes les commandes associées.
Utilisez une requête avec le mot clé **JOIN** pour réaliser
cet exercice.

:::