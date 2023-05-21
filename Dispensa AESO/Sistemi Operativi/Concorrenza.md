>[!info] Thread
>Un thread è una singola sequenza di esecuzione che rappresenta un task separatamente schedulabile, ovvero il sistema operativo può avviarlo o sospenderlo a suo piacimento. Possiamo avere uno o più thread per processo.
>Quando abbiamo un processo multi-thread, tutti i thread condividono le stesse strutture dati e sono isolati dagli altri processi. Tutte le informazioni su un thread sono conservate in una struttura dati chiamata *Thread Control Block (TCB)*.

### Thread API
- `thread_create(thread, func, args)`: crea un nuovo thread, conservo le sue info in *thread* e eseguendo *func(args)*.
- `thread_yield()`: il thread che chiama questa funzione volontariamente rilascia il processore per consentire a qualche altro thread di essere eseguito.
- `thread_join(thread)`: aspetta che il thread con id *thread* termini, e restituisce il suo stato di uscita. Può essere chiamata solo una volta per thread.
- `thread_exit(exit_status)`: termina il thread corrente e archivia *exit_status* nella struttura dati del thread. Se un altro thread è in attesa su di esso con una *thread_join* lo sveglia.

![[thread_lifecycle.png]]

#### Posizione del TCB per ogni stato del thread

![[tcb.png]]

#### Thread livello utente
>Sono implementati utilizzando delle librerie utente.

Il sistema operativo non è cosciente dei thread a livello utente. Inoltre la tabella dei thread è in user-space associata ad ogni processo.
Lo scheduling dei thread è implementato dal *Run Time Support* (RTS) del processo.

>[!danger] Contro
>- L'invocazione di una system call blocca tutti i thread del processo.
>- Tutti i thread di un processo sono schedulati sullo stesso processore; quindi non sfruttiamo a pieno l'architettura multiprocessore.

La *thread_create* implementa questi passi:
- Alloca la TCB e lo stack.
- Costruisce una funzione di appoggio *stub* nello stack frame.
- Mette *func* e *args* sullo stack.
- Inserisce il thread nella ready list.
- Quando si invoca `stub(func, args)`:
	- Si esegue `(*func)(args)*`.
	- Si chiama la `thread_exit()`.

#### Thread livello kernel
- La tabella dei thread è nel kernel ed è unica.
- La creazione, terminazione e il context switch sono eseguiti con l'utilizzo di system call.

>[!info] Contenuto della TCB
>- ID del thread
>- Stato
>- Contesto del thread
>- Parametri di schedulazione
>- Riferimento allo stack

### Thread Switch
- Volontario:
	- Thread livello utente: 
		1. Si salvano i registri prima sullo stack e poi sul TCB del thread che si sta eseguendo.
		2. Si cambia lo stack con quello del nuovo thread.
		3. Si ripristinano i registri dal TCB del nuovo thread.
		4. Si ritorna con `return`.
	- Kernel thread: esattamente lo stesso procedimento solo che al posto di *return* si utilizzano istruzioni come `IRET`, `MOVS` o `SUBS`.
- Dovuto a interrupt I/O, timer o eccezioni: 
	- Versione semplice:
		1. Il gestore dell'interrupt salva prima i registri sullo stack del kernel.
		2. Alla fine chiama la funzione ***switch_threads()***.
		3. Quando ritorna dalla funzione, l'handler riprende il nuovo thread.
	- Versione più veloce:
		1. Il gestore dell'interrupt salva direttamente i registri nel TCB.
		2. Si riprende il nuovo thread.

#### `switch_threads()`
- Salva il contesto del vecchio thread dallo stack del kernel nel TCB.
- Sposta il TCB del vecchio thread nella *ready list* o nella *waiting list*.
- Sceglie un nuovo thread dalla *ready list*.
- Ripristina i registri del nuovo thread dal TCB al processore.
- Sposta il TCB del nuovo thread nella *running list*.
- Restituisce il controllo al nuovo thread.
