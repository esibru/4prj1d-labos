# Exercice 2 - Selection de données

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
    1. demander de retourner le String nommé **birth_date**  : `String dateText = rs.getString("birth_date")`;
    1. convertir la date en un format utilisable : `LocalDateTime birthDate = LocalDateTime.parse(dateText, formatter)`
    1. demander de retourner le nombre réel nommé **height**  : `double height = rs.getDouble("height");`; 
    1. demander de retourner le booléen nommé **is_active**  : `boolean active = rs.getInt("is_active")`;     

Vous pouvez tester le code ci-dessous qui reprend l'ensemble de 
ces instructions.

```java showLineNumbers title="SelectionQuery.java"
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class Selection {
    public static void main(String[] args) {
        String url = "jdbc:sqlite:external-data/demo.db";

        String sql = "SELECT id, name, birth_date, height, is_active  FROM users";

        try (Connection conn = DriverManager.getConnection(url);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            // Format pour afficher la date si elle est en format texte
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

            System.out.println("Résultats de la requête :");
            while (rs.next()) {
                // Récupération des données avec les bons types
                int id = rs.getInt("id");

                String name = rs.getString("name");

                String dateText = rs.getString("birth_date");

                // Conversion en LocalDateTime (si stocké en format texte)
                LocalDate birthDate = LocalDate.parse(dateText, formatter);

                double height = rs.getDouble("height");

                boolean active = rs.getBoolean("is_active");

                // Affichage des résultats
                System.out.println("ID : " + id
                        + " | Nom : " + name
                        + " | Date de naissance : " + birthDate
                        + " | Taille : " + height
                        + " | Actif : " + active
                );
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
les utilisateurs actifs.

:::


:::note Exercice B : jointure

Créez dans la base de données demo.db la table Orders
contenant la liste des commandes effectuées par les
utilisateurs actifs.

```sql showLineNumbers
CREATE TABLE Orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Clé primaire de la commande
    user_id INTEGER NOT NULL,               -- Référence à l'utilisateur
    order_date TEXT NOT NULL,               -- Date et heure de la commande (YYYY-MM-DD HH:MM:SS)
    total_amount REAL NOT NULL,             -- Montant total de la commande en euros
    status TEXT CHECK (status IN ('Pending', 'Shipped', 'Delivered', 'Cancelled')) NOT NULL,  -- Statut de la commande
    
    FOREIGN KEY (user_id) REFERENCES Users(id)  -- Clé étrangère liée à Users
);
```

Alimentez cette table avec les données suivantes.

```sql showLineNumbers
INSERT INTO Orders (user_id, order_date, total_amount, status) VALUES 
(1, '2024-02-01 14:30:00', 59.99, 'Shipped'),
(2, '2024-02-05 09:15:00', 120.50, 'Pending'),
(1, '2024-02-10 18:45:00', 32.75, 'Delivered'),
(3, '2024-02-12 16:20:00', 87.90, 'Cancelled');
```

N'oubliez pas de valider vos mises à jours, en appuyant par
exemple sur le bouton *Write changes* dans *DB browser for SQLite*.

Modifiez la requête de selection pour afficher
tous les utilisateurs et toutes les informations liées à 
leurs commandes (date et heure, montant et statut).
Utilisez une jointure pour réaliser cet exercice.

:::