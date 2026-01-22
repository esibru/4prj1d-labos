# Exercice 5 - Deadlock

L'étreinte mortelle (ou interbloquage ou deadlock) survient 
lorsque deux threads sont en attente d'une ressource que possède 
l'autre thread. C'est-à-dire; 
- la thread 1 possède la clé de l'objet A et attend celle de l'objet B,
- la thread 2 possède la clé de l'objet B et attend celle de l'objet A

Ce type d'erreur est difficile à détecter. 
Résolvez les exercices ci-dessous pour en comprendre
les mécanismes.

:::note Exercice a
Écrivez un code générant un **deadlock**. 
:::

:::note Exercice b

Écrivez une classe `BankAccount` qui permet de maintenir un solde bancaire en ayant 3 méthodes: 

- deposit(int amount) (dépôt),
- withdraw(int amount) (retrait), 
- et int getBalance() (solde).

Écrivez ensuite une classe `Transaction` qui simule, dans une thread, 
une succession infinie d'opérations ajoutant et retirant une même somme 
sur un compte donné et puis affichant le solde du compte.

Écrivez ensuite une classe `Main` qui fait tourner 20 threads de type
`Transaction` en même temps sur un même objet du type `BankAccount`. 

Corrigez si nécessaire votre code jusqu'à ce que le solde du compte soit 
cohérent après chaque opération (jamais de solde négatif par exemple).
:::