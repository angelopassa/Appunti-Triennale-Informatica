### `fork()`

>[!tip] `fork()`
>Usata per generare un processo figlio. Il padre e il figlio condividono lo stesso codice; inoltre il figlio eredita una copia dei dati sia lato kernel che utente del padre. Se la `fork()` restituisce *0* vuol dire che ci troviamo nel processo del figlio, se è un valore *> 0* vuol dire che siamo nel padre e il valore corrispondente è il *PID* del figlio, altrimenti si è verificato un errore.

Quando invochiamo una `fork()`:
- Si crea e inizializza un nuovo *PCB* nel kernel.
- Si crea in memoria un nuovo spazio di indirizzamento.
- Si inizializza lo spazio di indirizzamento con una copia dell'intero contenuto dello spazio di indirizzamento del padre.
- L'unico segmento condiviso è **`TEXT`**.
- Il figlio eredita dal padre l'intero contesto di esecuzione, come i file aperti.
- Si informa lo scheduler che il nuovo processo è pronto per essere avviato.

### `exec()`

>[!tip] `exec()`
>Rimpiazza il codice eseguito da un processo, non ne crea uno nuovo, ma eredita il *PCB*, il *PID* e cambia lo spazio di indirizzamento sostituendo tutti i dati. Inoltre resetta i segnali pendenti, ma eredita lo stack del kernel e le risorse assegnate, come i file aperti.

Se la system call ha successo non ritorna niente, dato che stiamo eseguendo un altro programma e quindi tutti i registri, come *LR* e *PC* saranno sovrascritti. Se ritorna, vuol dire che abbiamo avuto un errore.

### `exit()` & `wait()`

Un processo può terminare o a causa di un'eccezione o invocando la system call `exit()`. Un processo quando termina restituisce un valore di uscita; il padre può ricevere questo valore attraverso la `wait()`, se questa system call non viene invocata dal padre, il processo figlio entra in uno stato di *zombie*. Se invece il padre è già terminato, il processo *init* aspetta per la terminazione del figlio.

>[!tip] `exit(int status)`
>*status* è il valore di terminazione, la system call non ritorna mai, libera la memoria e rilascia le risorse. Se il processo diventa *zombie*, mantiene il *PCB* fino a quando il padre non invoca la `wait()`.

>[!tip] `wait(int *status)`
>*status* è il *PID* del processo terminato o un valore che rappresenta un errore.
