# Compléments - JPA [Facultatif]

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

En résumé vous allez :

- Configurer Hibernate et JPA manuellement (sans Spring Data JPA).
- Définir une entité JPA et la mapper à une table de base de données.
- Écrire un Repository personnalisé qui gère les opérations CRUD (Create, Read, Update, Delete) en utilisant EntityManager.
- Gérer les transactions avec EntityTransaction.

## Contexte sur les ORM en java

### Java Persistence API

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
bases de données en réduisant le code, en offrant 
des repositories automatiques et en permettant la génération 
dynamique des requêtes à partir de méthodes d’interface.

## Ajout des dépendances

Avant de pouvoir utiliser JPA avec Hibernate dans votre projet, 
il est nécessaire d’ajouter les bonnes dépendances dans le 
fichier pom.xml.

JPA est une spécification et Hibernate est une 
**implémentation** courante de cette spécification. 
Vous devez donc inclure :

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

<!-- Pour la compatibilité avec SQLite -->
<dependency>
    <groupId>org.hibernate.orm</groupId>
    <artifactId>hibernate-community-dialects</artifactId>
    <version>6.6.9.Final</version>
</dependency>
```


## Configuration

Dans une application utilisant JPA avec Hibernate, le fichier 
`persistence.xml` est essentiel pour définir la 
**Persistence Unit**. 

:::info Persistence Unit

Une Persistence Unit regroupe l'ensemble des informations de configuration nécessaires pour la gestion de la persistance des données dans une application.

:::


Ce fichier permet de configurer :
- Le provider JPA, Hibernate dans votre cas.
- L’URL de connexion à la base de données et le driver JDBC utilisé.
- Les paramètres spécifiques à Hibernate, comme la génération automatique du schéma.
- Le mode de gestion des transactions.

:::info META-INF

Le dossier META-INF est un répertoire standard utilisé dans les 
applications Java, principalement pour stocker des métadonnées 
et des fichiers de configuration importants pour l'application, 
ou pour l'infrastructure qui l'exécute (comme un serveur 
d'application ou un conteneur).

Il est généralement situé à la racine de certaines archives 
Java, comme des fichiers JAR.

:::

Le fichier `persistence.xml` est placé dans le dossier META-INF 
du dossier resources et est lu par JPA pour établir la connexion 
à la base de données.


```xml showLineNumbers title="META-INF/persistence.xml"
<?xml version="1.0" encoding="UTF-8"?>
<persistence xmlns="https://jakarta.ee/xml/ns/persistence"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="https://jakarta.ee/xml/ns/persistence https://jakarta.ee/xml/ns/persistence/persistence_3_0.xsd"
             version="3.0">
// highlight-next-line             
    <persistence-unit name="userPU">
        <provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>
        // highlight-next-line
        <class>be.esi.prj.orm.User</class>

        <properties>
            <!-- URL de connexion à la base de données SQLite -->
            // highlight-next-line
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

Prenez attention aux valeurs surlignées qui doivent être adaptée
à votre projet  :
- **persistence-unit** : nom qui sera utilisé dans le code du Repository.
- **class** : chemin vers les entités.
- **jakarta.persistence.jdbc.url** : url de votre base de données.

## De DTO à Entité

Dans une application utilisant JPA avec Hibernate, les DTO (Data 
Transfer Objects) ne sont plus nécessaires pour représenter les 
données. 
À la place, vous utilisez des **entités** JPA, qui sont des 
classes annotées permettant de mapper directement les tables de 
la base de données.

Ces entités :

- Sont annotées avec @Entity pour être reconnues par JPA.
- Peuvent être directement gérées par le EntityManager (insertion, mise à jour, suppression, requêtes).
- Simplifient le code en évitant de devoir convertir constamment entre DTO et objets métier.

```java showLineNumbers title="User.java"
package be.esi.prj.orm;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private LocalDate birthDate;
    private double height;
    private boolean active;

    // Constructeur par défaut (nécessaire pour JPA)
    public User() {}

    // Constructeur avec tous les arguments
    public User(String name, LocalDate birthDate, double height, boolean active) {
        this.name = name;
        this.birthDate = birthDate;
        this.height = height;
        this.active = active;
    }

    // Getters et Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    // Méthode toString, hashCode, equals si nécessaire...
}
```

## Repository

Maintenant que vous avez défini votre entité JPA, vous allez
implémenter le UserRepository en utilisant JPA avec Hibernate. 
Contrairement à l’approche JDBC classique, où vous deviez écrire 
des requêtes SQL manuellement, JPA vous permet de manipuler 
directement les entités via la classe **EntityManager**.

Le code ci-dessous vous montre comment :
- Utiliser `EntityManager` pour insérer, mettre à jour, supprimer et rechercher des utilisateurs.
- Implémenter les méthodes du `UserRepository` en tirant parti des fonctionnalités de JPA.
- Remplacer la gestion manuelle des requêtes SQL par des appels simplifiés aux entités.

```java showLineNumbers title="UserRepository.java"
package be.esi.prj.orm;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.persistence.TypedQuery;

import java.util.List;
import java.util.Optional;

public class UserRepository {

    private EntityManagerFactory emf;
    private EntityManager em;

    public UserRepository() {
        // highlight-next-line
        emf = Persistence.createEntityManagerFactory("userPU");
        em = emf.createEntityManager();
    }

    public Optional<User> findById(int id) {
        return Optional.of(em.find(User.class, id));
    }

    public int save(User user) {
        int generatedId = -1;
        try {
            em.getTransaction().begin();
            em.persist(user);
            em.getTransaction().commit();

            // L'ID est mis à jour après la persistance
            generatedId = user.getId();

        } catch (Exception e) {
            em.getTransaction().rollback();
            throw e;
        }
        return generatedId;  // Retourne l'ID généré
    }

    public List<User> findAll() {
        TypedQuery<User> query = em.createQuery("SELECT u FROM User u", User.class);
        return query.getResultList();
    }

    public void delete(int id) {
        User user = findById(id).orElseThrow();
        try {
            em.getTransaction().begin();
            em.remove(user);
            em.getTransaction().commit();
        } catch (Exception e) {
            em.getTransaction().rollback();
            throw e;
        }
    }

    public void close() {
        em.close();
        emf.close();
    }
}
```

:::note Exercice A : Utiliser le nouveau repository

Remplacez dans la classe `RepositorySandbox` l'instance
de UserRepository utilisant JDBC par une instance utilisant
JPA. Constatez-vous une différence autre que modifier `UserDto` en `User` ?

:::