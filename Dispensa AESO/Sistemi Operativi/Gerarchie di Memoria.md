> [!abstract] Regole generali
> - Le memorie più sono grandi e più sono lente ed economiche.
> - Le memorie più sono piccole e più sono veloci e costose.

Implementando il sistema di memoria come una gerarchia, il programmatore la vede come un'unica memoria, grande quanto l'ultimo livello della gerarchia, e veloce quanto il primo (quello più vicino alla CPU).

- All'inizio i dati risiedono tutti nell'ultimo livello di memoria.
- Quelli riferiti si spostano dal livello *n* al livello *n-1*.

> [!info] Terminologia
> - **Hit**: quando il dato richiesto si trova nel livello più vicino di memoria.
> - **Miss**: altrimenti si verifica un miss e si cerca il dato nel livello di memoria successivo.
> - **Hit rate**: la frequenza di accessi di memoria andati a buon fine nel livello più vicino alla CPU.
> - **Miss rate**: la frequenza di accessi di memoria non andati a buon fine nel livello più vicino alla CPU.
> - **Miss penalty**: il tempo necessario per rimpiazzare un blocco nel livello *n* con il corrispettivo blocco dal livello *n-1*.
> - **Miss time**: il tempo per ottenere il dato in caso di miss.

$$MR = \frac{Numero\;di\;miss}{Numero\;totali\;di\;accessi\;alla\;memoria} = 1 - HR$$
$$HR = \frac{Numero\;di\;hit}{Numero\;totali\;di\;accessi\;alla\;memoria} = 1 - MR$$
L'*AMAT* o *Average Memory Access Time* è definito come:
$$AMAT = t_{M0} + MR_{M0} \cdot (t_{M1} + MR_{M1} \cdot (t_{M2} + MR_{M2} \cdot (t_{M3} + \dots)))$$
dove *MRx* è il miss rate al livello di memoria *x* e *tx* è il tempo di accesso al livello di memoria *x*.

## Località
- **Temporale**: c'è la probabilità che dati che sono stati utilizzati recentamente vengano richiesti di nuovo.
- **Spaziale**: se leggo un dato memorizzato in una data posizione, c'è la probabilità che legga anche quelli nelle sue vicinanze.

## Cache
La cache è il livello di memoria più vicino alla CPU.

Lo spostamento dei dati dati dal primo livello di cache ai registri è gestito dal compilatore tramite le istruzioni di *LDR* e *STR*.
Mentre fra livelli di cache e fra cache e RAM è gestito a livello hardware.
Invece tra i dispositivi di archiviazione e la RAM è gestito dall'OS.

Le cache sono organizzate in linee, ogni linea contiene un blocco di parole di memoria.
Si utilizza una funzione di mapping che associa ad ogni indirizzo di memoria un ID che identifica una linea di cache.

Per capire se un dato nella cache è valido si utilizza un singolo bit di validità.

#### Performance
Il tempo che impiega la CPU ad eseguire le istruzioni è definito come:
$$CPU_{time} = IC \cdot CPI \cdot ClockCycleTime$$
dove l'*Instruction Count* è il numero di istruzioni che il programma esegue. Il *CPI*, invece sono i cicli di clock eseguiti per ogni istruzione.

Il *CPI* può essere diviso nei cicli che la CPU spende per eseguire le istruzioni senza miss (*perfetto*) e nei cicli di clock che la CPU spende aspettando il sistema di memorie (*stallo*):
$$CPI = CPI_{perfect} + CPI_{stall}$$
I cicli di clock sugli stalli di memoria sono definiti come la somma di tutti gli stalli che provengono dalle istruzioni di lettura e scrittura (si assume che entrambe abbiano lo stesso miss rate e miss penalty):
$$CPI_{stall} = \frac{Istruzioni\;di\;Memoria}{Istruzioni\;totali} \cdot Miss\;Rate \cdot Miss\;Penalty$$
##### Cache Multi-Livello
Nel caso di cache multilivello, i cicli di clock sugli stalli di memoria possono essere definiti come la somma di tutti i cicli di stallo che provengono da ogni livello di cache:
$$CPI_{stall} = MissRate_{L1} \cdot MissPenalty_{L1} + GlobalMissRate_{L2} \cdot MissPenalty_{L2} + \dots$$
Dove il *Global Miss Rate* per un dato livello *LN* è:
$$GlobalMissRate_{LN} = MissRate_{L1} \cdot MissRate_{L2} \cdot\;\dots \;\cdot MissRate_{LN}$$

### Metodi di Indirizzamento

#### Diretto
>Le parole di memoria possono essere posizionate solo in 1 linea della cache.

Un'indirizzo di memoria è formato come segue:
|TAG|Nr. Linea|Offset di Blocco|Byte Offset|
|-|-|-|-|

>[!bug] Contro
>- Dato che una singola parola di memoria può risiedere in un unica linea della cache, non è possibile tenere conto della località temporale durante la sostituzione della linea.
>- La rigidità di questo metodo aumenta il numero di conflitti che può sfociare nel *trashing*.

