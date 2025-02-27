# Exercice 6 -  Gérer une transaction

```java showLineNumbers
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class TransactionExample {
    public static void main(String[] args) {
        String url = "jdbc:sqlite:database.db";

        try (Connection conn = DriverManager.getConnection(url)) {
            conn.setAutoCommit(false); // Désactiver l'auto-commit pour gérer la transaction

            try (PreparedStatement pstmt1 = conn.prepareStatement("INSERT INTO users (name, age) VALUES (?, ?)");
                 PreparedStatement pstmt2 = conn.prepareStatement("INSERT INTO users (name, age) VALUES (?, ?)");
                 PreparedStatement pstmt3 = conn.prepareStatement("INSERT INTO users (name, age) VALUES (?, ?)")) {

                // Insérer Alice
                pstmt1.setString(1, "Alice");
                pstmt1.setInt(2, 25);
                pstmt1.executeUpdate();

                // Insérer Bob
                pstmt2.setString(1, "Bob");
                pstmt2.setInt(2, 30);
                pstmt2.executeUpdate();

                // Erreur simulée avec Charlie (division par zéro)
                pstmt3.setString(1, "Charlie");
                pstmt3.setInt(2, 100 / 0); // Erreur volontaire

                pstmt3.executeUpdate();

                conn.commit(); // Si tout fonctionne, on valide la transaction
                System.out.println("Transaction réussie !");

            } catch (Exception e) {
                conn.rollback(); // Annuler toutes les opérations en cas d'erreur
                System.out.println("Transaction annulée : " + e.getMessage());
            } finally {
                conn.setAutoCommit(true); // Remettre l'auto-commit par défaut
            }

        } catch (SQLException e) {
            System.out.println("Erreur : " + e.getMessage());
        }
    }
}
```