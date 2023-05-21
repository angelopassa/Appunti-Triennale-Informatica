I dispositivi di archiviazione possono essere classificati come segue:
- Dischi magnetici:
	- Raramente diventano corrotti.
	- Tanta capacità a basso costo.
	- Basse performance per accesso random, ma migliore per gli accessi sequenziali.
- Memorie flash:
	- Anch'esse sono difficilmente corruttibili.
	- Buona capacità ad un costo intermedio.
	- Ottime performance per le letture, peggiore per le scritture random.

## Dischi Magnetici

![[disks.png]]

#### Tracce
Sono tipicamente separate da delle regioni di guardia, in modo tale da ridurre la probabilità che le tracce vicine vengano danneggiate durante una scrittura.
Inoltre la lunghezza delle tracce varia lungo il disco, infatti all'esterno ci sono più settori per traccia e ogni disco è organizzato in regioni di tracce con lo stesso numero di settori per traccia.
Infine, solo la metà più esterna del raggio del disco è usata, dato che è quella dove è possibile contenere più informazioni.

#### Settori
I settori contengono dei codici per la correzione degli errori. La testina del magnete del disco ha un campo più largo della traccia per nascondere le corruzioni delle tracce vicine.

>[!info] Performance
>  Latenza del disco = seek time + rotation time + transfer time
>- **Seek Time**: tempo per muovere il braccio del disco sulla traccia (1 - 20 ms).
>- **Rotation Time**: tempo di attesa per la rotazione del disco sotto la testina per selezionare il settore (4 - 15 ms).
>- **Transfer Time**: tempo per trasferire i dati sul o fuori dal disco (5 - 10 usec/settore).

## SSD (Solid State Drive)

E' un dispositivo di archiviazione non volatile basato sulla tecnologia flash memory. In molti sistemi, gli SSD sono usati come un livello addizionale di cache nella gerarchia di memoria.

Le scritture devono essere effettuate su delle celle pulite, quindi occorre cancellare prima le pagine già scritte.
Ma per evitare il costo di cancellazione per ogni scrittura, le pagine vengano cancellate in anticipo, quindi avremo sempre delle pagine pulite per ogni scrittura; ciò comporta che le scritture non possono essere indirizzate a delle pagine specifiche.
Dato che sarà molto probabile che i blocchi di un file non si troveranno in posizioni contigue, il firmware del dispositivo flash mappa il numero della pagina logica ad un posizione fisica.
Inoltre, i blocchi possono essere riscritti un numero limitato di volte.

>[!warning] Endurance
> Numero di volte che un blocco può essere riscritto prima che diventi inaffidabile.





