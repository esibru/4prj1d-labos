# Exercice 7 - Data Access Object

Il est courant d'ajouter un système de cache dans un Repository 
pour améliorer les performances et réduire les accès inutiles à 
la base de données. 

Cela est particulièrement utile lorsque :

- Les données changent peu fréquemment → Exemple : liste des pays, catalogue de produits, profils utilisateur rarement modifiés.
- Les requêtes sont coûteuses → Exemple : jointures complexes, agrégations lourdes, ou appels à un service distant.
- L'application a un fort trafic → Éviter que trop de requêtes surchargent la base de données.

Voici une implémentation d’un UserRepository qui utilise 
ConcurrentHashMap comme système de cache pour stocker les utilisateurs en mémoire.

```java showLineNumbers

```

Il est pertinent de diviser ce UserRepository en deux parties distinctes :

- UserDAO : Responsable de l'accès aux données (Base SQLite)
- UserRepository : Responsable du cache et de la gestion métier

```java showLineNumbers

```

```java showLineNumbers

```

Avantages de cette approche

1. Séparation claire des responsabilités
    - UserDAO = Requêtes SQL, gestion JDBC.
    - UserRepository = Cache, logique métier.
1. Évolutif & maintenable
    - On peut facilement changer le DAO pour une autre base (MySQL, PostgreSQL, etc.).
    - On peut remplacer ConcurrentHashMap par Redis, Ehcache, Caffeine sans toucher au DAO.

