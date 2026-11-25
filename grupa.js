/* Zapis na listę chętnych do grupy.
   Formularz pojawia się w miejscu <div data-grupa></div>.
   Bez JavaScriptu zostaje SMS z tekstu nad formularzem.
   Zgłoszenie idzie na webhook Make jako zwykły formularz (pola tekstowe). */
(function(){
  "use strict";

  /* Adres webhooka z Make. Wklej go zamiast [WEBHOOK_URL] (zostaw cudzysłowy). */
  var WEBHOOK_URL="https://hook.eu1.make.com/w21o8v75d53dg526dfsrkunfyr3mal9f";

  var OK_MSG="Mamy Twoje zgłoszenie, odezwiemy się, gdy zbierze się grupa.";
  var ZGODA="Zgadzam się na kontakt telefoniczny lub SMS w sprawie zajęć w grupie. Jeśli zgłaszam dziecko, jestem jego rodzicem lub opiekunem.";

  var CSS=
  ".wf-grupa{margin:0 48px 24px 0;padding:20px;border:1px solid var(--line);border-radius:16px;background:var(--bg)}"+
  "@media (max-width:520px){.wf-grupa{margin-right:0;padding:16px}}"+
  ".wf-grupa h3{font-size:1.05rem;font-family:var(--body);font-weight:700;margin:0 0 14px}"+
  ".wf-grupa fieldset{border:0;margin:0 0 16px;padding:0;min-width:0}"+
  ".wf-grupa legend,.wf-grupa .wf-l{display:block;font-weight:600;font-size:.95rem;margin:0 0 8px;padding:0;color:var(--fg)}"+
  ".wf-grupa .wf-ch{display:flex;flex-wrap:wrap;gap:8px}"+
  ".wf-grupa .wf-ch label{position:relative;display:inline-flex}"+
  ".wf-grupa .wf-ch input{position:absolute;opacity:0;inset:0;margin:0;cursor:pointer}"+
  ".wf-grupa .wf-ch span{display:inline-block;padding:10px 16px;min-height:44px;line-height:22px;border:1.5px solid var(--line);border-radius:999px;font-size:.95rem;color:var(--fg);cursor:pointer;user-select:none}"+
  ".wf-grupa .wf-ch input:checked+span{border-color:var(--brand-blue);background:rgba(10,140,245,.12);font-weight:600}"+
  ".wf-grupa .wf-ch input:focus-visible+span{outline:3px solid var(--accent);outline-offset:2px}"+
  ".wf-grupa .wf-row{display:grid;grid-template-columns:2fr 1fr;gap:12px;margin:0 0 16px}"+
  ".wf-grupa .wf-f{margin:0 0 16px}.wf-grupa .wf-row .wf-f{margin:0}"+
  ".wf-grupa input[type=text],.wf-grupa input[type=tel]{width:100%;font:inherit;font-size:16px;color:var(--fg);background:var(--bg);border:1.5px solid var(--line);border-radius:10px;padding:11px 12px;min-height:46px}"+
  ".wf-grupa input[type=text]:focus,.wf-grupa input[type=tel]:focus{outline:3px solid var(--accent);outline-offset:1px;border-color:var(--brand-blue)}"+
  ".wf-grupa [aria-invalid=true]{border-color:var(--no)!important}"+
  ".wf-grupa .wf-err{display:block;color:var(--no);font-size:.88rem;margin-top:6px}"+
  ".wf-grupa .wf-err:empty{display:none}"+
  ".wf-grupa .wf-zg{display:flex;gap:10px;align-items:flex-start;font-size:.9rem;color:var(--muted);margin:0 0 6px;cursor:pointer}"+
  ".wf-grupa .wf-zg input{flex:none;width:22px;height:22px;margin:1px 0 0;accent-color:var(--brand-blue)}"+
  ".wf-grupa .wf-hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;overflow:hidden}"+
  ".wf-grupa .btn{width:100%;margin-top:12px;cursor:pointer}"+
  ".wf-grupa .btn[disabled]{opacity:.6;cursor:wait}"+
  ".wf-grupa .wf-msg{margin:12px 0 0;font-weight:600}"+
  ".wf-grupa .wf-msg.ok{color:var(--ok)}.wf-grupa .wf-msg.no{color:var(--no)}"+
  ".wf-grupa .wf-done{padding:6px 0;font-weight:600;color:var(--ok);font-size:1.02rem}";

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
      '<h3>Zapisz się na listę chętnych</h3>'+
      '<fieldset data-f="kto"><legend>Kto będzie pływał?</legend>'+chips("kto","radio",["dziecko","dorosły"])+'<span class="wf-err"></span></fieldset>'+
      '<div class="wf-row">'+
        '<div class="wf-f"><label class="wf-l" for="'+id+'-imie">Imię</label><input type="text" id="'+id+'-imie" name="imie" autocomplete="off" maxlength="40"><span class="wf-err"></span></div>'+
        '<div class="wf-f"><label class="wf-l" for="'+id+'-wiek">Wiek</label><input type="text" id="'+id+'-wiek" name="wiek" inputmode="numeric" maxlength="2" autocomplete="off"><span class="wf-err"></span></div>'+
      '</div>'+
      '<div class="wf-f"><label class="wf-l" for="'+id+'-tel">Telefon do kontaktu</label><input type="tel" id="'+id+'-tel" name="telefon" inputmode="tel" autocomplete="tel" maxlength="20" placeholder="np. 600 100 200"><span class="wf-err"></span></div>'+
      '<fieldset data-f="kraul"><legend>Czy pływa kraulem?</legend>'+chips("kraul","radio",["tak","uczy się","nie"])+'<span class="wf-err"></span></fieldset>'+
      '<fieldset data-f="pory"><legend>Wolne pory (zaznacz wszystkie pasujące)</legend>'+chips("pory","checkbox",["rano","po południu","sobota"])+'<span class="wf-err"></span></fieldset>'+
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
    return m?m[1]:null; /* sam polski numer, 9 cyfr, bez +48 */
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
    mark(f.querySelector('[data-f="kraul"]'), val(f,"kraul")?"":"Zaznacz jedną odpowiedź.");
    mark(f.querySelector('[data-f="pory"]'), vals(f,"pory").length?"":"Zaznacz co najmniej jedną porę.");
    mark(f.querySelector('[data-f="zgoda"]'), f.elements.zgoda.checked?"":"Bez zgody nie możemy oddzwonić.");
    if(first){ var t=first.tagName==="INPUT"?first:first.querySelector("input"); try{ t.focus(); }catch(e){} }
    return ok;
  }

  function payload(f){
    return {
      zrodlo:"strona-grupa",
      strona:location.pathname,
      kto:val(f,"kto"),
      imie:f.elements.imie.value.trim(),
      wiek:f.elements.wiek.value.trim(),
      telefon:phone(f.elements.telefon.value),
      kraul:val(f,"kraul"),
      pory:vals(f,"pory").join(", "),
      zgoda_kontakt:"tak",
      zgoda_tresc:ZGODA,
      wyslano:new Date().toISOString()
    };
  }

  function init(box,n){
    var id="wfg"+n;
    box.className="wf-grupa"; box.innerHTML=html(id);
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
        msg.innerHTML='Formularz jeszcze nie działa. Wyślij SMS z hasłem GRUPA na <a href="tel:+48691325011">691 325 011</a>.';
        return;
      }
      var data=payload(f), body=new URLSearchParams();
      for(var k in data) body.append(k,data[k]);
      btn.disabled=true; btn.textContent="Wysyłam…";
      /* no-cors: proste żądanie bez preflight, działa z każdym webhookiem Make */
      fetch(WEBHOOK_URL,{method:"POST",mode:"no-cors",body:body,keepalive:true})
        .then(function(){ ev("grupa-zgloszenie"); done(); })
        .catch(function(){
          btn.disabled=false; btn.textContent="Wyślij zgłoszenie";
          msg.className="wf-msg no";
          msg.innerHTML='Nie udało się wysłać. Sprawdź internet i spróbuj jeszcze raz albo wyślij SMS z hasłem GRUPA na <a href="tel:+48691325011">691 325 011</a>.';
        });
    });
  }

  var boxes=document.querySelectorAll("[data-grupa]");
  if(!boxes.length) return;
  var st=document.createElement("style"); st.textContent=CSS; document.head.appendChild(st);
  for(var i=0;i<boxes.length;i++) init(boxes[i],i);
})();
