> [!info] Astrazione superiore dei dispositivi fisici con le seguenti caratteristiche:
> - Storage permanente
> - Accesso a blocchi
> - Alta capacità
> - Basso costo
> - Basse performance

## Astrazione

#### Directory
- Una directory è una struttura dati che collega ogni file name ai suoi attributi (indirizzo sul disco, dimensione, diritti ecc...).
- In Unix è una tabella che associa ad ogni file name un puntatore che si riferisce al suo file descriptor (i-node), che risiedono su una struttura dati separata sul disco.
- Le directory sono esse stesse dei file.
- Le directory piccole possono essere rappresentate come degli array, mentre quelle più grandi come dei B-Tree, per migliorare i tempi di ricerca.

#### File
Sequenza lineare di bytes (o insieme di sequenze).

#### Links
- Hard link -> Aggiunge nella tabella della directory il puntatore al file descriptor del file linkato.
- Soft link -> Creo un file che è linkato a un altro file che può risiedere anche in un'altra locazione, quindi i due file avranno lo stesso contenuto.

#### Mount
Prendere la root di un dispositivo montato e assegnargli un nome sotto il nostro file system.

### Metodi di accesso
1. Sequenziale
	* Il file è visto come una sequenza di record logici, quindi per accedere al record *i* occorre aver visitato i precenti *i-1* records.
1. Diretto
	* Il file è visto come un insieme di record logici, e l'utente può accedervi direttamente.

### Unix File System API
1. Seek -> Modificare la posizione corrente nel file.
2. Fsync ->  Forza le modifiche immediatamente sul disco.

### Strutture dati
1. <u>Directory</u>
2. <u>Metadati</u>: informazioni su come trovare i file data blocks, più le proprietà del file.
3. <u>Free map</u>: lista dei blocchi liberi sul disco.

> [!warning] I file sono accessibili in records ma sono fisicamente archiviati e disponibili in blocchi. Di solito block size >> record size.

## FAT (Microsoft File Allocation Table)

- Struttura linked list, facile da implementare.
- La file table è una mappa lineare di tutti i blocchi sul disco. Ogni file è una linked list di blocchi. Deve essere allocata sulla main memory.
- Alta frammentazione, dato che i blocchi dello stesso file o della stessa directory possono essere sparpagliati.

## FFS (Unix Fast File System)

- Tabella di i-node, chiamata i-list.
- Gli i-node contengono i metadati e un insieme di puntatori ai data blocks.

#### Puntatori
- 12 puntatori da 32 bit ciascuno.
- 1 puntatore a un blocco indiretto.
- 1 puntatore a un doppio blocco indiretto.
- 1 puntatore a un triplo blocco indiretto.

#### Località

> [!todo] Block group
> Un block group è un insieme di cilindri vicini. I file nella stessa directory sono nello stesso gruppo.

- <u>Allocazione first fit</u>: i file piccoli sono frammentati, mentre quelli larghi sono contigui.

### NTFS

- Si utilizza la Master File Table, che esso stesso è un file. E' una tabella di record, uno per file.

> [!info] Extends
> Si memorizza solo il puntatore al primo blocco e il numero di blocchi. Solo per blocchi contigui.
> - Nei file piccoli i dati sono direttamente memorizzati nel record.
> - Per quelli medi ci sono un numero di extends che dipende dai dati, se sono memorizzati in blocchi contigui o meno.

> [!tip] Blocchi indiretti
> Nei file più grandi, vi è una sezione *attr. list* che memorizza dei puntatori ad altri record, sempre nella Master File Table, che contengono solo gli extends.
> 
> Nei file ancora più grandi, la *attr. list* può essere *nonresident* ed, in questo caso, è essa stessa una extend.



