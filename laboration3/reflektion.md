# Reflektion

## Vad finns det för krav du måste anpassa dig efter i de olika API:erna?

### API - SR
 * Inga begränsningar på antalet requests, men en vädjan om så få requests som möjligt.

### API - Google Maps
Google anger följande för **Google Maps API licensing and options.**
 * Your service must be freely and publicly accessible to end users.
 * Ett maximum på 25 000 map requests per dag i mer än 90 dagar i rad. Om man överskrider denna gräns kommer google
   ta kontakt med ägaren av applikationen för att diskutera betalning.

### Hur och hur länga cachar du ditt data för att slippa anropa API:erna i onödan?
Det borde räcka att anropa SR's API var 5:e minut. Vad beträffar Google Maps renderas kartan endast en gång per reload/post. Node servern pushar data till klienten vilket gör att användaren aldrig behöver ladda om webbläsaren och därför kan en och samma kartrendering användas för varje enskilt "besök" i applikationen.

Mitt data cachas på serversidan. Servern gör en request till SR och tar imot data i json format, som sedan skrivs till fil. Det cachade datat används på klientsidan tills att servern upptäcker att det finns ny data att pusha till klienten. Kommunikation mellan server och klient sker via web sockets (socket.io).

### Vad finns det för risker med din applikation?
 * Om SR's api går ner, gör jag varken åtgärder eller visar en felsida för användaren. Användaren skulle då endast se    en tom karta. Denna typ av risk antar jag är i princip obefintlig vad beträffar Google Maps API. 
 * Jag har svårt att se någon annan uppenbar risk eftersom jag försökt försvåra xss attacker (skadliga script som       eventuellt skulle kunna komma från sr), dessutom låter jag inte    användaren mata in någon input till   applikationen.
 
### Hur har du tänkt kring säkerheten i din applikation?
 * All data som läggs in i html noder för trafikmeddelandelistan läggs in som text med hjälp av Node.textContent().     Detta förhindrar XSS attackvektorer.
 * Data som kommer ifrån SR och ska skrivas ut i Google Maps infoWindow körs genom en sanitize metod som strippar       bort "<" och ">".

### Hur har du tänkt kring optimeringen i din applikation?

## Filer
* Detta är en relativt liten applikation, därför valde jag medvetet bort jQuery för att undvika att ladda in massor    av onödig javascriptkod.
* Jag har minimerat bootstrap, borde också ha laddat ner en custimized version.
* Jag har skapat minimerade filer för min javascriptkod för deploy.

## Kod
* Jag har sett till att sätta endast en eventListener på listan av trafikmeddelanden. Detta gjorde applikationen       betydligt snabbare i jämförelse med min första implementation då det låg en eventListener för varje listelement.
* När jag skapar li element har jag försökt att först skapa ett li element och ett a element för att sedan klona så    många element jag behöver för listan. Det globala **document** objektet hämtas endast en gång istället för att en 
  sökning efter **document** måste vandra genom hela 'scope chain' lika många gånger som loopen loopar vilket kan      uppgå till ca **hundra gånger**.
* Jag har gjort ett försök att kapsla in stora delar av implementationens logik i moduler (som ligger i ett       namespace). Logiken kan sedan nås via ett publikt api genom vilket jag som skrivit modulerna kan styra vilka delar av logiken i modulen som ska köras exempelvis vid anrop från en loop, och vilka delar av koden (privata delar) som mest tillhandahåller data eller mindre funktioner som finns att tillgå från de delar som körs från det publika API:et (closures). Jag tänker mig att man kan se detta som en optimering, men är inte säker.
* Som redan nämnts försöker jag att hålla så mycket arbete som möjligt utanför looparna. I modulen   TRAFFIC.google.maps.markerRenderer skapar jag exempelvis en enda instans of infoWindow. Sedan refererar jag till denna instans ifrån loopen där jag skapar och renderar markers.
* Servern pushar data till klienten endast då det finns ny data att presentera.
