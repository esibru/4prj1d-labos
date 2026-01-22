# Exercice 4 -  Requêtes préparées

L’injection SQL est une faille de sécurité qui permet à un 
utilisateur malveillant d’altérer une requête SQL en manipulant 
les données saisies. 

Dans cette section, vous allez :
- Comprendre comment une requête non sécurisée peut être exploitée.
- Observer les risques liés à l'utilisation de la classe **Statement**.
- Découvrir comment la classe **PreparedStatement** permet de sécuriser les requêtes en empêchant les injections SQL.

## Une faille de la classe Statement

Testez le code ci-dessous qui permet à un utilisateur 
d'entrer un nom pour faire une recherche dans la base de données.

```java showLineNumbers title="SQLInjection.java"
import java.sql.*;
import java.util.Scanner;

public class SQLInjectionExample {
    public static void main(String[] args) {
        String url = "jdbc:sqlite:external-data/demo.db";

        Scanner scanner = new Scanner(System.in);

        System.out.print("Entrez un nom d'utilisateur : ");
        String userInput = scanner.nextLine();

        String sql = "SELECT * FROM users WHERE name = '" + userInput + "'";

        try (Connection conn = DriverManager.getConnection(url);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                int id = rs.getInt("id");
                String name = rs.getString("name");

                System.out.println("ID : " + id
                        + " | Nom : " + name
                );
            }

        } catch (SQLException e) {
            System.out.println("Erreur : " + e.getMessage());
        }
    }
}
```

Entrez `Alice` pour obtenir les informations de cette utilisatrice. Que constatez-vous si vous entrez `Alice' OR 1=1;'` ?

:::danger Sécurité

Si vous laissez un utilisateur entrer d’une manière ou d’une 
autre les requêtes, il peut accéder à votre base de données et 
récupérer ou modifier des données.

:::

## Une solution avec la classe PreparedStatement

La classe `Statement` utilisée jusqu’à présent reçoit l’ensemble 
de la requête qui doit être exécutée. 
Cependant on peut utiliser la classe `PreparedStatement` qui 
peut recevoir uniquement les paramètres de la requête.

```java showLineNumbers title="SecureQuery.java"
import java.sql.*;
import java.util.Scanner;

public class SecureQuery {
    public static void main(String[] args) {
        String url = "jdbc:sqlite:external-data/demo.db";
        Scanner scanner = new Scanner(System.in);

        System.out.print("Entrez un nom d'utilisateur : ");
        String userInput = scanner.nextLine();

        String sql = "SELECT * FROM users WHERE name = ?";

        try (Connection conn = DriverManager.getConnection(url);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, userInput);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    int id = rs.getInt("id");
                    String name = rs.getString("name");

                    System.out.println("ID : " + id
                            + " | Nom : " + name
                    );
                }
            }
        } catch (SQLException e) {
            System.out.println("Erreur : " + e.getMessage());
        }
    }
}
```

Notez la présence de `?` dans la requête. 
Ces `?` représentent les paramètres attendus par la requête.
Pour transmettre des valeurs à ces `?`, il faut utiliser des
mutateurs qui spécifient le type du paramètre entré.

:::note Exercice A : Tester PrepareStatement

Vérifiez que l'injection SQL est impossible
en introduisant la valeur `Alice' OR 1=1;'`.

:::