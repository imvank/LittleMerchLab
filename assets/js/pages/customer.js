import{customerApi as b,MOCK as H,getCustSession as _,setCustSession as T,clearCustSession as S}from"../api.js";import{CONFIG as M}from"../config.js";import{esc as a,icon as d,money as g,badge as k,PAY as j,STATUS as N,SHIP as D,fmtDate as y,toast as $,withBusy as x,emptyHtml as A,loadingHtml as B,carrierName as w,trackingUrl as q,copyText as G,deadlineInfo as I}from"../ui.js";import{isValidPhone as L,prettyPhone as C}from"../lib/phone.js";let f;function K(){return f??=new Promise((e,n)=>{window.__gmTsLoaded=e;const t=document.createElement("script");t.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__gmTsLoaded",t.async=!0,t.onerror=()=>{f=null,n(new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c captcha"))},document.head.appendChild(t)}),f}async function P(e){if(H){e.innerHTML='<label class="check card pad-sm" style="box-shadow:none"><input type="checkbox" id="mockcap"/> T\xF4i kh\xF4ng ph\u1EA3i robot \u{1F916} <span class="small" style="color:var(--muted)">(captcha demo)</span></label>';const s=e.querySelector("#mockcap");return{get:()=>s.checked?"mock-ok":null,reset:()=>{s.checked=!1}}}await K();let n=null;const t=window.turnstile.render(e,{sitekey:M.TURNSTILE_SITE_KEY,language:"vi",theme:"light",callback:s=>{n=s},"expired-callback":()=>{n=null},"error-callback":()=>{n=null}});return{get:()=>n,reset:()=>{n=null;try{window.turnstile.reset(t)}catch{}}}}function U(e,{title:n,sub:t,button:s="Xem \u0111\u01A1n c\u1EE7a t\xF4i",onDone:p}){e.innerHTML=`
    <form class="card gate-card" novalidate>
      <div class="gate-emoji"><img src="assets/img/logo-mark.svg" alt=""/></div>
      <h2>${n}</h2>
      <p class="muted">${t}</p>
      <label class="field"><span>S\u0110T Zalo \u0111\xE3 d\xF9ng khi \u0111\u1EB7t</span>
        <div class="input-icon">${d("phone")}<input class="input" name="phone" inputmode="tel" autocomplete="tel" placeholder="VD: 0912 345 678" maxlength="20" required /></div></label>
      <label class="field"><span>M\xE3 tra c\u1EE9u c\u1EE7a b\u1EA1n</span>
        <div class="input-icon">${d("lock")}<input class="input code-input" name="code" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="VD: AB12-CD34" maxlength="12" required /></div>
        <span class="small muted">M\xE3 hi\u1EC7n ngay khi b\u1EA1n g\u1EEDi form \u0111\u1EB7t h\xE0ng, ho\u1EB7c admin g\u1EEDi qua Zalo. Qu\xEAn m\xE3? Nh\u1EAFn admin nh\xE9.</span></label>
      <div class="captcha"><span class="muted small loading-cap">\u0110ang t\u1EA3i captcha\u2026</span></div>
      <button class="btn primary block" type="submit">${d("search")} ${a(s)}</button>
      <div class="gate-msg"></div>
      <p class="hint">${d("shield")}<span>C\u1EA7n \u0111\xFAng c\u1EA3 S\u0110T v\xE0 m\xE3 tra c\u1EE9u ri\xEAng \u2013 ng\u01B0\u1EDDi kh\xE1c bi\u1EBFt S\u0110T c\u1EE7a b\u1EA1n c\u0169ng kh\xF4ng xem \u0111\u01B0\u1EE3c. S\u0110T kh\xF4ng hi\u1EC3n th\u1ECB cho ng\u01B0\u1EDDi kh\xE1c.</span></p>
    </form>`;const l=e.querySelector("form");l.code.addEventListener("input",()=>{const r=l.code.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,8);l.code.value=r.length>4?`${r.slice(0,4)}-${r.slice(4)}`:r});const u=e.querySelector(".captcha");let c=null;P(u).then(r=>{c=r,u.querySelector(".loading-cap")?.remove()}).catch(r=>{u.innerHTML=`<span class="muted small">\u{1F972} ${a(r.message)}</span>`}),l.addEventListener("submit",r=>{r.preventDefault();const i=l.phone.value;if(!L(i))return $("S\u0110T ch\u01B0a \u0111\xFAng \u0111\u1ECBnh d\u1EA1ng (10\u201311 s\u1ED1).","err");const h=l.code.value.trim().toUpperCase();if(h.replace(/[^A-Z0-9]/g,"").length!==8)return $("M\xE3 tra c\u1EE9u g\u1ED3m 8 k\xFD t\u1EF1, d\u1EA1ng ABCD-EFGH.","err");const m=c?.get();if(!m)return $("B\u1EA1n x\xE1c nh\u1EADn captcha gi\xFAp m\xECnh nh\xE9 \u{1F33F}","warn");x(l.querySelector("button[type=submit]"),async()=>{try{const o=await b("session",{phone:i,code:h,captchaToken:m});p(T(o))}catch(o){e.querySelector(".gate-msg").innerHTML=`<div class="notice peach mt">\u{1F512} ${a(o.message)}</div>`}finally{c?.reset()}})})}function V(e,n){const t=document.createElement("div");return t.className="session-bar",t.innerHTML=`<span>${d("phone")} \u0110ang xem b\u1EB1ng S\u0110T <b>${a(C(e.phone||""))}</b></span>
    <button type="button" class="btn sm ghost">${d("logout")} \u0110\u1ED5i S\u0110T</button>`,t.querySelector("button").addEventListener("click",()=>{S(),n?.()}),t}async function Z(e,n){const t=_(),s=n?t?.products?.find(p=>p.slug===n):null;E(e,{back:n?`#/product/${n}`:"#/",backLabel:s?s.name:n?"\u0110\u1EE3t merch":"Trang ch\u1EE7",title:`${d("package")} \u0110\u01A1n c\u1EE7a t\xF4i`,sub:`${s?`\u0110\u1EE3t <b>${a(s.name)}</b> \xB7 `:""}Th\xF4ng tin nh\u1EADn h\xE0ng (s\u1EEDa \u0111\u01B0\u1EE3c khi \u0111\u01A1n ch\u01B0a \u0111\xF3ng g\xF3i) v\xE0 m\xE3 v\u1EADn \u0111\u01A1n.`,mode:"auto",slug:n})}const R=e=>Z(e,null);function E(e,{back:n,backLabel:t,title:s,sub:p,mode:l,slug:u}){e.innerHTML=`
    <a class="back" href="${n}">${d("back")} ${a(t)}</a>
    <div class="page-head"><h1>${s}</h1><p class="muted">${p}</p></div>
    <div id="sbar"></div>
    <div id="result"></div>`;const c=e.querySelector("#result"),r=()=>E(e,{back:n,backLabel:t,title:s,sub:p,mode:l,slug:u}),i=async m=>{e.querySelector("#sbar").replaceChildren(V(m,r)),c.innerHTML=B();try{const o=await b("lookup",{token:m.token,slug:u});T({token:o.token||m.token}),O(c,{token:o.token||m.token,orders:o.orders||[],phone:m.phone},{slug:u,mode:l})}catch(o){if(/hết hạn/.test(o.message))return S(),r();c.innerHTML=`<div class="notice peach">\u{1F512} ${a(o.message)}</div>`}},h=_();if(h)return i(h);U(c,{title:"Xem \u0111\u01A1n c\u1EE7a b\u1EA1n",sub:"Nh\u1EADp S\u0110T Zalo b\u1EA1n d\xF9ng khi \u0111\u1EB7t + m\xE3 tra c\u1EE9u c\u1EE7a b\u1EA1n.",button:"Tra c\u1EE9u",onDone:i})}function O(e,n,{slug:t,mode:s="address",heading:p=""}){l();function l(){if(!n.orders.length){e.innerHTML=`<div class="card">${A("\u{1F50D}","Kh\xF4ng t\xECm th\u1EA5y \u0111\u01A1n n\xE0o",`Ki\u1EC3m tra l\u1EA1i S\u0110T <b>${a(C(n.phone))}</b> \u2013 d\xF9ng \u0111\xFAng s\u1ED1 b\u1EA1n \u0111i\u1EC1n trong form \u0111\u1EB7t h\xE0ng nh\xE9.`)}</div>`;return}e.innerHTML=`${p}<div class="grid">${n.orders.map(c=>F(c,s)).join("")}</div>`,e.querySelectorAll("[data-edit]").forEach(c=>c.addEventListener("click",()=>u(c.dataset.edit))),e.querySelectorAll("[data-copy]").forEach(c=>c.addEventListener("click",()=>G(c.dataset.copy)))}function u(c){const r=n.orders.find(m=>m.id===c),i=e.querySelector(`[data-addr="${c}"]`);i.innerHTML=`
      <h4>${d("edit")} C\u1EADp nh\u1EADt th\xF4ng tin nh\u1EADn h\xE0ng</h4>
      <form data-form>
        <div class="form-grid">
          <label class="field"><span>T\xEAn ng\u01B0\u1EDDi nh\u1EADn</span><input class="input" name="receiver_name" maxlength="100" required value="${a(r.receiver_name)}"/></label>
          <label class="field"><span>S\u0110T ng\u01B0\u1EDDi nh\u1EADn</span><input class="input" name="receiver_phone" inputmode="tel" maxlength="20" required value="${a(r.receiver_phone)}"/></label>
        </div>
        <label class="field"><span>\u0110\u1ECBa ch\u1EC9 (ghi \u0111\u1EE7 s\u1ED1 nh\xE0, \u0111\u01B0\u1EDDng, ph\u01B0\u1EDDng/x\xE3, t\u1EC9nh/th\xE0nh theo \u0111\u1ECBa ch\u1EC9 m\u1EDBi)</span>
          <textarea class="input" name="address" maxlength="500" required>${a(r.address)}</textarea></label>
        <label class="field"><span>Ghi ch\xFA nh\u1EADn h\xE0ng (kh\xF4ng b\u1EAFt bu\u1ED9c)</span>
          <input class="input" name="customer_note" maxlength="500" value="${a(r.customer_note)}" placeholder="VD: giao gi\u1EDD h\xE0nh ch\xEDnh, g\u1ECDi tr\u01B0\u1EDBc khi giao\u2026"/></label>
        <div class="row"><button class="btn primary" type="submit">${d("check")} L\u01B0u</button><button class="btn ghost" type="button" data-cancel>Hu\u1EF7</button></div>
      </form>`,i.querySelector("[data-cancel]").addEventListener("click",l);const h=i.querySelector("[data-form]");h.addEventListener("submit",async m=>{m.preventDefault();const o=Object.fromEntries(new FormData(h));if(o.address.trim().length<10)return $("\u0110\u1ECBa ch\u1EC9 h\u01A1i ng\u1EAFn, ghi \u0111\u1EE7 ph\u01B0\u1EDDng & t\u1EC9nh/th\xE0nh gi\xFAp m\xECnh nh\xE9.","warn");if(!L(o.receiver_phone))return $("S\u0110T ng\u01B0\u1EDDi nh\u1EADn ch\u01B0a \u0111\xFAng.","warn");await x(h.querySelector("button[type=submit]"),async()=>{try{const v=await b("update",{token:n.token,orderId:c,fields:o,slug:t});n.orders=v.orders||n.orders,l(),$("\u0110\xE3 l\u01B0u \u0111\u1ECBa ch\u1EC9 m\u1EDBi \u{1F49A}")}catch(v){$(v.message,"err",5e3)}})})}}function F(e,n){const t=e.money_suffix,s=e.breakdown||null,p=I(e.payment_deadline),l=e.tracking_code?`<div class="row"><span class="tracking-code">${a(e.tracking_code)}</span>
        <button class="icon-btn" data-copy="${a(e.tracking_code)}" title="Sao ch\xE9p">${d("copy")}</button>
        ${q(e.carrier,e.tracking_code)?`<a class="btn sm" target="_blank" rel="noopener" href="${a(q(e.carrier,e.tracking_code))}">${d("external")} Theo d\xF5i ${a(w(e.carrier))}</a>`:e.carrier?`<span class="chip">${a(w(e.carrier))}</span>`:""}
      </div>`:'<p class="muted" style="margin:0">Ch\u01B0a c\xF3 m\xE3 v\u1EADn \u0111\u01A1n \u2013 admin s\u1EBD c\u1EADp nh\u1EADt khi g\u1EEDi h\xE0ng nha \u{1F331}</p>',u=e.shipment?`
    <div class="small mt">
      ${d("layers")} G\u1EEDi chung ki\u1EC7n <b>${a(e.shipment.code)}</b> ${k(D,e.shipment.status)}
      ${e.shipment.shipped_at?`<span class="muted">\xB7 g\u1EEDi ${y(e.shipment.shipped_at,!1)}</span>`:""}
      <div class="chips" style="margin-top:6px">
        ${(e.shipment.members||[]).map(i=>`<span class="chip">${i.is_mine?"\u2B50":"\u{1F4E6}"} ${a(i.product_name)} #${i.no}: ${(i.items||[]).map(h=>`${a(h.name)}\xD7${h.qty}`).join(", ")||"\u2014"}</span>`).join("")}
      </div>
    </div>`:"",c=`<div class="order-section"><h4>${d("truck")} V\u1EADn chuy\u1EC3n ${k(N,e.status)}</h4>${l}${u}</div>`,r=`
    <div class="order-section" data-addr="${e.id}">
      <h4>${d("pin")} Th\xF4ng tin nh\u1EADn h\xE0ng
        ${e.address_updated_at?`<span class="badge sky">\u270F\uFE0F b\u1EA1n s\u1EEDa l\xFAc ${y(e.address_updated_at)}</span>`:""}</h4>
      <dl class="kv">
        <dt>Ng\u01B0\u1EDDi nh\u1EADn</dt><dd>${a(e.receiver_name)||"\u2014"}</dd>
        <dt>S\u0110T</dt><dd>${a(e.receiver_phone)||"\u2014"}</dd>
        <dt>\u0110\u1ECBa ch\u1EC9</dt><dd>${a(e.address)||"\u2014"}</dd>
        ${e.customer_note?`<dt>Ghi ch\xFA</dt><dd>${a(e.customer_note)}</dd>`:""}
      </dl>
      <div class="row mt">
        ${e.locked?`<span class="badge gray">${d("lock")} \u0110\xE3 kho\xE1 ch\u1EC9nh s\u1EEDa</span><span class="muted small">\u0110\u01A1n \u0111\xE3 \u0111\xF3ng g\xF3i/g\u1EEDi ho\u1EB7c \u0111\xE3 h\u1EBFt h\u1EA1n s\u1EEDa. C\u1EA7n \u0111\u1ED5i g\u1EA5p? Nh\u1EAFn admin nh\xE9.</span>`:`<button class="btn sm primary" data-edit="${e.id}">${d("edit")} S\u1EEDa \u0111\u1ECBa ch\u1EC9</button>`}
      </div>
    </div>`;return`
    <article class="card order-card">
      <div class="order-head">
        <div class="product-emoji">${a(e.cover_emoji||"\u{1F33F}")}</div>
        <div style="flex:1;min-width:0">
          <h3 style="margin:0">${a(e.product_name)} <span class="muted">#${e.no}</span></h3>
          <span class="muted small">${a(e.zalo_name||"")}</span>
        </div>
        ${k(j,e.payment_status)}
      </div>
      <div class="order-section">
        <h4>${d("gift")} S\u1EA3n ph\u1EA9m</h4>
        ${(e.items||[]).map(i=>`<div class="item-line"><span>${a(i.name)} \xD7 <b>${i.qty}</b> <span class="muted small">(${g(i.unit_price,t)})</span></span><span>${g(i.qty*i.unit_price,t)}</span></div>`).join("")||'<span class="muted">\u2014</span>'}
        ${s?`
          <div class="item-line sub"><span>Ti\u1EC1n h\xE0ng</span><span>${g(s.goods,t)}</span></div>
          ${(s.fees||[]).map(i=>`<div class="item-line sub"><span>\uFF0B ${a(i.name)}</span><span>${g(i.amount,t)}</span></div>`).join("")}
          ${Number(s.adjustment)?`<div class="item-line sub"><span>\u0110i\u1EC1u ch\u1EC9nh</span><span>${Number(s.adjustment)>0?"+":""}${g(s.adjustment,t)}</span></div>`:""}`:""}
        <div class="total-line"><span>T\u1ED5ng c\u1ED9ng</span><span>${g(e.total,t)}</span></div>
        ${e.payment_status==="partial"&&Number(e.missing_amount)?`
          <div class="missing-box">\u{1F317} B\u1EA1n c\xF2n thi\u1EBFu <b>${g(e.missing_amount,t)}</b>${e.missing_note?` \u2013 ${a(e.missing_note)}`:""}. Chuy\u1EC3n th\xEAm gi\xFAp m\xECnh nh\xE9!</div>`:""}
        ${e.payment_status!=="paid"&&p?`<div class="deadline ${p.tone}">${d("clock")} H\u1EA1n CK: <b>${a(y(e.payment_deadline))}</b> \xB7 ${a(p.text)}</div>`:""}
      </div>
      ${n==="tracking"||n==="auto"&&(e.tracking_code||["shipped","delivered"].includes(e.status))?c+r:r+c}
    </article>`}export{P as mountCaptcha,O as mountOrders,F as orderCard,U as phoneGate,Z as renderLookup,R as renderTracking,V as sessionBar};
