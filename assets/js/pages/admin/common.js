import{sb as _,getAdminState as T,signInGoogle as L,signInPassword as x,sendPasswordReset as E,changePassword as M,signOut as $,rpc as j,must as k,MOCK as H}from"../../api.js";import{esc as n,icon as c,googleLogo as N,loadingHtml as D,openModal as f,toast as d,withBusy as b,options as w,PAY as A,STATUS as C,carrierOptions as q,money as G}from"../../ui.js";async function I(a){a.innerHTML=D("\u0110ang ki\u1EC3m tra quy\u1EC1n\u2026");const t=await T();let m=!1;try{m=sessionStorage.getItem("gm_pw_reset")==="1",sessionStorage.removeItem("gm_pw_reset")}catch{}if(t.session&&m&&S(!0),t.session&&t.isAdmin)return t;a.innerHTML=`
    <div class="login-wrap"><div class="card login-card">
      <div class="em">\u{1F510}</div>
      <h2>Khu v\u1EF1c Admin</h2>
      ${t.session?`<p>T\xE0i kho\u1EA3n <b>${n(t.session.user.email)}</b> ch\u01B0a \u0111\u01B0\u1EE3c c\u1EA5p quy\u1EC1n admin.</p>
           <p class="muted small">Th\xEAm email v\xE0o b\u1EA3ng <code>admins</code> trong Supabase (email ph\u1EA3i \u0111\xE3 x\xE1c nh\u1EADn).</p>
           <button class="btn" id="out">${c("logout")} \u0110\u0103ng xu\u1EA5t</button>`:`<button class="btn ms block" id="gg">${N} \u0110\u0103ng nh\u1EADp b\u1EB1ng Google</button>
           <div class="or"><span>ho\u1EB7c</span></div>
           <form id="pwf" class="login-form" autocomplete="on">
             <label class="field"><span>Email</span>
               <input class="input" type="email" name="email" autocomplete="username" required placeholder="admin@gmail.com"/></label>
             <label class="field"><span>M\u1EADt kh\u1EA9u</span>
               <input class="input" type="password" name="password" autocomplete="current-password" required minlength="6"/></label>
             <button class="btn primary block" type="submit">${c("lock")} \u0110\u0103ng nh\u1EADp</button>
             <button class="link-btn small" type="button" id="forgot">Qu\xEAn m\u1EADt kh\u1EA9u?</button>
           </form>
           ${H?'<p class="small muted">Demo: <b>admin.demo@gmail.com</b> / <b>demo123456</b></p>':""}
           <p class="hint" style="justify-content:center">${c("shield")}<span>Ch\u1EC9 t\xE0i kho\u1EA3n \u0111\u01B0\u1EE3c c\u1EA5p quy\u1EC1n m\u1EDBi v\xE0o \u0111\u01B0\u1EE3c.</span></p>`}
    </div></div>`,a.querySelector("#out")?.addEventListener("click",$),a.querySelector("#gg")?.addEventListener("click",async r=>{await b(r.currentTarget,async()=>{try{await L(location.hash||"#/admin")}catch(e){d(e.message,"err")}})});const p=a.querySelector("#pwf");return p?.addEventListener("submit",r=>{r.preventDefault(),b(p.querySelector("[type=submit]"),async()=>{const e=new FormData(p);try{await x(e.get("email"),e.get("password")),window.dispatchEvent(new HashChangeEvent("hashchange"))}catch(h){d(h.message,"err",5e3)}})}),a.querySelector("#forgot")?.addEventListener("click",r=>b(r.currentTarget,async()=>{const e=p.querySelector("[name=email]").value.trim();if(!e){d("Nh\u1EADp email tr\u01B0\u1EDBc r\u1ED3i b\u1EA5m \u201CQu\xEAn m\u1EADt kh\u1EA9u?\u201D","warn"),p.querySelector("[name=email]").focus();return}try{await E(e),d("N\u1EBFu email c\xF3 t\xE0i kho\u1EA3n, link \u0111\u1EB7t l\u1EA1i m\u1EADt kh\u1EA9u \u0111\xE3 \u0111\u01B0\u1EE3c g\u1EEDi. M\u1EDF link b\u1EB1ng CH\xCDNH tr\xECnh duy\u1EC7t n\xE0y.","ok",7e3)}catch(h){d(h.message,"err",5e3)}})),null}function S(a=!1){const t=f({title:`${c("lock")} ${a?"\u0110\u1EB7t m\u1EADt kh\u1EA9u m\u1EDBi":"\u0110\u1ED5i m\u1EADt kh\u1EA9u"}`,body:`
      <form id="cpf" class="login-form">
        <label class="field"><span>M\u1EADt kh\u1EA9u m\u1EDBi</span>
          <input class="input" type="password" name="p1" autocomplete="new-password" minlength="10" required/></label>
        <label class="field"><span>Nh\u1EADp l\u1EA1i m\u1EADt kh\u1EA9u m\u1EDBi</span>
          <input class="input" type="password" name="p2" autocomplete="new-password" minlength="10" required/></label>
        <p class="hint">${c("shield")}<span>T\u1ED1i thi\u1EC3u 10 k\xFD t\u1EF1, n\xEAn c\xF3 ch\u1EEF hoa, ch\u1EEF th\u01B0\u1EDDng v\xE0 s\u1ED1.</span></p>
        <button class="btn primary block" type="submit">${c("check")} L\u01B0u m\u1EADt kh\u1EA9u</button>
      </form>`}),m=t.el.querySelector("#cpf");m.addEventListener("submit",p=>{p.preventDefault(),b(m.querySelector("[type=submit]"),async()=>{const r=new FormData(m);if(r.get("p1")!==r.get("p2"))return d("Hai m\u1EADt kh\u1EA9u kh\xF4ng gi\u1ED1ng nhau","warn");try{await M(r.get("p1")),d("\u0110\xE3 l\u01B0u m\u1EADt kh\u1EA9u m\u1EDBi \u{1F49A}"),t.close()}catch(e){d(e.message,"err",5e3)}})})}function P(a,t){return`
    <div class="admin-bar">
      <div class="tabs" style="margin:0">
        <button data-go="#/admin" class="${t==="products"?"active":""}">${c("gift")} S\u1EA3n ph\u1EA9m</button>
        <button data-go="#/admin/shipments" class="${t==="shipments"?"active":""}">${c("layers")} G\u1ED9p ki\u1EC7n & v\u1EADn \u0111\u01A1n</button>
        <button data-go="#/admin/payment" class="${t==="payment"?"active":""}">${c("coins")} Chuy\u1EC3n kho\u1EA3n</button>
      </div>
      <span class="spacer"></span>
      <span class="muted small">${c("user")} ${n(a.session.user.email)}</span>
      ${a.session.user.app_metadata?.provider==="email"?`<button class="btn sm ghost" data-chpw>${c("lock")} \u0110\u1ED5i m\u1EADt kh\u1EA9u</button>`:""}
      <button class="btn sm ghost" data-logout>${c("logout")} Tho\xE1t</button>
    </div>`}function V(a){a.querySelectorAll("[data-go]").forEach(t=>t.addEventListener("click",()=>{location.hash=t.dataset.go})),a.querySelector("[data-logout]")?.addEventListener("click",$),a.querySelector("[data-chpw]")?.addEventListener("click",()=>S(!1))}function F({order:a,product:t,items:m,onSaved:p}){const r=!a,e=a||{quantities:{},extra:{},payment_status:"unpaid",status:"new",adjustment:0},h=m.filter(i=>i.kind==="qty"),s=Object.entries(e.extra||{}),l=f({title:`${c("edit")} ${r?"Th\xEAm \u0111\u01A1n th\u1EE7 c\xF4ng":`\u0110\u01A1n #${e.no} \u2013 ${n(e.zalo_name||"")}`}`,wide:!0,body:`
      <form id="of">
        <div class="form-grid">
          <label class="field"><span>T\xEAn Zalo</span><input class="input" name="zalo_name" value="${n(e.zalo_name)}"/></label>
          <label class="field"><span>S\u0110T Zalo (d\xF9ng tra c\u1EE9u)</span><input class="input" name="phone_raw" value="${n(e.phone_raw)}"/></label>
          <label class="field"><span>Link Threads/MXH</span><input class="input" name="threads_link" value="${n(e.threads_link)}"/></label>
          <label class="field"><span>Email</span><input class="input" name="email" value="${n(e.email)}"/></label>
          <label class="field"><span>T\xEAn ng\u01B0\u1EDDi nh\u1EADn</span><input class="input" name="receiver_name" value="${n(e.receiver_name)}"/></label>
          <label class="field"><span>S\u0110T ng\u01B0\u1EDDi nh\u1EADn</span><input class="input" name="receiver_phone" value="${n(e.receiver_phone)}"/></label>
        </div>
        <label class="field"><span>\u0110\u1ECBa ch\u1EC9</span><textarea class="input" name="address">${n(e.address)}</textarea></label>
        <label class="field"><span>Ghi ch\xFA c\u1EE7a kh\xE1ch</span><input class="input" name="customer_note" value="${n(e.customer_note)}"/></label>
        <div class="form-grid">
          ${h.map(i=>`<label class="field"><span>SL ${n(i.name)} (${G(i.unit_price,t.money_suffix)})</span><input class="input" type="number" min="0" step="1" name="q:${n(i.code)}" value="${Number(e.quantities?.[i.code]||0)}"/></label>`).join("")}
          <label class="field"><span>Ph\u1EE5 ph\xED/gi\u1EA3m gi\xE1 ri\xEAng (\xB1)</span><input class="input" type="number" step="0.5" name="adjustment" value="${Number(e.adjustment||0)}"/></label>
        </div>
        <div class="form-grid">
          <label class="field"><span>Thanh to\xE1n</span><select class="input" name="payment_status">${w(A,e.payment_status)}</select></label>
          <label class="field"><span>Tr\u1EA1ng th\xE1i</span><select class="input" name="status">${w(C,e.status)}</select></label>
          <label class="field"><span>\u0110VVC (\u0111\u01A1n l\u1EBB)</span><select class="input" name="carrier">${q(e.carrier)}</select></label>
          <label class="field"><span>M\xE3 v\u1EADn \u0111\u01A1n (\u0111\u01A1n l\u1EBB)</span><input class="input" name="tracking_code" value="${n(e.tracking_code)}"/></label>
        </div>
        <div class="form-grid missing-fields ${e.payment_status==="partial"?"":"hidden"}">
          <label class="field"><span>\u{1F317} S\u1ED1 ti\u1EC1n c\xF2n thi\u1EBFu (${n(t.money_suffix)})</span><input class="input" type="number" min="0" step="0.5" name="missing_amount" value="${e.missing_amount??""}"/></label>
          <label class="field"><span>Ghi ch\xFA cho kh\xE1ch</span><input class="input" name="missing_note" value="${n(e.missing_note)}" placeholder="VD: thi\u1EBFu ph\xED g\xF3i"/></label>
        </div>
        <label class="field"><span>Ghi ch\xFA admin (kh\xE1ch kh\xF4ng th\u1EA5y)</span><input class="input" name="admin_note" value="${n(e.admin_note)}"/></label>
        <label class="check"><input type="checkbox" name="address_locked" ${e.address_locked?"checked":""}/> Kho\xE1 kh\xF4ng cho kh\xE1ch s\u1EEDa \u0111\u1ECBa ch\u1EC9 \u0111\u01A1n n\xE0y</label>
        ${s.length?`<details class="mt"><summary class="muted">Th\xF4ng tin th\xEAm t\u1EEB form (${s.length})</summary>
          <dl class="kv mt">${s.map(([i,o])=>`<dt>${n(i)}</dt><dd>${n(o)}</dd>`).join("")}</dl></details>`:""}
      </form>`,footer:`<button class="btn" data-close>Hu\u1EF7</button><button class="btn primary" id="save">${c("check")} L\u01B0u</button>`});l.el.querySelector('[name="payment_status"]').addEventListener("change",i=>l.el.querySelector(".missing-fields").classList.toggle("hidden",i.target.value!=="partial")),l.el.querySelector("#save").addEventListener("click",i=>b(i.currentTarget,async()=>{const o=new FormData(l.el.querySelector("#of")),v={...e.quantities||{}};h.forEach(g=>{v[g.code]=Number(o.get(`q:${g.code}`)||0)});const u=g=>String(o.get(g)??"").trim()||null,y={zalo_name:u("zalo_name"),phone_raw:u("phone_raw"),threads_link:u("threads_link"),email:u("email"),receiver_name:u("receiver_name"),receiver_phone:u("receiver_phone"),address:u("address"),customer_note:u("customer_note"),admin_note:u("admin_note"),quantities:v,adjustment:Number(o.get("adjustment")||0),payment_status:o.get("payment_status"),status:o.get("status"),carrier:u("carrier"),tracking_code:u("tracking_code"),address_locked:o.get("address_locked")==="on",missing_amount:o.get("payment_status")==="partial"&&o.get("missing_amount")!==""?Math.max(0,Number(o.get("missing_amount"))):null,missing_note:o.get("payment_status")==="partial"?u("missing_note"):null};try{r?await k(_.from("orders").insert({...y,product_id:t.id,source_key:`manual-${crypto.randomUUID()}`})):await k(_.from("orders").update(y).eq("id",e.id)),d(r?"\u0110\xE3 th\xEAm \u0111\u01A1n \u{1F331}":"\u0110\xE3 l\u01B0u \u0111\u01A1n \u{1F49A}"),l.close(),p?.()}catch(g){d(g.message,"err",5e3)}}))}function B({orders:a,onDone:t}){const m=a.find(s=>s.address)||a[0],p=[...new Map(a.filter(s=>s.address).map(s=>[s.address,s])).values()],r=a.filter(s=>s.shipment_id),e=f({title:`${c("layers")} G\u1ED9p ${a.length} \u0111\u01A1n th\xE0nh 1 ki\u1EC7n`,wide:!0,body:`
      <div class="chips mb">${a.map(s=>`<span class="chip">\u{1F4E6} ${n(s.products?.name||"")} #${s.no} \xB7 ${n(s.zalo_name||"")}</span>`).join("")}</div>
      ${r.length?`<p class="badge cream">\u26A0\uFE0F ${r.length} \u0111\u01A1n \u0111ang \u1EDF ki\u1EC7n kh\xE1c s\u1EBD \u0111\u01B0\u1EE3c chuy\u1EC3n sang ki\u1EC7n m\u1EDBi.</p>`:""}
      ${p.length>1?`<label class="field"><span>L\u1EA5y th\xF4ng tin nh\u1EADn t\u1EEB \u0111\u01A1n</span><select class="input" id="pick">
          ${p.map((s,l)=>`<option value="${l}">${n(s.receiver_name||s.zalo_name||"")} \u2013 ${n((s.address||"").slice(0,70))}</option>`).join("")}
        </select></label>`:""}
      <form id="sf">
        <div class="form-grid">
          <label class="field"><span>T\xEAn ng\u01B0\u1EDDi nh\u1EADn</span><input class="input" name="receiver_name" value="${n(m?.receiver_name)}"/></label>
          <label class="field"><span>S\u0110T ng\u01B0\u1EDDi nh\u1EADn</span><input class="input" name="receiver_phone" value="${n(m?.receiver_phone)}"/></label>
        </div>
        <label class="field"><span>\u0110\u1ECBa ch\u1EC9</span><textarea class="input" name="address">${n(m?.address)}</textarea></label>
        <div class="form-grid">
          <label class="field"><span>\u0110VVC</span><select class="input" name="carrier">${q("")}</select></label>
          <label class="field"><span>M\xE3 v\u1EADn \u0111\u01A1n (c\xF3 th\u1EC3 nh\u1EADp sau)</span><input class="input" name="tracking"/></label>
        </div>
        <label class="field"><span>Ghi ch\xFA</span><input class="input" name="note"/></label>
      </form>`,footer:`<button class="btn" data-close>Hu\u1EF7</button><button class="btn primary" id="go">${c("layers")} T\u1EA1o ki\u1EC7n</button>`}),h=e.el.querySelector("#sf");e.el.querySelector("#pick")?.addEventListener("change",s=>{const l=p[+s.target.value];h.receiver_name.value=l.receiver_name||"",h.receiver_phone.value=l.receiver_phone||"",h.address.value=l.address||""}),e.el.querySelector("#go").addEventListener("click",s=>b(s.currentTarget,async()=>{const l=Object.fromEntries(new FormData(h));try{const i=await j("admin_create_shipment",{p_order_ids:a.map(o=>o.id),p_receiver_name:l.receiver_name,p_receiver_phone:l.receiver_phone,p_address:l.address,p_carrier:l.carrier||null,p_tracking:l.tracking||null,p_note:l.note||null});d(`\u0110\xE3 t\u1EA1o ki\u1EC7n ${i.code} \u{1F381}`),e.close(),t?.(i)}catch(i){d(i.message,"err",5e3)}}))}export{P as adminBar,V as bindAdminBar,F as openOrderModal,S as openPasswordModal,B as openShipmentModal,I as requireAdmin};
