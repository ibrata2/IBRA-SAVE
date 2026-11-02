// IBRA SAVE — renderer
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const T = {
  ar: {
    nav_save: 'حفظ', nav_remux: 'ريمكس', nav_history: 'السجل', nav_settings: 'الإعدادات', nav_about: 'حول',
    supported: 'المواقع المدعومة', placeholder: 'الصق الرابط هنا', paste: 'لصق',
    m_auto: 'تلقائي', m_audio: 'صوت', m_mute: 'بدون صوت',
    terms: 'حمّل فقط المحتوى المسموح لك بحفظه، واحترم حقوق أصحابه.',
    remux_title: 'ريمكس', remux_desc: 'يصلّح ملفات الفيديو والصوت اللي ما تشتغل أو معلوماتها خربانة، ويعيد تغليفها بصيغة ثانية بدون إعادة ترميز — بدون فقدان جودة وخلال ثواني. كل شي يصير على جهازك.',
    drop: 'اسحب الملف هنا أو اضغط للاختيار', container: 'الصيغة الناتجة', same: 'نفس الصيغة', remux_go: 'ابدأ الريمكس',
    clear: 'مسح', open: 'فتح', change: 'تغيير',
    s_video: 'الفيديو', s_quality: 'الجودة', s_codec: 'الترميز المفضّل',
    s_codec_hint: 'H264 يشتغل بكل مكان. AV1 حجمه أصغر وجودته أعلى بس بعض الأجهزة القديمة ما تشغّله. VP9 يطلع WEBM.',
    s_subs: 'تحميل الترجمة (عربي/إنكليزي) ودمجها', s_audio: 'الصوت', s_aformat: 'صيغة الصوت', s_bitrate: 'جودة الصوت (kbps)',
    s_cover: 'إضافة صورة الغلاف للملف الصوتي', s_files: 'الملفات', s_folder: 'مجلد الحفظ', s_fname: 'شكل اسم الملف',
    fn_classic: 'كلاسيكي', fn_basic: 'بسيط', fn_pretty: 'مرتب', fn_nerdy: 'تفصيلي',
    s_meta: 'حفظ معلومات الفيديو داخل الملف (العنوان، الناشر...)', s_playlist: 'تحميل القائمة كاملة إذا الرابط قائمة تشغيل',
    s_autopaste: 'لصق الرابط تلقائياً لما ترجع للبرنامج', s_concurrent: 'عدد التحميلات بنفس الوقت',
    s_engine: 'محرك التحميل', s_engine_ver: 'الإصدار', s_engine_upd: 'تحديث المحرك',
    max: 'أعلى جودة', best: 'الأصلية',
    about_text: 'IBRA SAVE يخليك تحفظ أي فيديو أو صوت أو صورة من مواقع التواصل بلصقة رابط — بدون إعلانات، بدون تتبع، وبدون اشتراكات.',
    ab1: 'تلقائي: فيديو مع الصوت بالجودة اللي تختارها', ab2: 'صوت: يسحب الصوت فقط MP3 / OGG / WAV / OPUS',
    ab3: 'بدون صوت: الفيديو فقط بدون ما يحمّل الصوت', ab4: 'ريمكس: يصلّح الملفات ويغيّر صيغتها بدون فقدان جودة',
    credit: 'برمجة و تطوير ابراهيم الخزرجي',
    about_thanks: 'مستوحى من فكرة cobalt.tools المفتوحة المصدر، ويعتمد على محرك yt-dlp وffmpeg.',
    services_note: 'وأكثر من 1000 موقع ثاني يدعمه المحرك. إذا رابط ما اشتغل حدّث المحرك من الإعدادات.',
    engine_setup: 'جاري تجهيز محرك التحميل لأول مرة...',
    q_queued: 'بالانتظار', q_running: 'جاري التحميل', q_processing: 'جاري المعالجة', q_done: 'اكتمل', q_error: 'فشل', q_cancelled: 'أُلغي',
    t_invalid: 'الرابط غير صحيح', t_added: 'انضاف للتحميل', t_saved: 'انحفظ ✓', t_clip_empty: 'الحافظة ما بيها رابط',
    remux_done: 'تم! انحفظ بجانب الملف الأصلي', remux_working: 'جاري الريمكس...',
    no_history: 'ماكو تحميلات بعد', upd_ready: 'نسخة جديدة جاهزة', upd_install: 'ثبّت الآن', upd_dl: 'جاري تنزيل التحديث',
    engine_ok: 'تم تحديث المحرك', fetching: 'جاري جلب المعلومات...'
  },
  en: {
    nav_save: 'Save', nav_remux: 'Remux', nav_history: 'History', nav_settings: 'Settings', nav_about: 'About',
    supported: 'supported services', placeholder: 'paste the link here', paste: 'paste',
    m_auto: 'auto', m_audio: 'audio', m_mute: 'mute',
    terms: 'Only save content you have the right to save, and respect its creators.',
    remux_title: 'Remux', remux_desc: 'Fixes media files that won\'t play or have broken metadata, and re-packs them into another container without re-encoding — no quality loss, in seconds. Everything happens on your device.',
    drop: 'drop a file here or click to pick', container: 'output container', same: 'same', remux_go: 'start remux',
    clear: 'clear', open: 'open', change: 'change',
    s_video: 'Video', s_quality: 'quality', s_codec: 'preferred codec',
    s_codec_hint: 'H264 plays everywhere. AV1 is smaller and sharper but older devices may not play it. VP9 gives WEBM.',
    s_subs: 'download & embed subtitles (ar/en)', s_audio: 'Audio', s_aformat: 'audio format', s_bitrate: 'bitrate (kbps)',
    s_cover: 'embed cover art in audio files', s_files: 'Files', s_folder: 'save folder', s_fname: 'filename style',
    fn_classic: 'classic', fn_basic: 'basic', fn_pretty: 'pretty', fn_nerdy: 'nerdy',
    s_meta: 'embed metadata (title, uploader...)', s_playlist: 'download whole playlist when the link is one',
    s_autopaste: 'auto-paste link when the app regains focus', s_concurrent: 'simultaneous downloads',
    s_engine: 'Download engine', s_engine_ver: 'version', s_engine_upd: 'update engine',
    max: 'max', best: 'original',
    about_text: 'IBRA SAVE lets you save any video, audio or image from social sites with one pasted link — no ads, no tracking, no subscriptions.',
    ab1: 'auto: video with audio at your chosen quality', ab2: 'audio: extract audio only as MP3 / OGG / WAV / OPUS',
    ab3: 'mute: the video only, audio is skipped', ab4: 'remux: repair files and change container losslessly',
    credit: 'Developed by Ibrahim Al-Khazraji',
    about_thanks: 'Inspired by the open-source cobalt.tools; powered by yt-dlp and ffmpeg.',
    services_note: 'Plus 1000+ more sites the engine supports. If a link fails, update the engine in settings.',
    engine_setup: 'Setting up the download engine for the first time...',
    q_queued: 'queued', q_running: 'downloading', q_processing: 'processing', q_done: 'done', q_error: 'failed', q_cancelled: 'cancelled',
    t_invalid: 'That link is not valid', t_added: 'Added to downloads', t_saved: 'Saved ✓', t_clip_empty: 'No link on the clipboard',
    remux_done: 'Done! Saved next to the original', remux_working: 'Remuxing...',
    no_history: 'No downloads yet', upd_ready: 'New version ready', upd_install: 'install now', upd_dl: 'Downloading update',
    engine_ok: 'Engine updated', fetching: 'Fetching info...'
  }
};

