>[!abstract] Race Condition
>L'output di un programma concorrente dipende dall'ordine con cui vengono eseguite le operazioni dei singoli thread.

>[!abstract] Mutua Esclusione
>Solo un thread alla volta può eseguire una determinata operazione.

>[!abstract] Sezione Critica
>Pezzo di codice che può essere eseguito da un solo thread alla volta.

>[!abstract] Lock
>Variabile di sincronizzazione che fornisce mutua esclusione, prima di entrare nella sezione critica si invoca la *lock* sulla variabile, mentre quando si esce si usa la *unlock*.
>Se è stata già invocata una *lock* su una variabile ci si mette in attesa.

### Semantica dei Lock

>[!tip] `lock.acquire()`
>Aspetta fino a quando il lock non è libero, poi lo acquisisce.

>[!tip] `lock.release()`
>Rilascia il lock e sveglia il thread che si è sospeso su di esso.

Proprietà:
- Safety: ci può essere al più un possessore del lock nello stesso momento.
- Liveness: se nessuno possiede il lock, e non c'è nessuno in attesa sul lock con priorità più alta, allora è possibile acquisire il lock.

### Variabili di Condizione
>Le variabili di condizione permettono di bloccare il thread su un evento, senza che consumi risorse facendo attesa attiva.

Ogni variabile di condizione fornisce tre primitive:
- *wait*: atomicamente rilascia il lock e si mette in attesa fino a quando non viene risvegliato.
- *signal*: sveglia un thread che si trova in attesa su quella variabile, se ce n'è uno.
- *broadcast*: sveglia tutti i thread che sono in attesa su quella variablie, se ce ne sono.

Ogni chiamata di una qualsiasi di queste tre funzioni deve sempre avvenire da un thread che è in possesso del lock.

>[!info] Memoryless
>Le variabili di condizione sono *memoryless* ovvero un thread si sveglia se è stato messo in attesa prima di una *signal*, altrimenti se non c'è nessuno in attesa allora non succede niente.
>Inoltre la *wait* rilascia atomicamente il lock.

>[!warning] Attenzione
>Quando un thread viene svegliato dopo che si è messo in attesa con una *wait* non potrebbe essere eseguito immediatamente, ma la *signal* e la *broadcast* lo inseriscono nella *ready list*. Quindi in questo lasso di tempo, quando il lock viene rilasciato potrebbe essere acquisito da qualcun altro.
>La soluzione è mettere la *wait* in un loop.

### Semantiche: Mesa & Hoare
- Semantica Mesa:
	1. La procedura *signal* mette il thread in attesa nella *ready list*.
	2. Il thread che ha invocato la *signal* continua a mantenere in possesso il lock e il processore.
- Semantica Hoare:
	1. La procedura *signal* rilascia il processore e il lock al thread in attesa.
	2. Quando il processo che era in attesa termina, il processore e il lock vengono riassegnati al thread che ha invocato la *signal*.

### Implementazione Lock - Processore Unico

``` c
LockAcquire(){
	disableInterrups();
	if(value == BUSY){
		waiting.add(myTCB);
		suspend(); 
		// Invoco lo scheduler, faccio context switch e abilito gli interrupt.
	}else{
		value = BUSY;
	}
	enableInterrupts();
}
```

``` c
LockRelease(){
	disableInterrups();
	if(!waiting.Empty()){
		thTCB = waiting.Remove();
		readyList.Append(thTCB);
		// Lock lasciato al thread risvegliato.
	}else{
		value = FREE;
	}
	enableInterrupts();
}
```

### Implementazione Lock - Multiprocessore

>[!abstract] Spinlock
>Uno *spinlock* è un tipo di *lock* dove il processore aspetta in un loop che il *lock* diventi libero.
>Quindi si mette in attesa attiva.

```c
SpinlockAcquire(){
	while(TestAndSet(&spinLockValue) == BUSY)
		;
}
```

```c
SpinlockRelease(){
	spinLockValue = FREE;
	memory_barrier();
}
```

