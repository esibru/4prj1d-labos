# Exercice 8 - Tests unitaires

Votre Repository développé, il faut en valider la logique via des tests unitaires. Les
tests unitaires ayant pour rôle de valider chaque classe de manière indépendante, il va
falloir être prudent lors de l’écriture de ces tests.

## Tester un Dao

Pour valider le comportement implémenté dans `UserDao`
sans modifier les données de la base de données réelles, 
le test unitaire doit :

1. Créer une base de données SQLite en mémoire pour isoler les tests.
1. Initialiser la table Users avant chaque test.
1. Nettoyer les données après chaque test pour éviter toute interférence.
1. Ferme la connexion une fois tous les tests terminés.

A l'aide des annotations `@BeforeAll`, `@BeforeEach` , 
`@AfterEach` et `@AfterAll` ces contraintes peuvent être 
respectées, comme montré avec le code ci-dessous.

```java showLineNumbers title="UserDaoTest.java"
import dto.UserDto;
import org.junit.jupiter.api.*;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class UserDaoTest {

    private static Connection connection;
    private UserDao instance;

    private final UserDto alice;

    public UserDaoTest() {
        alice = new UserDto(1,
                "Alice",
                LocalDate.of(1995, 6, 15),
                1.68,
                true);
    }

    @BeforeAll
    static void setupDatabase() throws SQLException {
        connection = DriverManager.getConnection("jdbc:sqlite::memory:");
        try (Statement stmt = connection.createStatement()) {
            stmt.execute("""
                        CREATE TABLE users (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            name TEXT NOT NULL,
                            birth_date TEXT NOT NULL,
                            height REAL NOT NULL,
                            is_active INTEGER NOT NULL
                        )
                    """);
        }
    }

    @BeforeEach
    void setup() throws SQLException {
        instance = new UserDao(connection);

        try (Statement stmt = connection.createStatement()) {
            stmt.execute("""
                    INSERT INTO Users (name, birth_date, height, is_active) VALUES\s
                    ('Alice', '1995-06-15', 1.68, 1),
                    ('Bob', '1988-09-23', 1.82, 0),
                    ('Charlie', '2000-12-05', 1.75, 1),
                    ('Diana', '1992-03-11', 1.60, 1);
                    """);
        }
    }

    @AfterEach
    void cleanDatabase() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            stmt.execute("DELETE FROM users");
        }
    }

    @AfterAll
    static void closeDatabase() throws SQLException {
        connection.close();
    }

}
```

Vous devez ensuite ajouter les cas de tests des différentes
méthodes de `UserDao`. Pour la méthode `findById(int id)`,
deux cas de tests sont obligatoires : 
- appeler la méthode avec l'identifiant d'un utilisateur existant.
- appeler la méthode avec l'identifiant d'un utilisateur inexistant.

```java showLineNumbers title="UserDaoTest.java"
    @Test
    void testFindByIdExist() {
        System.out.println("testFindByIdExist");
        //Arrange
        Optional<UserDto> expected = Optional.of(alice);
        //Action
        Optional<UserDto> result = instance.findById(1);
        //Assert
        assertEquals(expected, result);
    }

    @Test
    void testFindByIdDoesNotExist() {
        System.out.println("testFindByIdDoesNotExist");
        //Arrange
        Optional<UserDto> expected = Optional.empty();
        //Action
        Optional<UserDto> result = instance.findById(100);
        //Assert
        assertEquals(expected, result);
    }
```

:::note Exercice A : Tester UserDao

Implémentez les tests unitaires des méthodes `findAll()`, 
`save(UserDto user)` et `delete(int id)` de la classe `UserDao`.

:::

## Tester un Repository

L’objectif des tests unitaires est de valider le fonctionnement 
de la classe Repository **uniquement**. 
C’est à dire que le Repository doit fonctionner 
**peu importe l’implémentation du Dao** 
(lecture de fichier, accès à une base de données).
Pour réaliser cette division entre le Repository et le Dao nous 
allons utiliser une copie modifiée du Dao, ce que l’on appelle 
un **Mock**.
En java une librairie utilisée pour créer ces Mocks est **Mockito**.