const SERVICES = ['YouTube', 'YouTube Music', 'YouTube Shorts', 'TikTok', 'Instagram', 'Facebook', 'X / Twitter', 'Reddit', 'Snapchat',
  'Pinterest', 'Threads', 'Bluesky', 'Tumblr', 'SoundCloud', 'Vimeo', 'Dailymotion', 'Twitch clips', 'Bilibili', 'VK', 'OK.ru',
  'Rutube', 'Streamable', 'Loom', 'Xiaohongshu', 'Kick', 'Telegram (public)', 'Likee', 'Mixcloud', 'Bandcamp', 'Imgur'];

let S = {};
let lang = 'ar';
const t = k => (T[lang] && T[lang][k]) || T.ar[k] || k;

function applyLang() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  $$('[data-i]').forEach(el => { el.textContent = t(el.dataset.i); });
  $$('[data-ph]').forEach(el => { el.placeholder = t(el.dataset.ph); });
  $('#langBtn').textContent = lang === 'ar' ? 'EN' : 'ع';
  renderFnPreview();
  $$('.job').forEach(el => el._refresh && el._refresh());
}
function applyTheme() { document.documentElement.dataset.theme = S.theme || 'glass-light'; }

function toast(msg, err) {
  const el = $('#toast');
  el.textContent = msg;
  el.className = 'toast' + (err ? ' err' : '');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.add('hidden'), 3200);
}

