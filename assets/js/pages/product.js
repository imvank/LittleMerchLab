import{customerApi as L,getCustSession as w,setCustSession as C,clearCustSession as z}from"../api.js";import{esc as i,icon as c,money as h,badge as j,PAY as E,strip as T,debounce as B,emptyHtml as I,loadingHtml as P,openModal as A,sanitizeHtml as D,textToHtml as N,deadlineInfo as O,fmtDate as Q,formulaText as R}from"../ui.js";import{phoneGate as X,sessionBar as S,mountOrders as Z}from"./customer.js";async function G(s,v){const g=()=>G(s,v),r=w();if(!r){s.innerHTML=`<a class="back" href="#/">${c("back")} Trang ch\u1EE7</a><div id="box"></div>`,X(s.querySelector("#box"),{title:"Nh\u1EADp S\u0110T \u0111\u1EC3 xem \u0111\u1EE3t merch n\xE0y",sub:"Ch\u1EC9 kh\xE1ch \u0111\xE3 \u0111\u1EB7t trong \u0111\u1EE3t n\xE0y m\u1EDBi xem \u0111\u01B0\u1EE3c th\xF4ng tin & danh s\xE1ch thu ti\u1EC1n.",button:"Xem \u0111\u1EE3t",onDone:g});return}s.innerHTML=P();let d;try{d=await L("product",{slug:v,token:r.token}),C({token:d.token||r.token})}catch(t){if(/hết hạn/.test(t.message))return z(),g();s.innerHTML=`<a class="back" href="#/">${c("back")} Trang ch\u1EE7</a>
      <div class="card"><div class="notice peach">\u{1F512} ${i(t.message)}</div>
        <div class="row mt"><a class="btn primary" href="#/">${c("gift")} Xem \u0111\u1EE3t c\u1EE7a t\xF4i</a></div></div>`,s.querySelector(".card").prepend(S(r,g));return}const n=d.product,u=(n.items||[]).filter(t=>t.kind==="qty"),x=(n.items||[]).filter(t=>t.kind==="fee"),l=n.money_suffix,$=(n.product_images||[]).filter(t=>t?.url),y=n.payment_instruction_html?D(n.payment_instruction_html):n.payment_note?N(n.payment_note):"",H=d.rows||[];s.innerHTML=`
    <a class="back" href="#/">${c("back")} \u0110\u1EE3t merch c\u1EE7a b\u1EA1n</a>
    <div id="sbar"></div>
    <section class="hero" style="margin-bottom:16px">
      <h1>${i(n.name)}</h1>
      ${n.description?`<p class="pc-desc">${i(n.description)}</p>`:""}
      <div class="price-list">
        ${u.map(t=>`<div class="price-item"><div class="pi-name">${c("tag","tag-ic")} ${i(t.name)} <b>${h(t.unit_price,l)}</b></div>${t.description?`<div class="pi-desc">${i(t.description)}</div>`:""}</div>`).join("")}
        ${x.map(t=>`<div class="price-item fee"><div class="pi-name">\uFF0B ${i(t.name)} <b>${h(t.unit_price,l)}</b> / \u0111\u01A1n</div><div class="pi-desc">${i(t.description||"C\u1ED9ng 1 l\u1EA7n cho m\u1ED7i \u0111\u01A1n c\xF3 mua")}</div></div>`).join("")}
      </div>
      <div class="row mt">
        <button type="button" class="btn primary" id="goMine">${c("package")} \u0110\u01A1n c\u1EE7a t\xF4i trong \u0111\u1EE3t n\xE0y</button>
      </div>
    </section>

    ${$.length?`
    <section class="gallery mb">
      ${$.map((t,a)=>`
        <figure class="g-item"><button type="button" class="g-img" data-zoom="${a}" aria-label="Ph\xF3ng to \u1EA3nh">
          <img src="${i(t.url)}" alt="${i(t.caption||n.name)}" loading="lazy"/></button>
          ${t.caption?`<figcaption>${i(t.caption)}</figcaption>`:""}</figure>`).join("")}
    </section>`:""}

    ${y||n.payment_qr_url||n.payment_deadline?`
    <div class="card mb pay-card">
      <div class="card-title">${c("coins")}<h3>H\u01B0\u1EDBng d\u1EABn chuy\u1EC3n kho\u1EA3n</h3></div>
      <div id="dl"></div>
      <div class="pay-grid ${n.payment_qr_url?"":"no-qr"}">
        ${y?`<div class="rich">${y}</div>`:"<div></div>"}
        ${n.payment_qr_url?`<button type="button" class="qr" id="qr" aria-label="Ph\xF3ng to m\xE3 QR"><img src="${i(n.payment_qr_url)}" alt="M\xE3 QR / th\xF4ng tin chuy\u1EC3n kho\u1EA3n"/><span class="small muted">B\u1EA5m \u0111\u1EC3 ph\xF3ng to</span></button>`:""}
      </div>
    </div>`:""}

    <section class="card" id="listCard">
      <div class="card-title">${c("list")}<h3>Danh s\xE1ch (thu ti\u1EC1n)</h3></div>
      <div id="listBox"></div>
    </section>
    <div id="mine" class="mt"></div>`,s.querySelector("#goMine").addEventListener("click",()=>s.querySelector("#mine").scrollIntoView({behavior:"smooth",block:"start"})),s.querySelector("#sbar").replaceChildren(S(r,()=>{location.hash="#/"}));const _=(t,a)=>A({title:`${c("image")} ${i(a||n.name)}`,body:`<img class="zoom-img" src="${i(t)}" alt="${i(a||"")}"/>`,wide:!0});s.querySelectorAll("[data-zoom]").forEach(t=>t.addEventListener("click",()=>{const a=$[+t.dataset.zoom];_(a.url,a.caption)})),s.querySelector("#qr")?.addEventListener("click",()=>_(n.payment_qr_url,"Th\xF4ng tin chuy\u1EC3n kho\u1EA3n"));const f=s.querySelector("#dl");if(f&&n.payment_deadline){const t=()=>{if(!f.isConnected)return clearInterval(a);const m=O(n.payment_deadline);f.innerHTML=m?`<div class="deadline big ${m.tone}">${c("clock")} H\u1EA1n ch\xF3t chuy\u1EC3n kho\u1EA3n: <b>${i(Q(n.payment_deadline))}</b> \xB7 <span>${i(m.text)}</span></div>`:""},a=setInterval(t,6e4);t()}const p=s.querySelector("#listBox");if(!d.list_enabled||!d.rows)p.innerHTML='<div class="notice cream">\u{1F512} Admin \u0111ang \u1EA9n danh s\xE1ch c\u1EE7a \u0111\u1EE3t n\xE0y \u2013 b\xEAn d\u01B0\u1EDBi l\xE0 \u0111\u01A1n c\u1EE7a b\u1EA1n.</div>';else{p.innerHTML=`
      <div class="toolbar"><div class="input-icon search">${c("search")}<input class="input" id="q" placeholder="T\xECm t\xEAn Zalo / 4 s\u1ED1 cu\u1ED1i S\u0110T"/></div>
        <label class="check small"><input type="checkbox" id="onlyMine"/> Ch\u1EC9 \u0111\u01A1n c\u1EE7a t\xF4i</label></div>
      <div class="table-wrap fit">
        <table class="data list-table">
          <thead><tr>
            <th>NO.</th><th>T\xEAn Zalo</th><th>S\u0110T</th>
            ${u.map(o=>`<th class="num">${i(o.name)}</th>`).join("")}
            <th class="num">Ti\u1EC1n h\xE0ng</th><th class="num">Ph\xED g\xF3i</th><th class="num">T\u1ED5ng</th><th>Tr\u1EA1ng th\xE1i</th>
          </tr></thead>
          <tbody id="tb"></tbody>
        </table>
      </div>
      <p class="hint">${c("shield")}<span>S\u0110T ng\u01B0\u1EDDi kh\xE1c \u0111\xE3 \u0111\u01B0\u1EE3c che. D\xF2ng \u2B50 l\xE0 \u0111\u01A1n c\u1EE7a b\u1EA1n.</span></p>`;const t=p.querySelector("#tb"),a={q:"",mine:!1},m=()=>{const o=T(a.q),q=H.filter(e=>(!a.mine||e.is_mine)&&(!o||T(e.name).includes(o)||String(e.phone).includes(o)));t.innerHTML=q.length?q.map(e=>{const b=e.breakdown||{goods:e.total,fee_total:0,fees:[]};return`
        <tr class="${e.is_mine?"mine":""}">
          <td>${e.is_mine?"\u2B50 ":""}${e.no??""}</td>
          <td><b>${i(e.name)}</b></td>
          <td class="nowrap">${i(e.phone)}</td>
          ${u.map(M=>`<td class="num">${Number(e.q?.[M.code]||0)||""}</td>`).join("")}
          <td class="num">${h(b.goods,l)}</td>
          <td class="num">${b.fee_total?"+"+h(b.fee_total,l):"\u2014"}</td>
          <td class="num" title="${i(R(b,l,e.total))}"><b>${h(e.total,l)}</b></td>
          <td><div class="badges">${j(E,e.payment_status)}${e.shipped?'<span class="badge mint">\u{1F69A} \u0110\xE3 g\u1EEDi</span>':""}</div>
            ${e.is_mine&&e.payment_status==="partial"&&Number(e.missing_amount)?`<div class="small missing-inline">Thi\u1EBFu ${h(e.missing_amount,l)}</div>`:""}</td>
        </tr>`}).join(""):`<tr><td colspan="${7+u.length}">${I("\u{1F50D}","Kh\xF4ng c\xF3 k\u1EBFt qu\u1EA3")}</td></tr>`};m(),p.querySelector("#q").addEventListener("input",B(o=>{a.q=o.target.value,m()},150)),p.querySelector("#onlyMine").addEventListener("change",o=>{a.mine=o.target.checked,m()})}const k={orders:d.orders||[],token:d.token||r.token,phone:r.phone};k.orders.length&&Z(s.querySelector("#mine"),k,{slug:v,mode:"auto",heading:`<h2 class="mb">${c("gift")} \u0110\u01A1n c\u1EE7a b\u1EA1n</h2>`})}export{G as renderProduct};
