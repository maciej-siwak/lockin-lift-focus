import json

data = {
  "bench-press": {
    "muscles": ["Klatka piersiowa", "Przedni akton barku", "Triceps"],
    "equipment": "Sztanga, ławka pozioma",
    "difficulty": "Średniozaawansowany",
    "type": "Wyciskanie horyzontalne",
    "description": "Złoty standard w budowaniu siły górnej partii ciała. Angażuje mięśnie klatki piersiowej, przedni akton barku oraz triceps poprzez stabilny tor ruchu sztangi, który pozwala na progresję ciężaru przez lata.",
    "setup": "Połóż się płasko, tak aby oczy znajdowały się pod gryfem. Zaprzyj stopy o podłoże, zachowaj lekką lordozę (mostek) i ściągnij łopatki do siebie i w dół w stronę ławki. Chwyć sztangę na szerokość ok. 1.5× szerokości barków, trzymając nadgarstki prosto.",
    "execution": "Zdejmij sztangę nad barki, a następnie opuszczaj ją pod kontrolą do dolnej części mostka, trzymając łokcie pod kątem 45–75°. Zatrzymaj na moment na klatce, po czym wypchnij dynamicznie w górę i lekko w stronę twarzy do pełnego wyprostu.",
    "tips": "Utrzymuj napięcie górnej części pleców przez całe powtórzenie. Wykorzystaj nogi (leg drive), naciskając stopami w podłogę, ale nie odrywaj bioder. Spowolnij fazę negatywną — 2–3 sekundy opuszczania budują znacznie więcej mięśni niż szybkie odbijanie.",
    "mistakes": "Prowadzenie łokci pod kątem 90° mocno obciąża barki. Odbijanie sztangi od klatki ułatwia najtrudniejszą część ruchu. Utrata napięcia pleców i „mostka” w trakcie serii stawia mięśnie klatki w słabej, zbyt rozciągniętej pozycji."
  },
  "incline-dumbbell-press": {
    "muscles": ["Górna część klatki piersiowej", "Przedni akton barku", "Triceps"],
    "equipment": "Hantle, ławka skośna",
    "difficulty": "Średniozaawansowany",
    "type": "Wyciskanie na skosie",
    "description": "Najlepsze ćwiczenie na rozwój górnej części klatki piersiowej (część obojczykowa). Hantle pozwalają na naturalny tor ruchu każdego ramienia z osobna.",
    "setup": "Ustaw ławkę pod kątem 30°. Zarzuć hantle na wysokość barków kładąc się na ławce. Wierzch dłoni skieruj do przodu, nadgarstki prosto nad łokciami.",
    "execution": "Opuszczaj hantle, aż znajdą się na linii górnej części klatki piersiowej i poczujesz wyraźne rozciągnięcie. Wyciskaj w górę i lekko do środka, kończąc tuż przed zetknięciem się hantli na górze.",
    "tips": "Trzymaj ławkę pod kątem 30° — większy kąt zmieni ćwiczenie w wyciskanie na barki. Mocno spinaj klatkę w górnej fazie ruchu.",
    "mistakes": "Ustawienie skosu na 45–60° przenosi obciążenie na przedni akton barku. Odbijanie hantli od barków niweluje rozciągnięcie kluczowe dla wzrostu górnej części klatki."
  },
  "chest-dip": {
    "muscles": ["Dolna część klatki piersiowej", "Triceps", "Przedni akton barku"],
    "equipment": "Poręcze",
    "difficulty": "Średniozaawansowany",
    "type": "Wyciskanie z masą ciała",
    "description": "Brutalne ćwiczenie z masą ciała budujące dolną część klatki i tricepsy. Pochylenie tułowia do przodu jest tym, co odróżnia pompkę na klatkę od pompki na triceps.",
    "setup": "Chwyć poręcze nieco szerzej niż szerokość barków. Zablokuj ramiona, pochyl tułów o ok. 30° do przodu i skrzyżuj kostki za sobą.",
    "execution": "Opuszczaj się pod kontrolą, aż barki znajdą się tuż poniżej łokci i poczujesz rozciągnięcie w klatce. Wróć do pełnego wyprostu, zachowując pochylenie do przodu.",
    "tips": "Gdy powtórzenia z własną masą ciała staną się łatwe, dodaj obciążenie na pasie. Przez cały czas trzymaj barki nisko, z dala od uszu.",
    "mistakes": "Utrzymywanie pionowej pozycji zmienia ćwiczenie w ruch angażujący głównie triceps. Schodzenie zbyt głęboko bez kontroli nadmiernie obciąża stawy barkowe."
  },
  "cable-fly": {
    "muscles": ["Klatka piersiowa"],
    "equipment": "Wyciąg, rączki typu D",
    "difficulty": "Początkujący",
    "type": "Izolacja",
    "description": "Czysta izolacja klatki piersiowej ze stałym napięciem w całym zakresie ruchu — niemożliwe do odtworzenia z hantlami.",
    "setup": "Ustaw oba bloczki nieco powyżej wysokości barków. Przyjmij pozycję w wykroku, ramiona lekko ugięte i zablokowane pod tym samym kątem przez całą serię.",
    "execution": "Utrzymując lekkie ugięcie w łokciach, ściągaj rączki w dół i do siebie przed biodra, jakbyś obejmował beczkę. Zatrzymaj napięcie na sekundę, a następnie powoli otwieraj ramiona do pełnego rozciągnięcia.",
    "tips": "Myśl o zbliżaniu łokci do siebie, a nie dłoni. Skrzyżuj rączki lekko na dole, aby w pełni spiąć wewnętrzną część klatki.",
    "mistakes": "Prostowanie i uginanie łokci zamienia rozpiętki w wyciskanie. Zbyt duży ciężar powoduje wysuwanie barków do przodu."
  },
  "machine-chest-press": {
    "muscles": ["Klatka piersiowa", "Triceps", "Przedni akton barku"],
    "equipment": "Maszyna do wyciskania",
    "difficulty": "Początkujący",
    "type": "Wyciskanie na maszynie",
    "description": "Stały tor ruchu pozwala na bezpieczne trenowanie blisko upadku mięśniowego — idealne do pracy nad objętością (hipertrofią) lub gdy jesteś zmęczony po ciężkiej sztandze.",
    "setup": "Ustaw siedzisko tak, aby rączki znajdowały się na wysokości środka klatki. Zaprzyj stopy o podłoże, łopatki dociśnij do oparcia.",
    "execution": "Wyciskaj rączki przed siebie, unikając pełnej blokady w łokciach na górze. Opuszczaj powoli, aż dłonie znajdą się na linii klatki i poczujesz rozciągnięcie.",
    "tips": "Zatrzymaj ruch w fazie negatywnej na pełną sekundę. Unikanie pełnej blokady (lockoutu) utrzymuje stałe napięcie mięśniowe.",
    "mistakes": "Zbyt niskie ustawienie siedziska kieruje ruch w górę, odciążając klatkę. Pozwalanie barkom na uciekanie do przodu zmniejsza zaangażowanie klatki."
  },
  "close-grip-bench-press": {
    "muscles": ["Triceps", "Klatka piersiowa", "Przedni akton barku"],
    "equipment": "Sztanga, ławka pozioma",
    "difficulty": "Średniozaawansowany",
    "type": "Wyciskanie wielostawowe",
    "description": "Najcięższe ćwiczenie na triceps, które pozwala na użycie dużego obciążenia. Wykorzystuje wzorzec wyciskania na ławce, ale przenosi pracę na głowę długą i przyśrodkową tricepsa.",
    "setup": "Ustaw się jak do wyciskania klasycznego, ale chwyć sztangę na szerokość barków — nigdy węziej, aby nie obciążać nadgarstków.",
    "execution": "Opuszczaj sztangę do dolnej części mostka, trzymając łokcie blisko tułowia. Wyciskaj w linii prostej do mocnego zablokowania ramion.",
    "tips": "Trzymaj łokcie „przyklejone” do boków — rozstawianie ich na boki zamienia ruch w wyciskanie na klatkę. Skup się na końcowej fazie wyprostu, gdzie triceps pracuje najmocniej.",
    "mistakes": "Zbyt wąski chwyt (stykanie się kciuków) wykręca nadgarstki i szczypie barki. Odbijanie od klatki marnuje napięcie w tricepsach."
  },
  "overhead-cable-triceps-extension": {
    "muscles": ["Triceps (głowa długa)"],
    "equipment": "Wyciąg, lina",
    "difficulty": "Początkujący",
    "type": "Izolacja",
    "description": "Ustawia głowę długą tricepsa w pozycji pełnego rozciągnięcia, w której rośnie ona najszybciej.",
    "setup": "Ustaw bloczek nisko, chwyć linę i odwróć się tyłem do wyciągu. Przyjmij pozycję w wykroku, tułów lekko pochylony, łokcie przy głowie.",
    "execution": "Prostuj ramiona w górę i lekko do przodu, aż do pełnego wyprostu nad głową. Powoli wracaj, aż dłonie opadną za głowę i poczujesz mocne rozciągnięcie tricepsów.",
    "tips": "Trzymaj ramiona (część od barku do łokcia) całkowicie nieruchomo — poruszają się tylko przedramiona. Rozszerzaj końce liny przy wyproście dla mocniejszego spięcia.",
    "mistakes": "Rozstawianie łokci szeroko zmniejsza zaangażowanie głowy długiej. Zbyt szybkie wychodzenie z fazy rozciągnięcia pomija najbardziej produktywną część ruchu."
  },
  "cable-triceps-pushdown": {
    "muscles": ["Triceps"],
    "equipment": "Wyciąg, lina lub drążek",
    "difficulty": "Początkujący",
    "type": "Izolacja",
    "description": "Podstawowe ćwiczenie na wykończenie tricepsów. Wysoka liczba powtórzeń pod stałym napięciem daje świetną pompę i buduje siłę wyprostu.",
    "setup": "Ustaw bloczek na wysokości głowy. Stań na szerokość bioder, lekko pochyl się do przodu, łokcie trzymaj blisko żeber.",
    "execution": "Pchaj drążek/linę prosto w dół do pełnego wyprostu w łokciach. Zatrzymaj napięcie na sekundę, a następnie pozwól ciężarowi wrócić nieco powyżej kąta 90° w łokciu.",
    "tips": "Przez całą serię trzymaj łokcie nieruchomo przy bokach. Rozszerzaj linę na dole, aby mocniej zaangażować głowę boczną.",
    "mistakes": "Zbyt mocne pochylanie się i dociskanie barkami zamienia izolację w wyciskanie. Pozwalanie łokciom na uciekanie do przodu przy powrocie zabija napięcie."
  },
  "skull-crusher": {
    "muscles": ["Triceps"],
    "equipment": "Gryf łamany lub hantle, ławka",
    "difficulty": "Średniozaawansowany",
    "type": "Izolacja",
    "description": "Klasyczne wyciskanie francuskie leżąc, które mocno obciąża głowę długą z pozycji rozciągnięcia. Świetnie buduje masę przy zachowaniu ścisłej techniki.",
    "setup": "Połóż się płasko, trzymając gryf łamany wąskim chwytem. Wypchnij go w górę i odchyl ramiona lekko w stronę głowy — nie pionowo do sufitu.",
    "execution": "Uginaj tylko łokcie, opuszczając gryf tuż nad czoło lub za głowę. Wróć do pozycji wyjściowej, spinając tricepsy do pełnego wyprostu.",
    "tips": "Odchylenie ramion lekko w tył utrzymuje napięcie na tricepsie nawet w pełnym wyproście. Używaj gryfu łamanego, aby oszczędzić nadgarstki.",
    "mistakes": "Rozstawianie łokci na boki zmniejsza pracę tricepsów. Ustawienie ramion pionowo do podłogi przenosi ciężar na stawy w górnej fazie ruchu."
  },
  "bench-dip": {
    "muscles": ["Triceps"],
    "equipment": "Ławka",
    "difficulty": "Początkujący",
    "type": "Izolacja z masą ciała",
    "description": "Ćwiczenie na triceps bez specjalistycznego sprzętu — idealne na dobicie mięśni po ciężkich wyciskaniach.",
    "setup": "Usiądź na ławce, połóż dłonie obok bioder, chwytając krawędź. Wysuń stopy do przodu i zsuń biodra z ławki.",
    "execution": "Opuszczaj się, uginając tylko łokcie, aż ramiona będą równoległe do podłogi. Wybij się mocno w górę, używając siły dłoni.",
    "tips": "Trzymaj plecy blisko ławki, aby obciążenie spoczywało na tricepsach, a nie na barkach. Dla utrudnienia połóż talerz na udach.",
    "mistakes": "Zbyt głębokie schodzenie powoduje kłucie w barkach. Odsunięcie bioder zbyt daleko od ławki nadmiernie obciąża przedni akton barku."
  },
  "barbell-curl": {
    "muscles": ["Biceps", "Przedramiona"],
    "equipment": "Sztanga",
    "difficulty": "Początkujący",
    "type": "Izolacja",
    "description": "Najcięższy wariant uginania ramion. Angażuje oba ramiona symetrycznie, co pozwala na użycie większych ciężarów i budowanie ogólnej masy bicepsów.",
    "setup": "Stań ze stopami na szerokość bioder, chwyć sztangę podchwytem na szerokość barków. Łokcie trzymaj blisko żeber.",
    "execution": "Uginaj ramiona, prowadząc sztangę po łuku, bez bujania tułowiem. Mocno spnij bicepsy na górze, a następnie opuszczaj pod kontrolą do niemal pełnego wyprostu.",
    "tips": "Trzymaj łokcie nieruchomo. Skup się na powolnym opuszczaniu — faza ekscentryczna najbardziej stymuluje bicepsy.",
    "mistakes": "Bujanie biodrami zamienia uginanie w zarzut siłowy. Wysuwanie łokci do przodu angażuje przedni akton barku i zabiera napięcie z bicepsów."
  },
  "incline-dumbbell-curl": {
    "muscles": ["Biceps (głowa długa)"],
    "equipment": "Hantle, ławka skośna",
    "difficulty": "Początkujący",
    "type": "Izolacja",
    "description": "Ustawia bicepsy w pozycji głębokiego rozciągnięcia za ciałem — najszybszy sposób na rozbudowę głowy długiej i wydłużenie szczytu bicepsa.",
    "setup": "Ustaw ławkę pod kątem 60°. Usiądź, pozwalając hantlom zwisać swobodnie pionowo w dół, dłonie skierowane do przodu, łopatki ściągnięte.",
    "execution": "Uginaj hantle w górę, nie pozwalając łokciom na ruch do przodu. Spnij na górze, a następnie powoli opuszczaj do pełnego wyprostu i rozciągnięcia.",
    "tips": "Skup się na rozciągnięciu na dole — zatrzymanie tam ruchu na sekundę daje najlepsze efekty. Trzymaj mały palec wyżej niż kciuk na górze (supinacja).",
    "mistakes": "Unoszenie barków (szrugsy) niweluje rozciągnięcie. Robienie półpowtórzeń na dole omija sens tego ćwiczenia."
  },
  "hammer-curl": {
    "muscles": ["Mięsień ramienny", "Przedramiona", "Biceps"],
    "equipment": "Hantle",
    "difficulty": "Początkujący",
    "type": "Izolacja",
    "description": "Najlepsze ćwiczenie na mięsień ramienny — ten, który znajduje się pod bicepsem i wypycha go do góry, zwiększając objętość ramienia.",
    "setup": "Stań prosto, hantle po bokach, chwyt neutralny (palce skierowane do ud).",
    "execution": "Uginaj oba hantle jednocześnie, trzymając nadgarstki w pozycji neutralnej (jak przy trzymaniu młotka). Spnij na górze i powoli opuść.",
    "tips": "Rób powtórzenia naprzemiennie, jeśli chcesz lepiej skupić się na każdej stronie. Lina wyciągu dolnego świetnie imituje ten ruch ze stałym napięciem.",
    "mistakes": "Obracanie nadgarstków w trakcie ruchu zamienia młotki w zwykłe uginanie. Bujanie tułowiem psuje izolację."
  },
  "preacher-curl": {
    "muscles": ["Biceps (głowa krótka)"],
    "equipment": "Modlitewnik, gryf łamany",
    "difficulty": "Początkujący",
    "type": "Izolacja",
    "description": "Oparcie o modlitewnik eliminuje oszukiwanie i zmusza bicepsy do wykonania 100% pracy — to jeden z najbardziej rygorystycznych wariantów uginania.",
    "setup": "Usiądź na modlitewniku, oprzyj pachy o górną krawędź oparcia, łokcie rozstaw na szerokość barków.",
    "execution": "Uginaj sztangę do wysokości barków, mocno spinając bicepsy na górze. Opuszczaj pod pełną kontrolą do momentu, gdy ramiona będą prawie proste — nigdy nie blokuj ich całkowicie.",
    "tips": "Zatrzymaj ruch stopień przed pełnym wyprostem, aby chronić ścięgna w łokciach. Używaj gryfu łamanego dla komfortu nadgarstków.",
    "mistakes": "Odbijanie ciężaru na dole obciąża ścięgna bicepsa. Odrywanie się od siedziska lub poduszki całkowicie mija się z celem."
  },
  "cable-curl": {
    "muscles": ["Biceps"],
    "equipment": "Wyciąg, prosty drążek",
    "difficulty": "Początkujący",
    "type": "Izolacja",
    "description": "Stałe napięcie od samego dołu do góry sprawia, że wyciągi są idealne do pracy z dużą liczbą powtórzeń na koniec treningu ramion.",
    "setup": "Ustaw bloczek w najniższej pozycji, zamontuj prosty lub łamany drążek. Stań krok od wyciągu, łokcie przyklejone do boków.",
    "execution": "Uginaj drążek w górę, spnij bicepsy, a następnie stawiaj opór lince w drodze powrotnej — czuj napięcie przez cały czas.",
    "tips": "Stań nieco dalej, aby linka ciągnęła w przód i w dół nawet na samej górze ruchu, gdzie hantle tracą napięcie.",
    "mistakes": "Stanie zbyt blisko powoduje zanik napięcia w górnej fazie. Bujanie tułowiem zmienia ćwiczenie w ruch ogólnorozwojowy."
  },
  "deadlift": {
    "muscles": ["Mięśnie dwugłowe ud", "Pośladki", "Plecy", "Kaptury", "Przedramiona"],
    "equipment": "Sztanga, obciążenie",
    "difficulty": "Zaawansowany",
    "type": "Hip hinge",
    "description": "Najlepsze ćwiczenie budujące ogólną siłę. Angażuje całą tylną taśmę — od łydek po kaptury — w jednym potężnym ruchu.",
    "setup": "Stań ze stopami na szerokość bioder, sztanga nad środkiem stopy. Zrób skłon (hinge), chwyć gryf na zewnątrz goleni. Golenie pionowo, klatka wypchnięta, łopatki ściągnięte w dół.",
    "execution": "Odepchnij się nogami od podłogi, prowadząc sztangę blisko goleni. Po przejściu linii kolan wypchnij biodra do przodu do pełnego wyprostu. Wróć tym samym torem.",
    "tips": "Weź głęboki wdech i napnij brzuch przed każdym powtórzeniem. Resetuj chwyt i pozycję między powtórzeniami przy dużych ciężarach — unikaj odbijania od ziemi.",
    "mistakes": "Szarpanie sztangi z ziemi obciąża odcinek lędźwiowy. Lekkie zaokrąglenie góry pleców jest dopuszczalne przy rekordach, ale „koci grzbiet” na dole to prosta droga do kontuzji."
  },
  "pull-up": {
    "muscles": ["Najszerszy grzbietu", "Biceps", "Środek pleców"],
    "equipment": "Drążek do podciągania",
    "difficulty": "Średniozaawansowany",
    "type": "Przyciąganie pionowe",
    "description": "Król ćwiczeń na szerokość pleców. Żaden inny ruch nie rozciąga i nie spina najszerszego grzbietu w tak pełnym zakresie.",
    "setup": "Chwyć drążek nieco szerzej niż szerokość barków, nachwytem. Zwiśnij swobodnie, ale zachowaj aktywne łopatki (ściągnij je w dół, z dala od uszu).",
    "execution": "Podciągaj klatkę w stronę drążka, prowadząc łokcie w dół i do tyłu. Zatrzymaj na górze (broda nad drążkiem), a następnie powoli opuszczaj się do pełnego zwisu.",
    "tips": "Myśl o przyciąganiu łokci do bioder, a nie tylko brody do drążka. Gdy zrobisz 10 czystych powtórzeń, dodaj obciążenie na pasie.",
    "mistakes": "Kipping i bujanie nogami to gimnastyka, a nie budowanie pleców. Brak pełnego wyprostu na dole ogranicza pracę najszerszego grzbietu."
  },
  "barbell-row": {
    "muscles": ["Środek pleców", "Najszerszy grzbietu", "Tylny akton barku", "Biceps"],
    "equipment": "Sztanga",
    "difficulty": "Średniozaawansowany",
    "type": "Przyciąganie poziome",
    "description": "Najcięższe ćwiczenie na grubość pleców. Wiosłowanie dużym ciężarem to najszybsza droga do wypełnienia środkowej części pleców.",
    "setup": "Pochyl tułów pod kątem ok. 45°, kolana lekko ugięte, sztanga zwisa na wyprostowanych ramionach. Chwyt nieco szerszy niż barki, klatka do przodu, łopatki spięte.",
    "execution": "Przyciągaj sztangę do dolnej części żeber, prowadząc łokcie wysoko za siebie. Ściśnij łopatki na górze, a następnie powoli opuść, nie zmieniając kąta nachylenia tułowia.",
    "tips": "Utrzymuj stabilny kąt nachylenia przez całą serię. Lekki podchwyt pozwala na użycie większego ciężaru i mocniej angażuje najszerszy grzbietu.",
    "mistakes": "Prostowanie się w trakcie przyciągania zamienia wiosłowanie w szrugsy. Przyciąganie do klatki zamiast do brzucha angażuje bardziej kaptury niż najszerszy."
  },
  "lat-pulldown": {
    "muscles": ["Najszerszy grzbietu", "Biceps", "Środek pleców"],
    "equipment": "Wyciąg, drążek wyciągu górnego",
    "difficulty": "Początkujący",
    "type": "Przyciąganie pionowe",
    "description": "Najlepsza alternatywa dla podciągania — pozwala na precyzyjne dobranie ciężaru i skupienie się na pracy najszerszego grzbietu.",
    "setup": "Usiądź, blokując uda pod wałkami. Chwyć drążek nieco szerzej niż barki nachwytem, ramiona w pełni wyciągnięte nad głową.",
    "execution": "Przyciągaj drążek do górnej części klatki, prowadząc łokcie w dół i do tyłu. Mocno spnij plecy, a następnie pozwól drążkowi wrócić do pełnego rozciągnięcia.",
    "tips": "Odchyl się tylko minimalnie (5–10°). Każde powtórzenie zaczynaj od ściągnięcia łopatek w dół, zanim ugniesz łokcie.",
    "mistakes": "Ściąganie drążka za kark ustawia barki w niebezpiecznej pozycji. Zbyt mocne odchylanie się do tyłu zamienia ruch w wiosłowanie."
  },
  "seated-cable-row": {
    "muscles": ["Środek pleców", "Najszerszy grzbietu", "Tylny akton barku"],
    "equipment": "Wyciąg, uchwyt V",
    "difficulty": "Początkujący",
    "type": "Przyciąganie poziome",
    "description": "Angażuje grubość środkowej części pleców przy zachowaniu płynnego ruchu i mniejszym obciążeniu lędźwi niż przy sztandze.",
    "setup": "Usiądź prosto, stopy na podestach, kolana lekko ugięte. Chwyć uchwyt V, ramiona wyprostowane, klatka wypchnięta.",
    "execution": "Przyciągaj uchwyt do brzucha, prowadząc łokcie blisko tułowia i spinając łopatki. Wróć do pełnego wyprostu ramion, czując rozciągnięcie najszerszego grzbietu.",
    "tips": "Trzymaj tułów niemal pionowo — nie „wiosłuj” całym ciałem. Zatrzymaj ruch na sekundę przy brzuchu dla pełnego spięcia.",
    "mistakes": "Bujanie się przód-tył wykorzystuje pęd, a nie siłę mięśni. Garbienie się w fazie rozciągnięcia przenosi obciążenie na dół pleców."
  },
  "overhead-press": {
    "muscles": ["Przedni akton barku", "Boczny akton barku", "Triceps", "Górna część klatki"],
    "equipment": "Sztanga",
    "difficulty": "Średniozaawansowany",
    "type": "Wyciskanie pionowe",
    "description": "Prawdziwy test siły górnej partii ciała — wyciskanie ciężaru nad głowę przy pełnej stabilizacji sylwetki. Buduje potężne barki i kaptury.",
    "setup": "Stań na szerokość bioder, sztanga oparta na przednim aktonie barku, łokcie lekko przed sztangą, przedramiona pionowo. Napnij mocno brzuch i pośladki.",
    "execution": "Wyciskaj sztangę prosto w górę, odchylając głowę w tył, by zrobić miejsce dla gryfu. Gdy sztanga minie czoło, wróć głową do pozycji naturalnej i zablokuj ciężar nad środkiem stopy.",
    "tips": "Napinaj pośladki, aby uniknąć nadmiernego wygięcia w lędźwiach. Weź świeży oddech i napnij brzuch przed każdym powtórzeniem.",
    "mistakes": "Wyciskanie przed twarzą zamiast pionowo marnuje siłę. Zbyt mocne odchylanie się do tyłu zamienia ruch w wyciskanie skos ujemny, co niszczy plecy."
  },
  "dumbbell-lateral-raise": {
    "muscles": ["Boczny akton barku"],
    "equipment": "Hantle",
    "difficulty": "Początkujący",
    "type": "Izolacja",
    "description": "Najlepsze ćwiczenie na szerokość barków. Rozbudowa bocznego aktonu sprawi, że Twoja sylwetka zmieni się nie do poznania.",
    "setup": "Stań prosto, lekko pochylony do przodu, hantle po bokach. Zachowaj lekkie ugięcie w łokciach, które pozostaje niezmienne przez całą serię.",
    "execution": "Unoś hantle na boki szerokim łukiem, aż znajdą się na wysokości barków. Prowadź ruch łokciami, nie dłońmi, a następnie powoli opuszczaj.",
    "tips": "Myśl o wylewaniu wody z dzbanka na samej górze — mały palec nieco wyżej niż kciuk — aby lepiej trafić w boczny akton. Użyj mniejszego ciężaru niż podpowiada Ci ego.",
    "mistakes": "Bujanie tułowiem i pomaganie sobie kapturami sprawia, że rosną tylko one. Unoszenie dłoni powyżej linii barków przenosi pracę na kaptury."
  },
  "rear-delt-fly": {
    "muscles": ["Tylny akton barku", "Górna część pleców"],
    "equipment": "Hantle lub maszyna Reverse Pec-Deck",
    "difficulty": "Początkujący",
    "type": "Izolacja",
    "description": "Uderza w tylny akton barku, najczęściej zaniedbywaną część ramienia. Kluczowe dla uzyskania efektu „3D” barków i zdrowej postawy.",
    "setup": "Pochyl się do przodu, aż tułów będzie niemal równoległy do podłogi. Hantle zwisają pionowo w dół, dłonie skierowane do siebie, lekkie ugięcie w łokciach.",
    "execution": "Unoś hantle na boki szerokim łukiem do poziomu barków. Mocno spnij tylną część barku, a następnie opuszczaj pod kontrolą.",
    "tips": "Prowadź ruch łokciami i trzymaj kciuki skierowane lekko w dół, aby wyizolować barki od kapturów. Trenuj z małym ciężarem — technika jest tu wszystkim.",
    "mistakes": "Uginanie i prostowanie łokci zamienia ruch w wiosłowanie. Szruksy przy unoszeniu angażują kaptury i pomijają tylny akton."
  },
  "face-pull": {
    "muscles": ["Tylny akton barku", "Rotatory zewnętrzne", "Kaptury"],
    "equipment": "Wyciąg, lina",
    "difficulty": "Początkujący",
    "type": "Ruch prewencyjny (pull)",
    "description": "Najlepsze ćwiczenie dla zdrowia barków. Wzmacnia tylny akton i stożek rotatorów — niezbędne dla osób często wyciskających na ławce.",
    "setup": "Ustaw bloczek na wysokości górnej części klatki. Chwyć linę nachwytem (kciuki na końcach), zrób krok w tył i lekko się odchyl.",
    "execution": "Przyciągaj linę w stronę twarzy, rozsuwając łokcie szeroko na boki i obracając dłonie tak, by kostki znalazły się obok uszu. Spnij mocno i powoli wróć.",
    "tips": "Najlepsze efekty daje duża liczba powtórzeń (15–25) z wyraźnym spięciem. Myśl o pozycji „pokaż biceps” w końcowej fazie.",
    "mistakes": "Przyciąganie do klatki zamienia ruch w wiosłowanie. Brak rotacji zewnętrznej dłoni sprawia, że stożek rotatorów nie pracuje."
  },
  "arnold-press": {
    "muscles": ["Przedni akton barku", "Boczny akton barku", "Triceps"],
    "equipment": "Hantle, ławka",
    "difficulty": "Średniozaawansowany",
    "type": "Wyciskanie pionowe",
    "description": "Wyciskanie hantli z rotacją spopularyzowane przez Arnolda. Skręt angażuje przedni i boczny akton barku w większym zakresie ruchu niż klasyczne wyciskanie.",
    "setup": "Usiądź na ławce z oparciem. Zacznij z hantlami przed barkami, dłonie skierowane w stronę twarzy, łokcie blisko tułowia.",
    "execution": "Wyciskaj hantle nad głowę, jednocześnie obracając dłonie tak, aby na górze były skierowane do przodu. Wróć płynnie tym samym torem do pozycji wyjściowej.",
    "tips": "Wykonuj rotację powoli i świadomie. Używaj umiarkowanych ciężarów — bicie rekordów często niszczy technikę obrotu.",
    "mistakes": "Zbyt szybka rotacja skraca zakres ruchu. Gwałtowne blokowanie łokci na górze niepotrzebnie obciąża stawy."
  },
  "back-squat": {
    "muscles": ["Mięśnie czworogłowe ud", "Pośladki", "Mięśnie dwugłowe ud", "Core"],
    "equipment": "Sztanga, stojak do przysiadów",
    "difficulty": "Zaawansowany",
    "type": "Przysiad",
    "description": "Król ćwiczeń na dół ciała. Nic tak nie obciąża nóg, bioder i korpusu jak ciężki przysiad ze sztangą na plecach.",
    "setup": "Sztanga na mięśniach czworobocznych (nie na karku), wąski chwyt dla stabilizacji pleców. Zrób krok w tył, stopy na szerokość barków, palce lekko na zewnątrz (~15°).",
    "execution": "Siadaj biodrami w dół i lekko w tył, trzymając klatkę wypchniętą, a kolana prowadząc nad stopami. Schodź do momentu, gdy biodra znajdą się poniżej kolan, po czym wstań, napierając całą stopą o podłoże.",
    "tips": "Weź potężny wdech, napnij brzuch i dopiero zacznij schodzić. Rozpychaj kolana na zewnątrz w trakcie ruchu, by utrzymać je w linii ze stopami.",
    "mistakes": "Zapadanie się kolan do środka obciąża więzadła zamiast mięśni. Podwijanie miednicy (butt wink) na samym dole jest częstą przyczyną urazów lędźwi."
  },
  "romanian-deadlift": {
    "muscles": ["Mięśnie dwugłowe ud", "Pośladki", "Odcinek lędźwiowy"],
    "equipment": "Sztanga",
    "difficulty": "Średniozaawansowany",
    "type": "Hip hinge",
    "description": "Czysty ruch zawiasowy biodra, który buduje tył ud na całej długości. Prawdopodobnie najlepsze ćwiczenie na hipertrofię mięśni dwugłowych.",
    "setup": "Stań prosto, trzymając sztangę na wysokości bioder. Stopy na szerokość bioder, kolana lekko odblokowane (zostają w tej pozycji przez cały ruch).",
    "execution": "Wypychaj biodra prosto w tył, prowadząc sztangę blisko ud. Opuszczaj do momentu poczucia mocnego rozciągnięcia (zazwyczaj do połowy piszczeli), a następnie wypchnij biodra do przodu, by wstać.",
    "tips": "Zakres ruchu zależy od Twojej mobilności, nie od odległości do ziemi. Sztanga musi mieć kontakt z nogami przez cały czas.",
    "mistakes": "Uginanie kolan zamienia ruch w przysiad. Zaokrąglanie pleców przy maksymalnym rozciągnięciu to najczęstszy błąd prowadzący do kontuzji."
  },
  "leg-press": {
    "muscles": ["Mięśnie czworogłowe ud", "Pośladki", "Mięśnie dwugłowe ud"],
    "equipment": "Suwnica (leg press)",
    "difficulty": "Początkujący",
    "type": "Przysiad na maszynie",
    "description": "Pozwala na potężne dociążenie czworogłowych bez konieczności utrzymywania równowagi — idealne do budowania objętości po przysiadach.",
    "setup": "Usiądź głęboko, dociśnij lędźwia do oparcia. Postaw stopy na szerokość barków na środku platformy.",
    "execution": "Zwolnij blokady, opuszczaj platformę uginając kolana, aż uda znajdą się blisko klatki. Wypchnij ciężar z powrotem, unikając pełnego wyprostu (blokady) w kolanach.",
    "tips": "Ustawienie stóp ma znaczenie: niżej = więcej czworogłowych, wyżej = więcej pośladków i dwugłowych. Nigdy nie odrywaj bioder od siedziska.",
    "mistakes": "Pełna blokada kolan na górze grozi kontuzją. Odrywanie dołu pleców (butt wink) przy schodzeniu zbyt głęboko obciąża kręgosłup."
  },
  "bulgarian-split-squat": {
    "muscles": ["Mięśnie czworogłowe ud", "Pośladki", "Przywodziciele", "Core"],
    "equipment": "Hantle, ławka",
    "difficulty": "Średniozaawansowany",
    "type": "Przysiad jednostronny",
    "description": "Najtrudniejsze ćwiczenie na jedną nogę. Niweluje dysproporcje siłowe, buduje potężne nogi i pośladki oraz angażuje stabilizację.",
    "setup": "Stań w wykroku przed ławką, oprzyj wierzch tylnej stopy o ławkę. Przednia stopa płasko, tułów wyprostowany, hantle w dłoniach.",
    "execution": "Obniżaj tylne kolano w stronę podłogi, uginając przednią nogę, aż tylne kolano niemal dotknie ziemi. Dynamicznie wstań, odpychając się piętą przedniej nogi.",
    "tips": "Pionowy tułów = większy nacisk na czworogłowy. Lekkie pochylenie do przodu = większa praca pośladka. Długość wykroku ma znaczenie — eksperymentuj.",
    "mistakes": "Zbyt krótki wykrok powoduje nadmierne wysunięcie kolana i ból w stawie. Przenoszenie ciężaru na nogę z tyłu zamiast używania jej tylko dla równowagi."
  },
  "standing-calf-raise": {
    "muscles": ["Mięsień brzuchaty łydki"],
    "equipment": "Maszyna do wspięć lub maszyna Smitha",
    "difficulty": "Początkujący",
    "type": "Izolacja",
    "description": "Jedyny sposób na rozbudowę mięśnia brzuchatego łydki — tego, który nadaje jej diamentowy kształt. Wyprostowane nogi są tu kluczowe.",
    "setup": "Stań na krawędzi podestu przednią częścią stóp, pięty wiszą swobodnie. Nogi całkowicie proste, biodra i barki w jednej linii.",
    "execution": "Opuść pięty poniżej poziomu podestu do pełnego rozciągnięcia, a następnie wypchnij się jak najwyżej na palce. Zatrzymaj na moment na górze.",
    "tips": "Zatrzymaj ruch na 1 sekundę na samym dole i na samej górze. Wysoka liczba powtórzeń (15–30) z idealną techniką działa lepiej niż duży ciężar.",
    "mistakes": "Odbijanie się na dole (wykorzystywanie ścięgna Achillesa) hamuje wzrost. Uginanie kolan zmienia ćwiczenie w wariant siedzący, który omija mięsień brzuchaty."
  }
}

with open('/tmp/ex_pl.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("DONE")
