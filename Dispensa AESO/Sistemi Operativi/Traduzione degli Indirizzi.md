> [!info] La MMU (Memory Management Unit) si occupa della traduzione degli indirizzi

## Frammentazione
- Due tecniche per allocare una nuova partizione:
	- **First-fit**: si prende la prima partizione libera grande abbastanza per allocare quella nuova.
	- **Best-fit**: fra tutte le partizioni libere si sceglie la più piccola che sia grande abbastanza per allocare quella nuova.

> [!error] Frammentazione Interna
> Memoria allocata ad una partizione ma non tutta è necessaria al processo. Succede nel caso vengono usate partizioni di lunghezza fissa.

> [!error] Frammentazione Esterna
> Le partizioni di memoria libere sono troppo piccole, anche se la loro somma è sufficiente, per allocare una nuova partizione. Succede nel caso vengono usate partizioni di lunghezza variabile.

## Base + Bound
- Nella MMU risiedono 2 registri:
	- Il *base* che indica l'indirizzo fisico da cui partire.
	- Il *bound* che indica di quanto indirizzi possiamo spostarci a partire dall'indirizzo *base*.

> [!bug] Contro
> - Non è possibile far crescere la dimensione dello stack e dell'heap.
> - Non è possibile far condividere codice e dati a processi differenti.
> - Non è possibile impostare dei permessi su determinate aree di memoria.

## Segmentazione
- Ogni processo ha una tabella dei segmenti (lato hardware).
- Ogni riga della tabella contiene un segmento che è rappresentato da una coppia *base+bound*.
- Per ogni segmento è possibile impostare dei permessi di accesso.
- I processi possono condividere lo stesso segmento ma possono avere differenti permessi di accesso su esso.

> [!tip] UNIX Fork
> Quando viene eseguita una fork, viene copiata la tabella dei segmenti del processo padre nel figlio e si marchia ogni segmento come di sola lettura; se il padre o il figlio eseguono operazioni di scrittura, il kernel si occupa di fare una copia solo del segmento coinvolto.

>[!tip] Heap & Stack
>Sia al segmento dell'heap che a quello dello stack vengono allocati 0 bytes.
>Quando il programma tocca uno dei due, il kernel cattura la *segmentation fault* e si occupa di allocare un po' di memoria ed infine riprende il processo sospeso.

> [!bug] Contro
> - La gestione della memoria è complessa dato che occorre ogni volta trovare un *chunk* della memoria di dimensione diversa per far posto al nuovo segmento.
> - I segmenti, come quello dell'heap e dello stack, crescono nel tempo.
> - Questi due problemi provocano frammentazione esterna.

## Paginazione
- La memoria è gestita in *page frames* che sono tutti di lunghezza fissa.
- Trovare una pagina libera è facile, dato che si utilizza una bitmap dove ogni bit rappresenta un page frame fisico.
- Ogni processo ha la sua tabella delle pagine, che è memorizzata nella memoria fisica.
- Quindi nella *MMU* ci occorrono solo due registri:
	- Uno che punta all'inizio della tabella.
	- Uno che indica la sua lunghezza.

> [!warning] Se la lunghezza delle pagine è troppo piccola, la tabella diventa troppo grande, mentre se la lunghezza è troppo grande si può verificare frammentazione interna, nel caso non abbiamo bisogno di tutto lo spazio dentro un *chunk*.

>[!info] Core Map
> Tabella che indica per ogni page frame, se è libero o è occupato in memoria, e riporta tutti gli indirizzi virtuali con i rispettivi processi che puntano a quel frame.

> [!tip] Fast Program Start
> Permette di eseguire un programma prima che il suo codice sia in memoria.
> - Imposta tutte le righe della tabella delle pagine come invalide.
> - Quando una pagine è riferita per la prima volta, il kernel si occupa di caricarla in memoria fisica.
> - Le altre pagine sono trasferite in background mentre il programma è in esecuzione.

## Segmentazione Paginata
- La memoria del processo è segmentata.
- Ogni riga della tabella dei segmenti punta ad una tabella delle pagine che descrive quel segmento, e contiene anche la lunghezza della tabella delle pagine e i permessi sul segmento.
- Ogni riga della tabella delle pagine contiene il puntatore al page frame e i permessi su di esso.

## Paginazione Multilivello
- Abbiamo *N* livelli di tabelle delle pagine, ogni riga di una tabella del livello *i* punta ad una tabella del livello *i+1*, tranne nelle tabelle del livello *N-1* che puntano direttamente alle page frames.

## Segmentazione Multilivello
- Si utilizza una tabella dei segmenti chiamata *Global Descriptor Table*, e delle tabelle di pagina multilivello.

> [!info] Inverted Page Table
> Tabella che associa ad ogni pagina fisica l'ID del processo ad essa associata.

> [!abstract] Translation Lookaside Buffer
> - E' una cache che associa le recenti pagine virtuali alla loro traduzione in pagine fisiche.
> - In caso di cache hit (deve corrispondere anche l'ID del processo) si utilizza il valore nella *TLB*, altrimenti si percorre la tabella delle pagine.
> - La *TLB* si trova nella *MMU*.
> - La cache è completamente associativa e il numero di blocchi per linea di cache può essere al massimo 2 (località spaziale non sfruttata, solo temporale).

> [!abstract] Superpagine
> Le superpagine sono un insieme di pagine continue.
> Una riga della *TLB* può essere una pagine oppure una superpagina.
