import{sb as N,rpc as W,must as j,selectAll as K,uploadImage as at}from"../../api.js";import{esc as b,icon as g,money as P,toast as S,withBusy as D,loadingHtml as st,emptyHtml as Z,options as A,PAY as R,STATUS as X,strip as B,slugify as H,debounce as nt,confirmDialog as O,copyText as V,codeMessage as it,fmtDate as Y,breakdown as ct,shipCopyBtn as lt,emojiPicker as rt,compressImage as dt}from"../../ui.js";import{requireAdmin as ot,adminBar as J,bindAdminBar as Q,openOrderModal as U,openShipmentModal as pt}from"./common.js";import{formTab as ut,packTab as mt}from"./form.js";import{readWorkbook as ht,sheetAoa as gt,findHeaderRow as bt,autoMap as vt,buildOrders as ft,BASE_FIELDS as yt,qtyItemName as tt,matchStatuses as $t,isPaidText as kt,exportFull as _t,exportImportTemplate as wt}from"../../lib/excel.js";const et="gm_admin_tab";async function Pt(f,q){const T=await ot(f);if(!T)return;const p={slug:q,product:null,items:[]};if(p.load=async()=>{const y=await j(N.from("products").select("*, product_items(*)").eq("slug",q).maybeSingle());return y?(p.product=y,p.items=(y.product_items||[]).sort((s,v)=>s.sort-v.sort||s.name.localeCompare(v.name)),!0):!1},!await p.load()){f.innerHTML=`${J(T,"products")}<div class="card">${Z("\u{1F343}","Kh\xF4ng t\xECm th\u1EA5y s\u1EA3n ph\u1EA9m",'<a href="#/admin">Quay l\u1EA1i</a>')}</div>`,Q(f);return}let e="orders";try{const y=JSON.parse(sessionStorage.getItem(et)||"null");y?.slug===q&&y.tab&&(e=y.tab)}catch{}const z=()=>{const y=p.product;f.querySelector("#phead").innerHTML=`
      <a class="back" href="#/admin">${g("back")} T\u1EA5t c\u1EA3 s\u1EA3n ph\u1EA9m</a>
      <div class="row">
        <div class="product-emoji">${y.product_images?.[0]?.url?`<img src="${b(y.product_images[0].url)}" alt=""/>`:b(y.cover_emoji)}</div>
        <div style="flex:1;min-width:220px"><h1 style="margin:0;overflow-wrap:anywhere">${b(y.name)}</h1>
          <span class="muted small">/${b(y.slug)} \xB7 ${y.is_published?"\u{1F33F} \u0111ang c\xF4ng khai":"\u{1F512} \u0111ang \u1EA9n"}</span></div>
        <div class="row">
          <button class="btn primary" id="xlsMain">${g("download")} Xu\u1EA5t file Excel (thu ti\u1EC1n)</button>
          <button class="btn" id="goImport">${g("upload")} Import</button>
          <a class="btn" href="#/product/${b(y.slug)}" target="_blank" rel="noopener">${g("external")} Trang kh\xE1ch</a>
        </div>
      </div>`,f.querySelector("#xlsMain").addEventListener("click",s=>D(s.currentTarget,async()=>{try{const v=await K("orders","*, shipments(code,tracking_code,carrier,status)",L=>L.eq("product_id",y.id).order("no"));await _t(y,p.items,v),S("\u0110\xE3 xu\u1EA5t file Excel \u{1F49A}")}catch(v){S(v.message,"err",5e3)}})),f.querySelector("#goImport").addEventListener("click",()=>_("import"))};let _=()=>{};f.innerHTML=`
    ${J(T,"products")}
    <div class="page-head" id="phead"></div>
    <div class="tabs" id="tabs">
      <button data-tab="form">${g("file")} Form \u0111\u1EB7t h\xE0ng</button>
      <button data-tab="orders">${g("list")} \u0110\u01A1n h\xE0ng</button>
      <button data-tab="pack">${g("package")} So\u1EA1n \u0111\u01A1n ship</button>
      <button data-tab="import">${g("upload")} Import Excel</button>
      <button data-tab="settings">${g("settings")} Gi\xE1 & c\u1EA5u h\xECnh</button>
    </div>
    <div id="tab"></div>`,Q(f),z();const w=f.querySelector("#tab"),C=async y=>{e=y;try{sessionStorage.setItem(et,JSON.stringify({slug:p.product.slug,tab:y}))}catch{}f.querySelectorAll("#tabs button").forEach(L=>L.classList.toggle("active",L.dataset.tab===y));const s=document.createElement("div");w.replaceChildren(s);const v={show:C,reloadProduct:async()=>{await p.load(),z()}};y==="orders"&&await St(s,p,v),y==="import"&&await qt(s,p,v),y==="settings"&&await Tt(s,p,v),y==="form"&&await ut(s,p,v),y==="pack"&&await mt(s,p,v)};_=C,f.querySelectorAll("#tabs button").forEach(y=>y.addEventListener("click",()=>C(y.dataset.tab))),await C(e)}async function St(f,q){f.innerHTML=st();const T=q.product,p=T.money_suffix,e=q.items.filter(t=>t.kind==="qty"),z=()=>K("orders","*, shipments(code,tracking_code,carrier,status)",t=>t.eq("product_id",T.id).order("no"));let _=await z(),w=new Map;const C=async()=>{const t=[...new Set(_.map(n=>n.phone_norm).filter(Boolean))];w=new Map;try{for(let n=0;n<t.length;n+=200)(await j(N.from("customer_codes").select("phone_norm,code").in("phone_norm",t.slice(n,n+200)))).forEach(c=>w.set(c.phone_norm,c.code))}catch{}};await C();let y=20;try{y=Number(localStorage.getItem("gm_page_size"))||20}catch{}const s={q:"",pay:"",status:"",item:"",trk:"",sort:{key:"no",dir:1},sel:new Set,page:1,size:y};f.innerHTML=`
    <div class="grid kpis mb" id="kpis"></div>
    <div class="toolbar">
      <div class="input-icon search">${g("search")}<input class="input" id="q" placeholder="T\xECm t\xEAn / S\u0110T kh\xE1ch ho\u1EB7c ng\u01B0\u1EDDi nh\u1EADn, \u0111\u1ECBa ch\u1EC9"/></div>
      <button class="btn sm primary" id="add">${g("plus")} Th\xEAm \u0111\u01A1n</button>
    </div>
    <div class="toolbar filters">
      <select class="input sm" id="fitem"><option value="">T\u1EA5t c\u1EA3 s\u1EA3n ph\u1EA9m</option>${e.map(t=>`<option value="${b(t.code)}">C\xF3 mua ${b(t.name)}</option>`).join("")}</select>
      <select class="input sm" id="fpay"><option value="">T\u1EA5t c\u1EA3 thanh to\xE1n</option>${A(R,"")}</select>
      <select class="input sm" id="fst"><option value="">T\u1EA5t c\u1EA3 tr\u1EA1ng th\xE1i</option>${A(X,"")}</select>
      <select class="input sm" id="ftrk"><option value="">M\xE3 v\u1EADn \u0111\u01A1n: t\u1EA5t c\u1EA3</option><option value="has">\u{1F69A} \u0110\xE3 c\xF3 MV\u0110</option><option value="none">\u23F3 Ch\u01B0a c\xF3 MV\u0110</option></select>
      <button class="btn sm ghost" id="fclr">\u21BA B\u1ECF l\u1ECDc</button>
    </div>
    <div class="bulkbar hidden" id="bulk">
      \u2705 \u0110\xE3 ch\u1ECDn <b id="nsel">0</b> \u0111\u01A1n
      <button class="btn sm" data-bulk-pay="paid">\u{1F49A} \u0110\xE3 CK</button>
      <button class="btn sm" data-bulk-pay="unpaid">\u{1F550} Ch\u01B0a CK</button>
      <select class="input sm" id="bst"><option value="">\u0110\u1ED5i tr\u1EA1ng th\xE1i\u2026</option>${A(X,"")}</select>
      <button class="btn sm primary" id="merge">${g("layers")} G\u1ED9p ki\u1EC7n</button>
      <button class="btn sm danger" id="delSel">${g("trash")} Xo\xE1 \u0111\u01A1n</button>
      <button class="btn sm ghost" id="clr">B\u1ECF ch\u1ECDn</button>
    </div>
    <div class="table-wrap fit">
      <table class="data orders-table">
        <colgroup><col class="c-sel"/><col class="c-stt"/><col class="c-cust"/><col class="c-items"/><col class="c-money"/><col class="c-status"/><col class="c-addr"/><col class="c-trk"/><col class="c-act"/></colgroup>
        <thead><tr>
          <th class="c-sel"><input type="checkbox" id="all" aria-label="Ch\u1ECDn t\u1EA5t c\u1EA3 trang n\xE0y"/></th>
          <th class="c-stt"><button class="th-sort" data-sort="no">STT</button></th>
          <th><button class="th-sort" data-sort="name">Kh\xE1ch</button></th>
          <th>S\u1EA3n ph\u1EA9m</th>
          <th class="num"><button class="th-sort" data-sort="total">Ti\u1EC1n</button></th>
          <th><button class="th-sort" data-sort="pay">Thanh to\xE1n</button> \xB7 <button class="th-sort" data-sort="status">Tr\u1EA1ng th\xE1i</button></th>
          <th>Ng\u01B0\u1EDDi nh\u1EADn / \u0110\u1ECBa ch\u1EC9</th>
          <th>V\u1EADn \u0111\u01A1n</th>
          <th class="c-act"></th>
        </tr></thead>
        <tbody id="tb"></tbody>
      </table>
    </div>
    <div class="pager" id="pager"></div>`;const v=t=>f.querySelector(t),L=t=>!!(t.tracking_code||t.shipments?.tracking_code),l={unpaid:0,partial:1,paid:2,refunded:3},h={new:0,confirmed:1,packed:2,shipped:3,delivered:4,cancelled:5},a=()=>{const t=B(s.q),n=s.q.replace(/\D/g,""),c=_.filter(o=>s.pay&&o.payment_status!==s.pay||s.status&&o.status!==s.status||s.item&&!(Number(o.quantities?.[s.item]||0)>0)||s.trk==="has"&&!L(o)||s.trk==="none"&&L(o)?!1:!t||n.length>=3&&((o.phone_norm||"").includes(n)||(o.receiver_phone_norm||"").includes(n))?!0:[o.zalo_name,o.receiver_name,o.address].some(M=>B(M).includes(t))),{key:u,dir:d}=s.sort,E=o=>u==="name"?B(o.zalo_name):u==="date"?o.submitted_at||o.created_at||"":u==="total"?Number(o.total):u==="pay"?l[o.payment_status]??9:u==="status"?h[o.status]??9:o.no??0;return c.sort((o,M)=>{const F=E(o),G=E(M);return(F<G?-1:F>G?1:(o.no??0)-(M.no??0))*d})},i=()=>{const t=_.filter(u=>u.status!=="cancelled"),n=t.filter(u=>u.payment_status==="paid"),c=t.filter(u=>u.payment_status==="partial");v("#kpis").innerHTML=`
      <div class="kpi"><div class="k-label">${g("list")} \u0110\u01A1n</div><div class="k-val">${t.length}</div></div>
      <div class="kpi mint"><div class="k-label">\u{1F49A} \u0110\xE3 CK</div><div class="k-val">${n.length}</div></div>
      <div class="kpi cream"><div class="k-label">${g("coins")} \u0110\xE3 thu / d\u1EF1 ki\u1EBFn</div><div class="k-val" style="font-size:1.1rem">${P(n.reduce((u,d)=>u+Number(d.total),0),p)} / ${P(t.reduce((u,d)=>u+Number(d.total),0),p)}</div></div>
      <div class="kpi cream"><div class="k-label">\u{1F317} CK thi\u1EBFu</div><div class="k-val">${c.length}${c.length?` <span class="small">(${P(c.reduce((u,d)=>u+Number(d.missing_amount||0),0),p)})</span>`:""}</div></div>
      <div class="kpi peach"><div class="k-label">\u270F\uFE0F Kh\xE1ch s\u1EEDa \u0110C</div><div class="k-val">${t.filter(u=>u.address_updated_at).length}</div></div>
      ${e.map(u=>`<div class="kpi"><div class="k-label">${g("tag","tag-ic")} ${b(u.name)}</div><div class="k-val">${t.reduce((d,E)=>d+Number(E.quantities?.[u.code]||0),0)}</div></div>`).join("")}`},r=(t,n)=>{const c=ct(q.items,t.quantities,t.adjustment),u=e.filter(d=>Number(t.quantities?.[d.code]||0)>0);return`
    <tr data-id="${t.id}" class="${s.sel.has(t.id)?"selected":""}">
      <td class="c-sel"><input type="checkbox" data-sel ${s.sel.has(t.id)?"checked":""} aria-label="Ch\u1ECDn \u0111\u01A1n ${t.no??""}"/></td>
      <td class="c-stt"><b>${n}</b></td>
      <td><div class="cell-main"><b>${b(t.zalo_name)}</b> <span class="no" title="M\xE3 \u0111\u01A1n (NO.)">#${t.no??""}</span></div>
        <div class="small muted nowrap">${b(t.phone_raw)}</div>
        ${w.get(t.phone_norm)?`<div class="code-chip"><span title="M\xE3 tra c\u1EE9u \u2013 g\u1EEDi cho kh\xE1ch qua Zalo">\u{1F511} ${b(w.get(t.phone_norm))}</span>
          <button type="button" class="icon-btn sm" data-copy-code="${b(w.get(t.phone_norm))}" title="Sao ch\xE9p m\xE3">${g("copy")}</button>
          <button type="button" class="icon-btn sm" data-copy-msg="${t.id}" title="Sao ch\xE9p tin nh\u1EAFn Zalo g\u1EEDi m\xE3">\u{1F4AC}</button>
          <button type="button" class="icon-btn sm" data-reset-code="${b(t.phone_norm)}" title="\u0110\u1ED5i m\xE3 m\u1EDBi (m\xE3 c\u0169 h\u1EBFt hi\u1EC7u l\u1EF1c)">\u21BB</button></div>`:""}
        ${t.submitted_at?`<div class="small muted nowrap">${b(Y(t.submitted_at))}</div>`:""}
        ${t.admin_note?`<div class="small">\u{1F4DD} ${b(t.admin_note)}</div>`:""}</td>
      <td>${u.map(d=>`<div class="small nowrap">${b(d.name)} \xD7 <b>${Number(t.quantities[d.code])}</b></div>`).join("")||'<span class="muted small">\u2014</span>'}</td>
      <td class="num"><b>${P(t.total,p)}</b>
        ${c.fee_total||c.adjustment?`<div class="small muted nowrap">${P(c.goods,p)}${c.fee_total?` + ${P(c.fee_total,p)} ph\xED`:""}${c.adjustment?` ${c.adjustment>0?"+":"\u2212"} ${P(Math.abs(c.adjustment),p)}`:""}</div>`:""}</td>
      <td class="c-status">
        <select class="input sm" data-pay aria-label="Thanh to\xE1n">${A(R,t.payment_status)}</select>
        ${t.payment_status==="partial"?`
          <div class="missing-edit">
            <label>Thi\u1EBFu <input class="input sm" data-miss type="number" min="0" step="0.5" inputmode="decimal" value="${t.missing_amount??""}" placeholder="0"/> ${b(p)}</label>
            <input class="input sm" data-mnote value="${b(t.missing_note)}" placeholder="Ghi ch\xFA cho kh\xE1ch"/>
          </div>`:""}
        <select class="input sm" data-st aria-label="Tr\u1EA1ng th\xE1i">${A(X,t.status)}</select></td>
      <td class="addr"><div><b>${b(t.receiver_name)}</b>${t.receiver_phone?` \xB7 ${b(t.receiver_phone)}`:""}</div>
        <div class="small">${b(t.address)}</div>
        ${t.address_updated_at?`<span class="badge sky" title="${b(Y(t.address_updated_at))}">\u270F\uFE0F kh\xE1ch s\u1EEDa</span>`:""}
        ${t.customer_note?`<div class="small">\u{1F4AC} ${b(t.customer_note)}</div>`:""}
        ${lt(t.receiver_name||t.zalo_name,t.receiver_phone||t.phone_raw,t.address)}</td>
      <td>${t.shipments?`<span class="badge cream">${g("layers")} ${b(t.shipments.code)}</span><div class="small">${b(t.shipments.tracking_code||"ch\u01B0a c\xF3 m\xE3")}</div>`:`<input class="input sm" data-trk value="${b(t.tracking_code)}" placeholder="D\xE1n m\xE3 + Enter" enterkeyhint="next"/>`}</td>
      <td class="c-act"><button class="icon-btn" data-open title="S\u1EEDa \u0111\u01A1n" aria-label="S\u1EEDa \u0111\u01A1n">${g("edit")}</button></td>
    </tr>`},m=()=>{const t=a(),n=Math.max(1,Math.ceil(t.length/s.size));s.page=Math.min(Math.max(1,s.page),n);const c=t.slice((s.page-1)*s.size,s.page*s.size),u=(s.page-1)*s.size;v("#tb").innerHTML=c.length?c.map((o,M)=>r(o,u+M+1)).join(""):`<tr><td colspan="9">${Z(_.length?"\u{1F50D}":"\u{1F331}",_.length?"Kh\xF4ng c\xF3 \u0111\u01A1n kh\u1EDBp b\u1ED9 l\u1ECDc":"Ch\u01B0a c\xF3 \u0111\u01A1n \u2013 b\u1EA5m \u201CImport\u201D \u0111\u1EC3 nh\u1EADp file Excel nh\xE9")}</td></tr>`,v("#all").checked=c.length>0&&c.every(o=>s.sel.has(o.id));const d=t.reduce((o,M)=>o+Number(M.total),0),E=[];for(let o=1;o<=n;o++)o===1||o===n||Math.abs(o-s.page)<=1?E.push(o):E[E.length-1]!=="\u2026"&&E.push("\u2026");v("#pager").innerHTML=`
      <span class="muted small">T\u1ED5ng <b>${t.length}</b> \u0111\u01A1n${t.length!==_.length?` (l\u1ECDc t\u1EEB ${_.length})`:""} \xB7 ${P(d,p)}
        ${t.length?` \xB7 hi\u1EC3n th\u1ECB ${(s.page-1)*s.size+1}\u2013${Math.min(s.page*s.size,t.length)}`:""}</span>
      <span class="spacer"></span>
      <label class="small">S\u1ED1 d\xF2ng/trang <select class="input sm" id="psize">${[10,20,50].map(o=>`<option ${o===s.size?"selected":""}>${o}</option>`).join("")}</select></label>
      <div class="pages">
        <button class="btn sm" data-pg="${s.page-1}" ${s.page<=1?"disabled":""}>${g("left")} Tr\u01B0\u1EDBc</button>
        ${E.map(o=>o==="\u2026"?'<span class="muted">\u2026</span>':`<button class="btn sm ${o===s.page?"primary":""}" data-pg="${o}">${o}</button>`).join("")}
        <button class="btn sm" data-pg="${s.page+1}" ${s.page>=n?"disabled":""}>Sau ${g("right")}</button>
      </div>`,f.querySelectorAll(".th-sort").forEach(o=>{const M=o.dataset.sort===s.sort.key;o.classList.toggle("on",M),o.dataset.dir=M?s.sort.dir>0?"\u25B2":"\u25BC":""}),$()},$=()=>{v("#bulk").classList.toggle("hidden",s.sel.size===0),v("#nsel").textContent=s.sel.size},k=async()=>{_=await z(),await C(),i(),m()},x=async(t,n,c=!1)=>{try{const u=await j(N.from("orders").update(n).eq("id",t).select("*, shipments(code,tracking_code,carrier,status)").single()),d=_.findIndex(E=>E.id===t);d>=0&&(_[d]=u),i(),c&&m(),S("\u0110\xE3 l\u01B0u \u{1F49A}","ok",1500)}catch(u){S(u.message,"err",5e3)}},I=async t=>{const n=[...s.sel];try{for(let c=0;c<n.length;c+=200)await j(N.from("orders").update(t).in("id",n.slice(c,c+200)));S(`\u0110\xE3 c\u1EADp nh\u1EADt ${n.length} \u0111\u01A1n \u{1F49A}`),await k()}catch(c){S(c.message,"err",5e3)}};v("#q").addEventListener("input",nt(t=>{s.q=t.target.value,s.page=1,m()},150)),v("#fpay").addEventListener("change",t=>{s.pay=t.target.value,s.page=1,m()}),v("#fst").addEventListener("change",t=>{s.status=t.target.value,s.page=1,m()}),v("#fitem").addEventListener("change",t=>{s.item=t.target.value,s.page=1,m()}),v("#ftrk").addEventListener("change",t=>{s.trk=t.target.value,s.page=1,m()}),v("#fclr").addEventListener("click",()=>{Object.assign(s,{q:"",pay:"",status:"",item:"",trk:"",page:1}),["#q","#fpay","#fst","#fitem","#ftrk"].forEach(t=>{v(t).value=""}),m()}),f.querySelector("thead").addEventListener("click",t=>{const n=t.target.closest(".th-sort");if(!n)return;const c=n.dataset.sort;s.sort={key:c,dir:s.sort.key===c?-s.sort.dir:1},m()}),v("#all").addEventListener("change",t=>{a().slice((s.page-1)*s.size,s.page*s.size).forEach(c=>t.target.checked?s.sel.add(c.id):s.sel.delete(c.id)),m()}),v("#pager").addEventListener("click",t=>{const n=t.target.closest("[data-pg]");!n||n.disabled||(s.page=Number(n.dataset.pg),m(),f.querySelector(".orders-table").scrollIntoView({behavior:"smooth",block:"start"}))}),v("#pager").addEventListener("change",t=>{if(t.target.id==="psize"){s.size=Number(t.target.value),s.page=1;try{localStorage.setItem("gm_page_size",String(s.size))}catch{}m()}}),v("#tb").addEventListener("change",t=>{const n=t.target.closest("tr[data-id]");if(!n)return;const c=n.dataset.id,u=_.find(d=>d.id===c);if(t.target.matches("[data-sel]"))t.target.checked?s.sel.add(c):s.sel.delete(c),n.classList.toggle("selected",t.target.checked),$();else if(t.target.matches("[data-pay]")){const d=t.target.value;x(c,d==="partial"?{payment_status:d,missing_amount:u?.missing_amount??null}:{payment_status:d},!0).then(()=>{d==="partial"&&f.querySelector(`tr[data-id="${c}"] [data-miss]`)?.focus()})}else if(t.target.matches("[data-miss]")){const d=t.target.value===""?null:Math.max(0,Number(t.target.value));x(c,{missing_amount:d})}else if(t.target.matches("[data-mnote]"))x(c,{missing_note:t.target.value.trim()||null});else if(t.target.matches("[data-st]"))x(c,{status:t.target.value});else if(t.target.matches("[data-trk]")){const d=t.target.value.trim()||null;x(c,d&&u?.status!=="cancelled"?{tracking_code:d,status:"shipped"}:{tracking_code:d},!0)}}),v("#tb").addEventListener("keydown",t=>{if(t.key!=="Enter"||!t.target.matches("[data-trk]"))return;t.preventDefault();const n=[...v("#tb").querySelectorAll("tr[data-id]")].map(d=>d.dataset.id),c=n.slice(n.indexOf(t.target.closest("tr").dataset.id)+1).find(d=>v("#tb").querySelector(`tr[data-id="${d}"] [data-trk]`)),u=()=>{const d=c&&v("#tb").querySelector(`tr[data-id="${c}"] [data-trk]`);d&&(d.focus(),d.select())};t.target.value.trim()!==(_.find(d=>d.id===t.target.closest("tr").dataset.id)?.tracking_code||"")?(t.target.dispatchEvent(new Event("change",{bubbles:!0})),setTimeout(u,400)):u()}),v("#tb").addEventListener("click",async t=>{const n=t.target.closest("[data-copy-code]");if(n)return V(n.dataset.copyCode);const c=t.target.closest("[data-copy-msg]");if(c){const o=_.find(M=>M.id===c.dataset.copyMsg);return V(it({name:o.zalo_name,phone:o.phone_norm,code:w.get(o.phone_norm)})),S("\u0110\xE3 sao ch\xE9p tin nh\u1EAFn \u2013 d\xE1n v\xE0o Zalo c\u1EE7a kh\xE1ch \u{1F4AC}","ok",3500)}const u=t.target.closest("[data-reset-code]");if(u){if(!await O(`\u0110\u1ED5i m\xE3 tra c\u1EE9u m\u1EDBi cho kh\xE1ch n\xE0y?
M\xE3 c\u0169 h\u1EBFt hi\u1EC7u l\u1EF1c ngay \u2013 nh\u1EDB g\u1EEDi m\xE3 m\u1EDBi cho kh\xE1ch qua Zalo.`,{title:"\u0110\u1ED5i m\xE3 tra c\u1EE9u",okText:"\u0110\u1ED5i m\xE3"}))return;try{const o=await W("admin_code_reset",{p_phone:u.dataset.resetCode});w.set(u.dataset.resetCode,o),m(),V(o),S(`M\xE3 m\u1EDBi: ${o} (\u0111\xE3 sao ch\xE9p)`,"ok",5e3)}catch(o){S(o.message,"err",5e3)}return}const d=t.target.closest("[data-open]");if(!d)return;const E=_.find(o=>o.id===d.closest("tr").dataset.id);U({order:E,product:T,items:q.items,onSaved:k})}),v("#add").addEventListener("click",()=>U({order:null,product:T,items:q.items,onSaved:k})),f.querySelectorAll("[data-bulk-pay]").forEach(t=>t.addEventListener("click",async()=>{const n=R[t.dataset.bulkPay]?.label||t.dataset.bulkPay;await O(`\u0110\xE1nh d\u1EA5u ${s.sel.size} \u0111\u01A1n l\xE0 \u201C${n}\u201D?`,{title:"X\xE1c nh\u1EADn",okText:"\u0110\u1ED3ng \xFD"})&&I({payment_status:t.dataset.bulkPay})})),v("#bst").addEventListener("change",t=>{t.target.value&&I({status:t.target.value}),t.target.value=""}),v("#clr").addEventListener("click",()=>{s.sel.clear(),m()}),v("#delSel").addEventListener("click",async t=>{const n=[...s.sel];if(!n.length)return;const c=_.filter(u=>s.sel.has(u.id)).slice(0,5).map(u=>`#${u.no} ${u.zalo_name||""}`).join(", ");await O(`Xo\xE1 v\u0129nh vi\u1EC5n ${n.length} \u0111\u01A1n?
${c}${n.length>5?"\u2026":""}

Kh\xF4ng ho\xE0n t\xE1c \u0111\u01B0\u1EE3c \u2013 n\xEAn xu\u1EA5t file Excel tr\u01B0\u1EDBc \u0111\u1EC3 l\u01B0u.`,{danger:!0,okText:`Xo\xE1 ${n.length} \u0111\u01A1n`,title:"Xo\xE1 \u0111\u01A1n \u0111\xE3 ch\u1ECDn"})&&D(t.currentTarget,async()=>{try{for(let u=0;u<n.length;u+=200)await j(N.from("orders").delete().in("id",n.slice(u,u+200)));S(`\u0110\xE3 xo\xE1 ${n.length} \u0111\u01A1n`),s.sel.clear(),await k()}catch(u){S(u.message,"err",6e3)}})}),v("#merge").addEventListener("click",()=>{const t=_.filter(n=>s.sel.has(n.id)).map(n=>({...n,products:{name:T.name}}));pt({orders:t,onDone:async()=>{s.sel.clear(),await k()}})}),i(),m()}async function qt(f,q,T){const p=q.product,e={file:null,wb:null,sheet:null,aoa:[],headerRow:0,headers:[],rows:[],mapping:[],prices:new Map(q.items.map(a=>[a.code,{code:a.code,name:a.name,kind:a.kind,unit_price:Number(a.unit_price),description:a.description||"",sort:a.sort,existing:!0}])),thu:null};f.innerHTML=`
    <div>
      <div class="card">
        <div class="card-title">${g("file")}<h3>1. File (C\xE2u tr\u1EA3 l\u1EDDi)</h3></div>
        <label class="dropzone" id="dz1"><input type="file" accept=".xlsx,.xls,.csv"/>
          <div style="font-size:30px">\u{1F4E5}</div><b>Ch\u1ECDn ho\u1EB7c k\xE9o th\u1EA3 file v\xE0o \u0111\xE2y</b><div class="muted small">.xlsx \xB7 .xls \xB7 .csv \u2013 export t\u1EEB Google Form/Sheet</div></label>
        <div class="row mt"><button type="button" class="btn sm" id="tpl">${g("download")} T\u1EA3i file m\u1EABu (.xlsx)</button>
          <span class="muted small">\u0110\xFAng c\xE1c c\u1ED9t c\u1EA7n thi\u1EBFt, theo b\u1EA3ng gi\xE1 hi\u1EC7n t\u1EA1i c\u1EE7a \u0111\u1EE3t.</span></div>
        <div id="info1" class="small mt"></div>
      </div>

    </div>
    <div id="work"></div>`;const z=(a,i)=>{const r=a.querySelector("input");r.addEventListener("change",()=>r.files[0]&&i(r.files[0])),a.addEventListener("dragover",m=>{m.preventDefault(),a.classList.add("drag")}),a.addEventListener("dragleave",()=>a.classList.remove("drag")),a.addEventListener("drop",m=>{m.preventDefault(),a.classList.remove("drag"),m.dataTransfer.files[0]&&i(m.dataTransfer.files[0])})};f.querySelector("#tpl").addEventListener("click",a=>D(a.currentTarget,()=>wt(p,q.items))),z(f.querySelector("#dz1"),async a=>{try{e.file=a,e.wb=await ht(a),e.sheet=e.wb.SheetNames[0],await _(!0)}catch(i){S(`Kh\xF4ng \u0111\u1ECDc \u0111\u01B0\u1EE3c file: ${i.message}`,"err",6e3)}});async function _(a){e.aoa=await gt(e.wb,e.sheet),a&&(e.headerRow=bt(e.aoa));const i=Math.max(0,...e.aoa.map(m=>m?.length||0));e.headers=Array.from({length:i},(m,$)=>e.aoa[e.headerRow]?.[$]??`C\u1ED9t ${$+1}`).map(m=>String(m).replace(/\s+/g," ").trim()),e.rows=e.aoa.slice(e.headerRow+1);const r=e.headers.map((m,$)=>e.rows.map(k=>k?.[$]??null));e.mapping=vt(e.headers,r,q.items,p.column_map||{}),f.querySelector("#info1").innerHTML=`\u2705 <b>${b(e.file.name)}</b> \xB7 ${e.rows.length} d\xF2ng \xB7 ${e.headers.length} c\u1ED9t`,w(),l()}function w(){e.mapping.forEach(i=>{if(!i.startsWith("qty:new:"))return;const r=i.slice(8),m=H(r)||"item";e.prices.has(m)||e.prices.set(m,{code:m,name:r,kind:"qty",unit_price:y(m),description:"",sort:e.prices.size,existing:!1})});const a=new Set(e.mapping.filter(i=>i.startsWith("qty:new:")).map(i=>H(i.slice(8))||"item"));for(const[i,r]of e.prices)!r.existing&&r.kind==="qty"&&!a.has(i)&&!r.fromThu&&e.prices.delete(i)}function C(a,i){const r=H(i);return r&&(a===r||a.startsWith(r)||r.startsWith(a))}function y(a){const i=e.thu?.prices.find(r=>C(a,r.name));return i?i.price:0}function s(){if(e.thu)for(const a of e.thu.prices){const i=[...e.prices.values()].find(r=>r.kind==="qty"&&C(r.code,a.name));if(i)i.unit_price=a.price,!i.description&&a.description&&(i.description=a.description);else{const r=H(a.name)||"phi",m=e.prices.get(r);m?m.unit_price=a.price:e.prices.set(r,{code:r,name:a.name,kind:"fee",unit_price:a.price,description:a.description||"",sort:e.prices.size,existing:!1,fromThu:!0})}}}function v(a){const i=e.mapping[a],r=q.items.filter(k=>k.kind==="qty").map(k=>[`qty:${k.code}`,`\u{1F522} S\u1ED1 l\u01B0\u1EE3ng \u2192 ${k.name}`]),m=`qty:new:${tt(e.headers[a])}`,$=[...yt,...r];return $.some(([k])=>k===m)||$.push([m,`\u{1F195} S\u1ED1 l\u01B0\u1EE3ng \u2192 SP m\u1EDBi \u201C${tt(e.headers[a])}\u201D`]),$.some(([k])=>k===i)||$.push([i,i]),$.map(([k,x])=>`<option value="${b(k)}" ${k===i?"selected":""}>${b(x)}</option>`).join("")}function L(a){const i=e.rows.map(r=>r?.[a]).find(r=>r!=null&&r!=="");return i===void 0?"":i instanceof Date?i.toLocaleString("vi-VN"):String(i).slice(0,50)}function l(){const a=f.querySelector("#work");if(!e.headers.length){a.innerHTML="";return}const i=[...e.prices.values()],r=ft(e.headers,e.rows,e.mapping,q.items),m=e.mapping.includes("phone"),$=e.headers.map((t,n)=>n),k=$.filter(t=>!["extra","ignore"].includes(e.mapping[t])),x=$.filter(t=>["extra","ignore"].includes(e.mapping[t])),I=t=>`
        <div class="table-wrap">
          <table class="data map-table">
            <thead><tr><th>C\u1ED9t trong file</th><th>V\xED d\u1EE5</th><th>L\u01B0u v\xE0o</th></tr></thead>
            <tbody>${t.map(n=>`
              <tr><td><b>${b(e.headers[n])}</b></td><td><div class="sample">${b(L(n))}</div></td>
                <td><select class="input sm" data-col="${n}">${v(n)}</select></td></tr>`).join("")}
            </tbody>
          </table>
        </div>`;a.innerHTML=`
      <div class="card mt">
        <div class="card-title">${g("settings")}<h3>2. Gh\xE9p c\u1ED9t</h3><span class="spacer"></span>
          ${e.wb.SheetNames.length>1?`<select class="input sm" id="sheet" style="width:auto">${e.wb.SheetNames.map(t=>`<option ${t===e.sheet?"selected":""}>${b(t)}</option>`).join("")}</select>`:""}
          <label class="small">D\xF2ng ti\xEAu \u0111\u1EC1 <input class="input sm" id="hrow" type="number" min="1" value="${e.headerRow+1}" style="width:70px"/></label>
        </div>
        <p class="muted small">\u0110\xE3 t\u1EF1 nh\u1EADn di\u1EC7n \u2013 ki\u1EC3m tra l\u1EA1i c\u1ED9t n\xE0o ch\u01B0a \u0111\xFAng. L\u1EF1a ch\u1ECDn \u0111\u01B0\u1EE3c nh\u1EDB cho l\u1EA7n import sau c\u1EE7a \u0111\u1EE3t n\xE0y.</p>
        ${I(k)}
        ${x.length?`<details class="map-more"><summary>C\xE1c c\u1ED9t kh\xE1c (${x.length}) \u2013 c\xE2u h\u1ECFi ph\u1EE5, c\u1ED9t b\u1ECF qua\u2026 ch\u1EC9 admin xem</summary>${I(x)}</details>`:""}
        ${m?"":'<p class="badge peach mt">\u26A0\uFE0F Ch\u01B0a c\xF3 c\u1ED9t n\xE0o l\xE0 \u201CS\u0110T Zalo\u201D \u2013 kh\xE1ch s\u1EBD kh\xF4ng tra c\u1EE9u \u0111\u01B0\u1EE3c.</p>'}
      </div>

      <div class="card mt">
        <div class="card-title">${g("coins")}<h3>3. \u0110\u01A1n gi\xE1 (\u0111\u01A1n v\u1ECB: \u201C${b(p.money_suffix)}\u201D)</h3><span class="spacer"></span>
          <button class="btn sm" id="addfee">${g("plus")} Th\xEAm ph\u1EE5 ph\xED/\u0111\u01A1n</button></div>
        <p class="muted small">Th\xE0nh ti\u1EC1n = \u03A3 (\u0111\u01A1n gi\xE1 \xD7 s\u1ED1 l\u01B0\u1EE3ng) + ph\u1EE5 ph\xED/\u0111\u01A1n (ch\u1EC9 t\xEDnh khi \u0111\u01A1n c\xF3 mua) + ph\u1EE5 ph\xED ri\xEAng t\u1EEBng \u0111\u01A1n.</p>
        <div class="table-wrap">
          <table class="data">
            <thead><tr><th>T\xEAn</th><th class="num">\u0110\u01A1n gi\xE1</th><th>M\xF4 t\u1EA3</th><th></th></tr></thead>
            <tbody>${i.map(t=>`
              <tr data-code="${b(t.code)}">
                <td><div class="name-cell"><span class="kind-tag ${t.kind}" title="${t.kind==="qty"?"S\u1EA3n ph\u1EA9m (t\xEDnh theo s\u1ED1 l\u01B0\u1EE3ng)":"Ph\u1EE5 ph\xED c\u1ED9ng 1 l\u1EA7n m\u1ED7i \u0111\u01A1n"}">${t.kind==="qty"?g("tag","tag-ic"):"\uFF0B"}</span>
                  <input class="input sm w-name" data-f="name" value="${b(t.name)}"/></div></td>
                <td class="num"><input class="input sm" data-f="unit_price" type="number" step="0.5" min="0" value="${t.unit_price}" style="width:100px;text-align:right"/></td>
                <td><input class="input sm w-desc" data-f="description" value="${b(t.description)}"/></td>
                <td>${t.existing?"":`<button class="icon-btn" data-del title="B\u1ECF">${g("x")}</button>`}</td>
              </tr>`).join("")||'<tr><td colspan="4" class="muted">Ch\u01B0a c\xF3 c\u1ED9t s\u1ED1 l\u01B0\u1EE3ng n\xE0o.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card mt">
        <div class="card-title">${g("upload")}<h3>4. Nh\u1EADp v\xE0o h\u1EC7 th\u1ED1ng</h3></div>
        <p>S\u1EBD nh\u1EADp <b>${r.orders.length}</b> \u0111\u01A1n${r.newItems.length?` \xB7 t\u1EA1o ${r.newItems.length} s\u1EA3n ph\u1EA9m m\u1EDBi`:""}. \u0110\u01A1n \u0111\xE3 nh\u1EADp tr\u01B0\u1EDBc \u0111\xF3 (c\xF9ng th\u1EDDi gian + S\u0110T) s\u1EBD \u0111\u01B0\u1EE3c <b>c\u1EADp nh\u1EADt</b>, kh\xF4ng t\u1EA1o tr\xF9ng.</p>
        ${r.dupRows?.length?`<div class="notice cream mb">\u26A0\uFE0F C\xF3 <b>${r.dupRows.length}</b> d\xF2ng gi\u1ED1ng h\u1EC7t d\xF2ng ph\xEDa tr\xEAn (d\xF2ng ${r.dupRows.slice(0,10).join(", ")}${r.dupRows.length>10?"\u2026":""} trong file). V\u1EABn nh\u1EADp th\xE0nh \u0111\u01A1n ri\xEAng v\xEC kh\xE1ch c\xF3 th\u1EC3 \u0111\u1EB7t nhi\u1EC1u l\u1EA7n \u2013 ki\u1EC3m tra v\u1EDBi kh\xE1ch r\u1ED3i xo\xE1 b\u1EDBt n\u1EBFu g\u1EEDi nh\u1EA7m.</div>`:""}
        <label class="check"><input type="checkbox" id="ow"/> Ghi \u0111\xE8 c\u1EA3 \u0111\u1ECBa ch\u1EC9 m\xE0 kh\xE1ch \u0111\xE3 t\u1EF1 s\u1EEDa tr\xEAn web</label><br/>
        ${e.thu?'<label class="check mt"><input type="checkbox" id="applypaid" checked/> \u0110\xE1nh d\u1EA5u \u201C\u0110\xE3 CK\u201D theo file thu ti\u1EC1n (kh\u1EDBp t\xEAn Zalo + 4 s\u1ED1 cu\u1ED1i)</label><br/>':""}
        <button class="btn primary mt" id="commit">${g("check")} Nh\u1EADp ${r.orders.length} \u0111\u01A1n</button>
      </div>`,a.querySelector("#sheet")?.addEventListener("change",async t=>{e.sheet=t.target.value,await _(!0)}),a.querySelector("#hrow").addEventListener("change",async t=>{e.headerRow=Math.max(0,+t.target.value-1),await _(!1)}),a.querySelectorAll("[data-col]").forEach(t=>t.addEventListener("change",()=>{e.mapping[+t.dataset.col]=t.value,w(),l()})),a.querySelectorAll("tr[data-code] [data-f]").forEach(t=>t.addEventListener("input",()=>{const n=e.prices.get(t.closest("tr").dataset.code);n[t.dataset.f]=t.dataset.f==="unit_price"?Number(t.value||0):t.value})),a.querySelectorAll("[data-del]").forEach(t=>t.addEventListener("click",()=>{e.prices.delete(t.closest("tr").dataset.code),l()})),a.querySelector("#addfee").addEventListener("click",()=>{let t="phi",n=1;for(;e.prices.has(t);)t=`phi-${++n}`;e.prices.set(t,{code:t,name:n>1?`Ph\u1EE5 ph\xED ${n}`:"\u0110\xF3ng g\xF3i",kind:"fee",unit_price:0,description:"",sort:e.prices.size,existing:!1,fromThu:!0}),l()}),a.querySelector("#commit").addEventListener("click",t=>D(t.currentTarget,()=>h(r)))}async function h(a){if(!a.orders.length)return S("Kh\xF4ng c\xF3 d\xF2ng h\u1EE3p l\u1EC7 \u0111\u1EC3 nh\u1EADp","warn");try{const i=[...e.prices.values()].map((t,n)=>({product_id:p.id,code:t.code,name:String(t.name||t.code).trim(),kind:t.kind,unit_price:Number(t.unit_price||0),description:t.description||null,sort:t.sort??n}));i.length&&await j(N.from("product_items").upsert(i,{onConflict:"product_id,code"}));const r={};e.headers.forEach((t,n)=>{const c=e.mapping[n];r[t]=c.startsWith("qty:new:")?`qty:${H(c.slice(8))||"item"}`:c});const m={column_map:r};await j(N.from("products").update(m).eq("id",p.id));let $=0,k=0;const x=f.querySelector("#ow").checked;for(let t=0;t<a.orders.length;t+=250){const n=await W("admin_import_orders",{p_product:p.id,p_rows:a.orders.slice(t,t+250),p_overwrite_edited:x});$+=n.inserted,k+=n.updated}let I="";if(e.thu&&f.querySelector("#applypaid")?.checked){const t=await K("orders","id,zalo_name,phone_norm,payment_status",d=>d.eq("product_id",p.id)),{matched:n,unmatched:c}=$t(e.thu.statuses.filter(d=>kt(d.status)),t),u=n.filter(d=>d.order.payment_status!=="paid").map(d=>d.order.id);for(let d=0;d<u.length;d+=200)await j(N.from("orders").update({payment_status:"paid"}).in("id",u.slice(d,d+200)));I=` \xB7 \u{1F49A} ${n.length} kh\u1EDBp \u201C\u0110\xE3 ck\u201D${c.length?`, ${c.length} kh\xF4ng kh\u1EDBp`:""}`,c.length&&console.warn("Kh\xF4ng kh\u1EDBp:",c)}S(`Xong! Th\xEAm ${$}, c\u1EADp nh\u1EADt ${k} \u0111\u01A1n${I}`,"ok",6e3),await T.reloadProduct(),await T.show("orders")}catch(i){S(i.message,"err",6e3)}}}async function Tt(f,q,T){const p=q.product;let e=q.items.map(l=>({...l}));const z=new Set,_=l=>l?new Date(new Date(l).getTime()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,16):"";f.innerHTML=`
    <div class="grid cols-2">
      <form class="card" id="pf">
        <div class="card-title">${g("settings")}<h3>Th\xF4ng tin & hi\u1EC3n th\u1ECB</h3></div>
        <div class="form-grid">
          <label class="field"><span>T\xEAn</span><input class="input" name="name" value="${b(p.name)}" required/></label>
          <label class="field"><span>\u0110\u01B0\u1EDDng d\u1EABn (t\u1EF1 theo t\xEAn)</span><input class="input" name="slug" value="${b(p.slug)}" pattern="[a-z0-9-]{2,60}"/></label>
          <label class="field"><span>H\u1EADu t\u1ED1 ti\u1EC1n</span><input class="input" name="money_suffix" value="${b(p.money_suffix)}" maxlength="6"/></label>
          <label class="field"><span>Th\u1EE9 t\u1EF1</span><input class="input" name="sort" type="number" value="${p.sort}"/></label>
        </div>
        <div class="field"><span>Emoji \u0111\u1EA1i di\u1EC7n <span class="muted small">(b\u1EA5m ch\u1ECDn ho\u1EB7c d\xE1n emoji b\u1EA5t k\u1EF3)</span></span>
          <input class="input emoji-input" name="cover_emoji" value="${b(p.cover_emoji)}" maxlength="8"/></div>
        <label class="field"><span>M\xF4 t\u1EA3</span><textarea class="input" name="description" rows="3">${b(p.description)}</textarea></label>

        <h4 class="section-h">${g("coins")} Thanh to\xE1n</h4>
        <p class="hint">${g("coins")}<span>H\u01B0\u1EDBng d\u1EABn CK & \u1EA3nh QR d\xF9ng chung cho m\u1ECDi \u0111\u1EE3t \u2013 ch\u1EC9nh \u1EDF <a href="#/admin/payment"><b>Admin \u2192 Chuy\u1EC3n kho\u1EA3n</b></a>.</span></p>
        <div class="form-grid">
          <label class="field"><span>Deadline chuy\u1EC3n kho\u1EA3n</span>
            <input class="input" type="datetime-local" name="payment_deadline" value="${_(p.payment_deadline)}"/>
            <span class="small muted">Kh\xE1ch th\u1EA5y \u0111\u1EBFm ng\u01B0\u1EE3c. \u0110\u1EC3 tr\u1ED1ng = kh\xF4ng h\u1EA1n.</span></label>
        </div>

        <h4 class="section-h">${g("image")} \u1EA2nh m\xF4 t\u1EA3 s\u1EA3n ph\u1EA9m (t\u1ED1i \u0111a 3)</h4>
        <div class="img-grid" id="imgs"></div>

        <h4 class="section-h">${g("settings")} Hi\u1EC3n th\u1ECB</h4>
        <div class="grid" style="gap:8px">
          <label class="check"><input type="checkbox" name="is_published" ${p.is_published?"checked":""}/> \u{1F33F} C\xF4ng khai \u0111\u1EE3t n\xE0y (kh\xE1ch th\u1EA5y & tra c\u1EE9u \u0111\u01B0\u1EE3c)</label>
          <label class="check"><input type="checkbox" name="public_list_enabled" ${p.public_list_enabled?"checked":""}/> \u{1F4CB} Cho kh\xE1ch xem b\u1EA3ng (thu ti\u1EC1n)</label>
          <label class="check"><input type="checkbox" name="mask_public_names" ${p.mask_public_names?"checked":""}/> \u{1F648} Che t\xEAn Zalo trong b\u1EA3ng c\xF4ng khai</label>
          <label class="check"><input type="checkbox" name="allow_address_edit" ${p.allow_address_edit?"checked":""}/> \u270F\uFE0F Cho kh\xE1ch t\u1EF1 s\u1EEDa \u0111\u1ECBa ch\u1EC9</label>
        </div>
        <label class="field mt"><span>H\u1EA1n ch\xF3t s\u1EEDa \u0111\u1ECBa ch\u1EC9 (\u0111\u1EC3 tr\u1ED1ng = kh\xF4ng gi\u1EDBi h\u1EA1n)</span>
          <input class="input" type="datetime-local" name="address_edit_deadline" value="${_(p.address_edit_deadline)}"/></label>
        <p class="hint">${g("lock")} \u0110\u01A1n \u0111\xE3 \u201C\u0110\xE3 \u0111\xF3ng g\xF3i/\u0110ang giao\u201D, ho\u1EB7c n\u1EB1m trong ki\u1EC7n kh\xF4ng c\xF2n \u201C\u0110ang chu\u1EA9n b\u1ECB\u201D, s\u1EBD t\u1EF1 kho\xE1 s\u1EEDa.</p>
        <button class="btn primary mt" type="submit">${g("check")} L\u01B0u c\u1EA5u h\xECnh</button>
      </form>

      <div>
        <div class="card">
          <div class="card-title">${g("coins")}<h3>S\u1EA3n ph\u1EA9m & \u0111\u01A1n gi\xE1</h3><span class="spacer"></span>
            <button class="btn sm" id="addq">${g("plus")} SP</button><button class="btn sm" id="addf">${g("plus")} Ph\u1EE5 ph\xED</button></div>
          <div class="item-list" id="itb"></div>
          <p class="hint">${g("coins")} <span><b>S\u1EA3n ph\u1EA9m</b> t\xEDnh theo s\u1ED1 l\u01B0\u1EE3ng kh\xE1ch \u0111\u1EB7t \xB7 <b>Ph\u1EE5 ph\xED</b> c\u1ED9ng 1 l\u1EA7n m\u1ED7i \u0111\u01A1n c\xF3 mua. \u0110\u1ED5i gi\xE1 s\u1EBD t\u1EF1 t\xEDnh l\u1EA1i th\xE0nh ti\u1EC1n m\u1ECDi \u0111\u01A1n.</span></p>
          <button class="btn primary mt" id="saveItems">${g("check")} L\u01B0u b\u1EA3ng gi\xE1</button>
        </div>
        <div class="card" style="border-color:#F6CFD7">
          <div class="card-title">\u26A0\uFE0F<h3>V\xF9ng nguy hi\u1EC3m</h3></div>
          <p class="muted small">Xo\xE1 \u0111\u1EE3t s\u1EBD xo\xE1 v\u0129nh vi\u1EC5n to\xE0n b\u1ED9 \u0111\u01A1n & b\u1EA3ng gi\xE1 c\u1EE7a \u0111\u1EE3t n\xE0y (kh\xF4ng ho\xE0n t\xE1c).</p>
          <button class="btn danger" id="delp">${g("trash")} Xo\xE1 \u0111\u1EE3t \u201C${b(p.name)}\u201D</button>
        </div>
      </div>
    </div>`,rt(f.querySelector(".emoji-input"));{const l=f.querySelector('#pf [name="name"]'),h=f.querySelector('#pf [name="slug"]');let a=H(p.name)===p.slug;h.addEventListener("input",()=>{a=!1}),l.addEventListener("input",()=>{a&&(h.value=H(l.value).slice(0,60))})}const w={images:(p.product_images||[]).map(l=>({url:l.url,caption:l.caption||""}))},C=()=>new Promise(l=>{const h=document.createElement("input");h.type="file",h.accept="image/png,image/jpeg,image/webp",h.onchange=()=>l(h.files[0]||null),h.click()}),y=async(l,h,a)=>{const i=await C();return i?D(l,async()=>{try{return await at(await dt(i,{max:a}),`${p.slug}/${h}`)}catch(r){return S(r.message,"err",5e3),null}}):null},s=()=>{const l=f.querySelector("#imgs");l.innerHTML=w.images.map((h,a)=>`
      <div class="img-card" data-i="${a}">
        <img src="${b(h.url)}" alt=""/>
        <input class="input sm" data-cap value="${b(h.caption)}" maxlength="120" placeholder="Ch\xFA th\xEDch (VD: Lanyard m\u1EB7t tr\u01B0\u1EDBc)"/>
        <div class="row">
          ${a>0?`<button type="button" class="icon-btn" data-mv="-1" title="L\xEAn tr\u01B0\u1EDBc">${g("left")}</button>`:""}
          ${a<w.images.length-1?`<button type="button" class="icon-btn" data-mv="1" title="Ra sau">${g("right")}</button>`:""}
          <span class="spacer"></span><button type="button" class="icon-btn" data-rm title="B\u1ECF \u1EA3nh">${g("trash")}</button>
        </div>
      </div>`).join("")+(w.images.length<3?`<button type="button" class="img-add" id="imgAdd">${g("upload")}<span>Th\xEAm \u1EA3nh (${w.images.length}/3)</span></button>`:""),l.querySelector("#imgAdd")?.addEventListener("click",async h=>{const a=await y(h.currentTarget,"images",1600);a&&(w.images.push({url:a,caption:""}),s())})};f.querySelector("#imgs").addEventListener("input",l=>{l.target.matches("[data-cap]")&&(w.images[+l.target.closest("[data-i]").dataset.i].caption=l.target.value)}),f.querySelector("#imgs").addEventListener("click",l=>{const h=l.target.closest("[data-i]");if(!h)return;const a=+h.dataset.i;if(l.target.closest("[data-rm]"))w.images.splice(a,1);else if(l.target.closest("[data-mv]")){const i=a+Number(l.target.closest("[data-mv]").dataset.mv);[w.images[a],w.images[i]]=[w.images[i],w.images[a]]}else return;s()}),s();const v=f.querySelector("#itb"),L=()=>{v.innerHTML=e.map((l,h)=>`
      <div class="item-row" data-i="${h}">
        <div class="item-top">
          ${l.kind==="fee"?'<span class="badge cream">\uFF0B Ph\u1EE5 ph\xED / \u0111\u01A1n</span>':`<span class="badge mint">${g("tag","tag-ic")} S\u1EA3n ph\u1EA9m</span>`}
          <button class="icon-btn" data-del title="Xo\xE1" aria-label="Xo\xE1">${g("trash")}</button>
        </div>
        <div class="item-grid">
          <label class="field"><span>T\xEAn</span><input class="input" data-f="name" value="${b(l.name)}"/></label>
          <label class="field"><span>Gi\xE1</span><div class="price-input">
            <input class="input" data-f="unit_price" type="number" step="0.5" min="0" value="${Number(l.unit_price)}"/>
            <span class="sfx">${b(p.money_suffix)}</span></div></label>
        </div>
        <label class="field"><span>M\xF4 t\u1EA3</span><textarea class="input" data-f="description" rows="2" placeholder="VD: 2x90cm, in 2 m\u1EB7t\u2026">${b(l.description)}</textarea></label>
        ${l.kind==="qty"?`<div class="item-img">
          ${l.image_url?`<img src="${b(l.image_url)}" alt=""/>`:""}
          <button type="button" class="btn sm" data-itimg>${g("image")} ${l.image_url?"\u0110\u1ED5i \u1EA3nh m\xF3n":"Th\xEAm \u1EA3nh m\xF3n (hi\u1EC7n trong form)"}</button>
          ${l.image_url?`<button type="button" class="btn sm ghost" data-itimg-rm>${g("trash")}</button>`:""}
        </div>`:""}
      </div>`).join("")||'<p class="muted">Ch\u01B0a c\xF3 \u2013 import Excel s\u1EBD t\u1EF1 t\u1EA1o, ho\u1EB7c b\u1EA5m \u201C+ SP\u201D.</p>'};L(),v.addEventListener("input",l=>{const h=l.target.dataset.f;if(!h)return;const a=e[+l.target.closest("[data-i]").dataset.i];a[h]=h==="unit_price"?Number(l.target.value||0):l.target.value}),v.addEventListener("click",async l=>{const h=l.target.closest("[data-itimg]"),a=l.target.closest("[data-itimg-rm]");if(h||a){const r=e[+l.target.closest("[data-i]").dataset.i];if(a){r.image_url=null,L();return}const m=await y(h,"items",1600);m&&(r.image_url=m,L(),S("\u0110\xE3 t\u1EA3i \u1EA3nh \u2013 b\u1EA5m \u201CL\u01B0u b\u1EA3ng gi\xE1\u201D \u0111\u1EC3 l\u01B0u","ok",4e3));return}if(!l.target.closest("[data-del]"))return;const i=+l.target.closest("[data-i]").dataset.i;e[i].id&&!await O(`Xo\xE1 \u201C${e[i].name}\u201D kh\u1ECFi b\u1EA3ng gi\xE1? S\u1ED1 l\u01B0\u1EE3ng trong \u0111\u01A1n v\u1EABn gi\u1EEF nh\u01B0ng kh\xF4ng c\xF2n t\xEDnh ti\u1EC1n.`,{danger:!0,okText:"Xo\xE1"})||(e[i].id&&z.add(e[i].id),e.splice(i,1),L())}),f.querySelector("#addq").addEventListener("click",()=>{e.push({name:"S\u1EA3n ph\u1EA9m m\u1EDBi",code:"",kind:"qty",unit_price:0,description:"",sort:e.length}),L()}),f.querySelector("#addf").addEventListener("click",()=>{e.push({name:"\u0110\xF3ng g\xF3i",code:"",kind:"fee",unit_price:0,description:"",sort:e.length}),L()}),f.querySelector("#saveItems").addEventListener("click",l=>D(l.currentTarget,async()=>{try{if(e.some(i=>!String(i.name||"").trim()))return S("C\xF3 d\xF2ng ch\u01B0a nh\u1EADp t\xEAn","warn");const h=new Set(e.filter(i=>i.id).map(i=>i.code)),a=e.map((i,r)=>{let m=i.code;if(!i.id){const $=H(i.name)||`item-${r+1}`;m=$;for(let k=2;h.has(m);k++)m=`${$}-${k}`;h.add(m)}return{product_id:p.id,code:m,name:String(i.name).trim(),kind:i.kind,unit_price:Number(i.unit_price||0),description:i.description||null,sort:r,image_url:i.kind==="qty"&&i.image_url||null}});z.size&&await j(N.from("product_items").delete().in("id",[...z])),a.length&&await j(N.from("product_items").upsert(a,{onConflict:"product_id,code"})),S("\u0110\xE3 l\u01B0u b\u1EA3ng gi\xE1 & t\xEDnh l\u1EA1i th\xE0nh ti\u1EC1n \u{1F49A}"),await T.reloadProduct(),await T.show("settings")}catch(h){S(h.message,"err",5e3)}})),f.querySelector("#pf").addEventListener("submit",l=>{l.preventDefault(),D(l.submitter||f.querySelector("#pf button[type=submit]"),async()=>{const h=new FormData(l.target),a=H(h.get("slug"));if(!/^[a-z0-9-]{2,60}$/.test(a))return S("Slug kh\xF4ng h\u1EE3p l\u1EC7","warn");const i=h.get("address_edit_deadline"),r=h.get("payment_deadline"),m={name:String(h.get("name")).trim(),slug:a,cover_emoji:h.get("cover_emoji")||"\u{1F33F}",money_suffix:h.get("money_suffix")??"",sort:Number(h.get("sort")||0),description:String(h.get("description")||"").trim()||null,payment_deadline:r?new Date(r).toISOString():null,product_images:w.images.filter($=>$.url).slice(0,3).map($=>({url:$.url,caption:$.caption.trim()||null})),is_published:h.get("is_published")==="on",public_list_enabled:h.get("public_list_enabled")==="on",mask_public_names:h.get("mask_public_names")==="on",allow_address_edit:h.get("allow_address_edit")==="on",address_edit_deadline:i?new Date(i).toISOString():null};try{if(await j(N.from("products").update(m).eq("id",p.id)),S("\u0110\xE3 l\u01B0u c\u1EA5u h\xECnh \u{1F49A}"),a!==p.slug){location.hash=`#/admin/product/${a}`;return}await T.reloadProduct()}catch($){S($.message,"err",5e3)}})}),f.querySelector("#delp").addEventListener("click",async()=>{if(await O(`Xo\xE1 v\u0129nh vi\u1EC5n \u0111\u1EE3t \u201C${p.name}\u201D c\xF9ng T\u1EA4T C\u1EA2 \u0111\u01A1n h\xE0ng?
H\xE3y xu\u1EA5t file Excel tr\u01B0\u1EDBc \u0111\u1EC3 l\u01B0u tr\u1EEF.`,{danger:!0,okText:"Xo\xE1 v\u0129nh vi\u1EC5n",title:"Xo\xE1 \u0111\u1EE3t merch"}))try{await j(N.from("products").delete().eq("id",p.id)),S("\u0110\xE3 xo\xE1 \u0111\u1EE3t"),location.hash="#/admin"}catch(h){S(h.message,"err",5e3)}})}export{Pt as renderAdminProduct};
