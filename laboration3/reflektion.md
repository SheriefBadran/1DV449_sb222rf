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

Mitt data cashas på serversidan. Servern gör en request till SR och tar imot data i json format, som sedan skrivs till fil. Det cachade datat används på klientsidan tills att servern upptäcker att det finns ny data att pusha till klienten. Kommunikation mellan server och klient sker via web sockets (socket.io).

### Vad finns det för risker med din applikation?
 * Om SR's api går ner, gör jag varken åtgärder eller visar en felsida för användaren. Användaren skulle då endast se    en tom karta. Denna typ av risk antar jag är i princip obefintlig vad beträffar Google Maps API. 
 * Jag har svårt att se någon annan uppenbar risk eftersom jag försökt försvåra xss attacker (skadliga script som       eventuellt skulle kunna komma från sr), dessutom låter jag inte    användaren mata in någon input till   applikationen.
 
### Hur har du tänkt kring säkerheten i din applikation?
 * All data som läggs in i html noder läggs in som text med hjälp av Node.textContent(). Detta förhindrar XSS attackvektorer.
 * 
