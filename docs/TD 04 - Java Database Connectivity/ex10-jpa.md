# Exercice 10 - Facultatif - JPA

Dans les cours de Web vous avez utilisé Spring Data JPA, qui 
facilite énormément l’accès aux bases de données en générant 
automatiquement des requêtes et en gérant l’interaction avec 
Hibernate. 

Spring Data JPA est conçu pour fonctionner avec l’écosystème 
Spring mais une application de bureau n’a pas besoin de Spring.

Contrairement aux applications où Spring gère les beans et l’injection de dépendances, une application de bureau doit gérer explicitement ses connexions et transactions, ce qui n’est pas le mode de fonctionnement naturel de Spring Data JPA.

Dans cette section, vous allez apprendre à implémenter un 
Repository en utilisant JPA et Hibernate, sans la couche 
d’abstraction offerte par Spring Data JPA.

Dans cette section, vous allez :

- Configurer Hibernate et JPA manuellement (sans Spring Data JPA).
- Définir une entité JPA et la mapper à une table de base de données.
- Écrire un Repository personnalisé qui gère les opérations CRUD (Create, Read, Update, Delete) en utilisant EntityManager.
- Gérer les transactions avec EntityTransaction.

## Quelques rappels

### JPA (Java Persistence API)

JPA est une spécification Java qui définit une interface 
standard pour la gestion des bases de données relationnelles via 
des objets Java. Elle permet aux développeurs d'utiliser des 
entités Java pour interagir avec la base de données sans écrire
directement du SQL.

### Hibernate

Hibernate est une implémentation populaire de JPA. C'est un ORM 
(Object-Relational Mapping) qui simplifie la gestion de la 
persistance en convertissant automatiquement les objets Java en 
requêtes SQL. Il fournit des fonctionnalités avancées comme la 
gestion du cache, la validation des entités et le support de 
différentes bases de données.

### Spring Data JPA

Spring Data JPA est une surcouche de JPA fournie par le 
framework Spring. Elle simplifie encore davantage l'accès aux 
bases de données en réduisant le code boilerplate, en offrant 
des repositories automatiques et en permettant la génération 
dynamique des requêtes à partir de méthodes d’interface.

## Dépendances

Avant de pouvoir utiliser JPA avec Hibernate dans notre projet, 
il est nécessaire d’ajouter les bonnes dépendances dans le 
fichier pom.xml de Maven.

JPA est une spécification, et Hibernate est une implémentation 
courante de cette spécification. Nous devons donc inclure :

- L’API JPA pour utiliser les annotations et les fonctionnalités standard.
- Hibernate en tant que fournisseur JPA, qui gérera les interactions avec la base de données.
- Hibernate Community Dialects pour assurer la compatibilité avec certaines bases comme SQLite.
- SLF4J (Simple Logging Facade for Java), une bibliothèque de journalisation utilisée par Hibernate pour afficher des messages de log.

```xml showLineNumbers title="pom.xml"
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

Dans une application utilisant JPA avec Hibernate, le fichier 
persistence.xml est essentiel pour définir la Persistence Unit. 
Ce fichier permet de configurer :
- Le provider JPA (ici, Hibernate).
- L’URL de connexion à la base de données et le driver JDBC utilisé.
- Les paramètres spécifiques à Hibernate, comme la génération automatique du schéma.
- Le mode de gestion des transactions.

Ce fichier est placé dans le dossier META-INF du dossier 
resources et est lu par JPA pour établir la connexion à la base 
de données.


```xml showLineNumbers title="persistence.xml"
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

## De DTO à Entité

Dans une application utilisant JPA avec Hibernate, les DTO (Data 
Transfer Objects) ne sont plus nécessaires pour représenter les 
données en base. 
À la place, vous utilisez des entités JPA, qui sont des classes 
annotées permettant de mapper directement les tables de la base 
de données.

Ces entités :

- Sont annotées avec @Entity pour être reconnues par JPA.
- Peuvent être directement gérées par le EntityManager (insertion, mise à jour, suppression, requêtes).
- Simplifient le code en évitant de devoir convertir constamment entre DTO et objets métier.

```java showLineNumbers title="User.java"
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

Maintenant que vous avez défini votre entité JPA, vous allez
implémenter le UserRepository en utilisant JPA avec Hibernate. 
Contrairement à l’approche JDBC classique, où vous deviez écrire 
des requêtes SQL manuellement, JPA vous permet de manipuler 
directement les entités via l'EntityManager.

Dans cette section, vous allez :
- Utiliser EntityManager pour insérer, mettre à jour, supprimer et rechercher des utilisateurs.
- Implémenter les méthodes du UserRepository en tirant parti des fonctionnalités de JPA.
- Remplacer la gestion manuelle des requêtes SQL par des appels simplifiés aux entités.

```java showLineNumbers title="UserRepository.java"
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

:::note Exercice A : Utiliser le nouveau repository

Remplacez dans la classe `RepositorySandbox` l'instance
de UserRepository utilisant JDBC par une instance utilisant
JPA. Constatez-vous une différence ?

:::