#### Cache Completamente Associative
>Le parole di memoria possono risiedere in qualunque linea della cache.

Quindi per trovare un dato indirizzo occorre cercare in tutte le sue linee, in parallelo, dato che ogni linea ha un comparatore, quindi a livello hardware il costo è significativo.

Un'indirizzo di memoria è formato come segue:
|TAG|Offset di Blocco|Byte Offset|
|-|-|-|

#### Cache Associative a N-vie
>Si raccolgono un numero fissato *N* di linee di cache in *set*, quindi ogni parola di memoria può essere inserita in una qualunque delle *N* linee del suo *set* che è fissato.

Per trovare un dato indirizzo, occorre cercare in parallelo ma solo sulle *N* linee del suo set.

Un'indirizzo di memoria è formato come segue:
|TAG|Nr. Set|Offset di Blocco|Byte Offset|
|-|-|-|-|

### Tipi di Cache Miss
- Compulsory miss: sono quelli inevitabili come il primo accesso.
- Capacity miss: quando la cache non può contenere tutti i blocchi richiesti, quindi inevitabilmente alcuni vengono liberati e rientrano successivamente.
- Conflict miss: ovviamente possono verificarsi solo per l'indirizzamento diretto e ad N-vie.

> [!abstract] Ridurre il Miss Rate
> - Aumentare la dimensione della linea: ci permette di struttare meglio la località spaziale, ma aumenta il miss penalty e la probabilità di avere conflitti, dato che in una cache ad N-vie il numero di insiemi diminuisce.
> - Aumentare il numero di insiemi e/o la capacità della cache: meno conflitti, ma aumenta l'hit time.

> [!tip] Out-of-order execution
> Alcuni processori permettono di eseguire altre istruzioni mentre attendono per la risposta dalla gerarchia di memoria.

### Gestione delle Scritture
Due casi:
- Se abbiamo una *write hit* (si trova lo stesso TAG nella cache): si scrive il dato solo nella cache, ma in questo caso nella memoria non avremo il dato aggiornato.
- Se abbiamo un *write miss* ci sono due possibilità:
	- *Write-allocate*: il blocco è caricato nella cache e poi si effettua una *write hit*.
	- *No-write-allocate*: il blocco non è caricato nella cache.

#### Write-Through
>I *write hit* aggiornano sia la cache che il successivo livello di memoria.
>In caso di *write miss* utilizza la *no-write-allocate*.

#### Write-Back
>I *write hit* aggiornano solo la cache, il blocco aggiornato sarà spostato nel livello di memoria successivo quando nella cache verrà rimpiazzato.
>In caso di *write miss* utilizza la *write-allocate*.

>[!warning] Dirty Bit
>Occorre tenere traciia dei blocchi modificati tramite l'uso di un *dirty bit*.
>Inoltre, nel caso si verifica un write miss, il costo di scrittura è maggiore dato che, se il *dirty bit* del blocco che và sostitutito è a *1* bisogna prima riscrivere il blocco in memoria e successivamente possiamo spostare il nuovo blocco nella cache.

### Politiche di sostituzione

>[!error] Attenzione
>Nelle cache ad accesso diretto ogni blocco può andare solo in una esatta posizione, quindi non c'è altra scelta.

- **LRU** (Least Recently Used): tiene conto della località temporale, quindi la linea rimpiazzata è quella che non è stata usata per più tempo. Occorre utilizzare un numero di bit corrispondente a $\log_{2}{Numero\;di\;linee\;per\;insieme}$.
- Per le cache completamente associative si utilizza una politica **random**.

## Progettare il Sistema di Memoria
Il miss penalty può essere ridotto aumentando la banda del bus tra la memoria centrale e la cache.

Ci sono 3 possibili orgnanizzazioni:
- Simple: una parola alla volta viene letta dalla memoria.
	![[simple.png]]
- Wide-memory: *N* parola alla volta sono lette.
- Interlacciata: ci sono *m* indipendenti banchi di memoria, quindi siamo capaci di gestire *m* richieste contemporaneamente.
	![[interleaving.png]]

*b*: numero di blocchi in ogni linea di cache.

## Problemi Cache

### Coerenza
>Nei sistemi con multiprocessori, ogni core può avere dei livelli di cache dedicati che poi si collegano a cache che si trovano in livelli più alti che appartengono a tutti i core.

Questo può provocare problemi quando prima leggiamo lo stesso dato su tutti i nostri core e poi uno di questi processori lo riscrive; utilizzando una politica *write-through* le modifiche arriveranno fino alla memoria centrale, ma non passeranno nelle cache che si trovano nello stesso livello.

Per risolvere questo problema è possibile usare uno *snooping bus control*

### Ottimizzazioni Software
Lato software, per migliorare la località spaziale è possibile utilizzare dei *loop interchange*, mentre per quella temporale si usa una tecnica di *data blocking*.