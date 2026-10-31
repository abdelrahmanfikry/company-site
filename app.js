(function () {
  'use strict';
  const UI = {
    ar: { all: 'الكل', quote: 'اطلب عرض سعر', season: 'الموسم', origin: 'المنشأ', name: 'الاسم', phone: 'رقم الجوال', email: 'الإيميل', company: 'الشركة', product: 'المنتج المطلوب', message: 'رسالتك', send: 'إرسال', call: 'اتصل بنا', mail: 'راسلنا', address: 'العنوان', hours: 'مواعيد العمل', rights: 'جميع الحقوق محفوظة', follow: 'تابعنا', quick: 'روابط سريعة', contact: 'تواصل', menu: 'القائمة', langBtn: 'EN', hello: 'مرحباً، أنا', want: 'أريد عرض سعر لـ' },
    en: { all: 'All', quote: 'Request a Quote', season: 'Season', origin: 'Origin', name: 'Name', phone: 'Phone', email: 'Email', company: 'Company', product: 'Product', message: 'Your message', send: 'Send', call: 'Call Us', mail: 'Email Us', address: 'Address', hours: 'Working Hours', rights: 'All rights reserved', follow: 'Follow Us', quick: 'Quick Links', contact: 'Contact', menu: 'Menu', langBtn: 'ع', hello: 'Hello, I am', want: 'I would like a quote for' }
  };
  const ICONS = {
    facebook: '<path d="M14 9h3V5h-3c-2.8 0-4 1.8-4 4v2H7v4h3v8h4v-8h3l1-4h-4V9.5c0-.3.2-.5.5-.5z"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.3"/>',
    linkedin: '<path d="M4 9h4v12H4zM6 3a2 2 0 110 4 2 2 0 010-4zM10 9h4v2c.6-1.1 2-2.3 4-2.3 3.5 0 4 2.3 4 5.3V21h-4v-6c0-1.5 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V21H10z"/>',
    x: '<path d="M4 3h4.5l4 5.6L17 3h3l-6 7.4L21 21h-4.5l-4.4-6.1L7 21H4l6.6-8z"/>',
    youtube: '<path d="M22 8.2a3 3 0 00-2-2C18.2 5.7 12 5.7 12 5.7s-6.2 0-8 .5a3 3 0 00-2 2A31 31 0 001.7 12 31 31 0 002 15.8a3 3 0 002 2c1.8.5 8 .5 8 .5s6.2 0 8-.5a3 3 0 002-2 31 31 0 00.3-3.8 31 31 0 00-.3-3.8zM10 15V9l5.2 3z"/>',
    tiktok: '<path d="M16 3c.4 2.4 1.9 3.9 4.3 4.1v3.3c-1.6 0-3-.5-4.3-1.3v6.4A6 6 0 1110 9.6v3.4a2.7 2.7 0 102.7 2.6V3z"/>',
    whatsapp: '<path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.3-.4.3-.4.8-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.8 11.9 11.9 0 004.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 001.8-1.3 2.3 2.3 0 00.2-1.3c-.1-.1-.3-.2-.5-.3z"/>',
    phone: '<path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.6 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.6 3.6a1 1 0 01-.25 1z"/>',
    mail: '<path d="M3 5h18v14H3z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 6l9 7 9-7" fill="none" stroke="currentColor" stroke-width="2"/>',
    pin: '<path d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z"/>',
    clock: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2"/>'
  };
  const svg = (n, s = 20) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="currentColor" aria-hidden="true">${ICONS[n] || ''}</svg>`;

  let DATA, LANG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const t = v => v == null ? '' : (typeof v === 'object' ? (v[LANG] || v.ar || v.en || '') : String(v));
  const T = v => esc(t(v));
  const u = k => UI[LANG][k];
  const paras = v => t(v).split(/\n\s*\n/).map(p => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('');
  let RAW = '';
  const P = src => (RAW && src && /^images\/uploads\//.test(src)) ? RAW + src : (src || '');
  const img = (src, alt = '', cls = '') => src ? `<img src="${esc(P(src))}" alt="${esc(alt)}" loading="lazy" class="${cls}">` : '';
  const S = () => DATA.settings;
  const waLink = (msg) => `https://wa.me/${(S().whatsapp || '').replace(/\D/g, '')}?text=${encodeURIComponent(msg || t(S().whatsappMessage))}`;
  const resolveLink = l => l === 'whatsapp' ? waLink() : (l || '#');
  const head = s => (s.kicker || s.title) ? `<div class="sec-head reveal">${s.kicker ? `<span class="kicker">${T(s.kicker)}</span>` : ''}${s.title ? `<h2>${T(s.title)}</h2>` : ''}${s.text && s.type !== 'richtext' && s.type !== 'video' ? `<p class="lead">${T(s.text)}</p>` : ''}</div>` : '';
  const ext = l => /^https?:/.test(l) ? ' target="_blank" rel="noopener"' : '';

  const R = {
    hero(s) {
      const slides = (s.slides || []).map((sl, i) => `
        <div class="slide${i === 0 ? ' active' : ''}">
          <div class="slide-bg" style="background-image:url('${esc(P(sl.image))}')"></div>
          <div class="container slide-content">
            ${sl.kicker ? `<span class="kicker light">${T(sl.kicker)}</span>` : ''}
            <h1>${T(sl.title)}</h1>
            <p>${T(sl.text)}</p>
            <div class="btns">${(s.buttons || []).map(b => `<a class="btn ${b.style === 'ghost' ? 'btn-ghost' : 'btn-primary'}" href="${esc(resolveLink(b.link))}"${ext(resolveLink(b.link))}>${T(b.label)}</a>`).join('')}</div>
          </div>
        </div>`).join('');
      const dots = (s.slides || []).length > 1 ? `<div class="dots">${s.slides.map((_, i) => `<button aria-label="${i + 1}" class="${i === 0 ? 'on' : ''}" data-i="${i}"></button>`).join('')}</div>` : '';
      return `<section class="hero" id="${esc(s.id)}" data-autoplay="${+s.autoplay || 0}">${slides}${dots}<a href="#${esc(nextId(s))}" class="scroll-down" aria-label="scroll"><span></span></a></section>`;
    },
    stats(s) {
      return `<section class="stats" id="${esc(s.id)}"><div class="container stats-grid">${(s.items || []).map(it => `
        <div class="stat reveal"><div class="stat-icon">${esc(it.icon || '')}</div><div class="stat-num"><span class="count" data-to="${+it.value || 0}">0</span><b>${esc(it.suffix || '')}</b></div><div class="stat-label">${T(it.label)}</div></div>`).join('')}</div></section>`;
    },
    about(s) {
      return `<section class="sec about" id="${esc(s.id)}"><div class="container split">
        <div class="about-media reveal">${img(s.image, t(s.title))}${s.badge ? `<div class="badge">✦ ${T(s.badge)}</div>` : ''}</div>
        <div class="about-text reveal">${s.kicker ? `<span class="kicker">${T(s.kicker)}</span>` : ''}<h2>${T(s.title)}</h2>${paras(s.text)}
          ${(s.bullets || []).length ? `<ul class="checks">${s.bullets.map(b => `<li>${T(b.text)}</li>`).join('')}</ul>` : ''}</div>
      </div></section>`;
    },
    products(s) {
      const cats = [...new Set((s.items || []).map(p => t(p.category)).filter(Boolean))];
      return `<section class="sec products" id="${esc(s.id)}"><div class="container">${head(s)}
        ${cats.length > 1 ? `<div class="filters reveal"><button class="on" data-cat="*">${u('all')}</button>${cats.map(c => `<button data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div>` : ''}
        <div class="prod-grid">${(s.items || []).map(p => `
          <article class="prod reveal" data-cat="${esc(t(p.category))}">
            <div class="prod-img">${img(p.image, t(p.name))}${p.category ? `<span class="tag">${T(p.category)}</span>` : ''}</div>
            <div class="prod-body"><h3>${T(p.name)}</h3><p>${T(p.description)}</p>
              <div class="meta">${p.season && t(p.season) ? `<span>🗓 ${u('season')}: ${T(p.season)}</span>` : ''}${p.origin && t(p.origin) ? `<span>📍 ${u('origin')}: ${T(p.origin)}</span>` : ''}</div>
              ${s.showQuoteButton ? `<a class="btn btn-sm btn-primary" target="_blank" rel="noopener" href="${esc(waLink(u('want') + ': ' + t(p.name)))}">${u('quote')}</a>` : ''}
            </div>
          </article>`).join('')}</div></div></section>`;
    },
    features(s) {
      return `<section class="sec features" id="${esc(s.id)}"><div class="container">${head(s)}<div class="feat-grid">${(s.items || []).map((f, i) => `
        <div class="feat reveal" style="--d:${i * 70}ms"><div class="feat-icon">${esc(f.icon || '')}</div><h3>${T(f.title)}</h3><p>${T(f.text)}</p></div>`).join('')}</div></div></section>`;
    },
    process(s) {
      return `<section class="sec process" id="${esc(s.id)}"><div class="container">${head(s)}<ol class="steps">${(s.steps || []).map((st, i) => `
        <li class="step reveal" style="--d:${i * 90}ms"><span class="num">${String(i + 1).padStart(2, '0')}</span><h3>${T(st.title)}</h3><p>${T(st.text)}</p></li>`).join('')}</ol></div></section>`;
    },
    markets(s) {
      const items = (s.items || []).map(m => `<div class="market"><span class="flag">${esc(m.flag || '🌐')}</span>${T(m.name)}</div>`).join('');
      return `<section class="sec markets" id="${esc(s.id)}"><div class="container">${head(s)}</div>
        <div class="marquee reveal"><div class="track">${items}${items}</div></div></section>`;
    },
    gallery(s) {
      return `<section class="sec gallery" id="${esc(s.id)}"><div class="container">${head(s)}<div class="gal-grid">${(s.images || []).map((g, i) => `
        <figure class="gal reveal" data-i="${i}">${img(g.src, t(g.caption))}${g.caption && t(g.caption) ? `<figcaption>${T(g.caption)}</figcaption>` : ''}</figure>`).join('')}</div></div></section>`;
    },
    logos(s) {
      return `<section class="sec logos" id="${esc(s.id)}"><div class="container">${head(s)}<div class="logo-grid">${(s.items || []).map(l => `
        <div class="logo-item reveal">${l.image ? img(l.image, l.name) : `<span>${esc(l.name)}</span>`}</div>`).join('')}</div></div></section>`;
    },
    testimonials(s) {
      return `<section class="sec testi" id="${esc(s.id)}"><div class="container">${head(s)}<div class="testi-grid">${(s.items || []).map(q => `
        <blockquote class="quote reveal"><div class="qmark">“</div><p>${T(q.text)}</p><footer><b>${T(q.name)}</b><span>${T(q.role)}</span></footer></blockquote>`).join('')}</div></div></section>`;
    },
    faq(s) {
      return `<section class="sec faq" id="${esc(s.id)}"><div class="container narrow">${head(s)}${(s.items || []).map(f => `
        <details class="qa reveal"><summary>${T(f.q)}</summary><div>${paras(f.a)}</div></details>`).join('')}</div></section>`;
    },
    cta(s) {
      const l = resolveLink(s.buttonLink);
      return `<section class="cta" id="${esc(s.id)}"><div class="cta-bg" style="background-image:url('${esc(P(s.image || ''))}')"></div><div class="container cta-inner reveal">
        <h2>${T(s.title)}</h2><p>${T(s.text)}</p><a class="btn btn-accent btn-lg" href="${esc(l)}"${ext(l)}>${s.buttonLink === 'whatsapp' ? svg('whatsapp') : ''} ${T(s.buttonLabel)}</a></div></section>`;
    },
    video(s) {
      const m = String(s.youtube || '').match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
      return `<section class="sec video" id="${esc(s.id)}"><div class="container narrow">${head(s)}${m ? `<div class="video-wrap reveal"><iframe src="https://www.youtube.com/embed/${m[1]}" title="video" allowfullscreen loading="lazy"></iframe></div>` : ''}${s.text ? `<div class="center">${paras(s.text)}</div>` : ''}</div></section>`;
    },
    richtext(s) {
      const media = s.image ? `<div class="rt-media reveal">${img(s.image, t(s.title))}</div>` : '';
      const body = `<div class="rt-body reveal">${s.kicker ? `<span class="kicker">${T(s.kicker)}</span>` : ''}${s.title ? `<h2>${T(s.title)}</h2>` : ''}${paras(s.text)}</div>`;
      return `<section class="sec richtext${s.dark ? ' dark' : ''}" id="${esc(s.id)}"><div class="container ${s.image ? 'split' : 'narrow'}">${s.imageSide === 'end' ? body + media : media + body}</div></section>`;
    },
    contact(s) {
      const st = S();
      const phones = (st.phones || []).map(p => `<a class="c-row" href="tel:${esc(String(p.number).replace(/[^\d+]/g, ''))}">${svg('phone')}<div><small>${T(p.label)}</small><b dir="ltr">${esc(p.number)}</b></div></a>`).join('');
      return `<section class="sec contact" id="${esc(s.id)}"><div class="container">${head(s)}<div class="contact-grid">
        <div class="contact-info reveal">
          ${phones}
          ${st.whatsapp ? `<a class="c-row wa" target="_blank" rel="noopener" href="${esc(waLink())}">${svg('whatsapp')}<div><small>WhatsApp</small><b dir="ltr">+${esc(st.whatsapp)}</b></div></a>` : ''}
          ${st.email ? `<a class="c-row" href="mailto:${esc(st.email)}">${svg('mail')}<div><small>${u('email')}</small><b>${esc(st.email)}</b></div></a>` : ''}
          ${t(st.address) ? `<div class="c-row">${svg('pin')}<div><small>${u('address')}</small><b>${T(st.address)}</b></div></div>` : ''}
          ${t(st.workHours) ? `<div class="c-row">${svg('clock')}<div><small>${u('hours')}</small><b>${T(st.workHours)}</b></div></div>` : ''}
        </div>
        <form class="contact-form reveal" data-to="${esc(s.formTo || 'whatsapp')}">
          <div class="row2"><label><span>${u('name')}</span><input name="name" required></label><label><span>${u('company')}</span><input name="company"></label></div>
          <div class="row2"><label><span>${u('phone')}</span><input name="phone" dir="ltr" required></label><label><span>${u('email')}</span><input name="email" type="email" dir="ltr"></label></div>
          <label><span>${u('product')}</span><input name="product"></label>
          <label><span>${u('message')}</span><textarea name="message" rows="4"></textarea></label>
          <button class="btn btn-primary btn-lg" type="submit">${u('send')} ${s.formTo === 'email' ? svg('mail') : svg('whatsapp')}</button>
        </form>
      </div>${s.showMap && st.mapEmbed ? `<div class="map reveal"><iframe src="${esc(st.mapEmbed)}" loading="lazy" title="map"></iframe></div>` : ''}</div></section>`;
    }
  };

  function nextId(s) { const v = DATA.sections.filter(x => x.visible !== false); const i = v.indexOf(s); return v[i + 1] ? v[i + 1].id : s.id; }

  function render() {
    const st = S();
    document.documentElement.lang = LANG;
    document.documentElement.dir = LANG === 'ar' ? 'rtl' : 'ltr';
    const c = st.colors || {};
    const root = document.documentElement.style;
    if (c.primary) root.setProperty('--primary', c.primary);
    if (c.accent) root.setProperty('--accent', c.accent);
    if (c.dark) root.setProperty('--dark', c.dark);
    if (c.light) root.setProperty('--light', c.light);
    document.title = `${t(st.name)} | ${t(st.subtitle)}`;
    const md = $('meta[name="description"]'); if (md) md.content = t(st.seoDescription);
    if (st.favicon) { let l = $('link[rel="icon"]'); l.href = P(st.favicon); }

    const vis = DATA.sections.filter(s => s.visible !== false);
    const nav = vis.filter(s => s.showInNav).map(s => `<a href="#${esc(s.id)}">${T(s.navLabel)}</a>`).join('');
    const brand = `<a href="#${esc(vis[0] ? vis[0].id : '')}" class="brand">${st.logo ? `<img src="${esc(P(st.logo))}" alt="${T(st.name)}">` : `<span class="brand-mark">🌾</span>`}<span class="brand-text"><b>${T(st.name)}</b><small>${T(st.subtitle)}</small></span></a>`;
    const socials = Object.entries(st.social || {}).filter(([, v]) => v).map(([k, v]) => `<a href="${esc(v)}" target="_blank" rel="noopener" aria-label="${k}">${svg(k, 18)}</a>`).join('');
    const firstPhone = (st.phones || [])[0];

    $('#app').innerHTML = `
      <div class="topbar"><div class="container topbar-in">
        <div class="tb-info">${firstPhone ? `<a href="tel:${esc(String(firstPhone.number).replace(/[^\d+]/g, ''))}">${svg('phone', 14)} <span dir="ltr">${esc(firstPhone.number)}</span></a>` : ''}${st.email ? `<a href="mailto:${esc(st.email)}">${svg('mail', 14)} ${esc(st.email)}</a>` : ''}</div>
        <div class="tb-social">${socials}</div>
      </div></div>
      <header class="nav" id="nav"><div class="container nav-in">${brand}
        <nav class="menu" id="menu">${nav}</nav>
        <div class="nav-actions"><button class="lang" id="langBtn">${u('langBtn')}</button>
        ${st.whatsapp ? `<a class="btn btn-accent btn-sm hide-sm" target="_blank" rel="noopener" href="${esc(waLink())}">${u('quote')}</a>` : ''}
        <button class="burger" id="burger" aria-label="${u('menu')}"><span></span><span></span><span></span></button></div>
      </div></header>
      <main>${vis.map(s => (R[s.type] ? R[s.type](s) : '')).join('')}</main>
      <footer class="footer"><div class="container foot-grid">
        <div>${brand}<p class="muted">${T(st.footerText)}</p><div class="foot-social">${socials}</div></div>
        <div><h4>${u('quick')}</h4>${nav}</div>
        <div><h4>${u('contact')}</h4>${(st.phones || []).map(p => `<a href="tel:${esc(String(p.number).replace(/[^\d+]/g, ''))}"><small>${T(p.label)}:</small> <span dir="ltr">${esc(p.number)}</span></a>`).join('')}${st.email ? `<a href="mailto:${esc(st.email)}">${esc(st.email)}</a>` : ''}${t(st.address) ? `<span>${T(st.address)}</span>` : ''}</div>
      </div><div class="copy">© ${new Date().getFullYear()} ${T(st.name)} — ${u('rights')}</div></footer>
      ${st.whatsapp ? `<a class="wa-float" target="_blank" rel="noopener" href="${esc(waLink())}" aria-label="WhatsApp">${svg('whatsapp', 30)}</a>` : ''}
      <button class="to-top" id="toTop" aria-label="top">↑</button>
      <div class="lightbox" id="lb"><button class="lb-x">✕</button><button class="lb-prev">‹</button><img alt=""><button class="lb-next">›</button><p></p></div>`;
    wire();
  }

  function wire() {
    $('#langBtn').onclick = () => { LANG = LANG === 'ar' ? 'en' : 'ar'; try { localStorage.setItem('lang', LANG); } catch (e) {} render(); };
    const nav = $('#nav'), menu = $('#menu');
    $('#burger').onclick = () => { nav.classList.toggle('open'); };
    $$('a[href^="#"]', menu).forEach(a => a.onclick = () => nav.classList.remove('open'));
    const onScroll = () => {
      nav.classList.toggle('scrolled', scrollY > 40);
      $('#toTop').classList.toggle('show', scrollY > 600);
      let cur = '';
      $$('main > section').forEach(s => { if (s.getBoundingClientRect().top < 140) cur = s.id; });
      $$('a', menu).forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
    };
    window.onscroll = onScroll; onScroll();
    $('#toTop').onclick = () => scrollTo({ top: 0, behavior: 'smooth' });

    // reveal + counters
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in'); io.unobserve(e.target);
      $$('.count', e.target).forEach(countUp);
    }), { threshold: .15 });
    $$('.reveal').forEach(el => io.observe(el));

    // hero
    $$('.hero').forEach(h => {
      const slides = $$('.slide', h), dots = $$('.dots button', h); let i = 0, timer;
      const go = n => { slides[i].classList.remove('active'); dots[i] && dots[i].classList.remove('on'); i = (n + slides.length) % slides.length; slides[i].classList.add('active'); dots[i] && dots[i].classList.add('on'); };
      dots.forEach(d => d.onclick = () => { go(+d.dataset.i); reset(); });
      const ap = +h.dataset.autoplay; const reset = () => { clearInterval(timer); if (ap && slides.length > 1) timer = setInterval(() => go(i + 1), ap * 1000); };
      reset();
    });

    // filters
    $$('.products').forEach(sec => $$('.filters button', sec).forEach(b => b.onclick = () => {
      $$('.filters button', sec).forEach(x => x.classList.remove('on')); b.classList.add('on');
      $$('.prod', sec).forEach(p => p.classList.toggle('hide', b.dataset.cat !== '*' && p.dataset.cat !== b.dataset.cat));
    }));

    // lightbox
    const lb = $('#lb'); let gal = [], gi = 0;
    const show = () => { const f = gal[gi]; $('img', lb).src = $('img', f).src; $('p', lb).textContent = ($('figcaption', f) || {}).textContent || ''; };
    $$('.gallery').forEach(sec => $$('.gal', sec).forEach(f => f.onclick = () => { gal = $$('.gal', sec); gi = +f.dataset.i; show(); lb.classList.add('open'); }));
    $('.lb-x', lb).onclick = () => lb.classList.remove('open');
    lb.onclick = e => { if (e.target === lb) lb.classList.remove('open'); };
    $('.lb-next', lb).onclick = () => { gi = (gi + 1) % gal.length; show(); };
    $('.lb-prev', lb).onclick = () => { gi = (gi - 1 + gal.length) % gal.length; show(); };
    document.onkeydown = e => { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') lb.classList.remove('open'); if (e.key === 'ArrowRight') $('.lb-next', lb).click(); if (e.key === 'ArrowLeft') $('.lb-prev', lb).click(); };

    // contact form
    $$('.contact-form').forEach(f => f.onsubmit = e => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(f));
      const lines = [`${u('hello')} ${d.name}`, d.company && `${u('company')}: ${d.company}`, `${u('phone')}: ${d.phone}`, d.email && `${u('email')}: ${d.email}`, d.product && `${u('product')}: ${d.product}`, d.message].filter(Boolean).join('\n');
      if (f.dataset.to === 'email') location.href = `mailto:${S().email}?subject=${encodeURIComponent(u('quote') + ' — ' + d.name)}&body=${encodeURIComponent(lines)}`;
      else window.open(waLink(lines), '_blank');
    });
  }

  function countUp(el) {
    const to = +el.dataset.to, dur = 1800, t0 = performance.now();
    const fmt = n => n.toLocaleString('en-US');
    const step = now => { const p = Math.min((now - t0) / dur, 1); el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  async function load() {
    const q = new URLSearchParams(location.search);
    if (q.has('preview')) { try { RAW = localStorage.getItem('site_draft_raw') || ''; const d = localStorage.getItem('site_draft'); if (d) { document.body.insertAdjacentHTML('afterbegin', '<div class="preview-bar">معاينة — التعديلات لم تُنشر بعد</div>'); return JSON.parse(d); } } catch (e) {} }
    const r = await fetch('site.json?v=' + Date.now());
    return r.json();
  }

  load().then(d => {
    DATA = d;
    let saved = null; try { saved = localStorage.getItem('lang'); } catch (e) {}
    LANG = saved || (d.settings.defaultLang || 'ar');
    render();
    document.body.classList.add('ready');
  }).catch(err => { $('#app').innerHTML = '<p style="padding:40px;text-align:center">تعذّر تحميل بيانات الموقع (site.json)</p>'; console.error(err); });
})();
