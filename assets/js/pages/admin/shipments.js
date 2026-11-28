import{sb as b,must as f,selectAll as E}from"../../api.js";import{esc as d,icon as c,toast as g,loadingHtml as D,emptyHtml as T,badge as L,options as K,SHIP as M,PAY as N,strip as y,debounce as H,confirmDialog as F,carrierOptions as O,fmtDate as P,shipCopyBtn as Q}from"../../ui.js";import{requireAdmin as V,adminBar as I,bindAdminBar as U,openShipmentModal as A}from"./common.js";async function ee(v){const w=await V(v);if(!w)return;v.innerHTML=`${I(w,"shipments")}<div id="body">${D()}</div>`,U(v);const o=v.querySelector("#body");let _=[],p=[],m=[];const r={q:"",product:"",onlyFree:!0,sel:new Set,shipQ:""};async function x(){[_,p,m]=await Promise.all([f(b.from("products").select("id,name,slug,product_items(code,name,kind,sort)").order("sort")),E("orders","id,product_id,no,zalo_name,phone_raw,phone_norm,receiver_name,receiver_phone,receiver_phone_norm,address,quantities,status,payment_status,shipment_id,tracking_code",e=>e.neq("status","cancelled").order("product_id").order("no")),E("shipments","*",e=>e.order("created_at",{ascending:!1}))]);const a=new Map(_.map(e=>[e.id,e]));p.forEach(e=>{e.products=a.get(e.product_id)})}const q=a=>(a.products?.product_items||[]).filter(e=>e.kind==="qty"&&Number(a.quantities?.[e.code]||0)>0).sort((e,t)=>e.sort-t.sort).map(e=>`${e.name}\xD7${Number(a.quantities[e.code])}`).join(", "),z=a=>{const e=new Map;return a.forEach(t=>(t.products?.product_items||[]).filter(s=>s.kind==="qty").forEach(s=>{const i=Number(t.quantities?.[s.code]||0);i&&e.set(s.name,(e.get(s.name)||0)+i)})),[...e].map(([t,s])=>`${t} \xD7${s}`).join(" \xB7 ")||"\u2014"};function j(){o.innerHTML=`
      <div>
        <section class="card">
          <div class="card-title">${c("search")}<h2>T\xECm & g\u1ED9p \u0111\u01A1n</h2></div>
          <div class="toolbar">
            <div class="input-icon search">${c("search")}<input class="input" id="q" value="${d(r.q)}" placeholder="T\xEAn, S\u0110T, \u0111\u1ECBa ch\u1EC9, NO.\u2026"/></div>
            <select class="input" id="fp"><option value="">M\u1ECDi \u0111\u1EE3t</option>${_.map(e=>`<option value="${e.id}" ${e.id===r.product?"selected":""}>${d(e.name)}</option>`).join("")}</select>
          </div>
          <div class="toolbar">
            <label class="check small"><input type="checkbox" id="free" ${r.onlyFree?"checked":""}/> Ch\u1EC9 \u0111\u01A1n ch\u01B0a v\xE0o ki\u1EC7n</label>
            <span class="spacer"></span>
            <button class="btn sm" id="suggest">${c("sparkle")} G\u1EE3i \xFD g\u1ED9p theo S\u0110T</button>
            <button class="btn sm primary" id="merge" ${r.sel.size<1?"disabled":""}>${c("layers")} G\u1ED9p ${r.sel.size||""} \u0111\u01A1n</button>
          </div>
          <div class="table-wrap" style="max-height:520px">
            <table class="data"><thead><tr><th></th><th>\u0110\u01A1n</th><th>Kh\xE1ch / Ng\u01B0\u1EDDi nh\u1EADn</th><th>SP</th><th>TT</th></tr></thead>
            <tbody id="otb"></tbody></table>
          </div>
          <div id="sug"></div>
        </section>

      </div>

      <section class="mt">
        <div class="row between mb">
          <h2 style="margin:0">${c("layers")} Ki\u1EC7n g\u1EEDi chung (${m.length})</h2>
          <div class="input-icon search-wide">${c("search")}<input class="input" id="sq" value="${d(r.shipQ)}" placeholder="T\xECm ki\u1EC7n, ng\u01B0\u1EDDi nh\u1EADn, m\xE3 v\u1EADn \u0111\u01A1n"/></div>
        </div>
        <div class="grid cols-2" id="slist"></div>
      </section>`;const a=e=>o.querySelector(e);$(),S(),a("#q").addEventListener("input",H(e=>{r.q=e.target.value,$()},150)),a("#fp").addEventListener("change",e=>{r.product=e.target.value,$()}),a("#free").addEventListener("change",e=>{r.onlyFree=e.target.checked,$()}),a("#sq").addEventListener("input",H(e=>{r.shipQ=e.target.value,S()},150)),a("#otb").addEventListener("change",e=>{if(!e.target.matches("[data-sel]"))return;const t=e.target.closest("tr").dataset.id;e.target.checked?r.sel.add(t):r.sel.delete(t),e.target.closest("tr").classList.toggle("selected",e.target.checked),G()}),a("#merge").addEventListener("click",()=>{A({orders:p.filter(e=>r.sel.has(e.id)),onDone:async()=>{r.sel.clear(),await u()}})}),a("#suggest").addEventListener("click",B)}function G(){const a=o.querySelector("#merge");a.disabled=r.sel.size<1,a.innerHTML=`${c("layers")} G\u1ED9p ${r.sel.size||""} \u0111\u01A1n`}function C(){const a=y(r.q),e=r.q.replace(/\D/g,"");return p.filter(t=>r.product&&t.product_id!==r.product||r.onlyFree&&t.shipment_id?!1:!a||e.length>=3&&((t.phone_norm||"").includes(e)||(t.receiver_phone_norm||"").includes(e))||e&&String(t.no)===e?!0:[t.zalo_name,t.receiver_name,t.address,t.products?.name].some(s=>y(s).includes(a)))}function $(){const a=C().slice(0,500),e=t=>m.find(s=>s.id===t)?.code;o.querySelector("#otb").innerHTML=a.length?a.map(t=>`
      <tr data-id="${t.id}" class="${r.sel.has(t.id)?"selected":""}">
        <td><input type="checkbox" data-sel ${r.sel.has(t.id)?"checked":""}/></td>
        <td class="nowrap"><b>${d(t.products?.name||"")}</b> #${t.no}${t.shipment_id?`<div><span class="badge cream">${d(e(t.shipment_id)||"ki\u1EC7n")}</span></div>`:""}</td>
        <td class="addr"><b>${d(t.zalo_name)}</b> \xB7 ${d(t.phone_raw)}<div class="cell-clip">${d(t.receiver_name)} \u2013 ${d(t.address)}</div></td>
        <td class="small">${d(q(t))}</td>
        <td>${L(N,t.payment_status)}</td>
      </tr>`).join(""):`<tr><td colspan="5">${T("\u{1F50D}","Kh\xF4ng c\xF3 \u0111\u01A1n ph\xF9 h\u1EE3p")}</td></tr>`}function B(){const a=p.filter(i=>!i.shipment_id&&!["shipped","delivered"].includes(i.status)),e=new Map;a.forEach(i=>{const n=i.phone_norm||i.receiver_phone_norm;n&&(e.has(n)||e.set(n,[]),e.get(n).push(i))});const t=[...e.entries()].filter(([,i])=>i.length>1),s=o.querySelector("#sug");s.innerHTML=`<h3 class="mt">${c("sparkle")} G\u1EE3i \xFD (${t.length} nh\xF3m c\xF9ng S\u0110T c\xF3 \u2265 2 \u0111\u01A1n)</h3>`+(t.length?t.map(([i,n],l)=>`
      <div class="card pad-sm mt" style="box-shadow:none">
        <div class="row between"><b>\u{1F4F1} ${d(i)} \xB7 ${d(n[0].zalo_name||"")}</b><button class="btn sm primary" data-g="${l}">${c("layers")} G\u1ED9p ${n.length} \u0111\u01A1n</button></div>
        <div class="chips mt">${n.map(h=>`<span class="chip">\u{1F4E6} ${d(h.products?.name)} #${h.no}: ${d(q(h))}</span>`).join("")}</div>
      </div>`).join(""):'<p class="muted">Kh\xF4ng c\xF3 nh\xF3m n\xE0o c\u1EA7n g\u1ED9p \u{1F33F}</p>'),s.querySelectorAll("[data-g]").forEach(i=>i.addEventListener("click",()=>{A({orders:t[+i.dataset.g][1],onDone:u})}))}function S(){const a=y(r.shipQ),e=m.filter(s=>!a||[s.code,s.receiver_name,s.receiver_phone,s.address,s.tracking_code].some(i=>y(i).includes(a))),t=o.querySelector("#slist");t.innerHTML=e.length?e.map(s=>{const i=p.filter(n=>n.shipment_id===s.id);return`
      <article class="card ship-card" data-sid="${s.id}">
        <div class="row between">
          <h3 style="margin:0">\u{1F381} ${d(s.code)}</h3>
          ${L(M,s.status)}
        </div>
        <div class="small"><b>${d(s.receiver_name)}</b> \xB7 ${d(s.receiver_phone)}<br/><span class="muted">${d(s.address)}</span></div>
        ${Q(s.receiver_name,s.receiver_phone,s.address)}
        <div class="members">${i.map(n=>`<span class="member">${d(n.products?.name)} #${n.no} \xB7 ${d(n.zalo_name)}<button data-rm="${n.id}" title="G\u1EE1 kh\u1ECFi ki\u1EC7n">${c("x")}</button></span>`).join("")||'<span class="muted small">Ki\u1EC7n tr\u1ED1ng</span>'}</div>
        <div class="small mb">\u{1F4E6} <b>${d(z(i))}</b></div>
        <div class="form-grid" style="gap:0 8px">
          <label class="field"><span>\u0110VVC</span><select class="input sm" data-f="carrier">${O(s.carrier)}</select></label>
          <label class="field"><span>M\xE3 v\u1EADn \u0111\u01A1n</span><input class="input sm" data-f="tracking_code" value="${d(s.tracking_code)}"/></label>
          <label class="field"><span>Tr\u1EA1ng th\xE1i</span><select class="input sm" data-f="status">${K(M,s.status)}</select></label>
        </div>
        <div class="row">
          ${s.shipped_at?`<span class="muted small">G\u1EEDi: ${P(s.shipped_at)}</span>`:""}
          <span class="spacer"></span>
          <button class="btn sm danger" data-delship>${c("trash")} Hu\u1EF7 ki\u1EC7n</button>
        </div>
      </article>`}).join(""):`<div class="card">${T("\u{1F4E6}","Ch\u01B0a c\xF3 ki\u1EC7n n\xE0o","Ch\u1ECDn \u0111\u01A1n \u1EDF tr\xEAn r\u1ED3i b\u1EA5m \u201CG\u1ED9p\u201D.")}</div>`,t.querySelectorAll("[data-sid]").forEach(s=>{const i=s.dataset.sid;s.querySelectorAll("[data-f]").forEach(n=>n.addEventListener("change",async()=>{const l={[n.dataset.f]:n.value.trim()||null};if(n.dataset.f==="status"&&!l.status)return;const h=m.find(k=>k.id===i);n.dataset.f==="tracking_code"&&l.tracking_code&&["preparing","packed"].includes(h.status)&&(l.status="shipped");try{await f(b.from("shipments").update(l).eq("id",i)),g("\u0110\xE3 l\u01B0u ki\u1EC7n \u{1F49A}","ok",1500),await u()}catch(k){g(k.message,"err",5e3)}})),s.querySelectorAll("[data-rm]").forEach(n=>n.addEventListener("click",async()=>{try{await f(b.from("orders").update({shipment_id:null}).eq("id",n.dataset.rm)),await u()}catch(l){g(l.message,"err")}})),s.querySelector("[data-delship]").addEventListener("click",async()=>{if(await F("Hu\u1EF7 ki\u1EC7n n\xE0y? C\xE1c \u0111\u01A1n b\xEAn trong s\u1EBD quay l\u1EA1i tr\u1EA1ng th\xE1i ch\u01B0a g\u1ED9p (kh\xF4ng xo\xE1 \u0111\u01A1n).",{danger:!0,okText:"Hu\u1EF7 ki\u1EC7n"}))try{await f(b.from("shipments").delete().eq("id",i)),g("\u0110\xE3 hu\u1EF7 ki\u1EC7n"),await u()}catch(n){g(n.message,"err")}})})}async function u(){await x(),j()}await u()}export{ee as renderAdminShipments};
