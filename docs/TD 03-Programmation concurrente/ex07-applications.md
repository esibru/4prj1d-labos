# Exercice 7 - Applications

![work in progress](/img/work-in-progress.jpeg)

Vous devez développer une application Java capable de télécharger un 
fichier depuis une URL en utilisant plusieurs threads pour améliorer la 
vitesse de téléchargement. L’application devra être organisée en plusieurs
classes pour assurer une bonne séparation des responsabilités et 
utiliser une interface graphique créée avec JavaFX et un fichier FXML.

## Algorithme à implémenter

1. Analyse du fichier distant
    1. Effectuer une requête HTTP de type HEAD pour récupérer la taille du fichier.
    1. Diviser le fichier en N parties (selon le nombre de threads).

1. Téléchargement multi-threadé
    1. Créer N threads où chaque thread télécharge une plage spécifique du fichier.
    1. Utiliser l’en-tête HTTP Range pour demander uniquement une partie du fichier.
    1. Chaque thread écrit sa partie directement dans le fichier en utilisant FileChannel.

1. Synchronisation et finalisation
    1. Attendre que tous les threads terminent leur téléchargement.
    1. Afficher un message de succès lorsque le téléchargement est terminé.

## Utilisation des bibliothèques suivantes et méthodes clés :

1. java.net.http.HttpClient (pour les requêtes HTTP)
    1. HttpClient.newHttpClient() → Crée un client HTTP.
    1. HttpRequest.newBuilder().uri(URI.create(url)).method("HEAD", HttpRequest.BodyPublishers.noBody()).build() → Envoie une requête HEAD pour récupérer les métadonnées du fichier.
    1. client.send(request, HttpResponse.BodyHandlers.discarding()) → Exécute la requête et récupère la réponse.
    1. client.send(request, HttpResponse.BodyHandlers.ofByteArray()) → Télécharge une portion du fichier sous forme de tableau de bytes.

1. java.nio.channels.FileChannel (pour l’écriture efficace du fichier téléchargé)
    1. FileChannel.open(path, StandardOpenOption.CREATE, StandardOpenOption.WRITE) → Ouvre un fichier en mode écriture.
    1. fileChannel.position(start) → Positionne l’écriture à un endroit précis du fichier.
    1. fileChannel.write(ByteBuffer.wrap(data)) → Écrit les données téléchargées dans le fichier.

## Interface utilisateur avec JavaFX

- Champ de texte pour entrer l’URL du fichier à télécharger.
- Bouton “Démarrer” pour lancer le téléchargement.
- Barre de progression indiquant l’avancement du téléchargement.
- Label affichant les erreurs ou le succès du téléchargement.