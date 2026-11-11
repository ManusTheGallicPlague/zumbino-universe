# ZUMBINO UNIVERSE — Il bro ha lasciato la Terra.

Rifacimento spaziale del sito parodia di Gabriele Zumbino: pianeta cinematografico, campo stellare animato, parallasse, salto nell’iperspazio e audio sintetizzato attivabile.

Il multiverso include otto forme selezionabili con mouse, touch o frecce da tastiera, anteprima orbitante e carte PNG scaricabili. Radio Roast conserva le 32 battute, i filtri, la copia e la lettura vocale. La stazione Ohio conserva il colloquio a sei domande e il punteggio aura.

FX riduce le animazioni; FACE ripristina il cursore di sistema; il pulsante musicale abilita brevi effetti sintetizzati. Viene rispettata la preferenza di sistema per il movimento ridotto. Il campo stellare sospende il rendering quando non è visibile.

## Avvio e pubblicazione

Sito: https://manusthegallicplague.github.io/zumbino-universe/
Repository: https://github.com/ManusTheGallicPlague/zumbino-universe

Il sito è statico: nessuna dipendenza runtime, nessun account visitatore, nessuna chiave API. Immagini e font sono locali; le licenze dei font sono in `assets/fonts/`. La voce usa la sintesi vocale del browser, quando disponibile.

```sh
node scripts/build.mjs
python3 -m http.server 4174 --directory dist
```

Aprire http://localhost:4174. È anche possibile aprire `index.html` direttamente per esplorare il sito; per esportare le carte PNG serve la versione HTTP/HTTPS.

Il workflow `.github/workflows/pages.yml` verifica JavaScript e risorse, costruisce `dist/` e pubblica su GitHub Pages a ogni push su `main`. La pubblicazione comprende soltanto il sito, senza archivio delle versioni precedenti o file di sviluppo. Il progetto usa GitHub Pages come hosting; il manifest locale `.openai/` non fa parte del repository.

## Verifiche della versione 1.0

La suite `scripts/qa.cjs` è stata eseguita sul pacchetto costruito, con Chromium e WebKit: tutti i controlli superati.

- Layout da 320 a 1920 pixel, incluso 568×320 in orizzontale: nessun overflow orizzontale o volto tagliato nell’hero.
- Controlli automatici axe per WCAG 2 A/AA, 2.1 AA e 2.2 AA: nessuna violazione rilevata nelle viste e negli stati verificati. Non costituisce una certificazione di conformità.
- Otto forme, navigazione da tastiera ed esportazione delle otto carte PNG 800×1050.
- Filtri roast, nessuna ripetizione consecutiva, copia e alternativa manuale quando gli appunti sono bloccati.
- Interruzione e riavvio della lettura vocale senza interferenze tra messaggi; la disponibilità delle voci dipende dal dispositivo.
- Tutti e tre gli esiti del quiz, protezione dai doppi clic, punteggi e riavvio.
- Interruzione degli effetti e delle animazioni attive con FX; sospensione del campo stellare fuori dallo schermo; gestione del caricamento immagini fallito.
- Nessuna richiesta runtime a CDN esterne e nessuna risorsa locale mancante.

Per ripetere i test, installare le sole dipendenze di sviluppo e avviare il server:

```sh
npm install
npx playwright install chromium
npm test
```

`QA_URL` cambia l’indirizzo di anteprima; `WEBKIT_EXECUTABLE` abilita anche la verifica WebKit indicando l’eseguibile disponibile. Le schermate e le carte dei test vengono scritte in `qa-results/`, escluso dal repository.

Lo sfondo [orbit-background.png](assets/orbit-background.png) è stato generato con il tool integrato imagegen; il [prompt esatto](assets/orbit-background.prompt.txt) è salvato accanto all’immagine. Le otto facce sono gli asset della precedente versione. Il codice precedente è conservato in `archive-earth/`.

## Fonti e limiti

- Profilo pubblico: https://it.linkedin.com/in/gabriele-zumbino-2455b13a1 — informazioni professionali disponibili nell'indice pubblico. Il caricamento diretto del profilo restituisce HTTP 999; le sezioni private o non indicizzate non sono state recuperate.
- Post recruiting: https://it.linkedin.com/posts/gabriele-zumbino-2455b13a1_hr-masterhr-radaracademy-activity-7437417753113714688-Fhmr — testo pubblico e foto dell'autore, verificata tramite i metadati del post.
- Post sulla ricerca: https://it.linkedin.com/posts/gabriele-zumbino-2455b13a1_pensavo-che-la-mia-tesi-magistrale-si-sarebbe-activity-7508156250879324161-rmWX — il riferimento a Frontiers è presentato come dichiarazione dell'autore nel post.

I dati professionali sono sintetizzati e accompagnati da link alle fonti nel sito. Non sono riprodotti elenchi di contatti, conteggi di follower o informazioni di omonimi. Le battute, i titoli fantasiosi e Ohio S.p.A. sono invenzioni comiche, indicate come parodia. Le varianti non sono fotografie documentarie.
