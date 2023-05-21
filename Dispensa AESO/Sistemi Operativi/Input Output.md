>[!tip] Legge di Amdahl
> Considerando un programma in cui sono una frazione *f* può essere ottimizzata, mentre la frazione *1-f* no; lo *speedup* è comunque vincolato dalla parte del processo che non posso migliorare.

I dispositivi di I/O hanno 2 porte:
- **Porta di controllo**: si occupa sia dei comandi che dei report sullo stato del dispositivo.
- **Porta dati**: da e per la memoria del dispositivo.

#### Protocollo di comunicazione
- La CPU controlla lo stato del dispositivo di I/O.
- L'I/O controller restituisce lo stato.
- Se è pronto, la CPU richiede il trasferimento di dati attraverso dei comandi al controller.
- L'I/O controller preleva i dati dalla periferica.
- L'I/O controller trasferisce i dati al processore.

### Bus
I bus sono un mezzo di comunicazione condiviso costituito da una collezione di linee che sono viste come un'unico segnale logico. Inoltre solo un dispositivo alla volta può trasmettere sul bus.

#### Classificazione
- System bus: connettono il processore e la memoria, gli I/O si interfacciano ad essi tramite degli *adapters*.
- I/O bus: connettono i dispositivi di I/O, ma non c'è nessun collegamento diretto col processore o con la memoria.
- Backplane bus: connettono CPU, memoria e dispositivi di I/O.

#### Bus Clocking
- Sincrono: si utilizza un bus clock condiviso, quindi gli eventi possono accadere solo quando è alto il segnale di clock.
- Asincrono: è possibile comunicare coi dispositivi a velocità differenti, attraverso un protocollo di *handshake*.

#### Bus Arbitration
Due possibili implementazioni:
- Bus master: unità che può inizializzare una richiesta al bus.
- Arbitro: si sceglie un master tra tutti i device che hanno fatto richiesta, in questo modo si cerca di avere anche equità e priorità sulle richieste.
	- Centralizzato: un device dedicato colleziona le richieste e decide.
	- Distribuito: ogni device vede le richieste e partecipa insieme agli altri device alla selezione del prossimo master.

>[!example] Daisy-chain
> I device sono connessi all'arbitro in ordine di priorità, quindi l'arbitro può concedere i diritti al device di priorità maggiore che può decidere se negare o passare la priorità a quello successivo.

Ci sono due possibilità per inviare comandi ai device di I/O:
- Attraverso delle istruzioni dedicate:
	- ISA, istruzioni che indirizzano i registri del device.
	- Utilizzando istruzioni privilegiate disponibili solo in kernel mode.
- Memory-mapped I/O: una porzione di spazio degli indirizzi fisici è riservato ai dispositivi di I/O.

### Memory-mapped I/O
I registri interni dei device sono mappati nelle locazioni della memoria centrale, a degli indirizzi riservati. In questo modo non è necessario introdurre delle istruzioni dedicate. Le modifiche effettuate nella memoria centrale, sono riportate al device controller attraverso l'MMU. Inoltre non è possibile accedere alle area memory-mapped in user mode.

La CPU può sapere se l'operazione richiesta è completata in 2 modi:
- **Programmed I/O**: la CPU direttamente controlla lo stato e le operazioni di I/O. In questo caso il device ha un ruolo passivo e la CPU impiega tempo ad aspettare (*polling*).
- **Interrupt-driven I/O**: un interrupt è un evento asincrono che proviene da un device. La CPU invia il comando al device e si occupa di altri tasks. Quando il device ha elaborato la richiesta genera un interrupt asincrono e con priorità alla CPU. La CPU alla fine di ogni ciclo di clock controlla se ha ricevuto un'interrupt, in caso affermativo si salva il contesto corrente e si entra nel livello privilegiato che esegue il gestore dell'interrupt (tutto questo è gestito dal sistema operativo). Alla fine si ripristina il contesto precedente e si esegue la prossima istruzione.

### Trasferimento dati (DMA)

>[!tip] DMA - Direct Memory Access
> Meccanismo che fornisce al controller dell'I/O device la possibilità di trasferire dati direttamente da e per la memoria centrale, senza coinvolgere la CPU.
> In questo modo gli interrupt sono usati solo per comunicare alla CPU il completamento di un operazione o per gli errori.

#### DMA controller
Ogni dispositivo di I/O è collegato ad un DMA controller, che è implementato come un I/O device mappato in memoria. Esso fà anche le veci di bus master, infatti si occupa anche della bus arbitration e del trasferimento di dati. Insieme alla CPU si contende il memory bus.
La CPU non comunica più direttamente con i device di I/O ma invia le istruzioni al DMA controller, il quale alla fine invia l'interrupt.

Il DMA può utilizzare sia indirizzi virtuali che fisici, nel primo caso si deve occupare della traduzione internamente utilizzando una piccola cache (TLB).

>[!error] Cache
>Se il DMA scrive in memoria centrale, la versione che si trova nella cache è obsoleta.
>Oppure in caso di politica *Write Back*, il DMA potrebbe leggere dalla memoria dati vecchi che hanno il dirty bit a 1.
 
>[!success] Driver
> E' un software che permette di accedere a una vasta gamma di dispositivi di I/O.
> Permette a livello software di avere un'interfaccia comune.
> Il suo scopo è quelle di nascondere le differenze tra i controller dei device che sono tutti diversi uno dall'altro.





