/* Zapis na listę chętnych na obóz / wyjazd.
   Kopia grupa.js z innymi polami. Formularz pojawia się w miejscu <div data-oboz></div>.
   Bez JavaScriptu zostaje SMS z tekstu nad formularzem.
   Zgłoszenie idzie na webhook Make jako zwykły formularz (pola tekstowe). */
(function(){
  "use strict";

  /* Adres webhooka z Make. Wklej go zamiast [WEBHOOK_URL] (zostaw cudzysłowy). */
  var WEBHOOK_URL="https://hook.eu1.make.com/w21o8v75d53dg526dfsrkunfyr3mal9f";

  var OK_MSG="Mamy Twoje zgłoszenie. Odezwiemy się, gdy będą termin i cena.";
  /* Wyjazdy do wyboru w formularzu (Nachu 24.11: oba, sprawdzamy zapotrzebowanie). */
  var TERMINY=["ferie zimowe 2027","wakacje 2027"];
  var ZGODA="Zgadzam się na kontakt telefoniczny lub SMS w sprawie wyjazdu. Jeśli zgłaszam dziecko, jestem jego rodzicem lub opiekunem.";

  var CSS=
  ".wf-oboz{margin:0 48px 24px 0;padding:20px;border:1px solid var(--line);border-radius:16px;background:var(--bg)}"+
  "@media (max-width:520px){.wf-oboz{margin-right:0;padding:16px}}"+
  ".wf-oboz h3{font-size:1.05rem;font-family:var(--body);font-weight:700;margin:0 0 14px}"+
  ".wf-oboz fieldset{border:0;margin:0 0 16px;padding:0;min-width:0}"+
  ".wf-oboz legend,.wf-oboz .wf-l{display:block;font-weight:600;font-size:.95rem;margin:0 0 8px;padding:0;color:var(--fg)}"+
  ".wf-oboz .wf-ch{display:flex;flex-wrap:wrap;gap:8px}"+
  ".wf-oboz .wf-ch label{position:relative;display:inline-flex}"+
  ".wf-oboz .wf-ch input{position:absolute;opacity:0;inset:0;margin:0;cursor:pointer}"+
  ".wf-oboz .wf-ch span{display:inline-block;padding:10px 16px;min-height:44px;line-height:22px;border:1.5px solid var(--line);border-radius:999px;font-size:.95rem;color:var(--fg);cursor:pointer;user-select:none}"+
  ".wf-oboz .wf-ch input:checked+span{border-color:var(--brand-blue);background:rgba(10,140,245,.12);font-weight:600}"+
  ".wf-oboz .wf-ch input:focus-visible+span{outline:3px solid var(--accent);outline-offset:2px}"+
  ".wf-oboz .wf-row{display:grid;grid-template-columns:2fr 1fr;gap:12px;margin:0 0 16px}"+
  ".wf-oboz .wf-f{margin:0 0 16px}.wf-oboz .wf-row .wf-f{margin:0}"+
  ".wf-oboz input[type=text],.wf-oboz input[type=tel]{width:100%;font:inherit;font-size:16px;color:var(--fg);background:var(--bg);border:1.5px solid var(--line);border-radius:10px;padding:11px 12px;min-height:46px}"+
  ".wf-oboz input[type=text]:focus,.wf-oboz input[type=tel]:focus{outline:3px solid var(--accent);outline-offset:1px;border-color:var(--brand-blue)}"+
  ".wf-oboz [aria-invalid=true]{border-color:var(--no)!important}"+
  ".wf-oboz .wf-err{display:block;color:var(--no);font-size:.88rem;margin-top:6px}"+
  ".wf-oboz .wf-err:empty{display:none}"+
  ".wf-oboz .wf-zg{display:flex;gap:10px;align-items:flex-start;font-size:.9rem;color:var(--muted);margin:0 0 6px;cursor:pointer}"+
  ".wf-oboz .wf-zg input{flex:none;width:22px;height:22px;margin:1px 0 0;accent-color:var(--brand-blue)}"+
  ".wf-oboz .wf-hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;overflow:hidden}"+
  ".wf-oboz .btn{width:100%;margin-top:12px;cursor:pointer}"+
  ".wf-oboz .btn[disabled]{opacity:.6;cursor:wait}"+
  ".wf-oboz .wf-msg{margin:12px 0 0;font-weight:600}"+
  ".wf-oboz .wf-msg.ok{color:var(--ok)}.wf-oboz .wf-msg.no{color:var(--no)}"+
  ".wf-oboz .wf-done{padding:6px 0;font-weight:600;color:var(--ok);font-size:1.02rem}";

  function chips(name,type,opts){
    var h='<div class="wf-ch">';
    for(var i=0;i<opts.length;i++){
      h+='<label><input type="'+type+'" name="'+name+'" value="'+opts[i]+'"><span>'+opts[i]+'</span></label>';
    }
    return h+'</div>';
  }

  function html(id){
    return ''+
    '<form novalidate>'+
      '<h3>Zapisz się na listę chętnych na wyjazd</h3>'+
      '<fieldset data-f="kto"><legend>Kto będzie pływał?</legend>'+chips("kto","radio",["dziecko","dorosły"])+'<span class="wf-err"></span></fieldset>'+
      '<div class="wf-row">'+
        '<div class="wf-f"><label class="wf-l" for="'+id+'-imie">Imię</label><input type="text" id="'+id+'-imie" name="imie" autocomplete="off" maxlength="40"><span class="wf-err"></span></div>'+
        '<div class="wf-f"><label class="wf-l" for="'+id+'-wiek">Wiek</label><input type="text" id="'+id+'-wiek" name="wiek" inputmode="numeric" maxlength="2" autocomplete="off"><span class="wf-err"></span></div>'+
      '</div>'+
      '<div class="wf-f"><label class="wf-l" for="'+id+'-tel">Telefon do kontaktu</label><input type="tel" id="'+id+'-tel" name="telefon" inputmode="tel" autocomplete="tel" maxlength="20" placeholder="np. 600 100 200"><span class="wf-err"></span></div>'+
      '<fieldset data-f="poziom"><legend>Jak pływa?</legend>'+chips("poziom","radio",["nie pływa","trochę pływa","pływa kraulem"])+'<span class="wf-err"></span></fieldset>'+
      '<fieldset data-f="termin"><legend>Który wyjazd Cię interesuje? (możesz oba)</legend>'+chips("termin","checkbox",TERMINY)+'<span class="wf-err"></span></fieldset>'+
      '<div class="wf-hp" aria-hidden="true"><label>Nie wypełniaj tego pola<input type="text" name="strona_www" tabindex="-1" autocomplete="off"></label></div>'+
      '<div class="wf-f" data-f="zgoda"><label class="wf-zg"><input type="checkbox" name="zgoda" value="tak"><span>'+ZGODA+' <a href="polityka-prywatnosci.html">Polityka prywatności</a>.</span></label><span class="wf-err"></span></div>'+
      '<button type="submit" class="btn btn-navy">Wyślij zgłoszenie</button>'+
      '<p class="wf-msg" role="status" aria-live="polite"></p>'+
    '</form>';
  }

  /* Polski numer: 9 cyfr (pierwsza 2-9), opcjonalnie +48 / 0048 / 48, spacje i myślniki dozwolone. */
  function phone(v){
    var d=String(v||"").replace(/[\s\-().]/g,"");
    var m=d.match(/^(?:\+48|0048|48)?([2-9]\d{8})$/);
    return m?"+48 "+m[1].replace(/(\d{3})(\d{3})(\d{3})/,"$1 $2 $3"):null; /* spacje: arkusz nie zamieni numeru w liczbę i nie utnie „+” */
  }
  function val(f,name){ var c=f.querySelector('input[name="'+name+'"]:checked'); return c?c.value:""; }
  function vals(f,name){ var a=[],c=f.querySelectorAll('input[name="'+name+'"]:checked'); for(var i=0;i<c.length;i++) a.push(c[i].value); return a; }
  function err(el,msg){
    var box=el.closest(".wf-f,fieldset"), e=box.querySelector(".wf-err");
    e.textContent=msg||"";
    var inp=box.querySelector("input[type=text],input[type=tel]");
    if(inp) inp.setAttribute("aria-invalid",msg?"true":"false");
    return !msg;
  }
  function ev(name){
    var d={path:name,title:location.pathname.replace(/\.html$/,"").replace(/^\/$/,"/start")||"/start",event:true};
    if(window.WF_POMIAR_LOG) window.WF_POMIAR_LOG.push(d);
    try{ if(window.goatcounter&&window.goatcounter.count) window.goatcounter.count(d); }catch(e){}
  }

  function check(f){
    var ok=true, first=null;
    function mark(el,msg){ if(!err(el,msg)){ ok=false; if(!first) first=el; } }
    var kto=val(f,"kto");
    mark(f.querySelector('[data-f="kto"]'), kto?"":"Wybierz: dziecko czy dorosły.");
    var im=f.elements.imie, iv=im.value.trim();
    mark(im, iv.length>=2?"":"Wpisz imię.");
    var wk=f.elements.wiek, wv=wk.value.trim(), wn=parseInt(wv,10);
    mark(wk, /^\d{1,2}$/.test(wv)&&wn>=1?"":"Wpisz wiek w latach, np. 9.");
    var tl=f.elements.telefon;
    mark(tl, phone(tl.value)?"":"Sprawdź numer. Potrzebujemy 9 cyfr, np. 600 100 200.");
    mark(f.querySelector('[data-f="poziom"]'), val(f,"poziom")?"":"Zaznacz jedną odpowiedź.");
    mark(f.querySelector('[data-f="termin"]'), vals(f,"termin").length?"":"Zaznacz co najmniej jeden wyjazd.");
    mark(f.querySelector('[data-f="zgoda"]'), f.elements.zgoda.checked?"":"Bez zgody nie możemy się odezwać.");
    if(first){ var t=first.tagName==="INPUT"?first:first.querySelector("input"); try{ t.focus(); }catch(e){} }
    return ok;
  }

  function payload(f){
    return {
      zrodlo:"strona-oboz",
      strona:location.pathname,
      kto:val(f,"kto"),
      imie:f.elements.imie.value.trim(),
      wiek:f.elements.wiek.value.trim(),
      telefon:phone(f.elements.telefon.value),
      poziom:val(f,"poziom"),
      termin:vals(f,"termin").join(", "),
      zgoda_kontakt:"tak",
      zgoda_tresc:ZGODA,
      wyslano:new Date().toISOString()
    };
  }

  function init(box,n){
    var id="wfo"+n;
    box.className="wf-oboz"; box.innerHTML=html(id);
    var f=box.querySelector("form"), msg=f.querySelector(".wf-msg"), btn=f.querySelector("button");

    /* błędy znikają po poprawieniu */
    function clear(e){ var b=e.target.closest(".wf-f,fieldset"); if(e.target.name==="telefon"&&!phone(e.target.value)) return; if(b&&b.querySelector(".wf-err")) err(b,""); }
    f.addEventListener("change",clear); f.addEventListener("input",clear);
    f.elements.telefon.addEventListener("blur",function(){ if(this.value.trim()) err(this, phone(this.value)?"":"Sprawdź numer. Potrzebujemy 9 cyfr, np. 600 100 200."); });

    f.addEventListener("submit",function(e){
      e.preventDefault();
      msg.textContent=""; msg.className="wf-msg";
      if(!check(f)) return;

      function done(){
        box.innerHTML='<p class="wf-done" role="status" tabindex="-1">'+OK_MSG+'</p>';
        try{ box.firstChild.focus(); }catch(e){}
      }
      /* ukryte pole wypełnione = bot: udajemy sukces, nic nie wysyłamy */
      if(f.elements.strona_www.value){ done(); return; }

      if(!/^https:\/\//.test(WEBHOOK_URL)){
        msg.className="wf-msg no";
        msg.innerHTML='Formularz jeszcze nie działa. Wyślij SMS z hasłem OBÓZ na <a href="tel:+48691325011">691 325 011</a>.';
        return;
      }
      var data=payload(f), body=new URLSearchParams();
      for(var k in data) body.append(k,data[k]);
      btn.disabled=true; btn.textContent="Wysyłam…";
      /* no-cors: proste żądanie bez preflight, działa z każdym webhookiem Make */
      fetch(WEBHOOK_URL,{method:"POST",mode:"no-cors",body:body,keepalive:true})
        .then(function(){ ev("oboz-zgloszenie"); done(); })
        .catch(function(){
          btn.disabled=false; btn.textContent="Wyślij zgłoszenie";
          msg.className="wf-msg no";
          msg.innerHTML='Nie udało się wysłać. Sprawdź internet i spróbuj jeszcze raz albo wyślij SMS z hasłem OBÓZ na <a href="tel:+48691325011">691 325 011</a>.';
        });
    });
  }

  var boxes=document.querySelectorAll("[data-oboz]");
  if(!boxes.length) return;
  var st=document.createElement("style"); st.textContent=CSS; document.head.appendChild(st);
  for(var i=0;i<boxes.length;i++) init(boxes[i],i);
})();
