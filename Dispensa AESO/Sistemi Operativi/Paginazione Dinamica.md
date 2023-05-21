> [!warning] La memoria principale è vista come una cache del disco.

## Descrittore di pagina fisica
|nr. di pagina fisica se *P = 1 * oppure indirizzo della pagina sul disco se *P = 0*| R | W | U |M | P|
|-|-|-|--|-|-|

- M -> bit modified. Impostato dall'hardware sulle istruzioni di *store*
- B -> bit used. Impostato dall'hardware sulle istruzioni di *fetch*, *load* e *store*
- R -> read
- W -> write

> [!info] Bit M e U resettati dal kernel periodicamente o dopo un salvataggio sul disco.

>[!tip] Il sistema operativo può emulare i bit M e U
> M -> settare inizialmente le pagine pulite solo come read-only
> U -> settare inizialmente le pagine non usate come invalide

## Page replacement
1. TLB miss
2. Page fault nella page table (*P = 0*)
3. Si passa in kernel mode
4. Si alloca un page frame nella main memory e si inizia la lettura dal disco
5. Quando il DMA completa il trasferimento si verifica un interrupt da parte del disco
6. La pagina viene marcata come valida
7. Si ripristina il processo
8. TLB miss
9. Page table hit
10. Si esegue l'istruzione

## Politiche di rimpiazzo

### FIFO
> Si rimpiazza la pagina che è stata in memoria per più tempo.

>[!fail] Trashing quando il working set > cache capacity

### MIN (Utopico)
> Si rimpiazza la pagina che sarà usata di meno nel futuro.

### LRU (Least Recently Used)
> Si rimpiazza la pagina che in passato è stata usata di meno.

### NRU (Not Recently Used)
> Si usa il bit *U* per vedere la pagina meno usata nell'ultimo periodo *T*.

>[!help] Belady's Anomaly
> Certe volte aumentare la capacità della cache non riduce i problemi dell'algoritmo in uso.

### Second Chance
- Algoritmo FIFO implementato col reference bit *R*.
- Le pagine sono ordinate in una linked list.
- Se occorre rimpiazzare una pagina, si scorre la lista a partire dalla testa (la pagina più vecchia):
	- Se *R = 0* si prende quella pagina come vittima.
	- Altrimenti si setta *R* a *0* e si continua a scorrere la lista.

### Clock Algorithm
> Algoritmo *Second Chance* implementato con una lista circolare.

### Nth Chance
> Generalizzazione dell'algoritmo *Second Chance* che utilizza un intero *N* al posto del bit *R*.
> Se la pagina è stata usata si pone la variabile a *0*, altrimenti se è *< N* si incremente, se non rispetta nessuna di queste 2 condizioni, la pagina è la vittima.

### Algoritmi Globali
> La scelta della vittima è fra tutte le pagine nella memoria principale.

>[!fail] Trashing per processi lenti.

### Algoritmi Locali
> La scelta è fra le pagine del processo che ha causato il page fault.

### Algoritmo Working Set (Locale)
Il working set può essere definito come:
- L'insieme di pagine riferite negli ultimi *k* accessi.
- L'insieme di pagine riferite nell'ultimo periodo *T*. Si utilizza maggiormente questo, facendo uso del bit *U*.

> Ogni processo ha un numero di pagine fisiche riservate per caricare il proprio working set.

>[!info] Resident set
>Insieme delle attuali pagine virtuali in memoria. $$W.S. \subseteq R.S.$$

Ogni pagina ha:
- Un bit *R* che indica se la pagina è stata riferita nell'ultimo periodo.
- Una variabile *TLR* che indica il tempo dell'ultimo riferimento della pagina.
- Una variabile *age = tempo corrente - TLR*.

Quando si verifica un page fault:
- Se *R = 0*, allora *age = tempo corrente - TLR*.
- Altrimenti, se *R = 1*, allora *TLR = tempo corrente* e *age = 0*, e si reimposta *R* a *0*.
- Se si incontra una pagine con *age < T* allora rimane nel working set e non si rimuove dalla memoria.

Due possibili implementazioni:
- On demand paging: all'inizio nessuna pagina è in memoria, quindi si verificheranno una serie di page faults.
- Prepaging: un nuovo processo diventa pronto quando tutte le sue pagine del working set sono state caricate in memoria. Occorre conoscere il working set prima.

> [!info] Page Fault Frequency
> Il PFF è un algoritmo dinamico che permette di ridimensionare il numero di pagine fisiche allocate ad un processo. Garantisce che il resident set sia sempre maggiore o uguale del working set. Quando il numero di page faults aumenta, si incrementa la dimensione del resident set, altrimenti si diminuisce.

> [!fail] Se ci sono troppi processi attivi, la somma di tutti i working set potrebbe essere maggiore della capacità della memoria, ricadendo di nuovo nel trashing.

>[!info] Ogni segmento di un processo è salvato su un file, che può essere permanente o temporaneo a seconda del segmento, sul disco.

## Gestione della memoria Unix
> Memoria virtuale basata sulla paginazione on-demand.
> L'algoritmo di rimpiazzo è il *Second Chance* globale.

### File I/O
Per la gestione dei file ci sono due alternative:
1. System calls: utilizzare le primitive di *read* o *write*. I dati sono copiati nel processo utente. Quando ci sono modifiche ai dati il kernel rispedisce le modifiche al file utilizzando le system calls.
2. Memory-mapped files: aprire un file come un segmento di memoria, in questo modo il programma utlizza le istruzioni di *load* e *store* per operare sul file.
	- Si può scegliere se cariare tutto il file in memoria.
	- Oppure caricare solo la parte interessata, ed in caso di page fault caricare la parte restante.
	- I dati sono copiati direttamente dal disco al page frame.

## Gestione della memoria Windows
> L'algoritmo è il *Working Set* locale.
> Lavora sulle resident pages.

La memoria è da 4 GB con indirizzi a 32 bit paginata a dimensioni fisse:
- 2 GB sono privati di ogni processo.
- I restanti sono condivisi fra tutti i processi ed è dove viene mappato l'OS.

>[!info] A differenza di UNIX, il segmento *TXT* si chiama *PROGRAM* e non è condiviso fra i processi.

### Gestione page fault
- Per un dato processo si imposta *x* come la capacità del resident set che appartiene al range *\[min, max\]*.  All'inizio queste variabili sono inizializzate con valori di default, ma possono variare in base alle esigenze del processo. 
- Quando si verifica un page fault, il valore di *x* viene incrementato di *1*.
- Se *x* è maggiore o uguale di *max* una pagina del processo viene rimossa.
- Ad ogni pagina *p* corrisponde una variabilie *count(p)*, quando *x > max*:
	- Se *R = 1*, si resetta *R* e *count(p)*.
	- Altrimenti si incrementa *count(p)*.
	- L' insieme di pagine *x - max* da rimuovere è scelto in ordine decrescente di *count(p)*.