### Mise en place de Mockito

Commencez par ajouter à votre pom.xml les dépendances à Mockito :

```xml showLineNumbers title="pom.xml"
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <version>5.15.2</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-junit-jupiter</artifactId>
    <version>5.15.2</version>
    <scope>test</scope>
</dependency>
```

Pour tester `UserRepository` il faut instancier `UserDao`
dans votre code de test en précisant qu'il ne faut pas utiliser 
l'implémentation réelle, mais une imitation. 
On peut réaliser cette substitution via l'annotation `@Mock` ou 
en appelant la méthode `mock` de la classe `Mockito` : 

```java
UserDao userDao = mock(UserDao.class);
```

Ensuite il faut définir le comportement du mock pour chaque
appel de méthode utilisée lors d'un test. 
Par exemple si l'on souhaite demander au mock de retourner
une liste contenant un seul utilisateur lors d'un appel
à la méthode `UserDao.findAll()`, vous pouvez utiliser :

```java
UserDto user = new UserDto(1, "John Doe", LocalDate.of(1990, 1, 1), 1.80, true);
when(userDao.findAll()).thenReturn(List.of(user));
```

Finalement pour associer la classe testée, `UserRepository`,
à la classe substituée, il suffit d’instancier `UserRepository`
avec le mock de la classe `UserDao` en paramètre.

```java
UserRepository userRepository = new UserRepository(userDao);
```
### Tester UserRepository

Le fonctionnement de Mockito conduit à la classe de test
ci-dessous validant le comportement de la méthode
`findById(int id)` de la classe `UserRepository`.

```java showLineNumbers title="UserRepositoryTest.java"

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import dto.UserDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

class UserRepositoryTest {

    private UserDao userDao;

    private UserRepository userRepository;

    private UserDto user;

    @BeforeEach
    void setUp() {
        user = new UserDto(1, "John Doe", 
                LocalDate.of(1990, 1, 1), 
                1.80, true);

        // Crée le mock avant instanciation de l'objet testé
        userDao = mock(UserDao.class);

        // Configure les comportements des mocks avant création
        when(userDao.findAll()).thenReturn(List.of(user));

        // Instancie la classe testée avec le mock
        userRepository = new UserRepository(userDao);
    }

    @Test
    void testFindByIdExists() {
        System.out.println("testFindByIdExists");
        //Arrange
        when(userDao.findById(1)).thenReturn(Optional.of(user));
        //Action
        Optional<UserDto> result = userRepository.findById(1);
        //Assert
        assertTrue(result.isPresent());
        assertEquals(user, result.get());
        verify(userDao, times(0)).findById(1);
    }

    @Test
    void testFindByIdDoesNotExist() {
        System.out.println("testFindByIdDoesNotExist");
        //Arrange
        when(userDao.findById(2)).thenReturn(Optional.empty());
        //Action
        Optional<UserDto> result = userRepository.findById(2);
        //Assert
        assertFalse(result.isPresent());
        verify(userDao, times(1)).findById(2);
    }    
}
```

Lors de la vérification des tests (phase Assert), vous
utiliserez la méthode `verify()` de Mockito.
`verify()` permet de vérifier qu'une méthode a bien été appelée 
sur un objet *mocké*, et ce, selon **le nombre de fois attendu**
et **avec les paramètres spécifiés**. 

Dans le cas du test de la 
méthode `findById(int id)`, on s'attend à ce qu'aucun appel ne
soit effectué à la classe `UserDao` si l'utilisateur est dans
le cache et à un unique appel si il n'est pas dans le cache.

:::note Exercice B : Tester UserRepository

Implémentez les tests unitaires des méthodes `findAll()`, 
`save(UserDto user)` et `delete(int id)` de la classe `UserRepository`.

:::