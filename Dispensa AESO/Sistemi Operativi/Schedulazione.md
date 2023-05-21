>[!abstract] Definizioni
>- **Task**: richiesta dell'utente.
>- **Latenza o tempo di risposta**: quanto tempo ci mette un task a terminare.
>- **Throughput**: quanti task possiamo completare per unità di tempo.
>- **Overhead**: il lavoro in più impiegato dallo scheduler.
>- **Fairness**: se il lavoro dello scheduler è equo per utenti diversi.
>- **Workload**: insieme di task che il sistema deve completare.
>- **Schedulatore rilasciabile:** se possiamo prendere le risorse da un task in esecuzione.

## FIFO
>I task vengono schedulati nell'ordine in cui arrivano. I task vengono eseguiti fino a quando non finiscono o se volontariamente rilasciano il processore.

## SJF - Shortest Job First
- Senza pre-rilascio: prende il task con il tempo di lavoro più basso e lo esegue senza interruzioni.
- Con pre-rilascio: se un nuovo task più corto si aggiunge, si fà context switch e si esegue quello nuovo. Anche chiamato *SRTF - Shortest Remaining Time First*.

## Round Robin
- Ogni task ottiene le risorse solo per un periodo limitato di tempo, chiamato *quarto di tempo*. Se non finisce, viene rimesso in coda.

>[!warning] Quarto di Tempo
>Se il *quarto di tempo* è troppo lungo allora si ricadrebbe in una *FIFO*, se è troppo corto invece, l'overhead sarebbe troppo alto.

- La fine del *quarto di tempo* è segnato da un timer interrupt che causa l'attivazione dello scheduler, il quale riavvia il timer.

## Workload

Possiamo avere due tipi di processi:
- CPU-bound: tanto consumo della CPU, con qualche I/O.
- I/O-bound: poco consumo della CPU con I/O più frequenti.

I processi I/O-bound necessitano di poca CPU, mentre i CPU-bound useranno tanta CPU per tutto il tempo che gli è stata assegnata.

>[!tip] Tecnica di *Max-Min*
>Si cerca di massimizzare la minima allocazione data a un task.
>Si schedula prima il task più piccolo, poi si divide il tempo rimanente utilizzando la tecnica *Max-Min* tra gli altri task.

## MFQ - Multi-Level Feedback Queue

Sono un insieme di code gestite con *Round Robin*. Ogni coda ha una priorità diversa. Le code con priorità più alta hanno un time slice più basso. Lo scheduler all'inizio mette ogni thread nella coda con priorità di più alta.

Quando il time slice finisce, il thread scende di un livello, quindi la priorità è diminuita. Se invece il task si sospende o rilascia il processore, rimane nel suo livello oppure può salire. In questo caso la priorità è aumentata.

>[!bug] Starvation
>Nel caso in cui la coda con prioprità più alta è sempre piena di processi I/O-bound.

## Schedulazione Multiprocessore
>Ogni processore ha la propria *ready-list* implementata come una *MFQ* protetta da uno spinlock, uno per ogni processore.

I processori inattivi possono rubare lavoro dagli altri processori.

>[!info] BSP - Bulk Synchronous Parallel
>Si utilizzano due barriere, fra le quali avviene solo la comunicazione tra i thread.

### Affinity Scheduling
>I task che condividono le stesse risorse vengono assegnati allo stesso processore oppure a più processori che condividono tanti livelli di cache.
 
### Oblivious Scheduling
>Ogni processore schedula la propria *ready list* in modo indipendente dagli altri processori.

### Gang Scheduling
>Schedulare tutti i task dello stesso programma contemporaneamente.

### Space Sharing
>I processori vengono divisi in gruppi, e ad ogni gruppo è possibile assegnare solo i thread di un processo.
