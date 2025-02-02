# Exercice 3 - Une brève analyse 

Maintenant que vous connaissez les instructions pour utiliser
Tesseract, réalisez le Proof Of Concept du projet **PaperPlease** en suivant l'analyse ci-dessous.
Si vous vous écartez de cette analyse, notez ces différences dans un document et discutez-en avec votre enseignant.

## Description des besoins

Créer une application qui permet à un utilisateur d'effectuer un scan OCR 
sur une image d'une carte étudiant spécifiée par son chemin afin d'en extraire le texte 
français qu'elle contient. L'application doit être robuste.
Une interface simple en ligne de commande doit être mise en place pour cette saisie. Le but de l'application est d'aider les enseignants à prendre les présences lors des examens.

## Flux principal d'utilisation

Afin d'éclaircir la description des besoins, vous trouverez ci-dessous
une description des étapes qu'un utilisateur suit pour scanner une image.
Les images des cartes étudiants sont déjà disponibles dans un dossier.

:::info Flux principal du scan d'une carte étudiant

- Étape 1 : Entrée utilisateur
    - L'utilisateur entre le chemin ou le nom d'un fichier image.
- Étape 2 : Vérification du fichier
    - L'application vérifie l'existence du fichier :
        - Si le fichier n'existe pas, un message d'erreur est envoyé et on retourne à l'étape 1.
        - Si le fichier existe, on passe à l'étape suivante.
- Étape 3 : Scan OCR
    - L'application démarre l'analyse OCR et note l'heure de début.
    - Le texte est extrait de l'image.
    - L'application note l'heure de fin.
- Étape 4 : Sauvegarde et affichage
    - Le texte extrait est sauvegardé dans un fichier texte.
    - L'application affiche :
        - Le nom du fichier de sortie.
        - L'heure de début et de fin de l'opération.

::: 

## Diagramme de séquence

Si vous préférez un diagramme au lieu du texte, il existe en UML
une représentation dite de séquence qui contient les mêmes informations.

```mermaid
sequenceDiagram
    participant Utilisateur
    participant Application
    participant Système de fichiers
    participant OCR

    Utilisateur->>Application: Entrer le chemin du fichier
    Application->>Système de fichiers: Vérifier si le fichier existe
    alt Fichier non trouvé
        Système de fichiers-->>Application: Fichier introuvable
        Application->>Utilisateur: Afficher "Erreur : Le fichier n'existe pas"
    else Fichier trouvé
        Système de fichiers-->>Application: Fichier trouvé
        Application->>Utilisateur: Afficher "Scan en cours..."
        Application->>Application: Enregistrer l'heure de début
        Application->>OCR: Lancer le scan OCR (modèle français)
        OCR-->>Application: Texte extrait ou erreur
        Application->>Application: Enregistrer l'heure de fin
        Application->>Système de fichiers: Sauvegarder le résultat dans un fichier texte
        Système de fichiers-->>Application: Fichier sauvegardé
        Application->>Utilisateur: Afficher le nom du fichier et les horaires du scan
    end
```

## Diagramme de classes

La décomposition en classes suivante est proposée pour
répondre aux besoins de l'utilisateur.

```mermaid
classDiagram
direction BT
class ConsoleView {
  + ConsoleView() 
  + askFileName() String
  + printError(message : String) void
  + printResult(message : String) void
  - input : Scanner
}
class Controller {
  + Controller(model : OcrScanner, view : ConsoleView) 
  + start() void
  + askFileName() void
  + scan() void
  + end() void  
}
class FileUtils  {
  + isFileFound(fileName : String) boolean $
  + writeTo(results : String, filePath : Path) $
  + getTraineddataDirectory() $
}
class OcrScanner {
  + OcrScanner() 
  + isFileFound(imageName : String) boolean
  + setFileToScan(imageName : String) 
  + scan() Path
  - fileToScan : Path
  - tesseract : Tesseract 
}

Controller "1"  --> "1" ConsoleView 
Controller "1"  --> "1" OcrScanner 
```

## Plan de tests

Lorsque vous avez terminé de développer votre application, 
il faut vérifier si elle correspond aux besoins de départ
en testant manuellement celle-ci. 
Voici les 2 cas à tester pour valider votre travail.

### Cas 1 : Le fichier spécifié n'existe pas

#### Préconditions :
 - L'application est lancée.
 - Le fichier spécifié n'est pas présent sur le disque.

#### Étapes :
 - L'utilisateur entre le chemin d'un fichier inexistant, par exemple : C:\images\inexistant.png.
 - L'application vérifie l'existence du fichier.

#### Résultat attendu : 
 - L'application affiche un message d'erreur : "Erreur : Le fichier spécifié n'existe pas. Veuillez vérifier le chemin."
 - L'utilisateur peut ressaisir un chemin.

### Cas 2 : Le fichier spécifié existe et l'OCR réussit

#### Préconditions :
 - L'application est lancée.
 - Le fichier spécifié est une image valide, par exemple : C:\images\g12345.png.

#### Étapes :
 - L'utilisateur entre le chemin d'un fichier existant.
 - L'application vérifie l'existence du fichier.
 - L'application exécute l'analyse OCR sur l'image.
 - Le texte extrait est sauvegardé dans un fichier texte (ex. resultat_20250128_141513.txt).
 - L'application affiche :
    - Le nom du fichier de sortie.
    - L'heure de début et de fin de l'analyse.

#### Résultat attendu :
 - L'application indique :
    - "Scan en cours..."
    - "Résultat sauvegardé dans : resultat_20250128_141513.txt"
 -  - L'heure de début et l'heure de fin (ex. 14:15:13).
 - Le fichier resultat_20250128_141513.txt contient le texte extrait.

:::tip Pour aller plus loin

D'autres cas  à tester sont envisageables. Par exemple les cas où :  
- l'image ne contient pas de texte
- Tesseract n'a pas été installé
- les données d’entraînements sont absentes

Il n'est pas nécessaire de tester ces cas dans le cadre de cet exercice.

:::
