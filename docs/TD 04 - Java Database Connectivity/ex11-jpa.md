# Exercice 11 - JPA

- JPA
- Hibernate
- spring-data-jpa

## Dépendances

```xml showLineNumbers
<dependency>
        <groupId>jakarta.persistence</groupId>
        <artifactId>jakarta.persistence-api</artifactId>
        <version>3.2.0</version>
    </dependency>

    <dependency>
        <groupId>org.hibernate.orm</groupId>
        <artifactId>hibernate-core</artifactId>
        <version>6.6.9.Final</version>
    </dependency>

    <!-- Pour la gestion des logs -->
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-api</artifactId>
        <version>2.0.16</version>
    </dependency>

    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-simple</artifactId>
        <version>2.0.16</version>
        <scope>runtime</scope>
    </dependency>

    <dependency>
        <groupId>org.hibernate.orm</groupId>
        <artifactId>hibernate-community-dialects</artifactId>
        <version>6.6.9.Final</version>
    </dependency>
```


## Configuration

```xml showLineNumbers
<?xml version="1.0" encoding="UTF-8"?>
<persistence xmlns="https://jakarta.ee/xml/ns/persistence"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="https://jakarta.ee/xml/ns/persistence https://jakarta.ee/xml/ns/persistence/persistence_3_0.xsd"
             version="3.0">
    <persistence-unit name="userPU">
        <provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>
        <class>be.esi.prj.orm.User</class>

        <properties>
            <!-- URL de connexion à la base de données SQLite -->
            <property name="jakarta.persistence.jdbc.url" value="jdbc:sqlite:external-data/demo.db"/>
            <property name="jakarta.persistence.jdbc.driver" value="org.sqlite.JDBC"/>
            <property name="jakarta.persistence.jdbc.user" value=""/>
            <property name="jakarta.persistence.jdbc.password" value=""/>

            <!-- Configuration Hibernate -->
            <property name="dialect" value="org.hibernate.community.dialect.SQLiteDialect" />
            <property name="hibernate.hbm2ddl.auto" value="update"/>
            <property name="hibernate.show_sql" value="true"/>
            <property name="hibernate.format_sql" value="true"/>
        </properties>
    </persistence-unit>
</persistence>
```

## Entité

```java showLineNumbers
package be.esi.prj.orm;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class User {

    @Id
    private Long id;
    private String name;
    private String email;

    public User() {}

    public User(Long id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "User{id=" + id + ", name='" + name + "', email='" + email + "'}";
    }
}


```

## Repository

```java showLineNumbers
package be.esi.prj.orm;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.persistence.TypedQuery;
import java.util.List;

public class UserRepository {

    private EntityManagerFactory emf;
    private EntityManager em;

    // Constructeur : Création de l'EntityManager et EntityManagerFactory
    public UserRepository() {
        // Initialisation de l'EntityManagerFactory avec le nom de la persistence-unit défini dans persistence.xml
        emf = Persistence.createEntityManagerFactory("userPU");
        em = emf.createEntityManager();
    }

    public void addUser(User user) {
        try {
            em.getTransaction().begin();
            em.persist(user);  // Persiste l'objet dans la base de données
            em.getTransaction().commit();
        } catch (Exception e) {
            em.getTransaction().rollback();  // En cas d'erreur, rollback pour éviter de laisser des données inconsistantes
            e.printStackTrace();
        }
    }

    public List<User> getAllUsers() {
        TypedQuery<User> query = em.createQuery("SELECT u FROM User u", User.class);
        return query.getResultList();
    }

    public User getUserById(Long id) {
        return em.find(User.class, id);
    }

    public void deleteUser(Long id) {
        User user = getUserById(id);
        if (user != null) {
            try {
                em.getTransaction().begin();
                em.remove(user);  // Supprime l'entité de la base de données
                em.getTransaction().commit();
            } catch (Exception e) {
                em.getTransaction().rollback();
                e.printStackTrace();
            }
        }
    }

    // Méthode pour fermer les ressources : EntityManager et EntityManagerFactory
    public void close() {
        em.close();
        emf.close();
    }
}
```

## Utiliser le repository

```java showLineNumbers
package be.esi.prj.orm;

public class OrmTest {

    public static void main(String[] args) {
        // Création d'un instance du UserRepository
        UserRepository userRepository = new UserRepository();

        // 1. Ajout d'utilisateurs
        User user1 = new User(1L, "Alice", "alice@example.com");
        User user2 = new User(2L, "Bob", "bob@example.com");

        System.out.println("Ajout des utilisateurs...");
        userRepository.addUser(user1);
        userRepository.addUser(user2);

        // 2. Récupération et affichage de tous les utilisateurs
        System.out.println("\nListe des utilisateurs après ajout :");
        for (User user : userRepository.getAllUsers()) {
            System.out.println(user);
        }

        // 3. Récupération d'un utilisateur par ID
        System.out.println("\nRécupération de l'utilisateur avec ID 1 :");
        User retrievedUser = userRepository.getUserById(1L);
        System.out.println(retrievedUser);

        // 4. Suppression d'un utilisateur
        System.out.println("\nSuppression de l'utilisateur avec ID 2...");
        userRepository.deleteUser(2L);

        // 5. Affichage des utilisateurs après suppression
        System.out.println("\nListe des utilisateurs après suppression :");
        for (User user : userRepository.getAllUsers()) {
            System.out.println(user);
        }

        // 6. Fermeture du UserRepository (libération des ressources)
        userRepository.close();
    }

}
```