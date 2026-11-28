import{customerApi as z}from"../api.js";import{esc as n,icon as d,money as v,toast as C,withBusy as V,loadingHtml as X,emptyHtml as D,openModal as N,sanitizeHtml as O,confirmDialog as Q,copyText as A,downloadCodeCard as P}from"../ui.js";import{isValidPhone as B,normPhone as w}from"../lib/phone.js";import{mountCaptcha as K}from"./customer.js";async function Z(s,b){s.innerHTML=X();let q;try{({form:q}=await z("form",{slug:b}))}catch(e){s.innerHTML=`<div class="card form-card">${D("\u{1F343}","Kh\xF4ng m\u1EDF \u0111\u01B0\u1EE3c form",n(e.message))}</div>`;return}const i=q,h=i.money_suffix||"",f=(i.items||[]).filter(e=>e.kind==="qty"),_=(i.items||[]).filter(e=>e.kind==="fee"),u=i.max_per_order||20,S=(i.product_images||[]).filter(e=>e?.url),$=i.questions||[],E=2+($.length?1:0),j=`
    <section class="card form-card form-head">
      <div class="form-bar"></div>
      <h1>${n(i.cover_emoji||"\u{1F33F}")} ${n(i.name)}</h1>
      ${i.intro_html?`<div class="rich form-intro">${O(i.intro_html)}</div>`:""}
      ${f.length||_.length?`<div class="chips mt">${f.map(e=>`<span class="chip price">${d("tag","tag-ic")} ${n(e.name)} <b>${v(e.unit_price,h)}</b></span>`).join("")}
        ${_.map(e=>`<span class="chip price">\uFF0B ${n(e.name)} <b>${v(e.unit_price,h)}</b>/\u0111\u01A1n</span>`).join("")}</div>`:""}
      <p class="small muted mt"><span class="req">*</span> B\u1EAFt bu\u1ED9c</p>
    </section>
    ${S.length?`<section class="gallery form-gallery">${S.map((e,t)=>`
      <figure class="g-item"><button type="button" class="g-img" data-zoom="${t}" aria-label="Ph\xF3ng to \u1EA3nh"><img src="${n(e.url)}" alt="${n(e.caption||i.name)}" loading="lazy"/></button>
      ${e.caption?`<figcaption>${n(e.caption)}</figcaption>`:""}</figure>`).join("")}</section>`:""}`;if(!i.is_open){s.innerHTML=`<div class="form-wrap">${j}
      <section class="card form-card form-closed">
        <div class="em">\u{1F512}</div>
        <h2>Form \u0111\xE3 \u0111\xF3ng</h2>
        <p>${i.close_reason==="full"?"\u0110\u1EE3t n\xE0y \u0111\xE3 nh\u1EADn \u0111\u1EE7 s\u1ED1 l\u01B0\u1EE3ng r\u1ED3i. C\u1EA3m \u01A1n b\u1EA1n \u0111\xE3 quan t\xE2m, h\u1EB9n b\u1EA1n \u0111\u1EE3t sau nh\xE9 \u{1F33F}":"Admin \u0111\xE3 t\u1EA1m \u0111\xF3ng form n\xE0y. Theo d\xF5i group \u0111\u1EC3 bi\u1EBFt khi n\xE0o m\u1EDF l\u1EA1i nh\xE9 \u{1F33F}"}</p>
        <a class="btn" href="#/">${d("package")} Xem \u0111\u01A1n \u0111\xE3 \u0111\u1EB7t (nh\u1EADp S\u0110T)</a>
      </section></div>`,G(s,S,i.name);return}const g=(e,t,{type:c="text",required:o=!0,ph:a="",long:r=!1,hint:l="",mode:M=""}={})=>`
    <div class="card form-card fq" data-f="${e}">
      <label class="fq-label" for="f_${e}">${t}${o?' <span class="req">*</span>':""}</label>
      ${l?`<div class="small muted">${l}</div>`:""}
      ${r?`<textarea class="input" id="f_${e}" name="${e}" rows="3" maxlength="500" placeholder="${n(a)}" ${o?"required":""}></textarea>`:`<input class="input" id="f_${e}" name="${e}" type="${c}" ${M?`inputmode="${M}"`:""} maxlength="${c==="url"?300:100}" placeholder="${n(a)}" ${o?"required":""} autocomplete="off"/>`}
      <div class="fq-err"></div>
    </div>`;s.innerHTML=`
    <div class="form-wrap">
      ${j}
      <form id="of" novalidate>
        <div class="sec-tag">Ph\u1EA7n 1/${E} \xB7 Th\xF4ng tin \u0111\u1EB7t h\xE0ng</div>
        ${g("zalo_name","T\xEAn Zalo",{ph:"T\xEAn hi\u1EC3n th\u1ECB Zalo c\u1EE7a b\u1EA1n"})}
        ${g("phone","S\u1ED1 \u0111i\u1EC7n tho\u1EA1i (c\xF3 Zalo)",{type:"tel",mode:"tel",ph:"VD: 0912 345 678",hint:"M\u1EDF tin nh\u1EAFn Zalo \u0111\u1EC3 \u0111\u01B0\u1EE3c th\xEAm v\xE0o group nh\xE9."})}
        ${i.ask_threads?g("threads_link","Link Threads",{type:"url",ph:"https://www.threads.net/@..."}):""}
        ${f.map(e=>`
          <div class="card form-card fq" data-f="q_${n(e.code)}">
            <div class="fq-label">S\u1ED1 l\u01B0\u1EE3ng ${n(e.name)}</div>
            <div class="small muted">${v(e.unit_price,h)} / c\xE1i${e.description?` \xB7 ${n(e.description)}`:""} \xB7 t\u1ED1i \u0111a <b>${u}</b>/\u0111\u01A1n</div>
            ${e.image_url?`<button type="button" class="fq-img" data-img="${n(e.image_url)}" data-cap="${n(e.name)}" aria-label="Ph\xF3ng to \u1EA3nh ${n(e.name)}"><img src="${n(e.image_url)}" alt="${n(e.name)}" loading="lazy"/></button>`:""}
            <div class="stepper" data-code="${n(e.code)}" data-name="${n(e.name)}">
              <button type="button" class="icon-btn" data-d="-1" aria-label="B\u1EDBt">\u2212</button>
              <input class="input" type="number" inputmode="numeric" min="0" max="${u}" value="0" aria-label="S\u1ED1 l\u01B0\u1EE3ng ${n(e.name)}"/>
              <button type="button" class="icon-btn" data-d="1" aria-label="Th\xEAm">+</button>
            </div>
            <div class="fq-err"></div>
          </div>`).join("")}
        <div class="card form-card sum-card" id="sum"></div>

        <div class="sec-tag">Ph\u1EA7n 2/${E} \xB7 Th\xF4ng tin ship</div>
        ${g("receiver_name","T\xEAn ng\u01B0\u1EDDi nh\u1EADn")}
        <div class="card form-card fq" data-f="receiver_phone">
          <label class="fq-label" for="f_receiver_phone">S\u1ED1 \u0111i\u1EC7n tho\u1EA1i ng\u01B0\u1EDDi nh\u1EADn <span class="req">*</span></label>
          <input class="input" id="f_receiver_phone" name="receiver_phone" type="tel" inputmode="tel" maxlength="20" placeholder="VD: 0912 345 678" required autocomplete="off"/>
          <label class="check small mt"><input type="checkbox" id="samePhone"/> Gi\u1ED1ng S\u0110T Zalo</label>
          <div class="fq-err"></div>
        </div>
        ${g("address","\u0110\u1ECBa ch\u1EC9 nh\u1EADn h\xE0ng",{long:!0,ph:"S\u1ED1 nh\xE0, \u0111\u01B0\u1EDDng, ph\u01B0\u1EDDng/x\xE3, t\u1EC9nh/th\xE0nh",hint:"GHI \u0110\u1EA6Y \u0110\u1EE6 PH\u01AF\u1EDCNG, T\u1EC8NH/TH\xC0NH theo \u0111\u1ECBa ch\u1EC9 m\u1EDBi."})}

        ${$.length?`<div class="sec-tag">Ph\u1EA7n 3/${E} \xB7 C\xE2u h\u1ECFi th\xEAm</div>
          ${$.map(e=>`
            <div class="card form-card fq" data-q="${n(e.id)}">
              <label class="fq-label" for="q_${n(e.id)}">${n(e.label)}${e.required?' <span class="req">*</span>':""}</label>
              ${e.type==="long"?`<textarea class="input" id="q_${n(e.id)}" rows="3" maxlength="1000"></textarea>`:`<input class="input" id="q_${n(e.id)}" maxlength="300" autocomplete="off"/>`}
              <div class="fq-err"></div>
            </div>`).join("")}`:""}

        <div class="card form-card">
          <div id="cap"></div>
          <button class="btn primary block mt" type="submit">${d("check")} G\u1EEDi \u0111\u01A1n</button>
          <button class="link-btn small" type="button" id="clearForm">Xo\xE1 h\u1EBFt c\xE2u tr\u1EA3 l\u1EDDi</button>
          <p class="hint">${d("shield")}<span>Th\xF4ng tin ch\u1EC9 admin xem \u0111\u1EC3 so\u1EA1n \u0111\u01A1n. \u0110\u01A1n \u0111\u01B0\u1EE3c <b>admin duy\u1EC7t</b> xong b\u1EA1n m\u1EDBi tra c\u1EE9u \u0111\u01B0\u1EE3c b\u1EB1ng S\u0110T.</span></p>
        </div>
      </form>
    </div>`,G(s,S,i.name);const m=e=>s.querySelector(e),p=m("#of");function k(e,t){const c=e.querySelector(".fq-err");return c&&(c.textContent=t||"",c.classList.toggle("show",!!t)),e.classList.toggle("bad",!!t),!t}s.querySelectorAll("[data-img]").forEach(e=>e.addEventListener("click",()=>N({title:`${d("image")} ${n(e.dataset.cap)}`,body:`<img class="zoom-img" src="${n(e.dataset.img)}" alt=""/>`,wide:!0}))),m("#clearForm").addEventListener("click",async()=>{[...p.querySelectorAll("input:not([type=checkbox]), textarea")].some(t=>t.closest(".stepper")?Number(t.value)>0:t.value.trim())&&!await Q("Xo\xE1 to\xE0n b\u1ED9 th\xF4ng tin b\u1EA1n \u0111\xE3 nh\u1EADp trong form?",{danger:!0,okText:"Xo\xE1 h\u1EBFt",title:"Xo\xE1 c\xE2u tr\u1EA3 l\u1EDDi"})||(p.reset(),p.querySelectorAll(".stepper input").forEach(t=>{t.value=0}),p.querySelectorAll(".fq").forEach(t=>k(t,"")),T?.reset(),y(),window.scrollTo({top:0,behavior:"smooth"}))});let T=null;K(m("#cap")).then(e=>{T=e}).catch(()=>{m("#cap").innerHTML='<div class="notice peach">Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c captcha, t\u1EA3i l\u1EA1i trang gi\xFAp m\xECnh nh\xE9.</div>'});const L=()=>Object.fromEntries([...s.querySelectorAll(".stepper")].map(e=>[e.dataset.code,Math.max(0,Math.floor(Number(e.querySelector("input").value)||0))])),H=()=>[...s.querySelectorAll(".stepper")].filter(e=>(Number(e.querySelector("input").value)||0)>u).map(e=>({code:e.dataset.code,name:e.dataset.name})),x=e=>{const t=Number(e.querySelector("input").value),c=e.closest(".fq"),o=!Number.isFinite(t)||t<0||!Number.isInteger(t)?"Nh\u1EADp s\u1ED1 nguy\xEAn t\u1EEB 0.":t>u?`${e.dataset.name}: t\u1ED1i \u0111a ${u} / \u0111\u01A1n (b\u1EA1n \u0111ang nh\u1EADp ${t}).`:"";return k(c,o),!o},y=()=>{const e=L(),t=Object.values(e).reduce((a,r)=>a+r,0),c=f.reduce((a,r)=>a+Number(r.unit_price)*(e[r.code]||0),0),o=t>0?_.reduce((a,r)=>a+Number(r.unit_price),0):0;m("#sum").innerHTML=t?`<div class="row between"><span>T\u1EA1m t\xEDnh <b>${t}</b> s\u1EA3n ph\u1EA9m</span><b class="big">${v(c+o,h)}</b></div>
         ${o?`<div class="small muted">Ti\u1EC1n h\xE0ng ${v(c,h)} + ${_.map(a=>n(a.name)).join(", ")} ${v(o,h)}</div>`:""}
         ${H().length?`<div class="fq-err show">V\u01B0\u1EE3t gi\u1EDBi h\u1EA1n: ${H().map(a=>`${n(a.name)} (t\u1ED1i \u0111a ${u})`).join(", ")}</div>`:""}`:'<span class="muted">Ch\u1ECDn s\u1ED1 l\u01B0\u1EE3ng \u1EDF tr\xEAn \u0111\u1EC3 xem t\u1EA1m t\xEDnh.</span>'};s.querySelectorAll(".stepper").forEach(e=>{const t=e.querySelector("input");e.addEventListener("click",c=>{const o=c.target.closest("[data-d]");if(!o)return;const a=Math.max(0,(Number(t.value)||0)+Number(o.dataset.d));if(a>u){t.value=u,x(e),k(e.closest(".fq"),`${e.dataset.name}: t\u1ED1i \u0111a ${u} / \u0111\u01A1n.`),y();return}t.value=a,x(e),y()}),t.addEventListener("input",()=>{x(e),y()})}),y(),m("#samePhone").addEventListener("change",e=>{e.target.checked&&(m("#f_receiver_phone").value=m("#f_phone").value)}),m("#f_phone").addEventListener("input",()=>{m("#samePhone").checked&&(m("#f_receiver_phone").value=m("#f_phone").value)});const F=()=>{let e=null;const t=(r,l)=>{!k(r,l)&&!e&&(e=r)},c=r=>(p.elements[r]?.value||"").trim();t(s.querySelector('[data-f="zalo_name"]'),c("zalo_name")?"":"B\u1EA1n ch\u01B0a nh\u1EADp T\xEAn Zalo."),t(s.querySelector('[data-f="phone"]'),B(c("phone"))?"":"S\u0110T ch\u01B0a \u0111\xFAng (10 s\u1ED1, b\u1EAFt \u0111\u1EA7u b\u1EB1ng 0)."),i.ask_threads&&t(s.querySelector('[data-f="threads_link"]'),c("threads_link")?"":"B\u1EA1n ch\u01B0a nh\u1EADp link Threads.");const o=Object.values(L()).reduce((r,l)=>r+l,0);s.querySelectorAll(".stepper").forEach(r=>{!x(r)&&!e&&(e=r.closest(".fq"))});const a=s.querySelector('[data-f^="q_"]');return a&&o===0&&t(a,"Ch\u1ECDn \xEDt nh\u1EA5t 1 s\u1EA3n ph\u1EA9m."),t(s.querySelector('[data-f="receiver_name"]'),c("receiver_name")?"":"B\u1EA1n ch\u01B0a nh\u1EADp t\xEAn ng\u01B0\u1EDDi nh\u1EADn."),t(s.querySelector('[data-f="receiver_phone"]'),B(c("receiver_phone"))?"":"S\u0110T ng\u01B0\u1EDDi nh\u1EADn ch\u01B0a \u0111\xFAng."),t(s.querySelector('[data-f="address"]'),c("address").length>=10?"":"Ghi \u0111\u1EA7y \u0111\u1EE7 s\u1ED1 nh\xE0, ph\u01B0\u1EDDng, t\u1EC9nh/th\xE0nh nh\xE9."),$.forEach(r=>{const l=s.querySelector(`[data-q="${CSS.escape(r.id)}"]`);t(l,r.required&&!l.querySelector("input,textarea").value.trim()?"C\xE2u n\xE0y b\u1EAFt bu\u1ED9c.":"")}),e&&e.scrollIntoView({behavior:"smooth",block:"center"}),!e};p.addEventListener("submit",e=>{if(e.preventDefault(),!F())return;const t=T?.get();if(!t)return C("B\u1EA1n tick captcha gi\xFAp m\xECnh nh\xE9 \u{1F916}","warn");const c=a=>(p.elements[a]?.value||"").trim(),o={zalo_name:c("zalo_name"),phone:c("phone"),threads_link:c("threads_link"),receiver_name:c("receiver_name"),receiver_phone:c("receiver_phone"),address:c("address"),quantities:L(),answers:Object.fromEntries($.map(a=>[a.id,s.querySelector(`[data-q="${CSS.escape(a.id)}"] input, [data-q="${CSS.escape(a.id)}"] textarea`).value.trim()]))};V(p.querySelector("[type=submit]"),async()=>{try{const a=await z("submit",{slug:b,captchaToken:t,fields:o});I(o,a)}catch(a){if(T?.reset(),a.closed||/đã đóng/.test(a.message))return C(a.message,"warn",7e3),Z(s,b);C(a.message,"err",6e3)}})});const I=(e,t={})=>{const c=e.quantities,o=t.access_code?`<div class="code-card mt">
          <div class="small"><b>\u{1F511} M\xC3 TRA C\u1EE8U C\u1EE6A B\u1EA0N</b> \u2013 ch\u1EC9 hi\u1EC7n <b>1 l\u1EA7n</b>, ch\u1EE5p m\xE0n h\xECnh ho\u1EB7c l\u01B0u l\u1EA1i ngay nh\xE9!</div>
          <div class="code-big">${n(t.access_code)}</div>
          <div class="row" style="justify-content:center">
            <button type="button" class="btn sm" data-copy-code="${n(t.access_code)}">${d("copy")} Sao ch\xE9p m\xE3</button>
            <button type="button" class="btn sm primary" data-dl-code>${d("download")} T\u1EA3i \u1EA3nh m\xE3 v\u1EC1 m\xE1y</button>
          </div>
          <div class="small muted mt-xs">Tra c\u1EE9u \u0111\u01A1n c\u1EA7n nh\u1EADp S\u0110T <b>${n(w(e.phone))}</b> + m\xE3 n\xE0y. Ng\u01B0\u1EDDi kh\xE1c bi\u1EBFt S\u0110T c\u1EE7a b\u1EA1n c\u0169ng kh\xF4ng xem \u0111\u01B0\u1EE3c.</div>
        </div>`:'<div class="notice cream mt">\u{1F511} S\u0110T n\xE0y \u0111\xE3 c\xF3 <b>m\xE3 tra c\u1EE9u</b> t\u1EEB \u0111\u01A1n tr\u01B0\u1EDBc \u2013 d\xF9ng l\u1EA1i m\xE3 c\u0169 \u0111\u1EC3 tra c\u1EE9u nh\xE9. Qu\xEAn m\xE3 th\xEC nh\u1EAFn admin qua Zalo.</div>';if(s.innerHTML=`<div class="form-wrap">
      <section class="card form-card form-head"><div class="form-bar"></div>
        <h1>\u{1F389} \u0110\xE3 g\u1EEDi \u0111\u01A1n!</h1>
        <p>C\u1EA3m \u01A1n <b>${n(e.zalo_name)}</b> \u{1F49A} Admin s\u1EBD ki\u1EC3m tra v\xE0 duy\u1EC7t \u0111\u01A1n. Sau khi \u0111\u01B0\u1EE3c duy\u1EC7t, b\u1EA1n v\xE0o
          <a href="#/">trang ch\u1EE7</a> nh\u1EADp S\u0110T <b>${n(w(e.phone))}</b> \u0111\u1EC3 xem danh s\xE1ch thu ti\u1EC1n &amp; \u0111\u01A1n c\u1EE7a m\xECnh.</p>
        ${o}
        <div class="card pad-sm mt">
          ${f.filter(a=>c[a.code]).map(a=>`<div>${d("tag","tag-ic")} ${n(a.name)} \xD7 <b>${c[a.code]}</b></div>`).join("")}
          <div class="small muted mt">Giao t\u1EDBi: ${n(e.receiver_name)} \xB7 ${n(e.receiver_phone)}<br/>${n(e.address)}</div>
        </div>
        <div class="row mt"><button class="btn" id="again">${d("plus")} G\u1EEDi th\xEAm 1 \u0111\u01A1n kh\xE1c</button>
          <a class="btn primary" href="#/">${d("home")} Trang ch\u1EE7</a></div>
      </section></div>`,s.querySelector("#again").addEventListener("click",()=>Z(s,b)),s.querySelector("[data-copy-code]")?.addEventListener("click",a=>A(a.currentTarget.dataset.copyCode)),s.querySelector("[data-dl-code]")?.addEventListener("click",()=>P({code:t.access_code,phone:w(e.phone)})),window.scrollTo({top:0,behavior:"smooth"}),t.access_code){const a=N({title:"\u{1F511} L\u01B0u m\xE3 tra c\u1EE9u c\u1EE7a b\u1EA1n",body:`<div class="code-card">
            <div class="small">M\xE3 n\xE0y <b>ch\u1EC9 hi\u1EC7n 1 l\u1EA7n</b> \u2013 c\u1EA7n \u0111\u1EC3 xem \u0111\u01A1n, danh s\xE1ch thu ti\u1EC1n & m\xE3 v\u1EADn \u0111\u01A1n.</div>
            <div class="code-big">${n(t.access_code)}</div>
            <div class="row" style="justify-content:center">
              <button type="button" class="btn sm" data-m-copy>${d("copy")} Sao ch\xE9p</button>
              <button type="button" class="btn sm primary" data-m-dl>${d("download")} T\u1EA3i \u1EA3nh m\xE3</button>
            </div>
            <label class="check small mt"><input type="checkbox" data-m-ok/> M\xECnh \u0111\xE3 l\u01B0u m\xE3 (ch\u1EE5p m\xE0n h\xECnh / t\u1EA3i \u1EA3nh / sao ch\xE9p)</label>
          </div>`,footer:`<button class="btn primary" data-m-close disabled>${d("check")} \u0110\xE3 l\u01B0u, \u0111\xF3ng</button>`}),r=a.el.querySelector("[data-m-ok]"),l=a.el.querySelector("[data-m-close]");a.el.querySelector("[data-m-copy]").addEventListener("click",()=>{A(t.access_code),r.checked=!0,l.disabled=!1}),a.el.querySelector("[data-m-dl]").addEventListener("click",()=>{P({code:t.access_code,phone:w(e.phone)}),r.checked=!0,l.disabled=!1}),r.addEventListener("change",()=>{l.disabled=!r.checked}),l.addEventListener("click",()=>a.close())}}}function G(s,b,q){s.querySelectorAll("[data-zoom]").forEach(i=>i.addEventListener("click",()=>{const h=b[+i.dataset.zoom];N({title:`${d("image")} ${n(h.caption||q)}`,body:`<img class="zoom-img" src="${n(h.url)}" alt=""/>`,wide:!0})}))}export{Z as renderForm};