// ---------- navigation ----------
$$('.nav').forEach(b => b.addEventListener('click', () => {
  $$('.nav').forEach(x => x.classList.toggle('on', x === b));
  $$('.page').forEach(p => p.classList.toggle('on', p.id === 'page-' + b.dataset.page));
  if (b.dataset.page === 'history') loadHistory();
  if (b.dataset.page === 'settings') loadEngineVer();
}));

// ---------- settings binding ----------
function bindSettings() {
  $$('.seg[data-key]').forEach(seg => {
    const key = seg.dataset.key;
    const mark = () => $$('button', seg).forEach(b => b.classList.toggle('on', String(S[key]) === b.dataset.v));
    mark();
    seg.addEventListener('click', async e => {
      const b = e.target.closest('button'); if (!b) return;
      const v = key === 'maxConcurrent' ? +b.dataset.v : b.dataset.v;
      S = await ibra.setSettings({ [key]: v }); mark(); renderFnPreview();
    });
  });
  $$('input[type=checkbox][data-key]').forEach(cb => {
    cb.checked = !!S[cb.dataset.key];
    cb.addEventListener('change', async () => { S = await ibra.setSettings({ [cb.dataset.key]: cb.checked }); });
  });
  $('#folderPath').textContent = S.folder;
  $('#pickFolder').onclick = async () => { const f = await ibra.pickFolder(); if (f) { S = await ibra.setSettings({ folder: f }); $('#folderPath').textContent = f; } };
  $('#openFolder').onclick = () => ibra.openFolder(S.folder);
}
function renderFnPreview() {
  const ex = { classic: 'youtube_dQw4w9WgXcQ.mp4', basic: 'Video Title.mp4', pretty: 'Video Title (Youtube).mp4', nerdy: 'Video Title (Youtube, dQw4w9WgXcQ, 1920x1080).mp4' };
  const el = $('#fnPreview'); if (el) el.textContent = ex[S.filenameStyle] || '';
}

// ---------- mode ----------
function markMode() { $$('#modeSeg button').forEach(b => b.classList.toggle('on', b.dataset.mode === S.mode)); }
$('#modeSeg').addEventListener('click', async e => {
  const b = e.target.closest('button'); if (!b) return;
  S = await ibra.setSettings({ mode: b.dataset.mode }); markMode();
});

// ---------- omnibox ----------
const urlIn = $('#url'), go = $('#go');
const validUrl = s => { try { const u = new URL(s.trim()); return /^https?:$/.test(u.protocol) && u.hostname.includes('.'); } catch { return false; } };
let previewTimer, lastPreview = '';
urlIn.addEventListener('input', () => {
  const v = urlIn.value.trim();
  go.disabled = !validUrl(v);
  $('#clearUrl').classList.toggle('hidden', !v);
  clearTimeout(previewTimer);
  if (validUrl(v)) previewTimer = setTimeout(() => showPreview(v), 700);
  else $('#preview').classList.add('hidden');
});
urlIn.addEventListener('keydown', e => { if (e.key === 'Enter' && !go.disabled) start(); });
$('#clearUrl').onclick = () => { urlIn.value = ''; urlIn.dispatchEvent(new Event('input')); urlIn.focus(); };
go.onclick = start;

