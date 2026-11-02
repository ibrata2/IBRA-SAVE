// IBRA SAVE — main process
// برمجة و تطوير ابراهيم الخزرجي — t.me/ibraprogram
const { app, BrowserWindow, ipcMain, dialog, shell, clipboard, nativeTheme } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');
const { spawn } = require('child_process');

const IS_WIN = process.platform === 'win32';
const USER = () => app.getPath('userData');
const BIN_DIR = () => path.join(USER(), 'bin');
const YTDLP = () => path.join(BIN_DIR(), IS_WIN ? 'yt-dlp.exe' : 'yt-dlp');
const SETTINGS_FILE = () => path.join(USER(), 'settings.json');
const HISTORY_FILE = () => path.join(USER(), 'history.json');
const YTDLP_URL = IS_WIN
  ? 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe'
  : process.platform === 'darwin'
    ? 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos'
    : 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux';

// ffmpeg-static lives inside app.asar.unpacked once packaged
function ffmpegPath() {
  let p;
  try { p = require('ffmpeg-static'); } catch { return null; }
  if (!p) return null;
  return p.replace('app.asar' + path.sep, 'app.asar.unpacked' + path.sep);
}

const DEFAULTS = {
  lang: 'ar',
  theme: 'glass-light',          // glass-light | glass-dark | system
  mode: 'auto',                  // auto | audio | mute
  quality: '1080',               // max 4320 2160 1440 1080 720 480 360 240 144
  codec: 'h264',                 // h264 | av1 | vp9
  audioFormat: 'mp3',            // best | mp3 | ogg | wav | opus | m4a
  audioBitrate: '320',           // 320 256 128 96 64 8
  filenameStyle: 'pretty',       // classic | basic | pretty | nerdy
  embedMetadata: true,
  embedThumbnail: true,
  allowPlaylist: false,
  subtitles: false,
  folder: '',
  maxConcurrent: 3,
  autoPasteOnFocus: false
};

function readJSON(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
}
function writeJSON(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}
function getSettings() {
  const s = { ...DEFAULTS, ...readJSON(SETTINGS_FILE(), {}) };
  if (!s.folder) s.folder = path.join(app.getPath('downloads'), 'IBRA SAVE');
  return s;
}

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1080,
    height: 760,
    minWidth: 420,
    minHeight: 600,
    backgroundColor: '#f2f2f4',
    title: 'IBRA SAVE',
    icon: path.join(__dirname, '..', 'assets', 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
}

// ---------- yt-dlp engine management ----------
function downloadFile(url, dest, onProgress, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 8) return reject(new Error('too many redirects'));
    https.get(url, { headers: { 'User-Agent': 'IBRA-SAVE' } }, res => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        res.resume();
        return resolve(downloadFile(new URL(res.headers.location, url).toString(), dest, onProgress, redirects + 1));
      }
      if (res.statusCode !== 200) { res.resume(); return reject(new Error('HTTP ' + res.statusCode)); }
      const total = +res.headers['content-length'] || 0;
      let got = 0;
      const tmp = dest + '.part';
      const out = fs.createWriteStream(tmp);
      res.on('data', c => { got += c.length; if (total && onProgress) onProgress(got / total); });
      res.pipe(out);
      out.on('finish', () => out.close(() => {
        fs.renameSync(tmp, dest);
        if (!IS_WIN) fs.chmodSync(dest, 0o755);
        resolve(dest);
      }));
      out.on('error', reject);
    }).on('error', reject);
  });
}

async function ensureEngine() {
  if (fs.existsSync(YTDLP())) return { ok: true };
  fs.mkdirSync(BIN_DIR(), { recursive: true });
  send('engine', { state: 'downloading', p: 0 });
  await downloadFile(YTDLP_URL, YTDLP(), p => send('engine', { state: 'downloading', p }));
  send('engine', { state: 'ready' });
  return { ok: true, fresh: true };
}

function runCapture(args) {
  return new Promise((resolve, reject) => {
    const p = spawn(YTDLP(), args, { windowsHide: true, env: { ...process.env, PYTHONUTF8: '1', PYTHONIOENCODING: 'utf-8' } });
    let out = '', err = '';
    p.stdout.on('data', d => out += d.toString('utf8'));
    p.stderr.on('data', d => err += d.toString('utf8'));
    p.on('error', reject);
    p.on('close', code => code === 0 ? resolve(out) : reject(new Error(cleanError(err) || ('exit ' + code))));
  });
}

