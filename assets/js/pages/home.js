import{customerApi as f,getCustSession as g,setCustSession as y,clearCustSession as b}from"../api.js";import{esc as t,icon as s,money as $,emptyHtml as p,loadingHtml as k,deadlineInfo as x,strip as v}from"../ui.js";import{phoneGate as L,sessionBar as S}from"./customer.js";async function F(e){e.innerHTML=`
    <section class="hero hero-home">
      <div class="hero-text">
        <h1><span class="hero-kicker">Welcome to</span> Little Merch Lab <svg class="cute-star" viewBox="0 0 64 64" aria-hidden="true">
          <path d="M32 5c2.2 0 3.6 1.6 4.6 4l4.3 10.2 11 1c2.7.3 4.3 1.6 4.9 3.4.6 1.9-.1 3.8-2.1 5.6l-8.4 7.3 2.6 10.8c.6 2.7.1 4.6-1.5 5.8s-3.7 1.1-6-.3L32 47.1l-9.4 5.7c-2.3 1.4-4.4 1.5-6 .3s-2.1-3.1-1.5-5.8l2.6-10.8-8.4-7.3c-2-1.8-2.7-3.7-2.1-5.6.6-1.8 2.2-3.1 4.9-3.4l11-1L27.4 9c1-2.4 2.4-4 4.6-4z" fill="#FFE08A" stroke="#E9B949" stroke-width="2.5" stroke-linejoin="round"/>
          <circle cx="25.5" cy="30" r="2.6" fill="#3A2E1F"/><circle cx="38.5" cy="30" r="2.6" fill="#3A2E1F"/>
          <circle cx="26.4" cy="29" r=".9" fill="#fff"/><circle cx="39.4" cy="29" r=".9" fill="#fff"/>
          <path d="M28.5 35.5q3.5 3 7 0" fill="none" stroke="#3A2E1F" stroke-width="2.2" stroke-linecap="round"/>
          <ellipse cx="20.5" cy="35" rx="3.4" ry="2.2" fill="#FFB3C6" opacity=".85"/><ellipse cx="43.5" cy="35" rx="3.4" ry="2.2" fill="#FFB3C6" opacity=".85"/>
          <path d="M53 6l1.3 3.2L57.5 10l-3.2 1.3L53 14.5l-1.3-3.2L48.5 10l3.2-1.2z" fill="#B5D67B"/>
          <circle cx="9" cy="12" r="2" fill="#FFC9D6"/></svg></h1>
        <p>Nh\u1EADp S\u0110T Zalo b\u1EA1n d\xF9ng khi \u0111\u1EB7t v\xE0 m\xE3 tra c\u1EE9u ri\xEAng \u0111\u1EC3 xem c\xE1c \u0111\u1EE3t merch c\u1EE7a b\u1EA1n, danh s\xE1ch thu ti\u1EC1n, th\xF4ng tin nh\u1EADn h\xE0ng v\xE0 m\xE3 v\u1EADn \u0111\u01A1n.</p>
      </div>
      <img class="hero-logo" src="assets/img/logo-mark.svg" alt="Little Merch Lab"/>
    </section>
    <div id="sbar"></div>
    <div id="box"></div>`;const c=e.querySelector("#box"),i=()=>F(e),a=r=>{e.querySelector("#sbar").replaceChildren(S(r,i));const n=r.products||[];if(!n.length){c.innerHTML=`<div class="card">${p("\u{1F331}","Ch\u01B0a th\u1EA5y \u0111\u01A1n n\xE0o","S\u0110T n\xE0y ch\u01B0a c\xF3 \u0111\u01A1n trong \u0111\u1EE3t merch \u0111ang m\u1EDF.")}</div>`;return}c.innerHTML=`
      <div class="row between mb"><h2 style="margin:0">${s("gift")} \u0110\u1EE3t merch c\u1EE7a b\u1EA1n</h2>
        <a class="btn sm" href="#/lookup">${s("package")} \u0110\u01A1n c\u1EE7a t\xF4i</a></div>
      ${n.length>1?`<div class="toolbar"><div class="input-icon search">${s("search")}<input class="input" id="pq" placeholder="T\xECm \u0111\u1EE3t merch / s\u1EA3n ph\u1EA9m"/></div></div>`:""}
      <div class="grid cols-3" id="plist">${n.map(q).join("")}</div>`,c.querySelector("#pq")?.addEventListener("input",u=>{const l=v(u.target.value);let d=0;c.querySelectorAll("#plist .product-card").forEach(h=>{const m=!l||h.dataset.search.includes(l);h.hidden=!m,d+=m}),c.querySelector("#noRes")?.remove(),d||c.querySelector("#plist").insertAdjacentHTML("beforeend",`<div class="card" id="noRes">${p("\u{1F50D}","Kh\xF4ng t\xECm th\u1EA5y \u0111\u1EE3t n\xE0o")}</div>`)})},o=g();if(!o){L(c,{title:"Xem \u0111\u1EE3t merch c\u1EE7a b\u1EA1n",sub:"Nh\u1EADp S\u0110T Zalo \u0111\xE3 d\xF9ng khi \u0111\u1EB7t + m\xE3 tra c\u1EE9u c\u1EE7a b\u1EA1n.",button:"Xem \u0111\u1EE3t c\u1EE7a t\xF4i",onDone:a});return}c.innerHTML=k();try{const r=await f("session",{token:o.token});a(y(r))}catch{b(),i()}}function q(e){const c=x(e.payment_deadline);return`
    <article class="card product-card" data-search="${t(v([e.name,e.description,...(e.items||[]).map(i=>i.name)].join(" ")))}">
      <div class="pc-head">
        <div class="product-emoji">${e.cover_image?`<img src="${t(e.cover_image)}" alt="" loading="lazy"/>`:t(e.cover_emoji||"\u{1F33F}")}</div>
        <div class="pc-title"><h3>${t(e.name)}</h3>
          <div class="pc-meta"><span class="badge mint">\u2B50 ${Number(e.my_orders||0)} \u0111\u01A1n c\u1EE7a b\u1EA1n</span></div></div>
      </div>
      ${e.description?`<p class="pc-desc">${t(e.description)}</p>`:""}
      <div class="chips">
        ${(e.items||[]).map(i=>`<span class="chip price">${i.kind==="fee"?"\uFF0B":s("tag","tag-ic")} ${t(i.name)} <b>${$(i.unit_price,e.money_suffix)}</b></span>`).join("")}
      </div>
      ${c?`<div class="deadline ${c.tone}">${s("clock")} H\u1EA1n CK: ${t(c.text)}</div>`:""}
      <div class="pc-actions">
        <a class="btn sm primary" href="#/product/${t(e.slug)}">${s("list")} Xem \u0111\u1EE3t & thu ti\u1EC1n</a>
      </div>
    </article>`}export{F as renderHome};
