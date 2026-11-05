/* Akceptacja Regulaminu przed przejściem do kalendarza rezerwacji.
   Jeden plik na wszystkie podstrony. Wymaga dwóch zaznaczeń, zapamiętuje
   zgodę w tej przeglądarce (localStorage, bez cookies). */
(function(){
  "use strict";
  var KEY="wf_regulamin_2026-11", INSTR={oh15gMd5uZZ4uTGr5:"Jakub Nachyła",XdePtHMeZuQZpZiy5:"Kuba Strządała"};
  var pending=null, modal=null;

  function ok(){ try{ return !!localStorage.getItem(KEY) || !!sessionStorage.getItem(KEY); }catch(e){ return false; } }
  function remember(){ var v=new Date().toISOString(); try{ localStorage.setItem(KEY,v); }catch(e){} try{ sessionStorage.setItem(KEY,v); }catch(e){} }
  function who(href){ for(var k in INSTR){ if(href.indexOf(k)>-1) return INSTR[k]; } return null; }

  function css(){
    if(document.getElementById("wf-gate-css")) return;
    var s=document.createElement("style"); s.id="wf-gate-css";
    s.textContent=
      ".wf-gate{position:fixed;inset:0;z-index:9999;background:rgba(8,22,46,.72);display:flex;align-items:center;justify-content:center;padding:16px}"+
      ".wf-gate[hidden]{display:none}"+
      ".wf-box{background:#fff;color:#0B1A33;max-width:560px;width:100%;max-height:92vh;overflow:auto;border-radius:16px;padding:24px 22px;box-shadow:0 20px 60px rgba(0,0,0,.35);font-family:\"Instrument Sans\",system-ui,-apple-system,\"Segoe UI\",Roboto,sans-serif;font-size:1rem;line-height:1.5}"+
      ".wf-box h2,.wf-inline h2{font-family:\"Archivo\",\"Arial Narrow\",Arial,sans-serif;font-stretch:68%;font-weight:800;text-transform:uppercase;font-size:1.7rem;line-height:1;margin:0 0 6px}"+
      ".wf-box .wf-who,.wf-inline .wf-who{color:#56657C;margin:0 0 14px}"+
      ".wf-box ul,.wf-inline ul{margin:0 0 14px;padding-left:1.15em}.wf-box li,.wf-inline li{margin:3px 0}"+
      ".wf-box label,.wf-inline label{display:flex;gap:10px;align-items:flex-start;margin:10px 0;cursor:pointer;font-weight:400}.wf-box input,.wf-inline input{width:20px;height:20px;flex:none;margin-top:2px;accent-color:#1CB2F5}"+
      ".wf-box a,.wf-inline a{color:#1B56D6;text-underline-offset:3px}"+
      ".wf-act{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}"+
      ".wf-act button{font:inherit;font-weight:700;border:0;border-radius:999px;padding:12px 20px;cursor:pointer}"+
      ".wf-go{background:#08162E;color:#F2F5F9}.wf-go[disabled]{opacity:.45;cursor:not-allowed}.wf-no{background:#E1E6ED;color:#0B1A33}"+
      ".wf-inline{border:1px solid #E1E6ED;border-radius:14px;padding:18px;margin:8px 0 16px;color:#0B1A33;background:#fff}";
    document.head.appendChild(s);
  }

  function form(instr){
    return '<h2>Zanim zarezerwujesz</h2>'+
      '<p class="wf-who">'+(instr?'Stroną umowy będzie '+instr+'. ':'')+'Rezerwacja w kalendarzu oznacza zawarcie umowy na lekcję.</p>'+
      '<ul>'+
      '<li>Lekcja 45 min 120 zł, 60 min 140 zł. Pakiet 5 lekcji: 550 zł (45 min) lub 650 zł (60 min), ważny 10 tygodni, potem voucher na 90 dni.</li>'+
      '<li>Odwołanie do 24 h przed lekcją jest bezpłatne. Później lekcja jest płatna. Nagła choroba lub wypadek zgłoszone przed lekcją: bez opłaty.</li>'+
      '<li>Płatność przelewem, BLIK-iem albo gotówką na miejscu, przed lekcją. Bilet na basen kupujesz osobno.</li>'+
      '<li>Z pakietu możesz zrezygnować w każdej chwili ze zwrotem za niewykorzystane lekcje. Przy zakupie na odległość masz też 14 dni na odstąpienie od umowy (nie dotyczy lekcji z ustalonym terminem).</li>'+
      '</ul>'+
      '<label><input type="checkbox" class="wf-c1"><span>Przeczytałem/-am <a href="regulamin.html" target="_blank" rel="noopener">Regulamin</a> i <a href="polityka-prywatnosci.html" target="_blank" rel="noopener">Politykę prywatności</a> i akceptuję Regulamin.</span></label>'+
      '<label><input type="checkbox" class="wf-c2"><span>Chcę zacząć zajęcia przed upływem 14 dni od rezerwacji. Wiem, że po odbytej lekcji tracę prawo odstąpienia w jej zakresie, a przy odstąpieniu od pakietu w trakcie płacę za odbyte lekcje proporcjonalnie.</span></label>'+
      '<div class="wf-act"><button type="button" class="wf-go" disabled>Przejdź do kalendarza</button><button type="button" class="wf-no">Wróć</button></div>';
  }

  function wire(root,onGo,onNo){
    var c1=root.querySelector(".wf-c1"), c2=root.querySelector(".wf-c2"), go=root.querySelector(".wf-go"), no=root.querySelector(".wf-no");
    function upd(){ go.disabled=!(c1.checked&&c2.checked); }
    c1.addEventListener("change",upd); c2.addEventListener("change",upd);
    go.addEventListener("click",function(){ remember(); onGo(); });
    if(no) no.addEventListener("click",onNo);
    setTimeout(function(){ c1.focus(); },30);
  }

  function open(href){
    css(); pending=href;
    if(!modal){
      modal=document.createElement("div"); modal.className="wf-gate"; modal.setAttribute("role","dialog"); modal.setAttribute("aria-modal","true"); modal.setAttribute("aria-label","Akceptacja Regulaminu");
      document.body.appendChild(modal);
      modal.addEventListener("click",function(e){ if(e.target===modal) close(); });
      document.addEventListener("keydown",function(e){ if(e.key==="Escape"&&!modal.hidden) close(); });
    }
    modal.innerHTML='<div class="wf-box">'+form(who(href))+'</div>';
    modal.hidden=false; document.body.style.overflow="hidden";
    wire(modal,function(){ var h=pending; close(); window.open(h,"_blank","noopener"); },close);
  }
  function close(){ if(modal){ modal.hidden=true; } document.body.style.overflow=""; pending=null; }

  /* Wersja osadzona (np. zamiast iframe'u z kalendarzem na komputerze). */
  function inline(container,instr,onGo){
    css(); container.innerHTML='<div class="wf-inline">'+form(instr)+'</div>';
    var no=container.querySelector(".wf-no"); if(no) no.remove(); container.querySelector(".wf-go").textContent="Pokaż wolne terminy";
    wire(container,onGo,null);
  }

  document.addEventListener("click",function(e){
    var a=e.target.closest&&e.target.closest('a[href*="calendar.app.google"]');
    if(!a||ok()) return;
    e.preventDefault(); e.stopPropagation(); open(a.href);
  },true);

  window.WF_GATE={ok:ok,open:open,inline:inline,who:who};
})();