function cleanError(text) {
  const lines = String(text).split(/\r?\n/).filter(l => /ERROR/i.test(l));
  return (lines.pop() || text.trim().split(/\r?\n/).pop() || '').replace(/^ERROR:\s*/i, '').slice(0, 400);
}

// ---------- building yt-dlp arguments from cobalt-style options ----------
const FILENAMES = {
  classic: '%(extractor)s_%(id)s.%(ext)s',
  basic: '%(title).150B.%(ext)s',
  pretty: '%(title).150B (%(extractor)s).%(ext)s',
  nerdy: '%(title).120B (%(extractor)s, %(id)s, %(resolution)s).%(ext)s'
};

function buildArgs(url, o) {
  const a = [
    '--newline', '--progress', '--no-colors', '--no-warnings', '--no-mtime',
    '--progress-template', 'download:IBRAPROG|%(progress._percent_str)s|%(progress._speed_str)s|%(progress._eta_str)s|%(progress._total_bytes_str)s%(progress._total_bytes_estimate_str)s',
    '--print', 'before_dl:IBRATITLE|%(title)s',
    '--print', 'after_move:IBRAFILE|%(filepath)s',
    '--no-simulate',
    '-P', o.folder,
    '-o', FILENAMES[o.filenameStyle] || FILENAMES.pretty,
    '--windows-filenames',
    '--retries', '10', '--fragment-retries', '10',
    '--concurrent-fragments', '4'
  ];
  const ff = ffmpegPath();
  if (ff && fs.existsSync(ff)) a.push('--ffmpeg-location', ff);
  a.push(o.allowPlaylist ? '--yes-playlist' : '--no-playlist');
  if (o.embedMetadata) a.push('--embed-metadata');

  const height = o.quality === 'max' ? null : parseInt(o.quality, 10);
  const vcodec = { h264: 'avc', av1: 'av01', vp9: 'vp9' }[o.codec] || 'avc';
  const sort = ['res' + (height ? ':' + height : ''), 'vcodec:' + vcodec, 'acodec:m4a'].join(',');

  if (o.mode === 'audio') {
    a.push('-f', 'ba/b', '-x');
    if (o.audioFormat !== 'best') {
      a.push('--audio-format', o.audioFormat);
      if (['mp3', 'ogg', 'opus', 'm4a'].includes(o.audioFormat)) a.push('--audio-quality', o.audioBitrate + 'K');
    }
    if (o.embedThumbnail && ['mp3', 'm4a', 'best', 'opus', 'ogg'].includes(o.audioFormat)) a.push('--embed-thumbnail');
  } else if (o.mode === 'mute') {
    // pure video stream; always strip audio (some sites only offer muxed files)
    a.push('-f', 'bv/bv*/b', '-S', sort, '--remux-video', o.codec === 'vp9' ? 'webm' : 'mp4');
    a.push('--use-postprocessor', 'FFmpegCopyStream', '--ppa', 'CopyStream:-c copy -an');
  } else {
    a.push('-f', 'bv*+ba/b', '-S', sort);
    a.push('--merge-output-format', o.codec === 'vp9' ? 'webm' : 'mp4');
    if (o.embedThumbnail && o.codec !== 'vp9') a.push('--embed-thumbnail');
    if (o.subtitles) a.push('--write-subs', '--sub-langs', 'ar.*,en.*', '--embed-subs');
  }
  a.push('--', url);
  return a;
}

// ---------- jobs ----------
const jobs = new Map();
const queue = [];
function send(ch, data) { if (win && !win.isDestroyed()) win.webContents.send(ch, data); }

function pump() {
  const s = getSettings();
  const running = [...jobs.values()].filter(j => j.proc).length;
  let free = Math.max(1, s.maxConcurrent) - running;
  while (free-- > 0 && queue.length) startJob(queue.shift());
}

