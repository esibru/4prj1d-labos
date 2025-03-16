# En résumé…
:::note
Dans la grammaire de Java, le fichier `module-info.java` possède le format suivant :
```
ModuleDeclaration:
    {Annotation} [open] module Identifier {. Identifier} { {ModuleDirective} }

ModuleDirective:
    requires {RequiresModifier} ModuleName ;
    exports PackageName [to ModuleName {, ModuleName}] ;
    opens PackageName [to ModuleName {, ModuleName}] ;
    uses TypeName ;
    provides TypeName with TypeName {, TypeName} ;

RequiresModifier:
    (one of)
    transitive static
```

En pratique, cela donne au fichier la forme suivante : 
```java showLineNumbers title="module-info.java"
module $NAME {
    // for each dependency:
    requires $MODULE;

    // for each API package:
    exports $PACKAGE

    // for each package intended for reflection:
    opens $PACKAGE;

    // for each used service:
    uses $TYPE;

    // for each provided service:
    provides $TYPE with $CLASS;
}
```

Où 
- `requires` déclare une dépendance
- `exports` déclare un point d'accès
- `opens` ouvre une permission de réflexion
- `uses` déclare un service utilisé par le module
- `provides` déclare un service fourni par le module
:::

:::warning
Notez donc aussi qu'il est possible de déclarer un module entier comme `open` via `open module $NAME`. Cela revient au même que de déclarer une instruction `opens` pour _tous_ les packages du module. C'est toutefois bien sûr une pratique dangereuse puisqu'elle nuit à l'encapsulation du module ; elle est présente notamment pour des raisons de rétrocompatibilité.
:::