# wodaifitness.pl

Strona Woda & Fitness Jakub Nachyła: lekcje pływania na basenie Goczuś w Goczałkowicach-Zdroju.

- `main` – to, co jest teraz pod wodaifitness.pl (pełna strona). Zmiany: osobna gałąź → pull request → scalenie po akceptacji.
- `index.html` – strona główna, `polityka-prywatnosci.html` – polityka prywatności.
- Podstrony usług pod wyszukiwanie w Google: `nauka-plywania-dla-dzieci.html`, `nauka-plywania-dla-doroslych.html` (Kuba Strządała), `technika-plywania-dla-doroslych.html`, `kraul-dla-triathlonistow.html` (Jakub Nachyła), `testy-sprawnosciowe.html`. Nowa podstrona = też wpis w `sitemap.xml`.
- `fonts/` – czcionki Archivo i Instrument Sans (licencja SIL OFL, pliki LICENSE obok).
- `og.jpg`, `og-testy.jpg` – obrazki podglądu linku (Facebook, WhatsApp, Messenger).
- `regulamin.js` – okno akceptacji Regulaminu przed kalendarzem rezerwacji. `pomiar.js` – pomiar GoatCounter bez cookies.
- `img/*.webp` – lżejsze kopie zdjęć JPG (przeglądarka wybiera sama przez `<picture>`). Nowe zdjęcie JPG = dorzuć też WebP albo zostaw samo JPG.
- Dane strukturalne (JSON-LD) są w `<head>` każdej strony, w tym FAQPage. Zmieniasz pytanie lub odpowiedź w FAQ = zmień ten sam tekst w bloku FAQPage.
- `CNAME` – domena wodaifitness.pl dla GitHub Pages. Nie usuwać.

Publikacja: GitHub Pages z gałęzi `main`, folder główny. Każda zmiana w `main` jest online po ok. minucie.
