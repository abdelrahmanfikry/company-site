(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const h = (tag, attrs = {}, ...kids) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') el.className = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k === 'html') el.innerHTML = v;
      else if (v !== false && v != null) el.setAttribute(k, v === true ? '' : v);
    }
    kids.flat().forEach(c => c != null && el.append(c.nodeType ? c : document.createTextNode(c)));
    return el;
  };
  const store = {
    get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
    del: k => { try { localStorage.removeItem(k); } catch (e) {} }
  };
  const clone = o => JSON.parse(JSON.stringify(o));
  const getPath = (o, p) => p.split('.').reduce((a, k) => (a == null ? undefined : a[k]), o);
  const setPath = (o, p, v) => { const ks = p.split('.'); const last = ks.pop(); const t = ks.reduce((a, k) => (a[k] = a[k] || {}), o); t[last] = v; };
  const tx = v => v == null ? '' : typeof v === 'object' ? (v.ar || v.en || '') : String(v);

  let DATA = null, GH = null, OFFLINE = false, DEV = false, VIEW = 'media', DIRTY = false;
  const BLOBS = {}; // مسار الصورة ← رابط مؤقت لعرضها قبل ما GitHub ينشرها

  function toast(msg, err) { const t = $('#toast'); t.textContent = msg; t.className = 'toast show' + (err ? ' err' : ''); clearTimeout(t._t); t._t = setTimeout(() => t.className = 'toast', 3500); }
  function dirty(v = true) { DIRTY = v; const s = $('#status'); s.textContent = v ? '● فيه تعديلات لم تُنشر' : (OFFLINE ? 'وضع بدون إنترنت' : '✓ كل التعديلات منشورة'); s.className = 'status' + (v ? ' dirty' : ''); }
  window.addEventListener('beforeunload', e => { if (DIRTY) { e.preventDefault(); e.returnValue = ''; } });
  const imgURL = p => !p ? '' : BLOBS[p] || (/^(https?:|data:)/.test(p) ? p : p);

  /* ---------------- GitHub API ---------------- */
  const b64enc = str => { const bytes = new TextEncoder().encode(str); let bin = ''; bytes.forEach(b => bin += String.fromCharCode(b)); return btoa(bin); };
  const b64dec = b64 => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, '')), c => c.charCodeAt(0)));
  async function gh(path, opts = {}) {
    const r = await fetch(`https://api.github.com/repos/${GH.owner}/${GH.repo}/contents/${path}${opts.method ? '' : '?ref=' + encodeURIComponent(GH.branch) + '&t=' + Date.now()}`, {
      method: opts.method || 'GET',
      headers: { Authorization: 'Bearer ' + GH.token, Accept: 'application/vnd.github+json' },
      body: opts.body ? JSON.stringify(opts.body) : undefined
    });
    if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(r.status + ' — ' + (j.message || r.statusText)); }
    return r.json();
  }
  async function getSha(path) { try { return (await gh(path)).sha; } catch (e) { return undefined; } }
  async function putFile(path, b64, message) {
    const sha = await getSha(path);
    return gh(path, { method: 'PUT', body: { message, content: b64, branch: GH.branch, sha } });
  }

  /* ---------------- الدخول ---------------- */
  /* ---------------- تشفير مفتاح الدخول بكلمة سر ---------------- */
  const enc = new TextEncoder(), dec = new TextDecoder();
  const toB64 = u8 => { let s = ''; u8.forEach(x => s += String.fromCharCode(x)); return btoa(s); };
  const fromB64 = b => Uint8Array.from(atob(b), c => c.charCodeAt(0));
  async function deriveKey(pass, salt, iter) {
    const base = await crypto.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: iter, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  }
  async function encryptConn(conn, pass) {
    const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12)), iter = 310000;
    const key = await deriveKey(pass, salt, iter);
    const data = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(conn))));
    return { v: 1, iter, salt: toB64(salt), iv: toB64(iv), data: toB64(data) };
  }
  async function decryptConn(k, pass) {
    const key = await deriveKey(pass, fromB64(k.salt), k.iter);
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(k.iv) }, key, fromB64(k.data));
    return JSON.parse(dec.decode(plain));
  }

  /* ---------------- الدخول ---------------- */
  async function connectWith(conn, remember) {
    GH = conn;
    const f = await gh('site.json');
    DATA = JSON.parse(b64dec(f.content));
    if (remember) store.set('gh_conn', JSON.stringify(GH));
    store.set('site_draft_raw', `https://raw.githubusercontent.com/${GH.owner}/${GH.repo}/${GH.branch}/`);
    start();
  }
  function initLogin() {
    const err = m => $('#loginErr').textContent = m || '';
    const saved = JSON.parse(store.get('gh_conn') || 'null');
    let KEYFILE = null;
    fetch('admin-key.json?t=' + Date.now()).then(r => r.ok ? r.json() : null).then(k => {
      KEYFILE = k && k.data ? k : null;
      if (!KEYFILE && !saved) { $('#passBox').classList.add('hidden'); $('#devBox').open = true; }
    }).catch(() => { $('#passBox').classList.add('hidden'); $('#devBox').open = true; });
    const doPass = async () => {
      const pass = $('#pass').value; if (!pass) return err('اكتب كلمة السر');
      if (!KEYFILE) return err('لم يتم إعداد كلمة سر بعد — اطلبها من المطوّر');
      $('#passLogin').disabled = true; err('');
      let conn = null;
      try { conn = await decryptConn(KEYFILE, pass); } catch (e) { err('كلمة السر غير صحيحة'); }
      if (conn) { try { await connectWith(conn, $('#remember').checked); } catch (e) { err('تعذّر الاتصال: ' + e.message); } }
      $('#passLogin').disabled = false;
    };
    $('#passLogin').onclick = doPass;
    $('#pass').onkeydown = e => { if (e.key === 'Enter') doPass(); };
    $('#connect').onclick = async () => {
      const conn = { owner: $('#owner').value.trim(), repo: $('#repo').value.trim(), branch: $('#branch').value.trim() || 'main', token: $('#token').value.trim() };
      if (!conn.owner || !conn.repo || !conn.token) return err('كمّل البيانات الأربعة');
      $('#connect').disabled = true; err('');
      try { DEV = true; await connectWith(conn, true); } catch (e) { DEV = false; err('فشل الاتصال: ' + e.message); }
      $('#connect').disabled = false;
    };
    $('#offline').onclick = async () => {
      OFFLINE = true;
      try { DATA = await (await fetch('site.json?t=' + Date.now())).json(); start(); }
      catch (e) { err('تعذّر قراءة site.json'); }
    };
    if (saved && saved.token) { connectWith(saved, true).catch(e => { store.del('gh_conn'); err('انتهت صلاحية الدخول، ادخل تاني'); }); }
  }

  async function setClientPassword() {
    const p1 = prompt('اكتب كلمة السر الجديدة للعميل (8 حروف على الأقل):'); if (!p1) return;
    if (p1.length < 8) return toast('كلمة السر قصيرة — 8 حروف على الأقل', true);
    const p2 = prompt('اكتبها تاني للتأكيد:'); if (p1 !== p2) return toast('كلمتا السر غير متطابقتين', true);
    try {
      const k = await encryptConn(GH, p1);
      await putFile('admin-key.json', b64enc(JSON.stringify(k)), 'تحديث كلمة سر لوحة التحكم');
      toast('✓ اتحفظت كلمة السر — العميل يدخل بيها بعد دقيقة');
    } catch (e) { toast('فشل الحفظ: ' + e.message, true); }
  }

  function start() {
    $('#login').classList.add('hidden'); $('#panel').classList.remove('hidden');
    if (OFFLINE) { $('#saveBtn').textContent = '⬇ تنزيل site.json'; store.del('site_draft_raw'); }
    const sel = $('#newType');
    Object.entries(SECTION_TYPES).forEach(([k, v]) => sel.append(h('option', { value: k }, v.label)));
    $('#addSec').onclick = addSection;
    $('#saveBtn').onclick = save;
    $('#previewBtn').onclick = preview;
    $('#exportBtn').onclick = () => download(JSON.stringify(DATA, null, 2), 'site-backup-' + new Date().toISOString().slice(0, 10) + '.json');
    $('#importFile').onchange = async e => { const f = e.target.files[0]; if (!f) return; try { const d = JSON.parse(await f.text()); if (!d.settings || !d.sections) throw 0; DATA = d; dirty(); renderSide(); show('settings'); toast('تم الاسترجاع — اضغط حفظ ونشر'); } catch (err) { toast('الملف غير صالح', true); } };
    $('#logout').onclick = () => { if (DIRTY && !confirm('فيه تعديلات لم تُنشر، تخرج برضه؟')) return; store.del('gh_conn'); DIRTY = false; location.reload(); };
    $('#menuBtn').onclick = () => $('#panel').classList.toggle('menu');
    $$('.tab[data-view="settings"]').forEach(b => b.onclick = () => show('settings'));
    $$('.tab[data-view="media"]').forEach(b => b.onclick = () => show('media'));
    if (!OFFLINE) { $('#setPass').classList.remove('hidden'); $('#setPass').onclick = setClientPassword; }
    dirty(false); renderSide(); show('media');
  }

  /* ---------------- القائمة الجانبية ---------------- */
  function renderSide() {
    const list = $('#secList'); list.innerHTML = '';
    DATA.sections.forEach((s, i) => {
      const it = h('div', { class: 'sec-item' + (s.visible === false ? ' off' : '') + (VIEW === i ? ' on' : ''), draggable: 'true', 'data-i': i },
        h('span', { class: 'grip' }, '⋮⋮'),
        h('button', { class: 'tab', onclick: () => show(i) }, h('span', {}, tx(s.navLabel) || tx(s.title) || SECTION_TYPES[s.type]?.label || s.type)),
        h('button', { class: 'eye', title: 'إظهار/إخفاء', onclick: e => { e.stopPropagation(); s.visible = s.visible === false; dirty(); renderSide(); if (VIEW === i) show(i); } }, s.visible === false ? '🙈' : '👁'));
      it.addEventListener('dragstart', e => { it.classList.add('drag'); e.dataTransfer.setData('text/plain', i); });
      it.addEventListener('dragend', () => it.classList.remove('drag'));
      it.addEventListener('dragover', e => { e.preventDefault(); it.classList.add('over'); });
      it.addEventListener('dragleave', () => it.classList.remove('over'));
      it.addEventListener('drop', e => { e.preventDefault(); it.classList.remove('over'); const from = +e.dataTransfer.getData('text/plain'); moveSection(from, i); });
      list.append(it);
    });
    $('.tab[data-view="settings"]').classList.toggle('on', VIEW === 'settings');
    $('.tab[data-view="media"]').classList.toggle('on', VIEW === 'media');
  }
  function moveSection(from, to) {
    if (from === to || isNaN(from)) return;
    const viewed = typeof VIEW === 'number' ? DATA.sections[VIEW] : null;
    const [s] = DATA.sections.splice(from, 1); DATA.sections.splice(to, 0, s);
    dirty(); show(viewed ? DATA.sections.indexOf(viewed) : VIEW);
  }
  function addSection() {
    const type = $('#newType').value, def = SECTION_TYPES[type];
    let id = type, n = 2; while (DATA.sections.some(s => s.id === id)) id = type + n++;
    const s = { id, type, visible: true, showInNav: false, navLabel: { ar: def.label.split(' (')[0], en: type } };
    def.fields.forEach(f => s[f.key] = emptyOf(f));
    DATA.sections.push(s); dirty(); renderSide(); show(DATA.sections.length - 1);
    toast('اتضاف القسم في آخر الصفحة — اسحبه لمكانه');
  }
  function emptyOf(f) { return ({ i18n: { ar: '', en: '' }, i18nArea: { ar: '', en: '' }, list: [], bool: false, number: 0, select: f.options ? f.options[0][0] : '' })[f.type] ?? ''; }

  /* ---------------- المحرر ---------------- */
  function show(v) {
    VIEW = v; const ed = $('#editor'); ed.innerHTML = ''; renderSide(); $('#panel').classList.remove('menu');
    if (v === 'media') return renderMedia(ed);
    if (v === 'settings') {
      ed.append(h('h2', {}, '⚙️ الإعدادات العامة'), h('p', { class: 'sub' }, 'الاسم واللوجو والألوان وأرقام التواصل — بتظهر في الموقع كله.'));
      SETTINGS_FIELDS.forEach(g => { const c = h('div', { class: 'card' }, h('h3', {}, g.group)); g.fields.forEach(f => c.append(field(DATA.settings, f))); ed.append(c); });
      return;
    }
    const s = DATA.sections[v]; if (!s) return show('settings');
    const def = SECTION_TYPES[s.type] || { label: s.type, fields: [] };
    ed.append(h('h2', {}, tx(s.navLabel) || def.label), h('p', { class: 'sub' }, 'نوع القسم: ' + def.label));
    const base = h('div', { class: 'card' }, h('h3', {}, 'إعدادات القسم'));
    base.append(
      h('div', { class: 'row' }, toggle(s, 'visible', 'ظاهر في الموقع', true), toggle(s, 'showInNav', 'يظهر في القائمة العلوية')),
      h('div', { style: 'height:12px' }),
      field(s, { key: 'navLabel', type: 'i18n', label: 'اسم القسم في القائمة' }),
      field(s, { key: 'id', type: 'text', label: 'المعرّف (يُستخدم في الروابط مثل #products) — حروف إنجليزي بدون مسافات' }, v2 => v2.replace(/[^\w-]/g, '-')),
      h('div', { class: 'row' },
        h('button', { class: 'btn sm', onclick: () => { if (v > 0) { moveSection(v, v - 1); } } }, '⬆ لأعلى'),
        h('button', { class: 'btn sm', onclick: () => { if (v < DATA.sections.length - 1) { moveSection(v, v + 1); } } }, '⬇ لأسفل'),
        h('button', { class: 'btn sm', onclick: () => { const c = clone(s); c.id = s.id + '-copy'; DATA.sections.splice(v + 1, 0, c); dirty(); show(v + 1); } }, '⧉ نسخ القسم'),
        h('button', { class: 'btn sm danger', onclick: () => { if (confirm('حذف القسم «' + (tx(s.navLabel) || s.type) + '»؟ (تقدر تخفيه بدل ما تحذفه)')) { DATA.sections.splice(v, 1); dirty(); show(Math.max(0, v - 1)); } } }, '🗑 حذف القسم')));
    ed.append(base);
    const c = h('div', { class: 'card' }, h('h3', {}, 'المحتوى'));
    def.fields.forEach(f => c.append(field(s, f)));
    ed.append(c);
  }


  /* ---------------- شاشة الصور ---------------- */
  const REMOVABLE = { gallery: 'images', logos: 'items' };
  function collectGroups() {
    const groups = [];
    const st = DATA.settings;
    groups.push({ title: '⚙️ الهوية', entries: [
      { label: 'اللوجو', get: () => st.logo, set: v => st.logo = v },
      { label: 'أيقونة المتصفح', get: () => st.favicon, set: v => st.favicon = v }
    ]});
    DATA.sections.forEach((s, si) => {
      const def = SECTION_TYPES[s.type]; if (!def) return;
      const g = { title: (tx(s.navLabel) || def.label) + (s.visible === false ? ' (مخفي)' : ''), entries: [], add: null };
      def.fields.forEach(f => {
        if (f.type === 'image') g.entries.push({ label: f.label, get: () => s[f.key], set: v => s[f.key] = v });
        if (f.type === 'list') {
          const imgF = f.fields.find(x => x.type === 'image'); if (!imgF) return;
          if (!Array.isArray(s[f.key])) s[f.key] = [];
          const arr = s[f.key];
          const removable = REMOVABLE[s.type] === f.key;
          arr.forEach((it, i) => {
            const name = f.fields.map(x => tx(it[x.key])).find(x => x && !/^(images\/|data:|https?:)|\.(svg|png|jpe?g|webp|gif)$/i.test(x)) || `${f.itemLabel} ${i + 1}`;
            g.entries.push({ label: name, get: () => it[imgF.key], set: v => it[imgF.key] = v, remove: removable ? () => arr.splice(arr.indexOf(it), 1) : null });
          });
          if (removable) g.add = file => { const n = {}; f.fields.forEach(sf => n[sf.key] = emptyOf(sf)); n[imgF.key] = file; arr.push(n); };
        }
      });
      if (g.entries.length || g.add) groups.push(g);
    });
    return groups;
  }
  function renderMedia(ed) {
    ed.append(h('h2', {}, '📷 الصور'), h('p', { class: 'sub' }, 'كل صور الموقع في مكان واحد.'),
      h('div', { class: 'hintbox' }, 'اضغط «تغيير» لتبديل أي صورة، أو «حذف» لإزالتها. في معرض الصور تقدر ترفع كذا صورة مرة واحدة. بعد ما تخلص اضغط «🚀 حفظ ونشر» فوق.'));
    collectGroups().forEach(g => {
      const grid = h('div', { class: 'media-grid' });
      const head = h('h3', {}, h('span', {}, g.title));
      if (g.add) {
        const fi = h('input', { type: 'file', accept: 'image/*', multiple: true, hidden: true });
        const lb = h('label', { class: 'btn sm primary' }, '＋ إضافة صور', fi);
        fi.onchange = async () => {
          const files = Array.from(fi.files); if (!files.length) return;
          lb.firstChild.textContent = `… جاري رفع ${files.length}`;
          let ok = 0;
          for (const f of files) { try { g.add(await uploadImage(f)); ok++; } catch (e) { toast('فشل رفع ' + f.name + ': ' + e.message, true); } }
          if (ok) { dirty(); toast(`✓ اتضافت ${ok} صورة — متنساش «حفظ ونشر»`); }
          show('media');
        };
        head.append(lb);
      }
      g.entries.forEach(en => {
        const ph = h('div', { class: 'ph' });
        const paint = () => { const u = imgURL(en.get()); ph.style.backgroundImage = u ? `url("${u}")` : ''; ph.textContent = u ? '' : 'لا توجد صورة'; };
        paint();
        const card = h('div', { class: 'mcard' }, ph, h('div', { class: 'cap', title: en.label }, en.label));
        const fi = h('input', { type: 'file', accept: 'image/*', hidden: true });
        fi.onchange = async () => {
          const f = fi.files[0]; if (!f) return; card.classList.add('busy');
          try { en.set(await uploadImage(f)); dirty(); paint(); toast('✓ اتغيّرت الصورة — متنساش «حفظ ونشر»'); }
          catch (e) { toast('فشل الرفع: ' + e.message, true); }
          card.classList.remove('busy'); fi.value = '';
        };
        const acts = h('div', { class: 'acts' }, h('label', { class: 'btn primary' }, 'تغيير', fi));
        acts.append(h('button', { class: 'btn danger', onclick: () => {
          if (!confirm('حذف الصورة «' + en.label + '»؟')) return;
          if (en.remove) en.remove(); else en.set('');
          dirty(); show('media');
        } }, 'حذف'));
        card.append(acts); grid.append(card);
      });
      ed.append(h('div', { class: 'card media-group' }, head, grid));
    });
  }

  function toggle(obj, key, label, defTrue) {
    const cb = h('input', { type: 'checkbox' }); cb.checked = defTrue ? obj[key] !== false : !!obj[key];
    cb.onchange = () => { obj[key] = cb.checked; dirty(); renderSide(); };
    return h('label', { class: 'switch' }, cb, label);
  }

  function field(obj, f, clean) {
    const wrap = h('div', { class: 'field' });
    const val = getPath(obj, f.key);
    const set = v => { setPath(obj, f.key, v); dirty(); if (f.key === 'navLabel' || f.key === 'id') renderSide(); };
    if (f.type === 'bool') { wrap.append(toggle(obj, f.key, f.label)); return wrap; }
    wrap.append(h('label', {}, f.label));
    switch (f.type) {
      case 'i18n': case 'i18nArea': {
        const v = (val && typeof val === 'object') ? val : { ar: val || '', en: '' };
        if (val !== v) setPath(obj, f.key, v);
        const mk = (l, name) => { const inp = h(f.type === 'i18n' ? 'input' : 'textarea', { dir: l === 'ar' ? 'rtl' : 'ltr', placeholder: name }); inp.value = v[l] || ''; inp.oninput = () => { v[l] = inp.value; dirty(); if (f.key === 'navLabel') renderSide(); }; return h('div', { 'data-l': name }, inp); };
        wrap.append(h('div', { class: 'i18n' }, mk('ar', 'عربي'), mk('en', 'English')));
        break;
      }
      case 'number': { const i = h('input', { type: 'number', dir: 'ltr' }); i.value = val ?? 0; i.oninput = () => set(+i.value); wrap.append(i); break; }
      case 'color': { const i = h('input', { type: 'color' }); i.value = val || '#000000'; const t = h('input', { dir: 'ltr', style: 'max-width:140px' }); t.value = val || ''; i.oninput = () => { t.value = i.value; set(i.value); }; t.oninput = () => { if (/^#[0-9a-f]{6}$/i.test(t.value)) { i.value = t.value; set(t.value); } }; wrap.append(h('div', { class: 'row' }, i, t)); break; }
      case 'select': { const sel = h('select', {}, f.options.map(([k, l]) => h('option', { value: k }, l))); sel.value = val ?? f.options[0][0]; sel.onchange = () => set(sel.value); wrap.append(sel); break; }
      case 'image': wrap.append(imageField(val, set)); break;
      case 'list': wrap.append(listField(obj, f)); break;
      default: { const i = h('input', { dir: /link|url|email|whatsapp|social|map|id|youtube|number/i.test(f.key) ? 'ltr' : 'auto' }); i.value = val ?? ''; i.oninput = () => set(clean ? clean(i.value) : i.value); wrap.append(i); }
    }
    return wrap;
  }

  function imageField(val, set) {
    const thumb = h('div', { class: 'thumb' });
    const path = h('input', { dir: 'ltr', placeholder: 'images/... أو رابط' }); path.value = val || '';
    const paint = () => { const u = imgURL(path.value); thumb.style.backgroundImage = u ? `url("${u}")` : ''; thumb.textContent = u ? '' : 'لا توجد صورة'; };
    path.oninput = () => { set(path.value); paint(); };
    const file = h('input', { type: 'file', accept: 'image/*', hidden: true });
    const up = h('label', { class: 'btn sm primary' }, '⬆ رفع صورة', file);
    file.onchange = async () => {
      const f = file.files[0]; if (!f) return;
      up.firstChild.textContent = '… جاري الرفع'; up.style.pointerEvents = 'none';
      try { const p = await uploadImage(f); path.value = p; set(p); paint(); toast('✓ اتّرفعت الصورة'); }
      catch (e) { toast('فشل رفع الصورة: ' + e.message, true); }
      up.firstChild.textContent = '⬆ رفع صورة'; up.style.pointerEvents = ''; file.value = '';
    };
    const clr = h('button', { class: 'btn sm ghost', onclick: () => { path.value = ''; set(''); paint(); } }, 'إزالة');
    paint();
    return h('div', { class: 'img-field' }, thumb, h('div', { class: 'col' }, path, h('div', { class: 'row' }, up, clr)));
  }

  async function shrink(file) {
    if (/svg|gif/.test(file.type) || file.size < 350 * 1024) return { blob: file, ext: (file.name.split('.').pop() || 'png').toLowerCase() };
    const bmp = await createImageBitmap(file); const max = 1920; const r = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas'); c.width = Math.round(bmp.width * r); c.height = Math.round(bmp.height * r);
    const keepAlpha = /png|webp/.test(file.type);
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    const type = keepAlpha ? 'image/webp' : 'image/jpeg';
    const blob = await new Promise(res => c.toBlob(res, type, .84));
    return { blob, ext: keepAlpha ? 'webp' : 'jpg' };
  }
  async function uploadImage(file) {
    const { blob, ext } = await shrink(file);
    const dataURL = await new Promise(res => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(blob); });
    if (OFFLINE) return dataURL;
    const safe = file.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'img';
    const path = `images/uploads/${Date.now()}-${safe}.${ext}`;
    await putFile(path, dataURL.split(',')[1], 'رفع صورة: ' + path);
    BLOBS[path] = URL.createObjectURL(blob);
    return path;
  }

  function listField(obj, f) {
    let arr = getPath(obj, f.key); if (!Array.isArray(arr)) { arr = []; setPath(obj, f.key, arr); }
    const box = h('div', { class: 'list' });
    const draw = (openIdx) => {
      box.innerHTML = '';
      arr.forEach((item, i) => {
        const imgKey = f.fields.find(x => x.type === 'image');
        const title = f.fields.map(x => tx(item[x.key])).find(x => x && !/^(images\/|data:|https?:)/.test(x)) || `${f.itemLabel} ${i + 1}`;
        const body = h('div', { class: 'item-body' }); f.fields.forEach(sf => body.append(field(item, sf)));
        const el = h('div', { class: 'item' + (i === openIdx ? '' : ' closed') },
          h('div', { class: 'item-head', onclick: e => { if (e.target.closest('.iconbtn')) return; el.classList.toggle('closed'); } },
            imgKey ? h('span', { class: 'mini', style: `background-image:url("${imgURL(item[imgKey.key])}")` }) : null,
            h('b', {}, title),
            h('button', { class: 'iconbtn', title: 'لأعلى', onclick: () => { if (i > 0) { [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; dirty(); draw(i - 1); } } }, '↑'),
            h('button', { class: 'iconbtn', title: 'لأسفل', onclick: () => { if (i < arr.length - 1) { [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]]; dirty(); draw(i + 1); } } }, '↓'),
            h('button', { class: 'iconbtn', title: 'نسخ', onclick: () => { arr.splice(i + 1, 0, clone(item)); dirty(); draw(i + 1); } }, '⧉'),
            h('button', { class: 'iconbtn del', title: 'حذف', onclick: () => { if (confirm('حذف ' + title + '؟')) { arr.splice(i, 1); dirty(); draw(-1); } } }, '✕')),
          body);
        box.append(el);
      });
      box.append(h('button', { class: 'btn sm', onclick: () => { const n = {}; f.fields.forEach(sf => n[sf.key] = emptyOf(sf)); arr.push(n); dirty(); draw(arr.length - 1); } }, '+ إضافة ' + f.itemLabel));
    };
    draw(-1);
    return box;
  }

  /* ---------------- حفظ / معاينة ---------------- */
  function validate() {
    const ids = DATA.sections.map(s => s.id);
    const dup = ids.find((x, i) => ids.indexOf(x) !== i);
    if (dup) return 'المعرّف «' + dup + '» مكرّر في أكتر من قسم';
    if (ids.some(x => !x)) return 'فيه قسم من غير معرّف';
    return '';
  }
  function preview() {
    const err = validate(); if (err) return toast(err, true);
    store.set('site_draft', JSON.stringify(DATA));
    window.open('index.html?preview=1', '_blank');
  }
  async function save() {
    const err = validate(); if (err) return toast(err, true);
    const json = JSON.stringify(DATA, null, 2);
    if (OFFLINE) { download(json, 'site.json'); toast('اتنزّل site.json — حطّه مكان site.json'); dirty(false); return; }
    const b = $('#saveBtn'); b.disabled = true; b.textContent = '… جاري النشر';
    try {
      await putFile('site.json', b64enc(json), 'تحديث محتوى الموقع من لوحة التحكم');
      dirty(false); toast('✓ اتنشر! الموقع هيتحدّث خلال دقيقة تقريباً');
    } catch (e) { toast('فشل النشر: ' + e.message, true); }
    b.disabled = false; b.textContent = '🚀 حفظ ونشر';
  }
  function download(text, name) { const a = h('a', { href: URL.createObjectURL(new Blob([text], { type: 'application/json' })), download: name }); document.body.append(a); a.click(); a.remove(); }

  initLogin();
})();
