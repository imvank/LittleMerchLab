import{sb as g,must as f,uploadImage as w}from"../../api.js";import{esc as u,icon as e,toast as p,withBusy as q,loadingHtml as C,sanitizeHtml as b,textToHtml as L,compressImage as _}from"../../ui.js";import{requireAdmin as x,adminBar as k,bindAdminBar as E}from"./common.js";async function F(c){const h=await x(c);if(!h)return;c.innerHTML=`${k(h,"payment")}<div id="body">${C()}</div>`,E(c);const o=c.querySelector("#body");let r;try{r=await f(g.from("app_settings").select("*").eq("id",1).maybeSingle())||{id:1}}catch(t){o.innerHTML=`<div class="notice peach">${u(t.message)}<br/>\u0110\xE3 ch\u1EA1y migration <code>0005_payment_settings.sql</code> ch\u01B0a?</div>`;return}const a={qr:r.payment_qr_url||null};o.innerHTML=`
    <div class="grid cols-2">
      <section class="card">
        <div class="card-title">${e("coins")}<h2>H\u01B0\u1EDBng d\u1EABn chuy\u1EC3n kho\u1EA3n</h2></div>
        <p class="hint">${e("sparkle")}<span>Nh\u1EADp <b>1 l\u1EA7n</b>, hi\u1EC7n cho <b>t\u1EA5t c\u1EA3</b> c\xE1c \u0111\u1EE3t merch. H\u1EA1n ch\xF3t CK v\u1EABn \u0111\u1EB7t ri\xEAng \u1EDF t\u1EEBng \u0111\u1EE3t (Gi\xE1 & c\u1EA5u h\xECnh).</span></p>
        <div class="field mt">
          <div class="rt-toolbar" id="rtbar">
            <button type="button" data-cmd="bold" title="In \u0111\u1EADm"><b>B</b></button>
            <button type="button" data-cmd="italic" title="In nghi\xEAng"><i>I</i></button>
            <button type="button" data-cmd="underline" title="G\u1EA1ch ch\xE2n"><u>U</u></button>
            <span class="rt-sep"></span>
            ${["#1E3528","#C0392B","#D35400","#2E7D32","#1565C0","#8E24AA"].map(t=>`<button type="button" class="swatch" data-color="${t}" title="M\xE0u ch\u1EEF" style="--c:${t}"></button>`).join("")}
            <span class="rt-sep"></span>
            ${["#FFF176","#FFD6E0","#D8F3B5","#CDE7FF"].map(t=>`<button type="button" class="swatch hl" data-hl="${t}" title="T\xF4 n\u1EC1n n\u1ED5i b\u1EADt" style="--c:${t}">A</button>`).join("")}
            <span class="rt-sep"></span>
            <button type="button" data-cmd="insertUnorderedList" title="Danh s\xE1ch">\u2022 \u2014</button>
            <button type="button" data-cmd="removeFormat" title="Xo\xE1 \u0111\u1ECBnh d\u1EA1ng">\u2715 \u0111\u1ECBnh d\u1EA1ng</button>
          </div>
          <div class="input rt-editor rich" id="rt" contenteditable="true" role="textbox" aria-multiline="true">${r.payment_instruction_html?b(r.payment_instruction_html):L(r.payment_note)}</div>
          <span class="small muted">M\u1EB9o: b\xF4i \u0111en \u201Cnh\u1EADp \u0111\xFAng c\xFA ph\xE1p\u201D \u2192 b\u1EA5m <b>B</b> + m\xE0u \u0111\u1ECF + t\xF4 v\xE0ng cho th\u1EADt n\u1ED5i b\u1EADt.</span>
        </div>
        <div class="field mt"><span>\u1EA2nh STK / m\xE3 QR chuy\u1EC3n kho\u1EA3n</span><div class="img-slot" id="qrSlot"></div></div>
        <button class="btn primary mt" id="save">${e("check")} L\u01B0u h\u01B0\u1EDBng d\u1EABn chuy\u1EC3n kho\u1EA3n</button>
      </section>

      <section>
        <h3 class="mb">${e("smile")} Kh\xE1ch s\u1EBD th\u1EA5y</h3>
        <div class="card pay-card">
          <div class="card-title">${e("coins")}<h3>H\u01B0\u1EDBng d\u1EABn chuy\u1EC3n kho\u1EA3n</h3></div>
          <div class="pay-grid stack" id="pv"></div>
        </div>
      </section>
    </div>`;const s=t=>o.querySelector(t),i=s("#rt"),d=()=>{const t=b(i.innerHTML).trim();s("#pv").innerHTML=`${i.innerText.trim()?`<div class="rich">${t}</div>`:'<div class="muted small">Ch\u01B0a c\xF3 n\u1ED9i dung.</div>'}
      ${a.qr?`<div class="qr"><img src="${u(a.qr)}" alt="QR"/></div>`:""}`};try{document.execCommand("styleWithCSS",!1,!0)}catch{}s("#rtbar").addEventListener("mousedown",t=>{t.target.closest("button")&&t.preventDefault()}),s("#rtbar").addEventListener("click",t=>{const n=t.target.closest("button");n&&(i.focus(),n.dataset.cmd&&document.execCommand(n.dataset.cmd,!1,null),n.dataset.color&&document.execCommand("foreColor",!1,n.dataset.color),n.dataset.hl&&!document.execCommand("hiliteColor",!1,n.dataset.hl)&&document.execCommand("backColor",!1,n.dataset.hl),d())}),i.addEventListener("paste",t=>{t.preventDefault(),document.execCommand("insertText",!1,t.clipboardData.getData("text/plain"))}),i.addEventListener("input",d);const $=()=>new Promise(t=>{const n=document.createElement("input");n.type="file",n.accept="image/png,image/jpeg,image/webp",n.onchange=()=>t(n.files[0]||null),n.click()}),l=()=>{const t=s("#qrSlot");t.innerHTML=a.qr?`<img src="${u(a.qr)}" alt="QR"/><div class="row"><button type="button" class="btn sm" id="qrUp">${e("upload")} \u0110\u1ED5i \u1EA3nh</button><button type="button" class="btn sm danger" id="qrDel">${e("trash")} B\u1ECF</button></div>`:`<button type="button" class="img-add" id="qrUp">${e("upload")}<span>T\u1EA3i \u1EA3nh QR / STK</span></button>`,t.querySelector("#qrUp").addEventListener("click",async n=>{const m=n.currentTarget,y=await $();if(!y)return;const v=await q(m,async()=>{try{return await w(await _(y,{max:1800,quality:.92}),"settings/qr")}catch(T){return p(T.message,"err",5e3),null}});v&&(a.qr=v,l())}),t.querySelector("#qrDel")?.addEventListener("click",()=>{a.qr=null,l()}),d()};l(),s("#save").addEventListener("click",t=>q(t.currentTarget,async()=>{const n=i.innerText.trim();try{await f(g.from("app_settings").upsert({id:1,payment_instruction_html:n?b(i.innerHTML).trim():null,payment_note:n||null,payment_qr_url:a.qr},{onConflict:"id"})),p("\u0110\xE3 l\u01B0u \u2013 \xE1p d\u1EE5ng cho m\u1ECDi \u0111\u1EE3t \u{1F49A}")}catch(m){p(m.message,"err",5e3)}}))}export{F as renderAdminPayment};
