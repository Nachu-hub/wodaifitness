/* Pomiar bez ciasteczek (GoatCounter).
   Liczy wejścia na strony i kliknięcia, które prowadzą do zapisu.
   Nie zapisuje nic w przeglądarce, nie używa cookies ani identyfikatorów.
   Jeden plik na wszystkie podstrony. */
(function(){
  "use strict";
  var SITE="wodaifitness"; /* nazwa konta: https://SITE.goatcounter.com */
  var CAL={oh15gMd5uZZ4uTGr5:"jakub",XdePtHMeZuQZpZiy5:"kuba"};
  var WHO={dziecko:"kuba",zero:"kuba",plywa:"jakub",sluzby:"jakub"};
  var last=null;

  if(!/^(localhost|127\.|0\.0\.0\.0)/.test(location.hostname) || /[?&]pomiar-test/.test(location.search)){
    var s=document.createElement("script");
    s.async=true; s.src="https://gc.zgo.at/count.js";
    s.setAttribute("data-goatcounter","https://"+SITE+".goatcounter.com/count");
    document.head.appendChild(s);
  }

  function page(){ return location.pathname.replace(/\.html$/,"").replace(/^\/$/,"/start")||"/start"; }
  function ev(name){
    var d={path:name,title:page(),event:true};
    if(window.WF_POMIAR_LOG) window.WF_POMIAR_LOG.push(d);
    try{ if(window.goatcounter&&window.goatcounter.count) window.goatcounter.count(d); }catch(e){}
  }
  function cal(href){ for(var k in CAL){ if(href.indexOf(k)>-1) return CAL[k]; } return null; }

  /* faza przechwytywania na window: zadziała przed bramką Regulaminu */
  window.addEventListener("click",function(e){
    var t=e.target; if(!t||!t.closest) return;
    var o=t.closest('.opt[data-q="who"]');
    if(o){ var v=o.getAttribute("data-v"); last=WHO[v]||last; ev("wybor-"+v); return; }
    if(t.closest(".wf-go")){ var g=t.closest(".wf-go"); if(!g.disabled) ev("regulamin-ok"+(last?"-"+last:"")); return; }
    var a=t.closest("a[href]"); if(!a) return;
    var h=a.getAttribute("href")||"", k=cal(h);
    if(k){ last=k; ev("kalendarz-"+k); return; }
    if(h.indexOf("tel:")===0){ ev("telefon"); return; }
    if(h.indexOf("mailto:")===0){ ev("mail"); return; }
    if(/google\.com\/maps/.test(h)){ ev("mapa"); return; }
    if(/instagram\.com\/jakubnachyla/.test(h)){ ev("instagram"); return; }
    if(h==="#dobierz"||h==="#rezerwacja"||a.hasAttribute("data-pick")){ ev("zarezerwuj"); return; }
  },true);
})();