function startJob(job) {
  fs.mkdirSync(job.opts.folder, { recursive: true });
  const proc = spawn(YTDLP(), buildArgs(job.url, job.opts), {
    windowsHide: true, env: { ...process.env, PYTHONUTF8: '1', PYTHONIOENCODING: 'utf-8' }
  });
  job.proc = proc;
  job.files = [];
  let errBuf = '';
  send('job', { id: job.id, state: 'running' });

  const onLine = line => {
    line = line.trim();
    if (!line) return;
    if (line.startsWith('IBRAPROG|')) {
      const [, pct, speed, eta, size] = line.split('|');
      send('job', { id: job.id, state: 'running', pct: parseFloat(pct) || 0, speed: speed.trim(), eta: eta.trim(), size: size.replace(/N\/?A/g, '').trim() });
    } else if (line.startsWith('IBRATITLE|')) {
      job.title = line.slice(10);
      send('job', { id: job.id, title: job.title });
    } else if (line.startsWith('IBRAFILE|')) {
      job.files.push(line.slice(9));
    } else if (/\[(Merger|ExtractAudio|VideoRemuxer|EmbedThumbnail|Metadata)\]/.test(line)) {
      send('job', { id: job.id, state: 'processing' });
    }
  };
  let buf = '';
  proc.stdout.on('data', d => { buf += d.toString('utf8'); const parts = buf.split(/\r?\n/); buf = parts.pop(); parts.forEach(onLine); });
  proc.stderr.on('data', d => { errBuf += d.toString('utf8'); });
  proc.on('error', e => finish(job, 'error', e.message));
  proc.on('close', code => {
    if (buf) onLine(buf);
    if (job.cancelled) return finish(job, 'cancelled');
    if (code === 0) finish(job, 'done');
    else finish(job, 'error', cleanError(errBuf) || ('exit ' + code));
  });
}

function finish(job, state, error) {
  job.proc = null;
  jobs.delete(job.id);
  const file = job.files && job.files[job.files.length - 1];
  send('job', { id: job.id, state, error, file, files: job.files });
  if (state === 'done') {
    const h = readJSON(HISTORY_FILE(), []);
    h.unshift({ id: job.id, url: job.url, title: job.title || job.url, file, mode: job.opts.mode, at: Date.now() });
    writeJSON(HISTORY_FILE(), h.slice(0, 200));
  }
  pump();
}

// ---------- IPC ----------
ipcMain.handle('settings:get', () => getSettings());
ipcMain.handle('settings:set', (_e, patch) => {
  const s = { ...getSettings(), ...patch };
  writeJSON(SETTINGS_FILE(), s);
  if (patch.theme) nativeTheme.themeSource = 'system';
  return s;
});
ipcMain.handle('engine:ensure', async () => {
  try { return await ensureEngine(); } catch (e) { send('engine', { state: 'error', error: e.message }); return { ok: false, error: e.message }; }
});
ipcMain.handle('engine:update', async () => {
  try {
    await ensureEngine();
    const out = await runCapture(['-U']);
    return { ok: true, out: out.trim().split(/\r?\n/).pop() };
  } catch (e) {
    // fallback: re-download fresh copy
    try { fs.rmSync(YTDLP(), { force: true }); await ensureEngine(); return { ok: true, out: 'reinstalled' }; }
    catch (e2) { return { ok: false, error: e2.message }; }
  }
});
ipcMain.handle('engine:version', async () => {
  try { return (await runCapture(['--version'])).trim(); } catch { return null; }
});

ipcMain.handle('info', async (_e, url) => {
  await ensureEngine();
  const out = await runCapture(['-J', '--no-warnings', '--no-playlist', '--', url]);
  const j = JSON.parse(out);
  const heights = [...new Set((j.formats || []).filter(f => f.vcodec && f.vcodec !== 'none' && f.height).map(f => f.height))].sort((a, b) => b - a);
  return {
    title: j.title, uploader: j.uploader || j.channel, duration: j.duration,
    thumbnail: j.thumbnail, extractor: j.extractor_key || j.extractor, heights
  };
});

ipcMain.handle('download', async (_e, { url, overrides }) => {
  await ensureEngine();
  const opts = { ...getSettings(), ...(overrides || {}) };
  const job = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), url, opts };
  jobs.set(job.id, job);
  queue.push(job);
  send('job', { id: job.id, state: 'queued', url, mode: opts.mode });
  pump();
  return job.id;
});
ipcMain.handle('cancel', (_e, id) => {
  const job = jobs.get(id);
  if (!job) return false;
  job.cancelled = true;
  const qi = queue.indexOf(job);
  if (qi >= 0) { queue.splice(qi, 1); finish(job, 'cancelled'); return true; }
  if (job.proc) {
    if (IS_WIN) spawn('taskkill', ['/pid', String(job.proc.pid), '/T', '/F'], { windowsHide: true });
    else job.proc.kill('SIGTERM');
  }
  return true;
});

