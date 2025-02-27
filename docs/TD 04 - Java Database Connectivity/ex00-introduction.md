# Introduction

Ce TD a pour objectif de vous appendre à développer des applications Java 
connectées à une base de données. Pour ce faire nous utiliserons la librairie JDBC.
Dans le cadre de se TD nous utiliserons SQLite comme système de persistance.

Java Data Base Connectivity est une API qui permet d’exploiter des bases de données
au travers de requêtes SQL. Cette API permet d’écrire un code indépendant du SGBD
utilisé.

JDBC présente essentiellement des interfaces qui sont implémentées différemment pour
chacun des SGBD auxquels nous désirerons accéder. Bien évidemment, à l’exécution du
programme il faut disposer du driver JDBC (bibliothèque java spécifique d’accès au SGBD)
adapté au système de gestion de base de données cible.
Nous nous limiterons ici aux informations indispensables pour débuter.

## Base de données SQLite

SQLite est une bibliothèque écrite en langage C qui propose un moteur de base
de données relationnelle accessible par le langage SQL. L’intégralité de la base
de données (déclarations, tables, index et données) est stockée dans un fichier
indépendant de la plateforme.

Vous trouverez toutes les informations concernant SQLite sur le site https://www.
sqlite.org/index.html.
On peut utiliser SQLite en mode console via l’installation de sqlite3 dont la 
documentation est accessible via ce lien https://www.sqlite.org/cli.html

On peut également utiliser l’outil DB Browser for SQLite qui propose une interface
plus "accessible". Installé à l’adresse : C:\Program Files\DB Browser for SQLite sur
les machines de l’école, vous pouvez le télécharger via https://sqlitebrowser.org/.