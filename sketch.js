// =====================================================
//  CAPA DE CÁMARA · adentro afuera · Interludio: Martes
//  Se pone ENCIMA de tu cámara en OBS. El fondo es transparente.
//  Cambia de momento sola cuando el loop llega a cada uno.
// =====================================================
//  CONTROLES (en la ventana "Interactuar" de esta fuente)
//  Espacio / →   siguiente frase del momento
//  ←             frase anterior
//  0             entrada (antes de los cuatro momentos)
//  1 2 3 4       Autenticidad · Integridad · Fiabilidad · Disponibilidad
//  H             ocultar / mostrar subtítulos
//  R             volver a la entrada
// =====================================================

// ---------- 1. EDITA AQUÍ TUS FRASES ----------
// Cada momento tiene su pregunta y las frases que dices (una por línea).
// Son un borrador: cámbialas por tus propias palabras.
const MOMENTOS = {
  ENTRADA: {
    num: '00', titulo: 'MARTES', pregunta: 'mi trayecto no tiene calles: tiene horas',
    frases: [
      'Mi trayecto no tiene calles. Tiene horas.',
      'De 09:14 a 17:52, mi ciudad es una ventana de chat.'
    ]
  },
  AUTENTICIDAD: {
    num: '01', titulo: 'AUTENTICIDAD', pregunta: '¿quién escribió esto?',
    frases: [
      'Este párrafo lo escribimos entre las dos.',
      'Una de nosotras no tiene cuerpo.',
      'Adivinen cuál parte es mía.'
    ]
  },
  INTEGRIDAD: {
    num: '02', titulo: 'INTEGRIDAD', pregunta: '¿qué se perdió?',
    frases: [
      'Le pedí que sonara a mí.',
      'Me devolvió una versión más correcta de alguien que no soy.'
    ]
  },
  FIABILIDAD: {
    num: '03', titulo: 'FIABILIDAD', pregunta: '¿en qué confío?',
    frases: [
      'Se equivocó con total seguridad.',
      'Llevo años verificando documentos. Ahora verifico a quien me ayuda a escribirlos.'
    ]
  },
  DISPONIBILIDAD: {
    num: '04', titulo: 'DISPONIBILIDAD', pregunta: '¿qué recuerdas de mí?',
    frases: [
      'Le pregunté qué recuerda de mí.',
      'Me respondió con un expediente.'
    ]
  }
};

const TITULO   = 'Adentro-afuera.- Interludio: Martes';
const NOMBRE   = 'JIMÉNEZ RONCANCIO LAURA D.';

// Imágenes de referencia: sube estos archivos al mismo repositorio
// (PNG o JPG). Si un archivo no existe, ese momento no muestra imagen.
const IMAGENES = {
  AUTENTICIDAD:   'ref-autenticidad.png',
  INTEGRIDAD:     'ref-integridad.png',
  FIABILIDAD:     'ref-fiabilidad.png',
  DISPONIBILIDAD: 'ref-disponibilidad.png'
};
const PIE_IMAGEN = 'IMAGEN DE REFERENCIA';
const MARQUEE  = '¿quién escribió esto? · ¿qué se perdió? · ¿en qué confío? · ¿qué recuerdas de mí? · ';
const SPEED    = 0.035;  // letras por milisegundo de los subtítulos
const SCANLINES = true;  // líneas de escáner sobre la cámara (true / false)

// ---------- No hace falta tocar nada de aquí para abajo ----------
const W = 1200, H = 1080;
const G = { bright: '#33FF77', mid: '#1FC25A', dim: '#0E7A36', white: '#E6FFEC', red: '#FF3B3B' };
const FONT = 'IBM Plex Mono';
const ORDEN = ['ENTRADA', 'AUTENTICIDAD', 'INTEGRIDAD', 'FIABILIDAD', 'DISPONIBILIDAD'];

let momento = 'ENTRADA', frase = 0, fraseStart = 0, momentoStart = 0;
let showSubs = true, marqueeX = 0, scaleF = 1, t0 = 0;

let canal = null;
try {
  canal = new BroadcastChannel('adentro-afuera');
  canal.onmessage = (e) => {
    const m = e.data && e.data.momento;
    cambiar(m && MOMENTOS[m] ? m : 'ENTRADA');
  };
} catch (e) { canal = null; }

