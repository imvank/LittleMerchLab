import{sb as f,selectAll as w,must as b}from"../../api.js";import{esc as n,icon as i,money as p,openModal as T,toast as y,withBusy as C,slugify as v,emptyHtml as k,emojiPicker as S,strip as _,debounce as x}from"../../ui.js";import{requireAdmin as E,adminBar as L,bindAdminBar as A}from"./common.js";async function N(l){const h=await E(l);if(!h)return;const[d,q]=await Promise.all([b(f.from("products").select("*, product_items(*)").order("sort").order("created_at",{ascending:!1})),w("orders","product_id,total,payment_status,status,shipment_id")]),g=e=>{const t=q.filter(s=>(!e||s.product_id===e)&&s.status!=="cancelled");return{n:t.length,paid:t.filter(s=>s.payment_status==="paid").length,revenue:t.filter(s=>s.payment_status==="paid").reduce((s,a)=>s+Number(a.total),0),expected:t.reduce((s,a)=>s+Number(a.total),0),unshipped:t.filter(s=>!["shipped","delivered"].includes(s.status)).length}},m=g(null);l.innerHTML=`
    ${L(h,"products")}
    <div class="grid kpis mb">
      <div class="kpi"><div class="k-label">${i("gift")} \u0110\u1EE3t merch</div><div class="k-val">${d.length}</div></div>
      <div class="kpi"><div class="k-label">${i("list")} T\u1ED5ng \u0111\u01A1n</div><div class="k-val">${m.n}</div></div>
      <div class="kpi mint"><div class="k-label">\u{1F49A} \u0110\xE3 CK</div><div class="k-val">${m.paid}/${m.n}</div></div>
      <div class="kpi cream"><div class="k-label">\u{1F4E6} Ch\u01B0a g\u1EEDi</div><div class="k-val">${m.unshipped}</div></div>
    </div>
    <div class="row between mb">
      <h2 style="margin:0">${i("gift")} S\u1EA3n ph\u1EA9m / \u0110\u1EE3t merch</h2>
      <div class="row">
        <div class="input-icon search">${i("search")}<input class="input" id="pq" placeholder="T\xECm \u0111\u1EE3t merch / s\u1EA3n ph\u1EA9m"/></div>
        <button class="btn primary" id="new">${i("plus")} T\u1EA1o \u0111\u1EE3t m\u1EDBi</button>
      </div>
    </div>
    <div class="grid cols-3" id="list">
      ${d.length?d.map(e=>{const t=g(e.id);return`
        <article class="card product-card" data-search="${n(_([e.name,e.slug,e.description,...(e.product_items||[]).map(s=>s.name)].join(" ")))}">
          <div class="pc-head">
            <div class="product-emoji">${e.product_images?.[0]?.url?`<img src="${n(e.product_images[0].url)}" alt="" loading="lazy"/>`:n(e.cover_emoji)}</div>
            <div class="pc-title">
              <h3>${n(e.name)}</h3>
              <div class="pc-meta">
                ${e.is_published?'<span class="badge mint">\u{1F33F} C\xF4ng khai</span>':'<span class="badge gray">\u{1F512} \u1EA8n</span>'}
                <span class="muted small">/${n(e.slug)}</span>
              </div>
            </div>
          </div>
          ${e.description?`<p class="pc-desc">${n(e.description)}</p>`:""}
          <div class="chips">
            ${(e.product_items||[]).sort((s,a)=>s.sort-a.sort).map(s=>`<span class="chip price">${s.kind==="fee"?"\uFF0B":i("tag","tag-ic")} ${n(s.name)} <b>${p(s.unit_price,e.money_suffix)}</b></span>`).join("")||'<span class="muted small">Ch\u01B0a c\xF3 gi\xE1</span>'}
          </div>
          <div class="small">
            <b>${t.n}</b> \u0111\u01A1n \xB7 \u{1F49A} ${t.paid} \u0111\xE3 CK \xB7 thu ${p(t.revenue,e.money_suffix)} / ${p(t.expected,e.money_suffix)}
          </div>
          <div class="pc-actions">
            <a class="btn sm primary" href="#/admin/product/${n(e.slug)}">${i("settings")} Qu\u1EA3n l\xFD</a>
            <a class="btn sm" href="#/product/${n(e.slug)}" target="_blank" rel="noopener">${i("external")} Trang kh\xE1ch</a>
          </div>
        </article>`}).join(""):`<div class="card">${k("\u{1F331}","Ch\u01B0a c\xF3 \u0111\u1EE3t n\xE0o","B\u1EA5m \u201CT\u1EA1o \u0111\u1EE3t m\u1EDBi\u201D r\u1ED3i import file (C\xE2u tr\u1EA3 l\u1EDDi).")}</div>`}
    </div>`,A(l),l.querySelector("#pq").addEventListener("input",x(e=>{const t=_(e.target.value);let s=0;l.querySelectorAll("#list .product-card").forEach(a=>{const o=!t||a.dataset.search.includes(t);a.hidden=!o,s+=o}),l.querySelector("#noRes")?.remove(),!s&&d.length&&l.querySelector("#list").insertAdjacentHTML("beforeend",`<div class="card" id="noRes">${k("\u{1F50D}","Kh\xF4ng t\xECm th\u1EA5y \u0111\u1EE3t n\xE0o")}</div>`)},120)),l.querySelector("#new").addEventListener("click",()=>{const e=T({title:`${i("plus")} T\u1EA1o \u0111\u1EE3t merch m\u1EDBi`,body:`
        <form id="pf">
          <label class="field"><span>T\xEAn \u0111\u1EE3t / s\u1EA3n ph\u1EA9m</span><input class="input" name="name" placeholder="VD: MERCH CH\xD4NG GAI" required/></label>
          <label class="field"><span>\u0110\u01B0\u1EDDng d\u1EABn (t\u1EF1 t\u1EA1o t\u1EEB t\xEAn \u2013 s\u1EEDa n\u1EBFu mu\u1ED1n)</span><input class="input" name="slug" placeholder="merch-chong-gai" pattern="[a-z0-9-]{2,60}"/>
            <span class="small muted" id="slugPrev"></span></label>
          <div class="field"><span>Emoji \u0111\u1EA1i di\u1EC7n <span class="muted small">(b\u1EA5m ch\u1ECDn ho\u1EB7c d\xE1n emoji b\u1EA5t k\u1EF3)</span></span><input class="input" name="cover_emoji" value="\u{1F33F}" maxlength="8"/></div>
        </form>`,footer:`<button class="btn" data-close>Hu\u1EF7</button><button class="btn primary" id="ok">${i("check")} T\u1EA1o</button>`}),t=e.el.querySelector("#pf");S(t.cover_emoji);let s=!1;const a=new Set(d.map(r=>r.slug)),o=r=>{let c=r,u=2;for(;a.has(c);)c=`${r}-${u++}`;return c},$=()=>{e.el.querySelector("#slugPrev").textContent=t.slug.value?`Link kh\xE1ch: \u2026#/product/${t.slug.value}`:""};t.slug.addEventListener("input",()=>{s=!!t.slug.value,$()}),t.name.addEventListener("input",()=>{s||(t.slug.value=o(v(t.name.value).slice(0,60))),$()}),e.el.querySelector("#ok").addEventListener("click",r=>C(r.currentTarget,async()=>{const c=t.name.value.trim(),u=s?v(t.slug.value):o(v(t.slug.value||c).slice(0,60));if(!c||!/^[a-z0-9-]{2,60}$/.test(u))return y("Nh\u1EADp t\xEAn v\xE0 slug h\u1EE3p l\u1EC7 nh\xE9","warn");try{await b(f.from("products").insert({name:c,slug:u,cover_emoji:t.cover_emoji.value||"\u{1F33F}"})),e.close(),location.hash=`#/admin/product/${u}`}catch(j){y(j.message,"err",5e3)}}))})}export{N as renderAdminHome};
