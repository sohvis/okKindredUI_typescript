// tslint:disable:max-line-length

export const finnish = {
    message: {

      // Global
      Edit: `Muokata`,
      Done: `Tehty`,

      // Navbar & Menus
      Family: `Perhe`,
      Tree: 'Puu',
      Map: 'Kartta',
      Gallery: 'Galleria',
      Search: 'Hae',
      About: 'Noin',
      Settings: 'Asetukset',
      Logout: 'Kirjautua ulos',
      Login: 'Kirjaudu sisään',
      Profile: 'Profiili',

      // Login
      PleaseSignIn: 'Ole hyvä ja kirjaudu sisään',
      EmailAddress: 'Sähköpostiosoite',
      Password: 'Salasana',
      SignIn: 'Kirjaudu sisään',
      IForgotMyPassword: 'unohdin salasanani',
      InvalidLogin: 'Virheellinen kirjautuminen',

      // Introduction
      Slide1Header: 'Tervetuloa ok! Kindred',
      Slide1Desc: 'Vapaan ja avoimen lähdekoodin yhteistyöhön sukupuu ja valokuvien jakamiseen verkkosivuilla',
      Slide2Header: 'Luoda ja jakaa',
      Slide2Desc: 'Luo ja jaa monikielinen sukupuu perheen kanssa ja kutsu perheenjäseniä nähdäksesi osoitteen ja liittää siihen',
      Slide3Header: 'Kartta perheesi',
      Slide3Desc: 'Plot the locations of each of your relatives on a map',
      Slide4Header: 'Jaa valokuvia',
      Slide4Desc: 'Jaa valokuvia yksityisesti välillä perheen ja merkitä perheenjäsenet',
      SignUpButton: 'Kirjaudu',

      // About
      ViewDetails: 'Tarkemmat tiedot',
      OurStory: 'Meidän tarinamme',
      OurStoryStub: 'Haluatko tietää tarinan siitä, kuinka ja miksi olemme luoneet tämän sivuston?',
      ContactUs: 'Ota meihin yhteyttä',
      ContactUsStub: 'Jos sinulla on kysyttävää, haluat ilmoittaa bug, kysy ominaisuus tai edistää lähdekoodia.',
      FAQ: 'FAQ',
      FAQStub: 'Usein Kysytyt Kysymykset',

      StoryHeading: 'Miten se alkoi',
      StoryText1: `Hei. Olen Justin vasemmalla. Ja olen Adrian oikealla.`,
      StoryText2: `Tämä on sivusto tallentaa Sukupuussamme ja toimivat vähän kuin sosiaalinen verkosto. Voit ylläpitää profiilin täällä ja selvittää, miten pitkälle puu saavuttaa!
      Koska henkilö lisätään sukupuun, he saavat sähköpostitse, jotta Sivusto innostui meidän perhejuhliin ja vaikeudet selittää, kuinka me kaikki liittyvät.
      Perheemme on nyt hyvin monipuolinen monien etnisten ryhmien ja on levinnyt ympäri maailmaa.
      Kun perhe kasvaa ja kehittyy, halusimme tavan dokumentoida kaikki ja pitää yhteyttä.`,

      ContactHeading: 'Ottaa yhteyttä',
      ContactEmail: `Ota yhteyttä sähköpostitse <a href="mailto:info@okkindred.com">info@okkindred.com</a>`,
      ContactText1: `Jos olet meidän perheessä me haluamme kuulla sinusta ja ovat tervetulleita ja pysyä ympäri tahansa.
      Jos sinulla on kirjautuminen tähän sivustoon ja ovat osa perhettäni, saat minun puhelinnumero ja osoite minun profiili`,
      ContactText3: `Vaihtoehtoisesti, jos etsit apua käyttää sivustoa, tai vaikka haluat meidän auttaa perustaa oman samanlainen sivuston ota pudottaa meidät linja!
      Olemme ihan mukavia ihmisiä ja eivät halua puhua ihmisille kiinnostunut sames me saamme: Geek tavaraa, ohjelmistoja, musiikkia ja hullu pan
      maailmanlaajuinen kiinalaisten perheiden ...`,

      FAQHeading: 'Usein Kysytyt Kysymykset',
      Question1: 'Näkeekö kukaan perheeni tiedot?',
      Answer1: `No, only people within your family tree that you have invited can see the information you input.  The information is also not searchable by outside users or search engines.`,

      Question2: `Onko tietoni turvassa?`,
      Answer2: `Otamme turvallisuuden ja yksityisyyden hyvin vakavasti. Pidämme yksityiskohdat perheemme tällä sivustolla, ja emme koskaan tee mitään vaarantaa nämä tiedot
      Vain oman perheen jäsenille, että kutsut jakaa puu näkevät tiedot, jotka annat sivustolla.
      Lisäksi emme myy, vaihda tai vuokraa henkilökohtaisia ​​tunnistetietoja muille.`,
      Answer2a: `Sivusto on isännöi <a href="https://www.pythonanywhere.com/?affiliate_id=00022aed\">PythonAnywhere</a> joka itse ottaa yksityisyyttä hyvin vakavasti.
      Käytämme myös <a href="https://aws.amazon.com/s3/"> Amazon S3</a> tallentaa kaikki kuvat, jotka lataat.
      Teemme käyttää kolmannen osapuolen <a href="https://en.wikipedia.org/wiki/Geocoding">geocoding</a> palvelujen (Google & Microsoft).
      Tämä on muuntaa sijainti tulee pituus- ja leveysasteen, jotta voimme piirtää sen kartalla.
      Kuitenkin mitään muita tunnistetietoja paloja tiedot (esim. Nimi) syötetään tähän paikkaan näille kolmansille osapuolille.
      Niinpä esimerkiksi lähetämme ainoastaan termiä "Hong Kong" Google, joka sitten antaa meille leveys- ja pituusaste, jotta voimme piirtää sen kartalla.`,
      Answer2b: `Jos olet huolestunut, sivusto on täysin avoimen lähdekoodin, joten voit
      ottaa kopion lähdekoodista (katso jäljempänä), on katsoa, ​​miten tiedot on
      tallennettu tai jopa isännöidä omaa version tällä sivustolla.
      Meillä on enemmän kuin mielellään auttaa asettaa sen.`,

      Question3: `Voinko nähdä lähdekoodia?`,
      Answer3: `Lähdekoodi sijaitsee <a href="https://github.com/JustinWingChungHui/okKindred">Github.com</a>. Mitä näet okKindred.com otetaan "production" haara.`,
      Answer3a: `Olemme antanut sen jollain <a href="https://en.wikipedia.org/wiki/MIT_License">MIT lisenssin</a> mikä tarkoittaa vapaasti käyttää, kopioida ja muokata koodia oman tarkoitukseen.
      <a href="https://github.com/JustinWingChungHui/okKindred/blob/master/README.rst">README</a> sisältää perustiedot yleiskuvan siitä, miten se toimii ja askel askeleelta ohjeet sijoittaa oman esimerkiksi.`,
      Answer3b: `Olemme tyytyväisiä kuka tahansa ideoita tai joka haluaa osallistua tähän projektiin ja tehdä se paremmin! Olemme erityisen tarvitsevat apua kääntämistä muille kielille.
      Ole hyvä <a href="mailto:info@okkindred.com?subject=Development">yhteyttä</a> jos haluat edistää, tai (vielä parempi) esittää pull pyynnön Github :)`,

      Question4: `Mitä se sinulle, jos se on ilmainen?`,
      Answer4: `Olemme ohjelmistokehittäjiä, ja tämä on projekti luotu meidän vapaa-aikaa laajentaa skillset ja lisätä tuotevalikoimaamme keuliminen muille.
      Tämä oli paras tapa järjestää tietoa oman perheen, ja toivomme, että uudet käyttäjät tarjota ehdotuksia parantaa sivuston tai jopa edistää koodia.`,

      Question5: `Mitä selaimia tämä työ?`,
      Answer5: `Sivusto on testattu uusimman version alkuun selainten työpöydällä ja mobiili.
      Ongelma voi olla ei-tuetuissa selaimissa, kuten vanhemmat Android selaimilla, Internet Explorer 9 ja alla.`,

      Question6: `Onko olemassa rajoitusta kuvia voin ladata?`,
      Answer6: `Ei tällä hetkellä ei ole. Kuvat tallennetaan <a href="https://aws.amazon.com/s3/">Amazon S3</a> joka on erittäin hyvin halpaa, joten emme mielessä arvoisesti kustannuksia.
      Jos kuitenkin paljon käyttäjiä alkaa ladata tuhansia ja tuhansia kuvia, meidän on luotava raja.`,

      Question7: `Voinko mainostaa sivustossasi?`,
      Answer7: `Meillä ei ole suunnitelmia nostaa rahaa kautta mainoksia sivuston lähinnä emme halua alistaa meidän Grandmas mitään enemmän mainontaa kuin he nykyisin saavat`,

      Question8: `Löysin virheen!`,
      Answer8: `Kerro meille! Voit <a href="mailto:info@okkindred.com?Subject=I%%20found%%20a%%20bug!">meille sähköpostia</a> tai voit lisätä sen <a href=https: //github.com/JustinWingChungHui/okKindred/issues">issues lista </a> Github.
      Jos se on turvallisuus bug täytyy tietää ASAP, jotta voimme korjata sen!`,

      Question9: `Voitteko lisätä ominaisuus, joten se voi tehdä xxxxx haluta?`,
      Answer9: `Voit vapaasti pyytää uusia ominaisuuksia kautta <a href="mailto:"info@okkindred.com?Subject=Feature%%20Request">info@okkindred.com</a>.
      Tulemme varmasti pitävät niitä varsinkin jos se hyödyttää paljon ihmisiä (eli meidän perhe).
      Tämä sivusto tehdään vapaa-ajalla, joten pyyntöjä tehdään, kun he ovat tehneet.`,

      Question10: `Muut sukututkimus sivustot etsiä paikallisia kirjaa auttaa luomaan puu, voit tehdä saman?`,
      Answer10: `Meillä ei ole suunnitelmia toteuttaa tämän vielä. Syy tähän on se, että suurin osa perheen peräisin Kiinasta.
      Koska sisällissodat joka tapahtui Kiinassa 1900-luvulla ja epävakautta viimeisten vuosikymmenien aikana Qing-dynastian,
      Muutama käyttökelpoinen kirjaa olemassa, jotka olisi hyödyllistä meille.`,
      Answer10a: `Koska monet sukututkimusta sivustot tehdä tämän jo, me yrittäisi keskittyä enemmän sosiaalisen verkottumisen puolella tämän projektin.
      Kuitenkin, että ei ole sanoa, että jos ajan suuri tarve kävi ilmeiseksi, emme olisi tarkastella toteuttaa tällainen ominaisuus.`,

      Question11: `Sillä kuvataan suhteita olet "Partneroitu" mutta ei "Naimisissa", olet "Raised" mutta ei "synnyttänyt"?`,
      Answer11: `Olemme yrittäneet pitää sivuston mahdollisimman yksinkertainen ja mahdollisimman kattavat. Määritelmät "Raised", "Raised" ja "Partneroitu antaa riittävästi tietoa rakentaa puuhun.
      Ne sisältävät kulttuurien suhteita, jotka eivät ole avioliittokäsite.
      Ne voivat sisältää parisuhteiden, common law kumppanit, eronneita, adoptoidut ja muita määritelmiä, jotka voidaan tai ei ole eri kulttuureissa`,

      AboutFooter: `Justin Wing Chung Hui & Adrian Chu`,

      // Profile
      Name: `Nimi`,
      Gender: `Sukupuoli`,
      BirthYear: `Syntymä Vuosi`,
      DeathYear: `Kuoleman Vuosi`,
      SpokenLanguages: `Puhutut Kielet`,
      Email: `Sähköposti`,
      Occupation: `Ammatti`,
      TelephoneNumber: `Tel Number`,
      Location: `Sijainti`,
      Website: `Verkkosivusto`,
      SkypeName: `Skype Nimi`,
      Facebook: `Facebook`,
      Twitter: `Twitter`,
      LinkedIn: `LinkedIn`,

      Female: `Nainen`,
      Male: `Uros`,
      Other: `Muut`,

      Biography: `Elämäkerta`,
      BiographyNotExist: `Elämäkerta ei ole vielä kirjoitettu tällä kielellä.`,
      InviteToJoin: `Kutsu liittymään`,
      Photos: `Valokuvat`,

      ClickToEdit: `Napsauta Muokkaa`,
      UploadNewPhoto: `Lataa uusi valokuva`,

      // Search
      SearchName: `Haku Name`,

      // Password reset
      PasswordReset: `Salasanan Nollaus`,
      PasswordResetDescription: `Anna sähköpostiosoitteesi salasanan palauttamisen aloittamiseksi:`,
      ResetMyPassword: `Nollaa Salasanani`,
      PasswordResetRequested: `Salasanan palautus pyydetty`,
      CheckYourEmailForReset: `Tarkista sähköpostisi saadaksesi lisätietoja.`,

      // Password Reset Confirmation
      PasswordResetConfirmation: `Salasanan Palautuksen Vahvistus`,
      PasswordResetConfirmationDescription: `Anna uusi salasana`,
      PasswordConfirmation: `Vahvista uusi salasana`,
      PasswordsNotMatching: `Salasanat eivät täsmää`,
      UpdateMyPassword: 'Päivitä Salasanani',

      // Settings
      UserSettings: `Käyttäjäasetukset`,
      ChangePassword: `Vaihda Salasana`,
      LeaveokKindred: `Jätä ok!Kindred`,

      // User Settings
      LanguageLabel: `Kieli:`,
      ReceiveFamilyEmailUpdates: `Vastaanota sähköpostiviestejä, kun perheen tietoja päivitetään`,
      ReceivePhotoTaggingEmailUpdates: 'Vastaanota sähköpostiviestejä, kun olet merkitty valokuviin',
      UserSettingsSaved: `Käyttäjän Asetukset Tallennettu`,

      // Password breach
      PasswordBreach1: `Tämä salasana ei ole turvallinen!`,
      PasswordBreach2: `Sitä on käytetty muissa sivustoissa, joissa on rikottu yksityisyyttä ja joiden pitäisi olla
      muutettu pitämään ok! Kindred -tilisi turvallisena`,
      PasswordBreach3: `Ole hyvä ja vaihda salasanasi menemällä `,
      ForMoreInformation: `Lisätietoja:`,
    },
};
