#Reflektion laboration 1 - Webbskrapa

##Skäl att spara skrapat data i JSON-format

Jag anser att det finns följande skäl att spara data i JSON-format:

 * Läsbarhet: JSON är läsbart för människor samt enkelt för maskiner att använda och generera.
 * Jag har för mig att JSON kräver/upptar färre bytes jämfört med t.ex. XML.
 * JSON går att spara både till fil och i populära nosql databaser som exempelvis mongoDb eller 										couchDb.

##Tillämpning av webbskrapor

Webbskrapning är med all säkerhet en viktig tillämpning inom journalistik. Antar att det finns mjukvara "skräddarsydd" för journalister.

##Underlätta för serverägare

Jag har underlättat för serverägaren genom att ange vem jag är så att serverägaren enkelt kan urskilja mina anrop som webbskrapa.

##Etiska Aspekter

Då det finns intresse av att skrapa en webbplats/-applikation bör föjande göras:
  1. Läs serverägarens villkor för skrapning i dokument för användarvillkor (Terms Of Use).
  2. Kontakta sedan serverägaren och fråga om lov.

##Risker med automatisk skrapning

  1. Om ägaren av webbsidan ändrar på html id och klass attribut, fungerar inte webbskrapan längre.
  2. Om skrapning sker med oförsiktighet eller på felaktigt sätt kan det resultera i juridiska problem.

##Skrapa en sida gjord i ASP.NET mvc.
Om viewstate är satt till true i .net applikationen, skapar det problem för webbskrapan.

##Diskutabla delar i min webbskrapa.
  * Allmän kodkvallitet, skrapan är skiven i node.js, koden är uppbyggd på helt fel sätt. Koden borde delats upp på ett bättre sätt och sedan styra de olika delarna genom att lyssna på event och köra kod när det är dags. Som det är nu har jag gjort flertalet fulhack för att undvika bakslag med olika callbacks.
  * Kurserna med kursinformation i mitt json objekt borde ligga in en array. En fördel med det är att jag då skulle kunna räkna kurserna på ett bättre sätt.

##Rättsfall
En kille som heter [Pete Warden](http://petewarden.com/2010/04/05/how-i-got-sued-by-facebook/) jobbade på en applikation som exempelvis skulle illustrera gemensamma nämnare för människors namn, intressen mm. Applikationen skulle även kunna visa på hur människors civilstatus, inkomst, arbete och kontaktnätverk är relaterat till sociala faktorer och ekonomisk status (i USA). Applikationen skulle besvara intressanta frågor som:
 * Innebär en bred bekantskapskrets att man också tjänar mycket pengar?
 * Finns det en gräns där väldigt många vänner endast innebär att man är för social för sitt eget bästa?

För att samla in data som skulle ligga till grund för att besvara dessa frågor beslutade sig Pete Warden för att skrapa flertalet webbappar. Efter att han under en längre period skrapat facebook blev han kontaktad med en stämning. Med stor risk för att en rättegång i fallet skulle ruinera Pete Warden, blev han av sin advokat avrådd från att bestrida ärendet. Dessutom skulle rättegången blivit det första stora rättsfallet i sitt slag. Allt slutade med att Pete raderade all insamlad data.

##Kunskap och lärdomar
Med programmeringsuppgiften känner jag att jag har lite koll på hur det går till när man skrapar en webbsida. Dock är det något jag lika gärna kunna läsa om, eller testat på i mindre skala bara för att se hur det går till. Jag känner mig inte lockad att göra detta igen, därför kommer jag att dra mig ifrån det så långt det är möjligt. Jag tycker dessutom att det verkar vara ett klumpigt tillvägagångssätt för att samla data. Det känns heller inte som att det är ok om man skulle vilja skrapa för komersiella syften, kan inte tänka mig att det fins särskilt många webbplatser som går med på det. Det är med blandade känslor jag gjort denna uppgift, det är en värdefull erfarenhet att ha med sig.