const refs = {};
function preload() {
  Object.keys(IMAGENES).forEach(k => {
    refs[k] = null;
    loadImage(IMAGENES[k], img => { refs[k] = img; }, () => { refs[k] = null; });
  });
}

function setup() {
  createCanvas(10, 10);
  fitCanvas();
  t0 = millis();
  cambiar('ENTRADA', true);
}
function fitCanvas() {
  scaleF = Math.min(windowWidth / W, windowHeight / H);
  resizeCanvas(Math.floor(W * scaleF), Math.floor(H * scaleF));
}
function windowResized() { fitCanvas(); }

function cambiar(m, force) {
  if (m === momento && !force) return;
  momento = m; frase = 0; momentoStart = millis(); fraseStart = millis() + 900;
}
function typed(s, n) { return s.slice(0, Math.max(0, Math.min(s.length, Math.floor(n)))); }
function reloj() {
  // 09:14 + tiempo transcurrido, como el registro del día
  const min = 9 * 60 + 14 + Math.floor((millis() - t0) / 1000);
  return String(Math.floor(min / 60) % 24).padStart(2, '0') + ':' + String(min % 60).padStart(2, '0');
}

function draw() {
  clear();
  scale(scaleF);
  textFont(FONT);
  noStroke();

  // líneas de escáner
  if (SCANLINES) {
    fill(0, 0, 0, 38);
    for (let y = 0; y < H; y += 4) rect(0, y, W, 1.5);
  }

  // viñeta verde suave en los bordes
  const ctx = drawingContext;
  const grd = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.85);
  grd.addColorStop(0, 'rgba(0,40,15,0)');
  grd.addColorStop(1, 'rgba(0,40,15,0.55)');
  ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);

  // barra de título (ventana)
  fill(0, 0, 0, 230); rect(0, 0, W, 60);
  stroke(G.dim); strokeWeight(1); line(0, 60, W, 60); noStroke();
  [['#E0453A', 30], ['#F2C230', 58], ['#2FA866', 86]].forEach(([c, x]) => { fill(c); circle(x, 30, 16); });
  fill(G.mid); textSize(20); textAlign(LEFT, CENTER); text(TITULO, 116, 30);
  // franja de las cuatro características
  const pasos = ['AUTENTICIDAD', 'INTEGRIDAD', 'FIABILIDAD', 'DISPONIBILIDAD'];
  textSize(11); textAlign(CENTER, CENTER);
  pasos.forEach((p, i) => {
    const x = W - 4 * 122 - 20 + i * 122, on = p === momento;
    fill(on ? G.bright : 'rgba(14,122,54,0.35)'); rect(x, 18, 112, 24);
    fill(on ? '#001a08' : G.mid); text('0' + (i + 1) + ' ' + p, x + 56, 30);
  });

  // esquinas del visor
  stroke(G.bright); strokeWeight(3); noFill();
  const m = 40, L = 56, top = 84;
  line(m, top, m + L, top); line(m, top, m, top + L);
  line(W - m, top, W - m - L, top); line(W - m, top, W - m, top + L);
  line(m, H - 150, m + L, H - 150); line(m, H - 150, m, H - 150 - L);
  line(W - m, H - 150, W - m - L, H - 150); line(W - m, H - 150, W - m, H - 150 - L);
  noStroke();

  // REC + hora + nombre
  fill(0, 0, 0, 150); rect(m + 16, top + 18, 300, 40);
  textAlign(LEFT, CENTER);
  if (frameCount % 60 < 38) { fill(G.red); circle(m + 36, top + 38, 16); }
  fill(G.white); textSize(20); text('REC', m + 52, top + 38);
  fill(G.bright); textSize(16); text('> cámara_en_vivo', m + 112, top + 38);
  textSize(15); const nw = textWidth(NOMBRE);
  fill(0, 0, 0, 150); rect(W - m - nw - 40, top + 18, nw + 24, 72);
  textAlign(RIGHT, CENTER);
  fill(G.bright); textSize(26); text(reloj(), W - m - 26, top + 38);
  fill(G.mid); textSize(15); text(NOMBRE, W - m - 26, top + 70);

  // momento: número, título y pregunta
  const M = MOMENTOS[momento];
  const age = millis() - momentoStart;
  const titulo = M.num + ' · ' + M.titulo;
  const ty = top + 104;
  textAlign(LEFT, TOP);
  fill(0, 0, 0, 160); rect(m, ty, textWidthAt(titulo, 44) + 40, 66);
  fill(G.bright); textSize(44); textStyle(BOLD);
  drawingContext.shadowColor = G.bright; drawingContext.shadowBlur = 14;
  text(typed(titulo, age * 0.06), m + 20, ty + 8);
  drawingContext.shadowBlur = 0; textStyle(NORMAL);
  textSize(24);
  const preg = typed('> ' + M.pregunta, (age - 500) * 0.04);
  if (preg) { fill(0, 0, 0, 160); rect(m, ty + 76, textWidth(preg) + 40, 40); fill(G.white); text(preg, m + 20, ty + 82); }

  // imagen de referencia del momento
  const img = refs[momento];
  if (img && age > 1200) {
    const bw = 340, bh = 255, bx = W - m - bw, by = ty + 70;
    const a = constrain((age - 1200) / 600, 0, 1);
    push();
    tint(255, 255 * a);
    const r = Math.max(bw / img.width, bh / img.height);
    const iw = img.width * r, ih = img.height * r;
    drawingContext.save(); drawingContext.beginPath(); drawingContext.rect(bx, by, bw, bh); drawingContext.clip();
    image(img, bx + (bw - iw) / 2, by + (bh - ih) / 2, iw, ih);
    drawingContext.restore();
    pop();
    noFill(); stroke(G.bright); strokeWeight(2); rect(bx, by, bw, bh); noStroke();
    fill(0, 0, 0, 180); rect(bx, by + bh, bw, 28);
    fill(G.mid); textSize(13); textAlign(LEFT, CENTER); text('> ' + PIE_IMAGEN + ' · ' + M.num, bx + 10, by + bh + 14);
  }

  // subtítulos: lo que digo
  if (showSubs) {
    const s = M.frases[frase] || '';
    const shown = typed(s, (millis() - fraseStart) * SPEED);
    textSize(34); textLeading(44); textAlign(CENTER, BOTTOM);
    const boxW = 980, x = (W - boxW) / 2, yb = H - 178, m = 40;
    if (shown) {
      const lines = Math.ceil(textWidth(shown) / (boxW - 60)) || 1;
      fill(0, 0, 0, 175); rect(x, yb - lines * 44 - 28, boxW, lines * 44 + 40);
      fill(G.white); text(shown, x + 30, yb - lines * 44 - 18, boxW - 60, lines * 44 + 24);
    }
    if (shown) {
      fill(G.dim); textSize(13); textAlign(RIGHT, TOP);
      text('LO_QUE_DIGO ' + (frase + 1) + '/' + M.frases.length, x + boxW - 12, yb - Math.ceil(textWidth(shown) / (boxW - 60)) * 44 - 22);
    }
  }

  // marquesina
  fill(0, 0, 0, 225); rect(0, H - 104, W, 104);
  stroke(G.dim); strokeWeight(1); line(0, H - 104, W, H - 104); noStroke();
  textSize(34); textAlign(LEFT, CENTER); fill(G.bright);
  const mw = textWidth(MARQUEE);
  marqueeX -= 2; if (marqueeX <= -mw) marqueeX += mw;
  for (let xx = marqueeX; xx < W; xx += mw) text(MARQUEE, xx + 24, H - 52);
}

function textWidthAt(s, size) { push(); textSize(size); textStyle(BOLD); const w = textWidth(s); pop(); return w; }

function keyPressed() {
  const k = (key || '').toLowerCase();
  const M = MOMENTOS[momento];
  if (key === ' ' || keyCode === RIGHT_ARROW) {
    if (frase < M.frases.length - 1) { frase++; fraseStart = millis(); }
    return false;
  }
  if (keyCode === LEFT_ARROW) { if (frase > 0) { frase--; fraseStart = millis(); } return false; }
  if (['0', '1', '2', '3', '4'].includes(k)) { cambiar(ORDEN[+k]); return false; }
  if (k === 'h') showSubs = !showSubs;
  if (k === 'r') { t0 = millis(); cambiar('ENTRADA', true); }
}
