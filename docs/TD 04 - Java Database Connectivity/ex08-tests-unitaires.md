# Exercice 8 - Tests unitaires

## Tester un Dao

Ce test unitaire :

1. Crée une base de données SQLite en mémoire pour isoler les tests.
1. Initialise la table users avant tous les tests.
1. Nettoie les données après chaque test pour éviter toute interférence.
1. Ferme la connexion une fois tous les tests terminés.
1. Teste findById() en vérifiant la cohérence des données.


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

    @Test
    void testSelectExist() {
        System.out.println("testSelectExist");
        //Arrange
        UserDto expected = alice;
        //Action
        UserDto result = instance.findById(1);
        //Assert
        assertEquals(expected, result);
    }
}
```

## Tester un Repository

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


```java showLineNumbers title="UserRepositoryTest.java"

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import dto.UserDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

class UserRepositoryTest {

    @Mock
    private UserDao userDao;

    @InjectMocks
    private UserRepository userRepository;

    private UserDto user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new UserDto(1, "John Doe", LocalDate.of(1990, 1, 1), 1.80, true);
    }

    @Test
    void testFindById_UserExists() {
        when(userDao.findById(1)).thenReturn(user);
        Optional<UserDto> result = userRepository.findById(1);
        assertTrue(result.isPresent());
        assertEquals(user, result.get());
    }

    @Test
    void testFindById_UserDoesNotExist() {
        when(userDao.findById(2)).thenReturn(null);
        Optional<UserDto> result = userRepository.findById(2);
        assertFalse(result.isPresent());
    }

    @Test
    void testFindAll() {
        when(userDao.findAll()).thenReturn(List.of(user));
        List<UserDto> users = userRepository.findAll();
        assertEquals(1, users.size());
        assertEquals(user, users.get(0));
    }

    @Test
    void testSave() {
        when(userDao.save(any(UserDto.class))).thenReturn(1);
        int generatedId = userRepository.save(user);
        assertEquals(1, generatedId);
    }

    @Test
    void testDelete() {
        doNothing().when(userDao).delete(1);
        userRepository.delete(1);
        verify(userDao, times(1)).delete(1);
    }
}
```