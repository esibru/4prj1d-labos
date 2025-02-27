# Exercice 2 - Requêtes de selection


## Selection de tous les élements d'une table 

```java showLineNumbers
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Selection {
    public static void main(String[] args) {
        String url = "jdbc:sqlite::memory:";

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


## Utilisation d'une where clause


```java showLineNumbers
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Selection {
    public static void main(String[] args) {
        String url = "jdbc:sqlite::memory:";

        String sql = "SELECT id, name, age, created_at FROM users WHERE age > 18";

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

## Utilisation d'une jointure

```java showLineNumbers
import java.sql.*;

public class SelectWithJoin {
    public static void main(String[] args) {
        String url = "jdbc:sqlite:database.db";

        String sql = "SELECT users.name, orders.product " +
                "FROM users " +
                "INNER JOIN orders ON users.id = orders.user_id"; 

        try (Connection conn = DriverManager.getConnection(url);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            System.out.println("Commandes des utilisateurs :");
            while (rs.next()) {
                String userName = rs.getString("name");
                String product = rs.getString("product");
                System.out.println(userName + " a commandé : " + product);
            }

        } catch (SQLException e) {
            System.out.println("Erreur : " + e.getMessage());
        }
    }
}
```