# Exercice 4 -  Requêtes préparées

## Injection sql

```java showLineNumbers
import java.sql.*;
import java.util.Scanner;

public class SQLInjectionExample {
    public static void main(String[] args) {
        String url = "jdbc:sqlite:database.db";
        Scanner scanner = new Scanner(System.in);

        System.out.print("Entrez un nom d'utilisateur : ");
        String userInput = scanner.nextLine();

//        userInput = "' OR 1=1 --";
//        userInput = "'; DROP TABLE users; --";

        String sql = "SELECT * FROM users WHERE name = '" + userInput + "'"; 

        try (Connection conn = DriverManager.getConnection(url);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                System.out.println("ID: " + rs.getInt("id") + ", Name: " + rs.getString("name") + ", Age: " + rs.getInt("age"));
            }

        } catch (SQLException e) {
            System.out.println("Erreur : " + e.getMessage());
        }
    }
}
```

## preparestatement

```java showLineNumbers
import java.sql.*;
import java.util.Scanner;

public class SecureQueryExample {
    public static void main(String[] args) {
        String url = "jdbc:sqlite:database.db"; 
        Scanner scanner = new Scanner(System.in);

        System.out.print("Entrez un nom d'utilisateur : ");
        String userInput = scanner.nextLine();

        String sql = "SELECT * FROM users WHERE name = ?"; 

        try (Connection conn = DriverManager.getConnection(url);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, userInput); 

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    System.out.println("ID: " + rs.getInt("id") + ", Name: " + rs.getString("name") + ", Age: " + rs.getInt("age"));
                }
            }
        } catch (SQLException e) {
            System.out.println("Erreur : " + e.getMessage());
        }
    }
}
```