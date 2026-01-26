# Introduction

Les _threads_ (_processus léger_ ou encore _fil d'exécution_ en français) en Java permettent d'exécuter plusieurs tâches en parallèle, améliorant ainsi la réactivité et les performances des applications. 
Ils sont essentiels pour la programmation concurrente, notamment dans les 
systèmes multitâches ou les applications serveur.

Cette série d'exercices vous guidera dans la compréhension et la mise en pratique des _threads_ en Java. Vous apprendrez à :

- Créer et exécuter des threads avec `Thread` et `Runnable`.
- Gérer la synchronisation et éviter les problèmes de concurrence.
- Comprendre le rôle des _threads daemon_, utilisés pour des tâches d’arrière-plan.
- Identifier et prévenir les _deadlocks_ (_étreinte mortelle_ en français), qui peuvent bloquer un programme lorsque plusieurs threads attendent indéfiniment l'accès à des ressources partagées.