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
   görs en jämförelse.
 
 __Åtgärder - Indata__
 * Sql fråga för att lägga lägga in meddelanden i db sker med en pdo anslutning och sql frågan är parametriserad.
 * XSS åtgärd sker då all data skrivs ut som textContent istället för exempelvis innerHTML.

## Optimering

 __Problem1__: mess.php laddar in jquery.js istället för jquery.min.js.
 
  * __Åtgärd:__ mess.php laddar in jquery.min.js.
  * __Observation innan:__ Svårt att observera relevant tidsåtgång eftersom testet sker lokalt (1ms).
  * __Observation efter:__ Filen är 176 KB mindre vilket borde ge en viss tidsvinst på en annan server. 
  * __Resultat:__
  
__Problem2__: 

  * __Åtgärd:__
  * __Observation innan:__
  * __Observation efter:__
  * __Resultat:__
    