ipcMain.handle('history:get', () => readJSON(HISTORY_FILE(), []));
ipcMain.handle('history:clear', () => { writeJSON(HISTORY_FILE(), []); return true; });

ipcMain.handle('pick:folder', async () => {
  const r = await dialog.showOpenDialog(win, { properties: ['openDirectory', 'createDirectory'] });
  return r.canceled ? null : r.filePaths[0];
});
ipcMain.handle('pick:file', async () => {
  const r = await dialog.showOpenDialog(win, {
    properties: ['openFile'],
    filters: [{ name: 'Media', extensions: ['mp4', 'mkv', 'webm', 'mov', 'm4a', 'mp3', 'ogg', 'opus', 'wav', 'flac', 'avi', 'ts', 'm4v', '3gp'] }]
  });
  return r.canceled ? null : r.filePaths[0];
});
ipcMain.handle('open:file', (_e, p) => shell.openPath(p));
ipcMain.handle('open:folder', (_e, p) => {
  if (p && fs.existsSync(p) && fs.statSync(p).isFile()) shell.showItemInFolder(p);
  else shell.openPath(p || getSettings().folder);
});
ipcMain.handle('open:url', (_e, u) => { if (/^https?:\/\//.test(u)) shell.openExternal(u); });
ipcMain.handle('clipboard:read', () => clipboard.readText());

// Remux: re-pack a file into a clean container without re-encoding (like cobalt's remux)
ipcMain.handle('remux', async (_e, { file, container }) => {
  const ff = ffmpegPath();
  if (!ff || !fs.existsSync(ff)) throw new Error('ffmpeg not found');
  const ext = container === 'same' ? path.extname(file).slice(1) : container;
  const base = path.join(path.dirname(file), path.basename(file, path.extname(file)) + ' (remux).' + ext);
  const args = ['-y', '-hide_banner', '-i', file, '-map', '0', '-c', 'copy', '-map_metadata', '0'];
  if (ext === 'mp4' || ext === 'mov' || ext === 'm4a') args.push('-movflags', '+faststart');
  if (ext === 'mp4') args.push('-dn', '-sn');
  args.push(base);
  return new Promise((resolve, reject) => {
    const p = spawn(ff, args, { windowsHide: true });
    let err = '', dur = 0;
    p.stderr.on('data', d => {
      const s = d.toString();
      err += s;
      const md = /Duration: (\d+):(\d+):([\d.]+)/.exec(s);
      if (md) dur = (+md[1]) * 3600 + (+md[2]) * 60 + parseFloat(md[3]);
      const mt = /time=(\d+):(\d+):([\d.]+)/.exec(s);
      if (mt && dur) send('remux', { pct: Math.min(100, ((+mt[1]) * 3600 + (+mt[2]) * 60 + parseFloat(mt[3])) / dur * 100) });
    });
    p.on('close', code => code === 0 ? resolve(base) : reject(new Error(err.trim().split(/\r?\n/).pop())));
  });
});

ipcMain.handle('app:version', () => app.getVersion());

// ---------- auto update (installs over the current version) ----------
function setupUpdater() {
  if (!app.isPackaged) return;
  let autoUpdater;
  try { ({ autoUpdater } = require('electron-updater')); } catch { return; }
  autoUpdater.autoDownload = true;
  autoUpdater.on('update-available', i => send('update', { state: 'available', version: i.version }));
  autoUpdater.on('download-progress', p => send('update', { state: 'downloading', pct: p.percent }));
  autoUpdater.on('update-downloaded', i => send('update', { state: 'ready', version: i.version }));
  autoUpdater.on('error', () => {});
  ipcMain.handle('update:install', () => autoUpdater.quitAndInstall(false, true));
  autoUpdater.checkForUpdates().catch(() => {});
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) app.quit();
else {
  app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
  app.whenReady().then(() => {
    createWindow();
    setupUpdater();
  });
  app.on('window-all-closed', () => {
    for (const j of jobs.values()) if (j.proc) try { j.proc.kill(); } catch {}
    app.quit();
  });
}

module.exports = { buildArgs };