La *TestAndSet* è una funzione che utilizza istruzioni di *Read-Modify-Write*, ovvero istruzioni che permettono, atomicamente, di leggere un dato dalla memoria, operarci sopra, e infine riscriverlo in memoria.

Una possibile implementazione è la seguente:

```c
SpinlockAcquire(&spinLockValue){
	Loop:   TSL R, &spinLockValue
			CMP R, #BUSY
			BEQ Loop
			END
}
```

La *TSL* legge il valore dello spinlock e lo salva in *R*, nello stesso istante scrive nello spinlock *\#BUSY*.

``` c
LockAcquire(){
	disableInterrups();
	spinLockAcquire(&spinLock);
	if(value == BUSY){
		waiting.add(myTCB);
		sched.suspend(&spinLock); 
		// Marca il thread come in attesa, rilascio lo spinlock e schedulo il prossimo thread.
	}else{
		value = BUSY;
		spinLockRelease(&spinLock);
	}
	enableInterrupts();
}
```

``` c
LockRelease(){
	disableInterrups();
	spinLockAcquire(&spinLock);
	if(!waiting.Empty()){
		thTCB = waiting.Remove();
		sched.resume(thTCB);
		// Marco il thread come pronto, e lo metto nella ready list.
	}else{
		value = FREE;
	}
	spinLockRelease(&spinLock);
	enableInterrupts();
}
```

Come sapere quale thread è in esecuzione attualmente?
- In un sistema con un processore singolo, basti utilizzare una variabile globale.
- In un sistema multiprocessore, si può o dedicare un registro specifico per processore oppure mettere un puntatore al TCB nel fondo dello stack.

### Semafori
>Sono variabili intere che non possono assumere valori negativi.

Forniscono due primitive:
- `P()`: atomicamente aspetta che il valore della variabile diventi > 0, e successivamente decrementa di 1 la variabile.
- `V()`: atomicamente incrementa di 1 il valore della variabile, e se c'è qualche thread in attesa sulla variabile, lo sveglia.

#### Implementare P&V

```c
P(sem){
	disableInterrupts();
	spinLockAcquire(&spinLock);
	if(sem.value == 0){
		waiting.add(myTCB);
		suspend(&spinLock);
		// Invoco lo scheduler, faccio context switch e abilito gli interrupt.
	} else {
		sem.value--;
		spinLockRelease(&spinLock);
	}
	enableInterrupts();
}
```

``` c
V(sem){
	disableInterrups();
	spinLockAcquire(&spinLock);
	if(!waiting.Empty()){
		thTCB = waiting.Remove();
		readyList.Append(thTCB);
		// Lascia il semaforo al thread risvegliato.
	}else{
		sem.value++;
	}
	spinLockRelease(&spinLock);
	enableInterrupts();
}
```

#### Implementare le CV con i Semafori

```c
wait(lock){
	selfsem = createSemaphore(); // Coda dei thread in attesa
	queue.Append(selfsem);
	lock.release();
	selfsem.P();
	destroySemaphore(selfsem);
	lock.acquire();
}
```

```c
signal(){
	if(!queue.Empty()){
		selfsem = queue.Remove();
		selfsem.V(); // Risveglia il thread in attesa
	}
}
```

## Sincronizzazione Multi-Oggetto

Le risorse si possono classificare in:
- Rilasciabili: possono essere prese dal sistema operativo in qualunque momento.
- Non rilasciabili: il thread che possiede la risorsa deve rilasciarla.

>[!danger] Starvation
> Attesa indefinita di uno o più thread.

>[!danger] Deadlock
> Attesa circolare per le risorse.
> Condizioni:
> - Un numero limitato di thread può utilizzare contemporaneamente una risorsa.
> - Risorse non rilasciabili.
> - Wait while holding.
> - Attesa circolare di richieste.
> 
> Deadlock => Starvation

