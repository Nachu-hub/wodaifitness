# CLAUDE.md – wodaifitness.pl

Statyczna strona (HTML, CSS, JS bez budowania) na GitHub Pages. Push na `main` = strona od razu na żywo.

## Praca bez nadzoru

Zasady od Nachu. Stosuj w każdej sesji.

- Pracujesz sam, nie ma mnie przy komputerze. Nie zadawaj pytań w trakcie, decyzje dla mnie zbierz w raporcie.
- Osobna gałąź. Nic nie trafia na żywo bez mojego „OK”.
- Nie zmieniaj cen, zasad odwoływania ani regulaminu.
- Nie ruszaj prawdziwych danych kursantów, wpłat i kalendarzy. Do testów używaj danych zmyślonych.
- Nie wymyślaj faktów: opinii, liczb, wyników, norm. Brak treści oznacz [DO UZUPEŁNIENIA] i wypisz w raporcie.
- Do nikogo niczego nie wysyłaj.
- Wątpliwość: wybierz rozsądny wariant, zapisz założenie, idź dalej. Zatrzymaj się tylko przy czymś nie do cofnięcia.
- Kończ raportem: co zrobione · jak to sprawdzić w 2 minuty · decyzje dla mnie.

## Pułapki w tym repo

- FAQ na stronie jest powielone w bloku JSON-LD `FAQPage` w `<head>`. Zmiana pytania lub odpowiedzi = ta sama zmiana w obu miejscach.
- Zdjęcia: obok JPG leżą kopie WebP w `<picture>` (`picture{display:contents}`). Podmieniasz zdjęcie = podmień oba pliki.
- Animacja wody (WebGL) startuje po `load`; na grafice programowej zostaje jedna klatka. Lighthouse w chmurze to grafika programowa, więc nie pokaże animacji.
- Nie psuj: `pomiar.js` (zdarzenia GoatCounter), `regulamin.js` (okno przed kalendarzem), przycisk „Kto będzie pływał?”.
