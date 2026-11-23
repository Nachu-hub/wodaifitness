/* Kalkulator „Czy zdam test sprawnościowy do PSP?”
   Liczy wszystko w przeglądarce. Niczego nie wysyła i niczego nie zapisuje.

   ŹRÓDŁA (sprawdzone 23.11.2026):
   [T] Tabela punktowa: załącznik nr 5 do rozporządzenia MSWiA z 27.10.2005 r. w sprawie zakresu,
       trybu i częstotliwości przeprowadzania okresowych profilaktycznych badań lekarskich oraz
       okresowej oceny sprawności fizycznej strażaka PSP, tekst jednolity Dz.U. 2023 poz. 1177, s. 13–14.
       https://api.sejm.gov.pl/eli/acts/DU/2023/1177/text.pdf
       Kandydaci: bez punktów preferencyjnych za wiek (§ 10 ust. 1 rozporządzenia [S]).
   [S] Nabór do służby: rozporządzenie MSWiA z 23.09.2021 r. w sprawie postępowania kwalifikacyjnego
       o przyjęcie do służby w PSP (Dz.U. 2021 poz. 1772), § 10, § 11, § 17.
       https://api.sejm.gov.pl/eli/acts/DU/2021/1772/text.html
   [Z] Zmiana od 20.11.2026: rozporządzenie MSWiA z 28.10.2026 r. (Dz.U. 2026 poz. 1459), § 1 pkt 3 i 4
       (progi 45/41, obniżenie do 38; pływanie 50 m do 60 s), § 2 (sprawy wszczęte wcześniej: stare przepisy).
       https://api.sejm.gov.pl/eli/acts/DU/2026/1459/text.pdf
   [K] Szkoły PSP: nabór 2026/2027, „Proces naboru oraz założenia organizacyjne…” (zatw. 28.01.2026),
       opublikowane przez SA PSP w Krakowie: progi 50/46, 3 próby dla wszystkich, pływanie 50 m do 90 s.
       https://www.gov.pl/web/sapsp-krakow/rekrutacja-szkola-policealna-technik-pozarnictwa
       Podstawa: rozporządzenie MSWiA z 11.08.1997 r. (Dz.U. 1997 nr 101 poz. 638 ze zm., m.in. Dz.U. 2024 poz. 1421).
*/
(function(){
  "use strict";
  var NORMY_SPRAWDZONE="23.11.2026";

  /* [T] wiersz: [punkty, podciąganie, rzut 2 kg (m), koperta (s), beep "poziom-odcinki"]; null = pusta komórka */
  var T=[
    [75,26,10.00,22.00,"12-5"],[74,25,9.90,22.05,"12-4"],[73,24,9.80,22.10,"12-3"],[72,23,9.70,22.15,"12-2"],
    [71,22,9.60,22.20,"12-1"],[70,21,9.50,22.25,"11-12"],[69,20,9.40,22.30,"11-11"],[68,19,9.30,22.35,"11-10"],
    [67,18,9.20,22.40,"11-9"],[66,17,9.10,22.45,"11-8"],[65,16,9.00,22.50,"11-7"],[64,null,8.90,22.55,"11-6"],
    [63,15,8.80,22.60,"11-5"],[62,null,8.70,22.65,"11-4"],[61,14,8.60,22.70,"11-3"],[60,null,8.50,22.75,"11-2"],
    [59,null,8.40,22.80,"11-1"],[58,13,8.30,22.85,"10-11"],[57,null,8.20,22.90,"10-10"],[56,null,8.10,22.95,"10-9"],
    [55,12,8.00,23.00,"10-8"],[54,null,null,23.05,"10-7"],[53,null,7.90,23.10,"10-6"],[52,null,null,23.15,"10-5"],
    [51,null,7.80,23.20,"10-4"],[50,11,null,23.25,"10-3"],[49,null,7.70,23.30,"10-2"],[48,null,null,23.35,"10-1"],
    [47,null,7.60,23.40,"9-11"],[46,null,null,23.45,"9-10"],[45,10,7.50,23.50,"9-9"],[44,null,null,23.60,"9-8"],
    [43,null,7.40,23.70,"9-7"],[42,null,null,23.80,"9-6"],[41,null,7.30,23.90,"9-5"],[40,9,null,24.00,"9-4"],
    [39,null,7.20,24.10,"9-3"],[38,null,null,24.20,"9-2"],[37,null,7.10,24.30,"9-1"],[36,null,null,24.40,"8-11"],
    [35,8,7.00,24.50,"8-10"],[34,null,null,24.60,"8-9"],[33,null,6.90,24.70,"8-8"],[32,null,null,24.80,"8-7"],
    [31,null,6.80,24.90,"8-6"],[30,7,null,25.00,"8-5"],[29,null,6.70,25.10,"8-4"],[28,null,null,25.20,"8-3"],
    [27,null,6.60,25.30,"8-2"],[26,null,null,25.40,"8-1"],[25,6,6.50,25.50,"7-10"],[24,null,null,25.60,"7-9"],
    [23,null,6.40,25.70,"7-8"],[22,null,null,25.80,"7-7"],[21,null,6.30,25.90,"7-6"],[20,5,null,26.00,"7-5"],
    [19,null,6.20,26.10,"7-4"],[18,null,null,26.20,"7-3"],[17,null,6.10,26.30,"7-2"],[16,null,null,26.40,"7-1"],
    [15,4,6.00,26.50,"6-10"],[14,null,null,26.60,"6-9"],[13,null,5.90,26.70,"6-8"],[12,null,null,26.80,"6-7"],
    [11,null,5.80,26.90,"6-6"],[10,3,null,27.00,"6-5"],[9,null,5.70,27.10,"6-4"],[8,null,null,27.20,"6-3"],
    [7,null,5.60,27.30,"6-2"],[6,null,5.50,27.40,"6-1"],[5,2,5.40,27.50,"5-9"],[4,null,5.30,27.60,"5-8"],
    [3,null,5.20,27.70,"5-7"],[2,null,5.10,27.80,"5-6"],[1,1,5.00,27.90,"5-5"]
  ];

  /* Zasady trybów: progi średniej i limit pływania */
  var MODES={
    sluzba:{nazwa:"Nabór do służby",m:45,k:41,low:38,swim:60,
      zrodlo:"Rozporządzenie MSWiA, Dz.U. 2021 poz. 1772, w brzmieniu od 20.11.2026 (Dz.U. 2026 poz. 1459)"},
    sluzbaStare:{nazwa:"Nabór do służby, postępowanie rozpoczęte przed 20.11.2026",m:50,k:46,low:41,swim:90,
      zrodlo:"Rozporządzenie MSWiA, Dz.U. 2021 poz. 1772, w brzmieniu sprzed 20.11.2026"},
    szkola:{nazwa:"Szkoła PSP (nabór 2026/2027)",m:50,k:46,low:null,swim:90,
      zrodlo:"Zasady naboru do szkół PSP na rok 2026/2027 (SA PSP w Krakowie, gov.pl)"}
  };

  function beepKey(s){ var p=String(s).split("-"); return (+p[0])*100+(+p[1]); }

  /* Punkty za wynik. Zwraca 0, gdy wynik jest poniżej minimum z tabeli (próba niezaliczona). */
  function pts(kind,v){
    for(var i=0;i<T.length;i++){
      var r=T[i];
      if(kind==="pod"&&r[1]!==null&&v>=r[1]) return r[0];
      if(kind==="rzut"&&r[2]!==null&&v>=r[2]-1e-9) return r[0];
      if(kind==="kop"&&v<=r[3]+1e-9) return r[0];
      if(kind==="beep"&&v>=beepKey(r[4])) return r[0];
    }
    return 0;
  }
  /* Najsłabszy wynik, który daje co najmniej p punktów */
  function need(kind,p){
    var best=null;
    for(var i=0;i<T.length;i++){
      var r=T[i]; if(r[0]<p) break;
      var c=kind==="pod"?r[1]:kind==="rzut"?r[2]:kind==="kop"?r[3]:r[4];
      if(c!==null) best=c;
    }
    return best;
  }
  function fmtRes(kind,v){
    if(kind==="pod") return v+" "+(v===1?"powtórzenie":(v%10>=2&&v%10<=4&&(v%100<10||v%100>=20))?"powtórzenia":"powtórzeń");
    if(kind==="rzut") return v.toFixed(2).replace(".",",")+" m";
    if(kind==="kop") return v.toFixed(2).replace(".",",")+" s";
    return "poziom "+String(v).replace("-"," – odcinek ");
  }
  function num(el){ if(!el) return NaN; var s=String(el.value).trim().replace(",","."); return s===""?NaN:+s; }
  function fmt2(x){ return x.toFixed(2).replace(".",","); }

  var form=document.getElementById("psp-calc"); if(!form) return;
  var out=document.getElementById("psp-out");
  document.querySelectorAll("[data-normy-data]").forEach(function(el){ el.textContent=NORMY_SPRAWDZONE; });

  function val(name){ var c=form.querySelector('input[name="'+name+'"]:checked'); return c?c.value:null; }

  function sync(){
    var mode=val("tryb"), plec=val("plec"), st=val("stan");
    var showStan=(mode!=="szkola"&&plec==="k");
    form.querySelector("#psp-stan").hidden=!showStan;
    form.querySelector("#psp-stare").hidden=(mode==="szkola");
    var rzut=showStan&&st==="inne";
    form.querySelector("#f-rzut").hidden=!rzut;
    form.querySelector("#f-pod").hidden=rzut;
    var m=MODES[mode==="szkola"?"szkola":(form.querySelector("#psp-old").checked?"sluzbaStare":"sluzba")];
    form.querySelector("#psp-swim-lim").textContent=m.swim;
  }

  function calc(e){
    if(e) e.preventDefault();
    sync();
    var em=document.getElementById("psp-empty"); if(em) em.hidden=true;
    var mode=val("tryb"), plec=val("plec"), st=val("stan");
    var key=mode==="szkola"?"szkola":(form.querySelector("#psp-old").checked?"sluzbaStare":"sluzba");
    var M=MODES[key], prog=plec==="k"?M.k:M.m;
    var rzut=(mode!=="szkola"&&plec==="k"&&st==="inne");

    var trials=[], miss=[];
    var first=rzut?{kind:"rzut",label:"Rzut piłką lekarską 2 kg",v:num(form.elements.rzut)}
                  :{kind:"pod",label:"Podciąganie na drążku",v:num(form.elements.pod)};
    trials.push(first);
    trials.push({kind:"kop",label:"Bieg po kopercie",v:num(form.elements.kop)});
    var bp=num(form.elements.bpoz), bo=num(form.elements.bodc);
    trials.push({kind:"beep",label:"Beep test",v:(isNaN(bp)||isNaN(bo))?NaN:bp*100+bo,raw:bp+"-"+bo});

    trials.forEach(function(t){ if(isNaN(t.v)||t.v<0) miss.push(t.label); });
    if(trials[0].kind==="pod"&&!isNaN(trials[0].v)) trials[0].v=Math.floor(trials[0].v);
    if(miss.length){ out.hidden=false; out.innerHTML='<p class="pc-warn">Uzupełnij: '+miss.join(", ")+'.</p>'; return; }

    var sum=0, allOk=true, rows="";
    trials.forEach(function(t){
      t.p=pts(t.kind,t.v); sum+=t.p; if(t.p<1) allOk=false;
      var shown=t.kind==="beep"?fmtRes("beep",t.raw):fmtRes(t.kind,t.v);
      var st;
      if(t.p>=1){ st='<span class="pc-ok">'+t.p+' pkt</span>'; }
      else { st='<span class="pc-no">niezaliczona</span><small>Minimum: '+fmtRes(t.kind,need(t.kind,1))+'</small>'; }
      rows+='<li><span class="pc-n">'+t.label+'<small>'+shown+'</small></span><span class="pc-p">'+st+'</span></li>';
    });
    var avg=Math.round(sum/3*100)/100;

    var head, tips="";
    if(allOk&&avg>=prog){
      head='<p class="pc-res ok"><b>Zaliczone</b>Średnia '+fmt2(avg)+' pkt. Próg: '+prog+' pkt.</p>';
    } else if(!allOk){
      head='<p class="pc-res no"><b>Brakuje minimum w próbie</b>Każda próba musi dać co najmniej 1 pkt, inaczej cały test jest niezaliczony.</p>';
    } else {
      var gap=Math.ceil((prog*3-sum)-1e-9); /* średnia ≥ próg ⇔ suma ≥ 3×próg */
      head='<p class="pc-res no"><b>Brakuje '+fmt2(prog-avg)+' pkt średniej</b>Średnia '+fmt2(avg)+' pkt, próg: '+prog+' pkt. Łącznie brakuje '+gap+' pkt.</p>';
      var opts=[];
      trials.forEach(function(t){
        var target=t.p+gap; if(target>75) return;
        var r=need(t.kind,target); if(r===null) return;
        opts.push('<li>'+t.label+': '+fmtRes(t.kind,r)+'</li>');
      });
      if(opts.length) tips='<p class="pc-tip">Wystarczy jedna z tych zmian (reszta bez zmian):</p><ul class="pc-opts">'+opts.join("")+'</ul>';
      else tips='<p class="pc-tip">Jedna próba tego nie nadrobi. Trzeba poprawić co najmniej dwie.</p>';
    }

    var swim="", sw=num(form.elements.swim);
    if(!isNaN(sw)&&sw>0){
      swim=sw<=M.swim
        ?'<li><span class="pc-n">Pływanie 50 m<small>'+fmt2(sw)+' s</small></span><span class="pc-p"><span class="pc-ok">zaliczone</span></span></li>'
        :'<li><span class="pc-n">Pływanie 50 m<small>'+fmt2(sw)+' s</small></span><span class="pc-p"><span class="pc-no">brakuje '+fmt2(sw-M.swim)+' s</span><small>Limit: '+M.swim+' s</small></span></li>';
    }

    var low=(M.low&&allOk&&avg<prog&&avg>=M.low)?'<p class="pc-tip">Gdy test zaliczy mniej osób niż jest miejsc, komisja może obniżyć próg do '+M.low+' pkt. Na to się nie nastawiaj.</p>':"";

    out.hidden=false;
    out.innerHTML=head+'<ul class="pc-rows">'+rows+swim+'</ul>'+tips+low+
      '<a class="btn btn-accent pc-cta" href="#rezerwacja" data-ev="kalkulator-diagnostyka">Umów diagnostykę <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" stroke-width="2"/></svg></a>'+
      '<p class="pc-src">To orientacyjny wynik z tabeli, nie gwarancja. Liczy się wynik zmierzony przez komisję i zasady z Twojego ogłoszenia. Zasady: '+M.zrodlo+'. Normy sprawdzone: '+NORMY_SPRAWDZONE+'.</p>';
  }

  form.addEventListener("change",sync);
  form.addEventListener("submit",calc);
  sync();

  /* do testów automatycznych */
  window.WF_PSP={pts:pts,need:need,T:T,MODES:MODES};
})();