>[!info] *Wait while holding*
>Assumiamo che se un thread necessita di mettersi in attesa, lo fà mantenendo in suo possesso tutte le risorse che ha già acquisito, quindi parliamo di risorse non rilasciabili.

### Soluzioni
#### Detect and Fix
>L'algoritmo scansiona il grafo (dove i nodi sono i thread e le risorse, e gli archi sono gli assegnamenti e le richieste delle risorse), individua i cicli e li elimina.

Uno dei thread nel ciclo viene soppresso, quindi le sue risorse vengono riassegnate.
Questa azione viene chiamata di *roll-back*:
- Ripristina lo stato precedente del processore.
- Il processore riparte.
- Nel migliore dei casi, il deadlock non dovrebbe ripresentarsi.
- Richiede che si utilizzino dei *checkpoint*, ovvero un salvataggio periodico dello stato interno del processore.

#### Deadlock Prevention
Cerca di eliminare una delle quattro condizioni per il deadlock:
- Ordine dei lock (per evitare l'attesa circolare): consiste nell'acquisire i lock sempre nello stesso ordine, per esempio acquisirle sempre in ordine alfabetico.
- Progettare il sistema per far in modo di rilasciare le risorse e riprovare a riacquisirle. Oppure si cerca di acquisire tutte le risorse necessarie in anticipo. In questo modo viene evitata la *wait while holding*. L'unico limite è che il processo dovrebbe conoscere in anticipo tutte le risorse che necessita.
- Alcuni device possono essere gestiti da uno *spool*, ovvero una risorsa viene virtualizzata, creando infinite istanze di quella risorsa. In questo modo non abbiamo più mutua esclusione, dato che la risorsa è assegnata allo *spool* e il processo effettua la richiesta allo *spool* stesso. L'unico problema è che possiamo comunque avere deadlock se il buffer usato dallo *spool* per la gestione dei processi in coda si riempie.

#### Algoritmo del Banchiere
Le risorse possono essere classificate in base alla:
- Molteplicità *M*: il numero di risorse di un certo tipo.
- Disponibilità *D*: il numero di risorse di un certo tipo che sono attualmente libere.

Metodo di richiesta:
- Singola
- Multipla: un processo richiede *k* risorse di un certo tipo, se *k <= D* allora tutte e *k* le risorse sono assegnate, altrimenti nessuna risorsa è assegnata e il processo si mette in attesa.

Algoritmo:
- Ogni processo dichiara in anticipo il massimo numero di risorse di cui ha bisogno.
- Quando c'è una richiesta, si attende se la concessione porterebbe a un deadlock, altrimenti viene concessa se esiste un certo ordinamento sequenziale dei thread privo di deadlock.

Il banchiere sarebbe il gestore delle risorse.

Possibili stati:
- Stato *safe*: per qualunque possibile sequenza di richieste future, è possibile soddisfarle tutte, non necessariamente nell'ordine richiesto.
- Stato *unsafe*: qualche sequenza di richieste potrebbe portare in un deadlock.
- Stato *doomed*: tutte le possibili sequenze di richieste portano ad un deadlock.

Il banchiere concede la richiesta se e solo se questa porta in uno stato *safe*.

Per ogni risorsa $R_{k}$ abbiamo $D_{k}$ che rappresenta il numero di istanze disponibili di $R_{k}$.
Per ogni processo $P_{j}$ abbiamo:
- $A_{j}$: che rappresenta il vettore degli assegnamenti delle risorse che il processo ha già in possesso.
- $E_{j}$: che rappresenta il vettore delle risorse residue che mancano al completamento. Si dice che $E_{j} \leq D$ se $E_{jk} \leq D_{k}$ per ogni $k$.
Inizialmente ogni processo $P_{j}$ non è marcato.
```c
while(Esiste un processo non marcato){
	if(Esiste un processo Pj non marcato che soddisfa Ej <= D){
		Si marca Pj;
		D = D + Aj;
	}else{
		Si esce dal while e si segna lo stato come unsafe;
	}
}
Successo: lo stato iniziale è safe;
```