async function pasteFromClipboard(andGo) {
  const txt = (await ibra.readClipboard() || '').trim();
  const m = txt.match(/https?:\/\/\S+/);
  if (!m) { if (andGo) toast(t('t_clip_empty'), true); return false; }
  urlIn.value = m[0]; urlIn.dispatchEvent(new Event('input'));
  if (andGo) start();
  return true;
}
$('#pasteBtn').onclick = () => pasteFromClipboard(true);
window.addEventListener('focus', () => { if (S.autoPasteOnFocus && !urlIn.value) pasteFromClipboard(false); });
document.addEventListener('drop', e => {
  const txt = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
  if (txt && validUrl(txt.trim()) && $('#page-save').classList.contains('on')) { e.preventDefault(); urlIn.value = txt.trim(); urlIn.dispatchEvent(new Event('input')); }
});

async function showPreview(url) {
  if (url === lastPreview) return;
  lastPreview = url;
  const box = $('#preview');
  box.classList.remove('hidden');
  box.innerHTML = `<div class="m">${t('fetching')}</div>`;
  try {
    const i = await ibra.info(url);
    if (urlIn.value.trim() !== url) return;
    const dur = i.duration ? new Date(i.duration * 1000).toISOString().substr(i.duration >= 3600 ? 11 : 14, i.duration >= 3600 ? 8 : 5) : '';
    const top = i.heights && i.heights[0] ? i.heights[0] + 'p' : '';
    box.innerHTML = '';
    if (i.thumbnail) { const img = new Image(); img.src = i.thumbnail; img.referrerPolicy = 'no-referrer'; img.onerror = () => img.remove(); box.append(img); }
    const d = document.createElement('div');
    d.innerHTML = `<div class="t"></div><div class="m"></div>`;
    d.querySelector('.t').textContent = i.title || url;
    d.querySelector('.m').textContent = [i.extractor, i.uploader, dur, top].filter(Boolean).join(' · ');
    box.append(d);
  } catch { box.classList.add('hidden'); }
}

