api complexity / gas 2013 kommenttien huomiointi

Timon ehdotuksen mukaan koontia siit� miten ajattelin ett� arvioijien kommenttien pohjalta voisi ty�st��:

---

R1: remove/update paragraph on motivation (reX API dev):

* kyll�, vois harkita siirt�� kun on asian vierest� tuolla ja tavallaan
sotkee muuten selke�� introa. tai jos joku keksii miten vois
kirjoittaa uudestaan. mihinh�n tuo oikein sopis jos siirt��? minusta
ihan tolkkua kuitenkin mainita ett� miksi t�m� koko askare on tehty..

R1: move related work towards end:

* ajattelin ett� ei siirret�, liian iso muutos ja muiden arvioijien mielest� rakenne ja flow o ok. oon kans tottunut siihen ett� related work o 2. kappaleena.

R1: jscomplexity pois jos ei k�ytet�:

* on k�yt�ss�, pit�� tarkistaa voisko sen sanoa selvemmin

R1: organize description and discussion

* katso voisko jotenkin selvent�� arviointikriteerien esityst�
* lis�� otsikkoja pitkiin kohtiin diskussiossa (future work nyt samassa p�tk�ss� siell� lopussa)

R1: remove UMLs

* harkintaan, minusta on kuitenkin oikeastaan olennaista ett� ne siell� n�kyy, kun OP metriikat perustuu osaltaan luokkiin ja niiden metodien signatuureihin yms niin onpahan n�k�s�ll� v�h�n konkretiaa siit� koodista eik� vaan numeroita

R1: summarize conclusions

* kiintoisa idea. voidaanko t�n pohjalta sanoa selvemmin mihin Tundra ja mihin Union sopii, sellaista p�hkyr�inti�h�n siit� on .. yksinkertaistaen vois sanoa ett� Tundra sopii kun on 3d ja euklidinen ja normaalia fysiikkaa jne, Union jos o vaikka joku spesiaalikoordinaatisto ja liikkeet ja toiminnot. tuo nyt ei kuitenkaan oo t�n artikkelin p��pointti, enemm�n sellainen sivuhavainto minusta, ja sellaisena on siell� v�h�n kirjoitettukin diskussiossa.

---

R2: compare OP with FP

* OP ja varmaankin sen osana oleva MP (message points) on jonkinlainen askel eteenp�in FP:st� (funktion points), pit�is setvi� t�m� tarkemmin ja todeta jotenkin

---

R3: concern about these Pong implementations not being comparable:

* agreed, ja t�m� on sanottukin - vois selvent�� sit� ett� jatkossa pit�is tehd� huolellisesti samanlaisia implementaatiota jotta API ois ainoa ero mik� j�� (n�ill� sanoilla se tosin on tuolla jo sanottukin, mutta jospa vois ter�v�itt��)

R3: suprised about our surprise (maintainability indices)

* yll�tys viittas vaan siihen ett� kun se toinen codebase on paljon pienempi, eik� ensin hoksannut ett� katsotaan keskiarvoja. vois yksinkertaisesti vaihtaa 'surprisingly' -> 'notably' tms. kun ei se oikeasti ole yll�tt�v��, kuten arvioija toteaa.
