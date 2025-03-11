# Exercice 7 - Data Access Object

Dans cet exercice, vous allez partir de l'implémentation 
d'un Repository pour introduire le concept de 
**Data Access Object** et en comprendre l'intérêt dans la 
gestion de l'accès aux données. 

Pour illustrer cette approche, vous utiliserez un Repository 
avec cache, une technique fréquemment utilisée pour améliorer 
les performances des applications en évitant les appels répétitifs 
à la base de données. 
Le cache permet de stocker temporairement les résultats des requêtes 
dans la mémoire, de sorte qu'une fois qu'une donnée est récupérée, 
elle peut être réutilisée sans avoir à interroger à nouveau la base 
de données.

La structure du projet que vous allez construire est
la suivante : 

```bash
/src
 ├── dto
 │   ├── UserDto.java
 ├── repository
 │   ├── ConnectionManager.java
 │   ├── RepositoryException.java
 │   ├── UserDao.java
 │   ├── UserRepository.java
 ├── RepositorySandbox.java
```

## Responsabilité unique

Si vous souhaitez ajouter un système de cache à votre classe `UserRepository`, 
il est pertinent de le diviser en deux parties distinctes :
- `UserDao` : Responsable de l'accès aux données (Base de données SQLite).
- `UserRepository` : Responsable du cache.