async function start() {
  const url = urlIn.value.trim();
  if (!validUrl(url)) return toast(t('t_invalid'), true);
  go.classList.add('busy');
  try {
    await ibra.download(url, { mode: S.mode });
    urlIn.value = ''; urlIn.dispatchEvent(new Event('input'));
    $('#preview').classList.add('hidden'); lastPreview = '';
  } catch (e) { toast(String(e.message || e).replace(/^Error invoking remote method '[^']+': (Error: )?/, ''), true); }
  go.classList.remove('busy');
}

// ---------- queue ----------
const ICONS = {
  auto: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9l5 3-5 3z"/></svg>',
  audio: '<svg viewBox="0 0 24 24"><path d="M9 18V6l11-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>',
  mute: '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4zM17 9l5 6m0-6-5 6"/></svg>',
  open: '<svg viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
  folder: '<svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  retry: '<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 14-5.3L20 9m0-5v5h-5M20 12a8 8 0 0 1-14 5.3L4 15m0 5v-5h5"/></svg>'
};
const jobEls = {};
ibra.onJob(d => {
  let el = jobEls[d.id];
  if (!el) {
    el = document.createElement('div');
    el.className = 'job glass';
    el.innerHTML = `<div class="ic">${ICONS[d.mode] || ICONS.auto}</div><div class="body"><div class="ttl"></div><div class="meta"></div><div class="bar indet"><i></i></div></div><div class="acts"></div>`;
    el._d = { url: d.url, mode: d.mode, state: 'queued' };
    el._refresh = () => renderJob(el, d.id);
    jobEls[d.id] = el;
    $('#queue').prepend(el);
  }
  Object.assign(el._d, Object.fromEntries(Object.entries(d).filter(([, v]) => v !== undefined)));
  renderJob(el, d.id);
  if (d.state === 'done') toast(t('t_saved'));
  if (d.state === 'error') toast(d.error || t('q_error'), true);
});

function renderJob(el, id) {
  const d = el._d;
  el.classList.toggle('done', d.state === 'done');
  $('.ttl', el).textContent = d.title || (d.file ? d.file.split(/[\\/]/).pop() : d.url);
  const meta = $('.meta', el), bar = $('.bar', el), acts = $('.acts', el);
  meta.classList.toggle('err', d.state === 'error');
  if (d.state === 'running' && d.pct != null) {
    const parts = [t('q_running'), (d.pct || 0).toFixed(1) + '%', d.size, d.speed, d.eta && d.eta !== 'NA' ? 'ETA ' + d.eta : ''].filter(x => x && x !== 'N/A');
    meta.textContent = '';
    parts.forEach((p, i) => { if (i) meta.append(' · '); const b = document.createElement('bdi'); b.textContent = p; meta.append(b); });
    bar.classList.remove('indet', 'hidden'); $('i', bar).style.width = d.pct + '%';
  } else if (['queued', 'running', 'processing'].includes(d.state)) {
    meta.textContent = t('q_' + d.state); bar.classList.add('indet'); bar.classList.remove('hidden');
  } else {
    meta.textContent = d.state === 'error' ? (d.error || t('q_error')) : t('q_' + d.state);
    bar.classList.add('hidden');
  }
  acts.innerHTML = '';
  const btn = (ic, fn) => { const b = document.createElement('button'); b.innerHTML = ICONS[ic]; b.onclick = fn; acts.append(b); };
  if (['queued', 'running', 'processing'].includes(d.state)) btn('x', () => ibra.cancel(id));
  if (d.state === 'done' && d.file) { btn('open', () => ibra.openFile(d.file)); btn('folder', () => ibra.openFolder(d.file)); }
  if (d.state === 'error' || d.state === 'cancelled') {
    btn('retry', () => { el.remove(); delete jobEls[id]; ibra.download(d.url, { mode: d.mode }); });
    btn('x', () => { el.remove(); delete jobEls[id]; });
  }
}

// ---------- history ----------
async function loadHistory() {
  const h = await ibra.history();
  const list = $('#historyList'); list.innerHTML = '';
  if (!h.length) { list.innerHTML = `<div class="empty">${t('no_history')}</div>`; return; }
  for (const it of h) {
    const el = document.createElement('div');
    el.className = 'job glass done';
    el.innerHTML = `<div class="ic">${ICONS[it.mode] || ICONS.auto}</div><div class="body"><div class="ttl"></div><div class="meta"></div></div><div class="acts"></div>`;
    $('.ttl', el).textContent = it.title;
    $('.meta', el).textContent = new Date(it.at).toLocaleString(lang === 'ar' ? 'ar-IQ' : 'en-GB') + ' · ' + (() => { try { return new URL(it.url).hostname.replace(/^www\./, ''); } catch { return ''; } })();
    const acts = $('.acts', el);
    for (const [ic, fn] of [['open', () => ibra.openFile(it.file)], ['folder', () => ibra.openFolder(it.file)], ['retry', () => { ibra.download(it.url, { mode: it.mode }); $('.nav[data-page=save]').click(); }]]) {
      const b = document.createElement('button'); b.innerHTML = ICONS[ic]; b.onclick = fn; acts.append(b);
    }
    list.append(el);
  }
}
$('#clearHist').onclick = async () => { await ibra.clearHistory(); loadHistory(); };

// ---------- remux ----------
let remuxFile = null, remuxContainer = 'same';
const setRemuxFile = f => { remuxFile = f; $('#remuxFile').textContent = f || ''; $('#remuxGo').disabled = !f; $('#remuxStatus').textContent = ''; };
$('#drop').onclick = async () => { const f = await ibra.pickFile(); if (f) setRemuxFile(f); };
['dragover', 'dragenter'].forEach(ev => $('#drop').addEventListener(ev, e => { e.preventDefault(); $('#drop').classList.add('over'); }));
['dragleave', 'drop'].forEach(ev => $('#drop').addEventListener(ev, () => $('#drop').classList.remove('over')));
$('#drop').addEventListener('drop', e => { e.preventDefault(); e.stopPropagation(); const f = e.dataTransfer.files[0]; const fp = f && ibra.filePath(f); if (fp) setRemuxFile(fp); });
$('#containerSeg').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  remuxContainer = b.dataset.v; $$('#containerSeg button').forEach(x => x.classList.toggle('on', x === b));
});
ibra.onRemux(d => { $('#remuxBar i').style.width = d.pct + '%'; });
$('#remuxGo').onclick = async () => {
  $('#remuxGo').disabled = true; $('#remuxBar').classList.remove('hidden'); $('#remuxBar i').style.width = '0';
  $('#remuxStatus').textContent = t('remux_working');
  try {
    const out = await ibra.remux(remuxFile, remuxContainer);
    $('#remuxBar i').style.width = '100%';
    $('#remuxStatus').textContent = t('remux_done');
    ibra.openFolder(out);
  } catch (e) { $('#remuxStatus').textContent = String(e.message || e).replace(/^Error invoking remote method '[^']+': (Error: )?/, ''); }
  $('#remuxGo').disabled = false;
};

// ---------- services modal ----------
$('#servicesList').innerHTML = SERVICES.map(s => `<span>${s}</span>`).join('');
$('#servicesBtn').onclick = () => $('#servicesModal').classList.remove('hidden');
$('#servicesModal').addEventListener('click', e => { if (e.target.id === 'servicesModal' || e.target.closest('[data-close]')) $('#servicesModal').classList.add('hidden'); });

// ---------- engine ----------
ibra.onEngine(d => {
  const ov = $('#engineOverlay');
  if (d.state === 'downloading') { ov.classList.remove('hidden'); $('#engineBar').style.width = Math.round((d.p || 0) * 100) + '%'; }
  else ov.classList.add('hidden');
  if (d.state === 'error') toast(d.error, true);
});
async function loadEngineVer() { $('#engineVer').textContent = (await ibra.engineVersion()) || '—'; }
$('#updEngine').onclick = async () => {
  $('#updEngine').disabled = true; $('#engineMsg').textContent = '...';
  const r = await ibra.updateEngine();
  $('#engineMsg').textContent = r.ok ? t('engine_ok') + ' — ' + (r.out || '') : r.error;
  $('#updEngine').disabled = false; loadEngineVer();
};

// ---------- app update ----------
ibra.onUpdate(d => {
  const bar = $('#updateBar');
  if (d.state === 'downloading') { bar.classList.remove('hidden'); bar.textContent = `${t('upd_dl')} ${Math.round(d.pct || 0)}%`; }
  if (d.state === 'ready') {
    bar.classList.remove('hidden'); bar.innerHTML = '';
    const s = document.createElement('span'); s.textContent = `${t('upd_ready')} (v${d.version})`;
    const b = document.createElement('button'); b.className = 'primary'; b.textContent = t('upd_install'); b.onclick = () => ibra.installUpdate();
    bar.append(s, b);
  }
});

// ---------- header buttons ----------
$('#langBtn').onclick = async () => { lang = lang === 'ar' ? 'en' : 'ar'; S = await ibra.setSettings({ lang }); applyLang(); };
$('#themeBtn').onclick = async () => {
  const order = ['glass-light', 'glass-dark', 'system'];
  S = await ibra.setSettings({ theme: order[(order.indexOf(S.theme) + 1) % order.length] }); applyTheme();
};
$$('[data-url]').forEach(b => b.onclick = () => ibra.openUrl(b.dataset.url));

// ---------- boot ----------
(async () => {
  S = await ibra.getSettings();
  lang = S.lang || 'ar';
  applyTheme(); applyLang(); markMode(); bindSettings();
  $('#appVer').textContent = 'v' + (await ibra.appVersion());
  urlIn.focus();
  ibra.ensureEngine();
})();
