(function () {
  var DEFAULT_FRAMES = 4;
  var DEFAULT_SPEED = 100;
  var DEFAULT_SCALE = 3;
  var MAX_FRAMES = 12;
  var BASE_FREQUENCY = 0.02;
  var NUM_OCTAVES = 2;
  var SEEDS = [1, 42, 7, 99, 23, 61, 83, 14, 55, 37, 72, 5];

  var knownSets = {};
  var entries = [];
  var defsEl;

  function setKey(scale, frames) {
    return String(scale).replace('.', '_') + '-f' + frames;
  }

  function ensureFilters(scale, frames) {
    var key = setKey(scale, frames);
    if (knownSets[key]) return;
    knownSets[key] = true;

    for (var i = 0; i < frames; i++) {
      var filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      filter.setAttribute('id', 'boil-' + key + '-' + i);

      var turb = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence');
      turb.setAttribute('type', 'turbulence');
      turb.setAttribute('baseFrequency', BASE_FREQUENCY);
      turb.setAttribute('numOctaves', NUM_OCTAVES);
      turb.setAttribute('seed', SEEDS[i % SEEDS.length]);
      turb.setAttribute('result', 'noise');

      var disp = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
      disp.setAttribute('in', 'SourceGraphic');
      disp.setAttribute('in2', 'noise');
      disp.setAttribute('scale', scale);
      disp.setAttribute('xChannelSelector', 'R');
      disp.setAttribute('yChannelSelector', 'G');

      filter.appendChild(turb);
      filter.appendChild(disp);
      defsEl.appendChild(filter);
    }
  }

  function injectSVG() {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    defsEl = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defsEl);
    document.body.appendChild(svg);
  }

  function collectElements() {
    var els = document.querySelectorAll('.boil');
    var seen = new Map();
    for (var i = 0; i < entries.length; i++) {
      seen.set(entries[i].el, entries[i]);
    }

    var next = [];
    for (var j = 0; j < els.length; j++) {
      var el = els[j];
      if (seen.has(el)) {
        next.push(seen.get(el));
      } else {
        var scale = parseFloat(el.dataset.boilScale) || DEFAULT_SCALE;
        var speed = parseInt(el.dataset.boilSpeed, 10) || DEFAULT_SPEED;
        var frames = Math.min(Math.max(parseInt(el.dataset.boilFrames, 10) || DEFAULT_FRAMES, 2), MAX_FRAMES);
        ensureFilters(scale, frames);
        next.push({ el: el, scale: scale, speed: speed, frames: frames, frame: 0, lastTick: performance.now() });
      }
    }
    entries = next;
  }

  function tick(now) {
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      if (now - e.lastTick >= e.speed) {
        e.frame = (e.frame + 1) % e.frames;
        e.el.style.filter = 'url(#boil-' + setKey(e.scale, e.frames) + '-' + e.frame + ')';
        e.lastTick = now;
      }
    }
    requestAnimationFrame(tick);
  }

  function init() {
    injectSVG();
    collectElements();
    requestAnimationFrame(tick);

    var observer = new MutationObserver(collectElements);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
