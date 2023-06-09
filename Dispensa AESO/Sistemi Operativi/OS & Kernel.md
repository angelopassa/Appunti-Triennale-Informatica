>[!abstract] Sistema Operativo
>Software che gestisce le risorse del computer per gli utenti e gli applicativi.

**Funzionalità principali**:
- Schedulare le risorse
- Gestione della memoria virtuale
- Comunicazione e sincronizzazione tra processi

**Ruoli**:
- Arbitro: allocazione delle risorse, isolamento e comunicazione tra gli utenti e le applicazione.
- Illusionista: ogni applicazione pensa di aver l'intera macchina a disposizione con infinite risorse.
- Collante: semplifica lo sviluppo di applicazioni grazie a dei servizi standard, librerie e l'interfaccia utente.

**Obiettivi**:
- Affidabilità del sistema.
- Sicurezza & Privacy.
- Portabilità:
	- Per i programmi attraverso la fornitura di API.
	- Per il sistema attraverso l'utilizzo di un livello di astrazione per l'hardware.
- Performance.

**Struttura**:
- <u>Kernel monolitico</u>: quasi tutte le funzionalità del sistema operativo girano nel kernel.
- <u>Microkernel</u>: nel kernel girano solo i meccanismi principali, mentre le restanti girano a livello utente. Più facile da debuggare dato che permette un maggiore isolamento.
- <u>Modello ibrido</u>.

## Kernel
> Per implementare l'esecuzione con privilegi limitati, si esegue ogni istruzione di un programma in un simulatore, se l'istruzione è permessa si esegue, altrimenti si interrompe il processo.

>[!info] Processo
>Astrazione dell'OS che esegue un programma con privilegi limitati.
>A differenza di un programma che è un'entità statica, un processo è dinamico.

Ci sono due modalità di operazioni:
- Kernel-mode: esecuzione con privilegi completi.
- User-mode: esecuzione con privilegi limitati.
La modalità di operazione a livello hardware è contenuta nel *Program Status Register*, che in *x86* si chiama *EFLAGS*, mentre in *ARM* è *CPSR*.

>[!info] PCB (Process Control Block)
>E' una struttura dati che contiene:
> - Nome del processo
> - Stato del processo
> - I registri della CPU e le informazioni per la schedulazione
> - Puntatori ai thread del processo
> - Limiti della memoria assegnata
> - Le risorse assegnate
>
>Tutti i PCB sono contenuti nella Process Table.

Istruzioni privilegiate:
- Disabilitare gli interrupt.
- Impostare il timer (permette di riottenere il controllo da un programma che si trova in loop).
- Cambiare i bit nel *PSR*.

>[!tip] Hardware Timer
>Dispositivo che periodicamente interrompe il processore. La frequenza di interruzione può essere impostata dal kernel. Inoltre gli interrupt possono essere temporaneamente ritardati (ad esempio per implementare la mutua esclusione).

### Mode Switch
- Da livello utente al kernel: interrupt (sollevati dal timer o dai device di I/O), eccezioni, system call.
- Da livello kernel ad utente: ritorno da interrupt, eccezioni, system call; quando viene creato un nuovo processo o thread, dopo un context switch, o tramite upcall, ovvero delle notifiche asincrone ad un programma utente.

**Interrupt vector**: tabella generata dal kernel che contiene puntatori al codice da eseguire in base agli eventi che occorrono.
**Interrupt stack**: uno per ogni processore, situato nella memoria del kernel.
**Interrupt masking**: quando si esegue un gestore degli interrupt occorre disabilitare gli interrupt, che vengono riabilitati al suo completamento.
**Interrupt handler**: non è bloccante, quindi si esegue fino al suo completamento; inoltre deve durare il minimo necessario per consentire al dispositivo di ricevere il prossimo interrupt.
**Atomic Mode Transfer**: una singola istruzione che:
- Salva il corrente SP, PC, e PSR.
- Cambia lo stack da user a kernel e salva SP, PC e PSR sullo stack.
- Cambia la modalità da user a kernel.
- Si trova il vettore dell'handler nell'interrupt table.
- Si esegue l'handler.
- L'handler salva gli altri registri.
- Alla fine, l'handler ripristina tutti i registri salvati.
- Si ripristinano SP, PC e PSR.
- Si cambia la modalità da kernel a user.
- Si abilitano gli interrupt.

### Gestione delle eccezioni in ARM

Ci sono 6 modi di operazioni, per cambiare modalità si cambiano i bit nel registro CPSR.

**Exception vector table**: ogni entry è formata da 32 bit che rappresentano o un'istruzione di salto o una di caricamento del PC all'handler attuale.

>[!tip] Registri *Banked*
>Sono registri che permettono di avere più copie dello stesso registro, visibili o meno in base alla modalità di operazione.
>In questo modo il *mode switch* è più rapido dato che non occorre salvare sullo stack il contenuto di questi registri, ma basta rendere non visibili tutte le restanti copie tranne quella che appartiene alla modalità selezionata.

#### Risposta ad un'eccezione
- Si imposta il registro LR all'indirizzo di ritorno (avrà il valore di PC + 4).
- Si copia il CPSR nel registro banked SPSR.
- Si cambiano i bit in CPSR in base alla modalità.
- Si mappano gli appropriati registri banked per quella modalità.
- Si disabilitano gli interrupt.
- Si imposta il PC all'indirizzo dell'handler dell'eccezione.

#### Ritornare da un'eccezione
- Si ripristina il CPSR dal registro banked SPSR e il PC dal registro banked LR, questi due step devono essere atomici.
- Il ritorno da un'eccezione è conclusa con l'esecuzione di un'istruzione di elaborazione dati con il flag *S* impostato:
	- Nel caso di system call abbiamo `MOVS PC, R14_svc` che corrisponde a `pc = lr_svc; cprsr = spsr_svc`. Se invece vogliamo usare lo stack, all'inizio dell'handler bisogna usare `STMFD SP!, {reglist, LR}`, mentre all'uscita dell'handler `LDMFD SP!, {reglist, PC}^`, dove *^* significa che che il registro CPSR è ripristinato dal registro SPSR.
	- Nel caso di interrupt o fast interrupt, invece, l'istruzione che stavamo eseguendo mentre è avvenuto l'interrupt, quella nel PC, non è terminata completamente, quindi occorrerà usare `SUBS PC, R14_fiq/irq, #4`, oppure se utilizziamo lo stack, all'inizio dell'handler bisognerà utilizzare le seguenti due istruzioni:
		- `SUB LR, LR, #4`
		- `STMFD SP!, {reglist, LR}`
	
	   mentre alla fine sempre `LDMFD SP!, {reglist, PC}^`.

#### Handler di una System Call
- Si trovano i parametri nei registri o nello stack dell'utente.
- Si copiano nella memoria del kernel, proteggendolo da codice dannoso che potrebbe essere iniettato.
- Si copiano i risultati nella memoria dell'utente.

### Upcall (Segnali UNIX)

>[!info] Interrupt a livello utente
>Notificano al processo utente di un evento che necessita di essere gestito nel giusto modo.

Strutture analoghe ai kernel interrupt:
- Signal handler.
- Signal stack.
- Signal masking, ovvero i segnali si disabilitano quando si è nell'handler.

### Kernel Booting
>All'avvio, il processore esegue un codice in una *ROM* per caricare il ***first-stage bootloader*** che inizializza il gestore della memoria centrale e un po' di dispositivi di I/O per poi caricare in memoria il ***second-stage bootloader*** che carica il kernel e il root del file system. Infine si passa il controllo al kernel.