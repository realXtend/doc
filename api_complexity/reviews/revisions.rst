api complexity / gas 2013 kommenttien huomiointi

Timon ehdotuksen mukaan koontia siitä miten ajattelin että arvioijien kommenttien pohjalta voisi työstää:

---

R1: remove/update paragraph on motivation (reX API dev):

* kyllä, vois harkita siirtää kun on asian vierestä tuolla ja tavallaan
sotkee muuten selkeää introa. tai jos joku keksii miten vois
kirjoittaa uudestaan. mihinhän tuo oikein sopis jos siirtää? minusta
ihan tolkkua kuitenkin mainita että miksi tämä koko askare on tehty..

R1: move related work towards end:

* ajattelin että ei siirretä, liian iso muutos ja muiden arvioijien mielestä rakenne ja flow o ok. oon kans tottunut siihen että related work o 2. kappaleena.

R1: jscomplexity pois jos ei käytetä:

* on käytössä, pitää tarkistaa voisko sen sanoa selvemmin

R1: organize description and discussion

* katso voisko jotenkin selventää arviointikriteerien esitystä
* lisää otsikkoja pitkiin kohtiin diskussiossa (future work nyt samassa pötkössä siellä lopussa)

R1: remove UMLs

* harkintaan, minusta on kuitenkin oikeastaan olennaista että ne siellä näkyy, kun OP metriikat perustuu osaltaan luokkiin ja niiden metodien signatuureihin yms niin onpahan näkösällä vähän konkretiaa siitä koodista eikä vaan numeroita

R1: summarize conclusions

* kiintoisa idea. voidaanko tän pohjalta sanoa selvemmin mihin Tundra ja mihin Union sopii, sellaista pähkyröintiähän siitä on .. yksinkertaistaen vois sanoa että Tundra sopii kun on 3d ja euklidinen ja normaalia fysiikkaa jne, Union jos o vaikka joku spesiaalikoordinaatisto ja liikkeet ja toiminnot. tuo nyt ei kuitenkaan oo tän artikkelin pääpointti, enemmän sellainen sivuhavainto minusta, ja sellaisena on siellä vähän kirjoitettukin diskussiossa.

---

R2: compare OP with FP

* OP ja varmaankin sen osana oleva MP (message points) on jonkinlainen askel eteenpäin FP:stä (funktion points), pitäis setviä tämä tarkemmin ja todeta jotenkin

---

R3: concern about these Pong implementations not being comparable:

* agreed, ja tämä on sanottukin - vois selventää sitä että jatkossa pitäis tehdä huolellisesti samanlaisia implementaatiota jotta API ois ainoa ero mikä jää (näillä sanoilla se tosin on tuolla jo sanottukin, mutta jospa vois terävöittää)

R3: suprised about our surprise (maintainability indices)

* yllätys viittas vaan siihen että kun se toinen codebase on paljon pienempi, eikä ensin hoksannut että katsotaan keskiarvoja. vois yksinkertaisesti vaihtaa 'surprisingly' -> 'notably' tms. kun ei se oikeasti ole yllättävää, kuten arvioija toteaa.
