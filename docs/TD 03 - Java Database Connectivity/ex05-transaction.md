# Exercice 5 - Gérer une transaction

Une transaction en base de données permet d'exécuter un ensemble 
d'opérations de manière atomique, garantissant que soit toutes 
les modifications sont appliquées, soit aucune ne l’est.

Cette section permet :

- de découvrir comment gérer une transaction avec JDBC.
- d'utiliser `setAutoCommit(false)`, `commit()` et `rollback()` pour contrôler l’exécution des requêtes.
- d'observer l’impact des transactions en cas de succès ou d’erreur.

:::info Principe ACID

En informatique, les propriétés ACID (atomicité, cohérence, 
isolation et durabilité) sont un ensemble de propriétés qui 
garantissent qu'une transaction informatique est exécutée de 
façon fiable. Plus d'informations sur la [page wikipédia dédiée](https://fr.wikipedia.org/wiki/Propri%C3%A9t%C3%A9s_ACID).

:::

L'exemple ci-dessous illustre l'utilisation d'une transaction.
Le code proposé : 
1. insère un utilisateur Mallory.
1. insère un utilisateur Oscar.
1. produit une erreur lors de l'insertion de l'utilisateur Trudy.
1. Les deux premières insertions sont annulées (ROLLBACK).


```java showLineNumbers title="Transaction.java"
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class Transaction {
    public static void main(String[] args) {
        String url = "jdbc:sqlite:external-data/demo.db";

        try (Connection conn = DriverManager.getConnection(url)) {

            // Désactiver l'auto-commit pour gérer la transaction
            conn.setAutoCommit(false);
            
            String insertNameHeightDobStmt = "INSERT INTO users (name, height,birth_date) VALUES (?, ?, ?)";
            
            try (PreparedStatement pstmt1
                         = conn.prepareStatement(insertNameHeightDobStmt);
                 PreparedStatement pstmt2
                         = conn.prepareStatement(insertNameHeightDobStmt);
                 PreparedStatement pstmt3
                         = conn.prepareStatement(insertNameHeightDobStmt)) {

                pstmt1.setString(1, "Mallory");
                pstmt1.setDouble(2, 178);
                pstmt1.setString(3, "1996-03-10");
                pstmt1.executeUpdate();

                pstmt2.setString(1, "Oscar");
                pstmt2.setDouble(2, 169);
                pstmt2.setString(3, "2003-07-14");
                pstmt2.executeUpdate();

                pstmt3.setString(1, "Trudy");
                pstmt3.setDouble(2, 100 / 0); // Erreur volontaire
                pstmt3.setString(3, "2001-01-01");
                pstmt3.executeUpdate();

                // Si tout fonctionne, on valide la transaction
                conn.commit();

                System.out.println("Transaction réussie !");

            } catch (Exception e) {
                // Annuler toutes les opérations en cas d'erreur
                conn.rollback();
                System.out.println("Transaction annulée : "
                        + e.getMessage());
            } finally {
                // Remettre l'auto-commit par défaut
                conn.setAutoCommit(true);
            }

        } catch (SQLException e) {
            System.out.println("Erreur : " + e.getMessage());
        }
    }
}
```

:::note Exercice A : Vérifiez le rollback

Testez le code proposé et vérifiez qu'aucune écriture n'a eu
lieu dans la base de données. Enlevez la division par 0 et
vérifiez après avoir à nouveau exécutez le code que les
données sont insérées dans la base de données.

:::

Notez dans cet exemple : 
- La désactivation de l'**autoCommit** via `conn.setAutoCommit(false)` pour que les opérations soient groupées.
- L'utilisation de `commit()` pour appliquer les changements uniquement si tout fonctionne.
- L'utilisation de `rollback()` pour annuler tout les changements si une erreur survient.
- La simulation d'une erreur (100 / 0) ce qui provoque une `ArithmeticException` et ce qui déclenche `rollback()`.
- La remise de **autoCommit** à true pour éviter des erreurs sur les requêtes suivantes.

:::info Quand utiliser des transactions

- Les transactions améliorent les performances lorsqu'elles réduisent le nombre d’écritures et optimisent la gestion des ressources.
- Elles peuvent nuire aux performances si elles sont trop longues, bloquent d’autres utilisateurs ou consomment trop de mémoire.
- Une bonne gestion des transactions consiste à les rendre courtes et efficaces, en validant (COMMIT) rapidement les modifications pour éviter les blocages inutiles.

:::
