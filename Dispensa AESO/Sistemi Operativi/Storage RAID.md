> [!info] Lost+Found
> Unix mette a disposizione una directory chiamata *lost+found* contenente tutti i dati che sono diventati obsoleti.

> [!abstract] Redundant Array Inexpensive Disk
> - Si realizza un disco virtuale di capacità superiore a quella dei singoli dischi
> - Si sfrutta il parallelismo per memorizzare blocchi dello stesso file per migliorare la velocità
> - Si sfrutta la ridondanza per accrescere l'affidabilità

> [!info] Se ho un totale di *n* dischi fisici, il settore *b* del disco virtuale viene mappato nel settore *b / n* del disco fisico numero *b mod n*

## RAID 0
- Nessuna ridondanza (*striping*).
- I blocchi sono asincroni.

## RAID 1
- Ridondanza, mando i dati a tutti i dischi (*mirror*).
- I blocchi sono asincroni.

## RAID 2
- Dischi sincroni.
- Ridondanza.
- I dischi ridondanti contengono codici per la correzione degli errori.

## RAID 3
- Dischi sincroni.
- C'è solo 1 disco ridondante che contiene i codici per la correzione degli errori.

## RAID 4
- Dischi asincroni
- C'è solo 1 disco ridondante che contiene i codici per la correzione degli errori.
- Se si fanno molti aggiornamenti, il disco ridondante è in sovraccarico.

## RAID 5
- Dischi asincroni.
- La parità è distribuita fra tutti i dischi.

## RAID 01 *(mirror di stripes)*
- Gruppi di RAID 0 che realizzano un RAID 1.

## RAID 10 *(stripes di mirror)*
- Gruppi di RAID 1 che realizzano un RAID 0.
- Migliore tolleranza ai guasti rispetto ai RAID 01, dato che se si guastano due dischi qualsiasi in gruppi diversi il sistema può continuare a funzionare (i dischi dello stesso gruppo non sono indipendenti).