Cette décomposition respecte [le principe SOLID](https://fr.wikipedia.org/wiki/SOLID_(informatique)), 
chaque classe a une seule responsabilité, ce qui
améliore la maintenance et l'évolutivité de l'application.

## Data access Object

Créez la classe `UserDao` contenant le code
d'accès aux données initialement dans la classe `UserRepository`.

```mermaid
classDiagram
    direction RL
    note for UserDao "La visibilité des méthodes est package"
    note for UserDao "Le constructeur reçoit la connexion en paramètre"
    note for UserDao "La gestion de la connexion n'incombe pas à cette classe, la méthode close est absente."
    class UserDao {
        - connection : Connection 
        - formatter : DateTimeFormatter 
        ~ UserDao(connection : Connection)
        ~findById(id: Integer): Optional~UserDto~
        ~findAll(): List~UserDto~
        ~save(user: UserDto): Integer
        ~deleteById(id: Integer): void
    }
```

```java showLineNumbers title="UserDao.java"
import dto.UserDto;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

class UserDao {

    private final DateTimeFormatter formatter;

    private final Connection connection;

    UserDao(Connection connection) {
        this.connection = Objects.requireNonNull(connection, "Connexion requise");
        this.formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    }

    Optional<UserDto> findById(int id) {
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
        return Optional.empty();
    }

    List<UserDto> findAll() {
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

    private int insert(UserDto user) {
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

    private int update(UserDto user) {
        String sql = """
                UPDATE users
                SET
                    name = ?, birth_date = ?, height = ?, is_active = ?
                WHERE id = ?
                """;
        int updatedRows = 0;
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, user.name());
            String datetext = formatter.format(user.birthDate());
            stmt.setString(2, datetext);
            stmt.setDouble(3, user.height());
            stmt.setBoolean(4, user.active());
            stmt.setInt(5,user.id());
            updatedRows = stmt.executeUpdate();

        } catch (SQLException e) {
            throw new RepositoryException("Sauvegarde impossible", e);
        }
        return updatedRows; // Retourne le nombre de lignes affectées
    }

    public int save(UserDto user) {
        int result = -1;
        String sql = "SELECT COUNT(*) FROM users WHERE id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1,user.id());
            ResultSet rs = stmt.executeQuery();
            boolean found = rs.next() && rs.getInt(1)>0;
            if (found) {
                if (this.update(user)>0) {
                    result = user.id();
                }
            } else {
                result = this.insert(user);
            }
            return result;
        }
        catch (SQLException e) {
          throw new RepositoryException("Recherche impossible", e);
        }
    }

    void delete(int id) {
        String sql = "DELETE FROM users WHERE id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, id);
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RepositoryException("Suppression impossible", e);
        }
    }
}
```

## Repository avec cache

L'utilisation d'un Data Access Object change la structure
du Repository, l'attribut connexion permettant d'exécuter
des requêtes a été déplacé.

```mermaid
classDiagram
    note for UserRepository "Constructeur pour les tests ajoutés"
    class UserRepository {
        - userCache : Map~Integer, UserDto~
        + UserRepository()
        ~ UserRepository(userDao: UserDao)
        - loadCache(): void
        +findById(id: Integer): Optional~UserDto~
        +findAll(): List~UserDto~
        +save(user: UserDto): Integer
        +deleteById(id: Integer): void
        +close(): void
    }

    class UserDao {
        - connection : Connection 
        - formatter : DateTimeFormatter 
        ~ UserDao(connection : Connection)
        ~findById(id: Integer): Optional~UserDto~
        ~findAll(): List~UserDto~
        ~save(user: UserDto): Integer
        ~deleteById(id: Integer): void
    }

    UserRepository "1" *-- "1" UserDao
```

Modifiez la classe `UserRepository` avec l'implémentation 
ci-dessous pour déléguer l'accès aux données à la classe 
`UserDao`. Utilisez **ConcurrentHashMap** 
comme système de cache pour stocker les utilisateurs en mémoire.

```java showLineNumbers title="UserRepository.java"
import dto.UserDto;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

public class UserRepository {
    private final UserDao userDao;
    private final Map<Integer, UserDto> userCache;

    public UserRepository() {
        Connection connection = ConnectionManager.getConnection();
        this.userDao = new UserDao(connection);
        this.userCache = new ConcurrentHashMap<>();
        loadCache();
    }

    UserRepository(UserDao userDao) {
        this.userDao = Objects.requireNonNull(userDao, "UserDao is required");
        this.userCache = new ConcurrentHashMap<>();
        loadCache();
    }

    private void loadCache() {
        userDao.findAll().forEach(
                user -> userCache.put(user.id(), user));
    }

    public Optional<UserDto> findById(int id) {
        return Optional.ofNullable(userCache.get(id))
                .or(() -> userDao.findById(id));
    }

    public List<UserDto> findAll() {
        return new ArrayList<>(userCache.values());
    }

    public int save(UserDto user) {
        int generatedId = userDao.save(user);
        if (generatedId != -1) {
            userCache.put(generatedId,
                    new UserDto(generatedId, user.name(),
                            user.birthDate(), user.height(), user.active()));
        }
        return generatedId;
    }

    public void delete(int id) {
        userDao.delete(id);
        userCache.remove(id);
    }

    public void close() {
        ConnectionManager.close();
    }
}
```

:::note Exercice A : Indépendance du reste de l'application

Vérifiez que la méthode main de la classe RepositorySandbox
est toujours opérationnelle. 

:::

## Plusieurs repository

Si vous gérez plusieurs repositories, il est recommandé 
d'utiliser des interfaces pour Repository et pour Dao.

```mermaid
classDiagram

    subgraph Users
        class UserRepository~Integer,UserDto~ {
            +findById(id: Integer): Optional~UserDto~
            +findAll(): List~UserDto~
            +save(user: UserDto): Integer
            +deleteById(id: Integer): void
            +close(): void
        }

        class UserDao~Integer,UserDto~ {
            ~findById(id: Integer): UserDto
            ~findAll(): List~UserDto~
            ~save(user: UserDto): Integer
            ~deleteById(id: Integer): void
        }
    end

    subgraph interface
        class Repository~K,T~ {
            <<interface>>
            +findById(key: K): Optional~T~
            +findAll(): List~T~
            +save(item: T): K
            +deleteById(key: K): void
            +close(): void
        }

        class Dao~K,T~ {
            <<interface>>
            ~findById(key: K): T
            ~findAll(): List~T~
            ~save(item: T): K
            ~deleteById(key: K): void
        }
    end

    subgraph Orders  
        direction TB

        class OrderRepository~Integer,OrderDto~ {
            +findById(id: Integer): Optional~OrderDto~
            +findAll(): List~OrderDto~
            +save(user: OrderDto): Integer
            +deleteById(id: Integer): void
            +close(): void
        }

        class OrderDao~Integer,OrderDto~ {
            ~findById(id: Integer): OrderDto
            ~findAll(): List~OrderDto~
            ~save(user: OrderDto): Integer
            ~deleteById(id: Integer): void
        }
    end

    Repository <|.. UserRepository
    Repository <|.. OrderRepository

    Repository ..> Dao

    Dao <|.. UserDao
    Dao <|.. OrderDao

    UserRepository *-- UserDao
    OrderRepository *-- OrderDao
```

