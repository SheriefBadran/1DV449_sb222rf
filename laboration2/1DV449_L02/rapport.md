# Rapport - laboration 2

## Säkerhetsproblem

### Login
När loginformuläret postas körs check.php där isUser anropas. isUser körs i filen sec.php. I funktionen isUser sker en sql fråga för att
kontrollera användarnamn och lösenord. __Följande säkerhetsbriser är identifierade:__

 * Sql frågan är ej parametriserad och det lämnas helt öppet för en sql injection.
 * Lösenordet sparas i klartext! Användarnas autentiseringsuppgifter är exponerade och kontot är kapat om uppgifterna hamnar i fel händer.
 * ifUser() körs i en if-sats som släpper igenom inloggningsförsöket om ifUser returnerar true, men man kontrollerar inte att ifUser
   returnerar ett faktiskt boleanskt värde. Om ingen användare hittas returnerar ifUser() en sträng och den som loggar in deligeras vidare
   till inloggat läge oavsett vilka autentiseringsuppgifter som angetts.
 * Oavsett vad användaren autentiserar sig med, körs funktionen sec_session_start() i filen sec.php och användaren deligeras vidare till
   chatten (mess.php).
 * I filen mess.php görs ingen kontroll på om användaren är inloggad.
 * Funktionen logout i sec.php används inte. Dessutom sköts utloggning med hjälp av ett onclick event och funktionen logout() i MessageBoard.js,
   vilket helt kopplar förbi utloggningen på servern även om logout i sec.php hade varit anropad. Det görs alltså aldrig en session_unset på
   den sessionen som startas vid inloggning.
 * Funktionen logout() i filen sec.php anropar en icke befintlig funktion, session_end(). Det finns ingen fungerande utloggning på serversidan.
 
 
 __Åtgärder__
 
 * Sql frågan är parametriserad och körs med PDO.
 * Lösenordet är både saltat och hashat. Användarnamn och lösenord kontrolleras enligt följande:
   Lösenordet hämtas ut med användarnamnet. Hash av angivet lösenord + salt ska matcha lösenordet i databasen. Detta sker i validate.php
   och Validator.php
 
### Chat

I filen mess.php körs ett inline skript som anropar funktionen getMessages() i filen MessageBoard. I getMessages sker ett ajaxanrop som
går till filen functions.php.
__Följande säkerhetsbrister är identifierade:__

 __Utdata__
 * Ajaxanrop görs med GET istället för POST.
 * Ingen validering av utdata i varken functions.php eller get.php för skydd eventuellt skadlig xss som kommer från server till klient.
 * Ingen validering av utdata på klienten? Hur mycket gör json.parse()? 

 __Indata__
 * Inga parametriserade sql frågor
 * Indata skickas till servern via ett ajaxanrop som görs av funktionen sendMessage i filen MessageBoard.js. Indata valideras inte innan
   den skickas till servern vilket öppnar för xss attacker och sql injection. Detta är särskilt allvarligt eftersom data skrivs ut med
   innerHTML och inte som textContent.
 * Funktionen addToDb() i filen post.php sparar meddelandet till databasen utan validering, vilket öppnar för sql injection samt xss attacker då
   utdata kommer att kunna innehålla skadlig javascript kod.
 
 __Cross Site Request Forgery__
 * Skydd mot CSRF är implementerat. Ett token är satt på server och i ett gömt fält på klienten. När ett meddelande skickas till servern
   görs en jämförelse. Jag använder dock php's uniqId() som jag senare läste på php.net inte bör användas i syften för att åstadkomma
   säkerhet.
 
 __Åtgärder - Indata__
 * Sql fråga för att lägga lägga in meddelanden i db sker med en pdo anslutning och sql frågan är parametriserad.
 * XSS åtgärd sker då all data skrivs ut som textContent istället för exempelvis innerHTML.
 
### Övrigt 

 __Persistent lagring:__ Om man skriver url'en till db.db kommer man att kunna ladda ner hela db filen!!
 __Åtgärd:__ Tabellerna ligger i en mysql databas. Databasfilerna ligger i mappen data utanför den publika public_html.
 
 __Exceptions:__ I flera av php filerna skrivs $e->getMessage() ut om en PDO Exception fångas. Känslig information exponeras.
 __Åtgärd:__ Ta bort all form av utskrift av $e->getMessage() i fångat PDO Exception.
 
 __Brister:__ En uppenbar brist just nu är att det går att jag inte hunnit implementera kontroll för stöld av session.
 

## Optimering

 __Problem1__: mess.php laddar in jquery.js istället för jquery.min.js.
 
  * __Åtgärd:__ mess.php laddar in jquery.min.js.
  * __Observation innan:__ Svårt att observera relevant tidsåtgång eftersom testet sker lokalt (1ms).
  * __Observation efter:__ Filen är 176 KB mindre vilket borde ge en viss tidsvinst på en annan server. 
  * __Resultat:__
  
__Problem2__: Onödigt många javascript filer länkas in i mess.php.

  * __Åtgärd:__ Ta bort script.js eftersom den har samma innehåll som bootstrap.js, ta bort jquery.js eftersom vi redan använder oss av jquery.min.js
  * __Observation innan:__ Svårt att observera relevant tidsåtgång eftersom testet sker lokalt (1ms).
  * __Observation efter:__ Förändringen innebär en minskning på 333 KB i form av statiska resurser.
  * __Resultat:__  Resultatet är ett genomsnitt på 10 försök.
    
__Problem3__: Javascript länkas in längst upp i head i filen mess.php.

  * __Åtgärd:__ Javascriptfilerna i mess.php länkas istället in precis innan body elementets slut-tagg. Ett alternativ hade varit att lägga in attributet async.
    Detta görs för att javascriptfilerna inte ska blockera rendering av html sidan.
  * __Observation innan:__ Observationen har genomförsts genom att först rendera html sidan inkl. övriga resurser utan javascriptfiler och genomsnittstiden togs till 211 ms.
                           Sedan gjordes ytterligare en observation då javascriptfilerna laddas in i html head elementet. Den genomsnittliga tiden är tagen till 251 ms.
  * __Observation efter:__ En mätning då javascriptfilerna länkas in precis innan body elementets slut-tagg gav en genomsnittlig tid på 220 ms.
  * __Resultat:__  Resultatet är ett genomsnitt på 10 försök.
  
__Problem4:__ Bootstrap.css är inte minifierad.

  * __Åtgärd:__ Länka in bootstrap.min.css. När filen genererades hos bootstrap valdes endast css för formulär och knappar. 
  * __Observation innan:__ bootstrap.css har en storlek på 123,5 KB.
  * __Observation efter:__ filen är nu minimerad till 20,6 KB.
  * __Resultat:__  bootstrap har minimerats med 103 KB.
  
__Problem4:__ Bootstrap.css är inte minifierad.

  * __Åtgärd:__ Länka in bootstrap.min.css. När filen genererades hos bootstrap valdes endast css för formulär och knappar. 
  * __Observation innan:__ bootstrap.css har en storlek på 123,5 KB.
  * __Observation efter:__ filen är nu minimerad till 20,6 KB.
  * __Resultat:__  bootstrap har minimerats med 103 KB. 


### Övrigt

__Brister:__
Onödig datatrafik mellan server och klient då servern alltid skickar över alla meddelanden som finns i db tabellen till klienten som
endast skriver ut de nya meddelanderna till användaren.

__Totalt har alla statiska resurser minimerats från 1100 KB till 165 KB.__
 
  
  