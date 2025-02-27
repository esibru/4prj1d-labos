# Exercice 3 -  Requêtes de mise à jour

## update

```java showLineNumbers
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class Update {
    public static void main(String[] args) {
        String url = "jdbc:sqlite::memory:";

        String sql = "UPDATE users SET age = 28 WHERE name = 'Alice'";

        try (Connection conn = DriverManager.getConnection(url);
             Statement stmt = conn.createStatement()) {
            int rowsUpdated = stmt.executeUpdate(sql);
            System.out.println("Nombre de lignes mises à jour : " + rowsUpdated);
        } catch (SQLException e) {
            System.out.println("Erreur : " + e.getMessage());
        }
    }
}
```

### insert

```java showLineNumbers
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class Insert {
    public static void main(String[] args) {
        String url = "jdbc:sqlite::memory:";

        String sql = "INSERT INTO users (name, age) VALUES ('Charlie', 35)";

        try (Connection conn = DriverManager.getConnection(url);
             Statement stmt = conn.createStatement()) {
            int rowsInserted = stmt.executeUpdate(sql);
            System.out.println("Nombre de lignes insérées : " + rowsInserted);
        } catch (SQLException e) {
            System.out.println("Erreur : " + e.getMessage());
        }
    }
}
```

### Récupération d'une clé auto-générée

```java showLineNumbers
import java.sql.*;

public class InsertGeneratedKey {
    public static void main(String[] args) {
        String url = "jdbc:sqlite::memory:";

        String sql = "INSERT INTO users (name, age) VALUES ('Charlie', 35)";

        try (Connection conn = DriverManager.getConnection(url);
             Statement stmt = conn.createStatement()) {
            int rowsInserted = stmt.executeUpdate(sql);
            System.out.println("Nombre de lignes insérées : " + rowsInserted);

            if (rowsInserted > 0) {
                // Récupérer l'ID généré
                try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        int newId = generatedKeys.getInt(1); // Récupérer l'ID généré
                        System.out.println("Nouvel utilisateur inséré avec l'ID : " + newId);
                    }
                }
            }
        } catch (SQLException e) {
            System.out.println("Erreur : " + e.getMessage());
        }
    }
}
```


### delete

```java showLineNumbers
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class Delete {
    public static void main(String[] args) {
        String url = "jdbc:sqlite::memory:";

        String sql = "DELETE FROM users WHERE name = 'Charlie'";
        try (Connection conn = DriverManager.getConnection(url);
             Statement stmt = conn.createStatement()) {
            int rowsDeleted = stmt.executeUpdate(sql);
            System.out.println("Nombre de lignes supprimées : " + rowsDeleted);
        } catch (SQLException e) {
            System.out.println("Erreur : " + e.getMessage());
        }
    }
}
```