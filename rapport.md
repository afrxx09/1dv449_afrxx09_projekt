#Projektrapport 1dv449
Andreas Fridlund - afrxx09

##Inledning
I brist på fantasi blev det en applikation där man kan hantera ett öl-lager. Efter att ha letat och läst om diverse API:er i över två dagar, kunde jag fortfarande inte komma på någon bra idé att göra en applikation om. Det var svårt att hitta 2 bra, tillförlitliga och intressanta API:er, samt att det var svårt att komma på en applikation som kunde använda datan på ett relevant sätt. Då jag inte kom på någon bra idé och började känna stressen så fick jag nöja mig med en dålig applikations-idé och bara börja. Värt att nämna också är att jag inte ville använda google maps som en av de två datakällorna, då det kändes lite tråkigt och som en för enkel utväg. Jag känner inte till några andra applikationer av detta slaget.

![Schema](https://github.com/afrxx09/1dv449_afrxx09_projekt/blob/master/schema.png)

##Serversidan
Applikationen är skriven i node js, med en MongoDB NoSQL-databas tillsammans med ett flertal node js-moduler. De mest relevanta är Express som förenklar arbetet med att sätta upp serven och routes. Mongoose för databas och modell-scheman. Passport för inloggning, konton, och oauth. De två API:er jag använder är brewerydb.com för att hämta information om öl och bryggerier, samt Flickr för att hämta bilder relaterade till dessa.

Upplägget på serversidan är i stil med MVC. En uppsättning routes som är kopplade mot metoder i controllrar som renderar ut vyer. All funktionalitet ligger bakom inloggning så applikationen går inte använda utan att logga in och alla requests kontrolleras. Appplikationen hämtar främst data från den egna databasen, endast om datan är bristfällig används något av API:erna. Data som hämtas från brewerydb.com mellanlagras i den egna databasen för att minska antalet requests mot dem.

Cachning används inte som standard i node js applikationer, jag använder en modul till express som gör att servern använder gzip och jag har ställt in cache-control max-age på alla requests.

##Klientsidan
Klientsidan är ganska simpel, det är bara html och css som renderas statiskt från webservern. Det finns lite javascript för att göra vissa ajax-anrop.

##Säkerthet och prestanda
Inloggningen använder sessioner, dessa hashas med en “secret”-sträng för att förhindra att de manipuleras. Objektet som används för inloggade användare är krypterat och avkrypteras automatiskt med hjälp av Passport.

Jag har gömt alla mina api-nycklar och databasuppgifter i “environment -variabler” på servern, dessa manipuleras på webhotellet heroku och applikationen får tillgång till dem när den körs. Mycket smart lösning för att gömma känslig data som jag aldrig använt förut.

SQL-injects är inget problem med mongodb då såkallade BSON-object används istället för strängar för att bygga upp querys. “As a client program assembles a query in MongoDB, it builds a BSON object, not a string. Thus traditional SQL injection attacks are not a problem.”

Jag har inte gjort något för att förhindra csrf-attacker, det är inte så väsentliga operationer som kan utföras som inloggad användare så det kändes inte nödvändigt. Det finns en modul till express som gör det möjligt att lägga in csrf-token i ens formulär.

Prestandan höjs en aning genom att gzip används och cache är påslaget. Externa bibliotek som jQuery och Bootstrap laddas in från CDN-servrar. Jag försöker använda mina API:er så sällan som möjligt för att minska belasningen mot dessa, samt att applikationen går snabbare om den inte frågar externa källor efter data hela tiden.

##Offline-first
Då hela min applikation ligger bakom inloggning och varje request kontrolleras så har jag haft svårt att klura ut hur detta skulle appliceras. Jag har ingen direkt intressant data att manipulera i ett offline-läge då det mesta handlar om att söka efter information(öl). Min applikation är väldigt fokuserad på serversidan vilket gör det svårt att mellan-lagra data på klienten.

##Reflektion
Det har varit en stor utmaning detta projektet. Att sammanfoga alla kraven till en vettig idé och en bra applikation har varit mitt största problem och såhär i efterhan även nederlag. Två datakällor, offline-first, oauth blev för mycket för att komma på en vettig idé i tid. Så jag är inte speciellt nöjd med min applikation och kommer inte jobba alls på att utveckla den vidare. Jag hade velat komma på ett vettigt sätt att implementera offline-first. Jag påbörjade, men skrotade pga tidsbrist funktionalitet kring att skaffa vänner i applikationen vilket hade vart trevligt att implementera.

Trots negativiteten och frustrationen som nämnts så finns det saker jag är nöjd över. Jag har aldrig programmerat node js förut, har aldrig använt en NoSQL-databas. Jag har lärt mig massor om detta och är faktiskt taggad på att fortsätta jobba med node js. Jag vill bli bättre och ser massor av potential i språket, framförallt när man kan börja arbeta bort mycket av modulerna och kan börja skriva riktigt bra optimerad kod själv. Så även om jag har knåpat ihop vad som enligt mig är en dålig applikation så har jag massor av ny lärdom och erfarenhet i bagaget!

##Risker
Det är alltid riskfyllt med API:er, flickr är jag inte så orolig över då det är ett gigantiskt API. Gör de förändringar så kommer det bergis ske med nya version så att de gamla finns kvar en längre tid, det körs på stabila servrar och har ingra begränsningar mm. Brewerydb där emot känns som ett mer känsligt API, datan känns tämligen opålitlig, de har hårda begränsningar med anopen och jag har ingen uppfattning alls om stabiliteten på deras servrar.
Jag använder mycket moduler, dessa är av specifika definerade versioner så det borde inte vara några problem med beroenden mellan dem. Där emot är det tredjeparts-kod så det är inte alltid säkert att använda.

##Betygshöjande
Tycker inte det är något speciellt jag gjort som förtjänar extra belöning, men något att ha i åtanke kanske är att jag är komplett nybörjare på node js och NoSQL. Man har fått spendera allt för många timmar på att brottas med “dumma”, “enkla” problem. Bara en sådan sak som att skapa en många-till-många-relation mellan två modeller med NoSQL var en utmaning då det inte finns beskrivet i deras dokumentation och mongoose(wrapper-modulen till mongodb) inte har stöd för det heller.
