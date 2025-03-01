# Exercice 6 - Design pattern repository

Dans cette section vous allez structurer votre code pour 
implémenter le patron de conception Repository et séparer la 
logique de l’application de l’accès à la base de données.

La structure du projet que vous allez construire est
la suivante : 

```bash
/src
 ├── dto
 │   ├── UserDto.java
 ├── repository
 │   ├── ConnectionManager.java
 │   ├── RepositoryException.java
 │   ├── UserRepository.java
 ├── RepositorySandbox.java
```

## Data Transfert Object

Un **DTO** (Data Transfer Object) est un objet utilisé pour 
transporter des données entre différentes couches d’une 
application, notamment entre :
- La base de données et la couche métier
- La couche métier et la couche présentation

Depuis Java 14, la syntaxe record permet de simplifier 
l’écriture des DTO en rendant les classes immutables et en 
générant automatiquement :
- Les constructeurs
- Les getters
- Les méthodes equals(), hashCode() et toString()

```java showLineNumbers title="UserDto.java"
import java.time.LocalDate;

public record UserDto(int id, String name, LocalDate birthDate, double height, boolean active) {}
```

## Encapsuler une SQLException

**SQLException** est l'exception générée par JDBC lorsqu'une 
erreur se produit lors de l'interaction avec la base de données 
(par exemple, une erreur dans une requête SQL, une violation de 
contrainte, un problème de connexion,...).

Dès qu'une classe contient `import java.sql.SQLException`, elle
devient dépendante à l'implémentation de l'accès aux données.
Afin d'éviter que toutes les classes métier dépendent de cette 
SQLException, vous allez créer une **RepositoryException**.
Cette exception personnalisée est une exception enveloppante
(wrapper) qui permet de gérer toutes les erreurs liées à la 
couche de persistance dans une application sans que les détails 
techniques spécifiques à JDBC ne se propagent au reste de 
l'application.

```java showLineNumbers title="RepositoryException.java"
public class RepositoryException extends RuntimeException {
    public RepositoryException(String message, Throwable cause) {
        super(message, cause);
    }
}
```

## Gestion de la connexion

Dans le cadre de l'implémentation du Pattern Repository, il est
généralement préférable de se connecter une seule fois lors de 
l'initialisation de l'objet Repository. 
Cela permet de réutiliser la même connexion pour plusieurs opérations (en particulier si vous effectuez plusieurs actions 
au sein d'une même transaction) et peut améliorer les 
performances en évitant de créer une nouvelle connexion à chaque
appel de méthode.

```java showLineNumbers title="ConnectionManager.java"
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

class ConnectionManager {
    private static Connection connection;

    static Connection getConnection() {
        if (connection == null) {
            try {
                String url = "jdbc:sqlite:external-data/demo.db";
                connection = DriverManager.getConnection(url);
            } catch (SQLException ex) {
                throw new RepositoryException("Connexion impossible", ex);
            }
        }
        return connection;
    }

    static void close() {
        try {
            if (connection != null && !connection.isClosed()) {
                connection.close();
            }
        } catch (SQLException ex) {
            throw new RepositoryException("Fermeture impossible", ex);
        }
    }
}
```


## Première version du repository

L’idée derrière le Repository pattern est d’avoir au sein de 
l’application, une classe qui centralise les accès à un type de 
données.
Par exemple nous allons créer une classe `UserRepository` qui 
va être le point d’accès des données concernant les 
utilisateurs. 
Si nous avions besoin d’accéder aux informations concernant les 
commandes nous créerions une classe `OrdersRepository`.


```java showLineNumbers title="UserRepository.java"
import dto.UserDto;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class UserRepository {
    private final Connection connection;

    private final DateTimeFormatter formatter;

    public UserRepository() {
        connection = ConnectionManager.getConnection();
        formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    }

    public Optional<UserDto> findById(int id) {
        String sql = """
                SELECT 
                    * 
                FROM 
                    users 
                WHERE 
                    id = ?
                """;
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    String name = rs.getString("name");
                    String dateText = rs.getString("birth_date");
                    LocalDate birthDate = LocalDate.parse(dateText, formatter);
                    double height = rs.getDouble("height");
                    boolean active = rs.getBoolean("is_active");

                    UserDto user = new UserDto(id, name, birthDate, height, active);

                    return Optional.of(user);
                }
            }
        } catch (SQLException e) {
            throw new RepositoryException("Selection impossible", e);
        }
        return null;
    }

    public List<UserDto> findAll() {
        List<UserDto> users = new ArrayList<>();
        String sql = "SELECT * FROM users";
        try (PreparedStatement stmt = connection.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                int id = rs.getInt("id");
                String name = rs.getString("name");
                String dateText = rs.getString("birth_date");
                LocalDate birthDate = LocalDate.parse(dateText, formatter);
                double height = rs.getDouble("height");
                boolean active = rs.getBoolean("is_active");

                UserDto user = new UserDto(id, name, birthDate, height, active);
                users.add(user);
            }
        } catch (SQLException e) {
            throw new RepositoryException("Selection impossible", e);
        }
        return users;
    }

    public int save(UserDto user) {
        String sql = """
                INSERT INTO 
                    users (name, birth_date, height, is_active) 
                VALUES 
                    (?, ?, ?, ?)
                """;
        try (PreparedStatement stmt = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, user.name());
            String datetext = formatter.format(user.birthDate());
            stmt.setString(2, datetext);
            stmt.setDouble(3, user.height());
            stmt.setBoolean(4, user.active());
            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    return rs.getInt(1); // Retourne l'ID généré
                }
            }

        } catch (SQLException e) {
            throw new RepositoryException("Insertion impossible", e);
        }
        return -1;
    }

    public void delete(int id) {
        String sql = "DELETE FROM users WHERE id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, id);
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RepositoryException("Suppression impossible", e);
        }
    }

    public void close() {
        ConnectionManager.close();
    }

}
```

:::note Exercice A : Utilisation du repository

Dans un nouveau fichier RepositorySandbox.java créez une
méthode main qui en utilisant une instance de la 
classe UserRepository : 
1. Affiche tous les utilisateurs de la table Users.
1. Insère l'utilisateur actif Isaac, né le 01/12/1995, mesurant 1.89 mètre.
1. Affiche tous les utilisateurs de la table Users.
1. Met à jour l'utilisateur Isaac en changeant sa taille à 1.74 mètre.
1. Affiche tous les utilisateurs de la table Users.
1. Supprime l'utilisateur Isaac.
1. Affiche tous les utilisateurs de la table Users.
1. Ferme la connexion au repository.

:::   

## Plusieurs repository

Si vous avez plusieurs repository, utilisez une interface.

```mermaid
classDiagram
    class Repository~K,T~ {
        <<interface>>
        +findById(key: K): Optional~T~
        +findAll(): List~T~
        +save(item: T): K
        +deleteById(key: K): void
    }

    class UserRepository~Integer,UserDto~ {
        +findById(id: Integer): Optional~UserDto~
        +findAll(): List~UserDto~
        +save(user: UserDto): Integer
        +deleteById(id: Integer): void
    }

    class OrderRepository~Integer,OrderDto~ {
        +findById(id: Integer): Optional~OrderDto~
        +findAll(): List~OrderDto~
        +save(user: OrderDto): Integer
        +deleteById(id: Integer): void
    }

    Repository <|.. UserRepository
    Repository <|.. OrderRepository
```

Vous retrouvez une interface similaire à celle que vous
avez découvert avec **spring-data-jpa**.


