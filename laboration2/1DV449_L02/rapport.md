# Rapport - laboration 2

## Säkerhetsproblem

###Login
När loginformuläret postas körs check.php där isUser anropas. isUser körs i filen sec.php. I funktionen isUser sker en sql fråga för att
kontrollera användarnamn och lösenord. __Följande säkerhetsbriser är identifierade:__

 * Sql frågan är ej parametriserad och det lämnas helt öppet för en sql injection.
 * Lösenordet sparas i klartext!
 * ifUser() körs i en if-sats som släpper igenom inloggningsförsöket om ifUser returnerar true, men man kontrollerar inte att ifUser
   returnerar ett faktiskt boleanskt värde. Om ingen användare hittas returnerar ifUser() en sträng och den som loggar in deligeras vidare
   till inloggat läge oavsett vilka autentiseringsuppgifter som angetts.
 * Oavsett vad användaren autentiserar sig med, körs funktionen sec_session_start() i filen sec.php och användaren deligeras vidare till
   chatten (mess.php).
 * I filen mess.php görs ingen kontroll på om användaren är inloggad.
 * Funktionen logout i sec.php används inte. Dessutom sköts utloggning med hjälp av ett onclick event och funktionen logout() i MessageBoard.js,
   vilket helt kopplar förbi utloggningen på servern även om logout i sec.php hade varit anropad. Det görs alltså aldrig en session_unset på
   den sessionen som startas vid inloggning.
 * Funktionen logout() i filen sec.php anropar en icke befintlig funktion, session_end().
 
 
 __Åtgärder__
 

## Optimering

