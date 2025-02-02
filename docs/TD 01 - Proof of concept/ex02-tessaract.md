# Exercice 2 - Reconnaissance optique de caractères

La reconnaissance optique de caractères ou OCR pour l'anglais optical 
character recognition, désigne les procédés informatiques pour la 
transcription d'images de textes imprimés ou dactylographiés en fichiers 
de texte.
Pour effectuer cette tâche, vous allez utiliser Tesseract, un logiciel de reconnaissance optique de caractères sous licence Apache.


:::info L'instant wikipedia

Conçu par les ingénieurs de Hewlett Packard de 1985 à 1995, son développement est abandonné pendant les dix années suivantes ; en 2005, les sources du logiciel sont publiées sous licence Apache et Google poursuit son développement. Initialement limité aux caractères ASCII, il reconnaît les caractères UTF-8 dans plus de 100 langues. 

:::

## Installation

Cherchez votre système d'exploitation dans 
[la documentation de Tesseract](https://tesseract-ocr.github.io/tessdoc/Installation.html)
et installez le sur votre machine.

Une fois l'installation terminée, vérifiez que la commande
`tesseract -v` affiche la version installée et suivez les instructions
ci-dessous pour scanner votre premier document.

## Création du projet

1. Créez un projet java avec maven intitulé `OcrQuickRun`
1. Ajoutez les dépendances suivantes dans le `pom.xml`
```xml showLineNumbers
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-simple</artifactId>
    <version>2.0.6</version>
    <scope>runtime</scope>
</dependency>

<dependency>
    <groupId>net.sourceforge.tess4j</groupId>
    <artifactId>tess4j</artifactId>
    <version>5.11.0</version>
</dependency>
```
3. Ajoutez dans le main `Tesseract tesseract = new Tesseract();`
sans oublier d'importer la classe `net.sourceforge.tess4j.Tesseract;`.
1. Essayez de compiler et d'exécuter votre projet.

## Les données d’entraînement

Les données d'entraînement de Tesseract sont des fichiers  qui 
permettent au moteur OCR de reconnaître et d'interpréter le texte 
dans les images.
Les données d'entraînement se présentent sous la forme de fichiers 
`.traineddata`. Chaque fichier correspond à une langue. Par exemple :
- `eng.traineddata` pour l'anglais.
- `fra.traineddata` pour le français.

Ces fichiers contiennent les polices et les formes des caractères ainsi que des statistiques linguistiques.

**Téléchargez** les données d’entraînement du logiciel relatives au français 
[fra.traineddata](https://github.com/tesseract-ocr/tessdata_fast)
 et placez le fichier dans le sous-dossier `data` des ressources du projet (`/src/main/resources/data`).

Ajoutez dans votre `main` le code permettant lire ces données d’entraînement. 
```java showLineNumbers
    ClassLoader classLoader = Main.class.getClassLoader();
    String dataDirectory = classLoader.getResource("data").getFile();
    tesseract.setDatapath(dataDirectory);

    // Optionally set language
    tesseract.setLanguage("fra");
```

Vérifiez que les fichiers sont visibles par votre programme
en essayant de l'exécuter.

:::danger Gestion des fichiers traineddata dans Git

Les fichiers `traineddata` sont volumineux et 
**ne doivent pas être versionnés** dans le dépôt Git.
Ces fichiers ne sont pas modifiés par le code source et peuvent être téléchargés séparément.
Ajoutez la ligne suivante dans le fichier `.gitignore` :

```
*.traineddata
```

Téléchargez les fichiers `traineddata` à chaque installation en les récupérant depuis la source officielle de Tesseract 

De cette façon chaque développeur pourra récupérer les fichiers nécessaires sans alourdir le dépôt.

:::

## Les images à scanner

Prenez une photo de votre carte étudiant et déposez cette image dans un dossier extérieur à votre projet java intitulé `data-out`.
Renommez cette image `g12345.png` et vérifiez que votre programme reconnaisse les caractères qui sont présents sur votre carte
en ajoutant le code suivant à votre `main` : 

```java showLineNumbers
String imageName = "g12345.png";
Path imagePath = FileSystems.getDefault().getPath("data-out/", imageName);
String result = tesseract.doOCR(imagePath.toFile());
System.out.println(result);
```