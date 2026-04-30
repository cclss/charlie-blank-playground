// script.js — The Type Foundry (활자 주조소)

/**
 * Intro Sequence Orchestrator
 *
 * 4-phase entry animation:
 *   Phase 1 — Deep black (#1A1A1A) full-screen overlay (CSS default state)
 *   Phase 2 — "Lorem" characters fade in one by one (~1.1s)
 *   Phase 3 — Antique gold (#C9A96E) horizontal line draws (~0.7s)
 *   Phase 4 — Overlay fades out, main UI rises into view
 *
 * Timing uses CSS transitions driven by class toggles.
 * Respects prefers-reduced-motion: the CSS hides .intro and shows
 * .reveal immediately, so JS skips the sequence entirely.
 */

(function initIntroSequence() {
  'use strict';

  // ── Constants ──────────────────────────────────────────────────────
  // Durations derived from CSS transition values.
  // Phase 2: 5 chars × 0.12s stagger + 0.5s transition = ~1.08s.
  // Small buffer added for rendering headroom.
  var PHASE_TEXT_DURATION = 1200;  // ms — wait for all chars to finish
  var PHASE_LINE_DURATION = 800;  // ms — line draw (0.7s) + buffer
  var PHASE_DONE_DELAY    = 200;  // ms — breathing room before overlay exit
  var PHASE_REVEAL_STAGGER = 120; // ms — stagger between reveal elements

  // ── Helpers ────────────────────────────────────────────────────────

  /**
   * Schedules a callback via requestAnimationFrame + setTimeout.
   * rAF ensures we are in a paint-ready frame; setTimeout provides
   * the delay. This keeps animations aligned to vsync.
   */
  function scheduleAfter(ms, callback) {
    setTimeout(function () {
      requestAnimationFrame(callback);
    }, ms);
  }

  // ── Main ───────────────────────────────────────────────────────────

  /**
   * Starts the 4-phase intro sequence.
   * Called once fonts are ready.
   */
  function runSequence() {
    var intro = document.querySelector('.intro');
    if (!intro) return;

    // Respect prefers-reduced-motion.
    // CSS already handles the visual skip; JS must also bail out
    // so we don't toggle classes on an element that is display:none.
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
      skipSequence(intro);
      return;
    }

    // ── Phase 1: Deep black is the default CSS state (no JS needed) ──

    // ── Phase 2: Text fade-in ──
    // A minimal rAF delay ensures the browser has painted the initial
    // overlay frame before we trigger transitions.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        intro.classList.add('intro--step-text');

        // ── Phase 3: Line draw ──
        scheduleAfter(PHASE_TEXT_DURATION, function () {
          intro.classList.add('intro--step-line');

          // ── Phase 4: Overlay exit + UI reveal ──
          scheduleAfter(PHASE_LINE_DURATION + PHASE_DONE_DELAY, function () {
            intro.classList.add('intro--done');
            revealUI();

            // Cleanup: remove overlay from DOM after all transitions finish.
            // Longest child transition in .intro--done is 1s (visibility delay).
            scheduleAfter(1200, function () {
              intro.remove();
            });
          });
        });
      });
    });
  }

  /**
   * Immediately reveals all UI elements and removes the overlay.
   * Used when prefers-reduced-motion is active.
   */
  function skipSequence(intro) {
    intro.remove();
    var revealElements = document.querySelectorAll('.reveal');
    for (var i = 0; i < revealElements.length; i++) {
      revealElements[i].classList.add('reveal--visible');
    }
  }

  /**
   * Adds .reveal--visible to each .reveal element with a slight stagger
   * for a cascading rise-up effect.
   */
  function revealUI() {
    var revealElements = document.querySelectorAll('.reveal');
    for (var i = 0; i < revealElements.length; i++) {
      (function (el, index) {
        scheduleAfter(index * PHASE_REVEAL_STAGGER, function () {
          el.classList.add('reveal--visible');
        });
      })(revealElements[i], i);
    }
  }

  // ── Bootstrap ──────────────────────────────────────────────────────
  // Wait for both DOM and fonts before starting the sequence.
  // document.fonts.ready resolves when all font-face loads settle.
  // DOMContentLoaded ensures the intro overlay markup exists.

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForFonts);
  } else {
    // DOM already parsed (e.g. script at bottom of body).
    waitForFonts();
  }

  function waitForFonts() {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(runSequence);
    } else {
      // Fallback: browser does not support FontFaceSet API.
      // Wait a short beat for fonts, then proceed.
      scheduleAfter(300, runSequence);
    }
  }
})();


// ─────────────────────────────────────────────────────────────────────
// Text Generation Engine
// ─────────────────────────────────────────────────────────────────────

/**
 * Generation Module
 *
 * Manages the Lorem ipsum paragraph pool and the generate-button
 * lifecycle (clear → disable → populate → re-enable).
 *
 * Paragraphs are randomly selected from the pool without repetition
 * within a single generation run. The typing animation itself is
 * handled by a separate grain; this module only inserts the <p>
 * elements with their text content.
 */

(function initGenerationEngine() {
  'use strict';

  // ── Paragraph Pool ────────────────────────────────────────────────
  // Minimum 10 distinct paragraphs. Mix of Korean-infused and classic
  // Lorem Ipsum to match the bilingual identity of the site.

  var PARAGRAPHS = [
    '로렘 입숨은 인쇄 및 조판 산업의 표준 더미 텍스트입니다. 1500년대 이후로 업계의 표준으로 자리 잡아 왔으며, 알려지지 않은 인쇄업자가 활자 견본집을 만들기 위해 활자를 뒤섞은 것에서 시작되었습니다. 전자 조판의 시대에도 그 원형은 변하지 않았습니다.',

    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',

    '활자를 주조한다는 것은 단순히 금속을 녹이는 일이 아닙니다. 그것은 언어에 형태를 부여하고, 생각에 무게를 더하며, 침묵 위에 의미를 새기는 일입니다. 한 글자 한 글자가 세상과 대화하는 작은 문이 됩니다.',

    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',

    '좋은 타이포그래피는 보이지 않는 곳에서 빛납니다. 행간의 여백, 자간의 호흡, 문단의 리듬 — 이 모든 것이 독자의 눈을 이끌고 의미를 전달합니다. 훌륭한 활자는 읽히기 위해 존재하지만, 그 존재 자체는 드러나지 않습니다.',

    'Nullam quis risus eget urna mollis ornare vel eu leo. Cras mattis consectetur purus sit amet fermentum. Donec id elit non mi porta gravida at eget metus. Vestibulum id ligula porta felis euismod semper.',

    '인쇄술이 발명되기 전, 모든 책은 손으로 한 자씩 필사되었습니다. 구텐베르크의 금속 활자는 지식의 복제를 가능하게 했고, 그로 인해 세상은 돌이킬 수 없이 변했습니다. 오늘날 우리가 화면 위에서 글자를 다루는 방식 또한 그 유산 위에 서 있습니다.',

    'Maecenas sed diam eget risus varius blandit sit amet non magna. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.',

    '주조소의 불꽃은 꺼지지 않습니다. 납과 안티몬이 녹아 하나의 활자가 될 때, 그 작은 금속 조각에는 수백 년의 기술과 미학이 응축되어 있습니다. 디지털 시대에도 활자의 정신 — 정밀함, 균형, 아름다움 — 은 여전히 유효합니다.',

    'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Cras justo odio, dapibus ut facilisis in, egestas eget quam.'
  ];

  // ── Helpers ────────────────────────────────────────────────────────

  /**
   * Schedules a callback via requestAnimationFrame + setTimeout.
   * Mirrors the intro IIFE's helper for consistency.
   */
  function scheduleAfter(ms, callback) {
    setTimeout(function () {
      requestAnimationFrame(callback);
    }, ms);
  }

  /**
   * Returns an array of `count` paragraphs randomly selected from the
   * pool without repetition. Uses Fisher-Yates partial shuffle.
   *
   * If count exceeds the pool size, the pool is exhausted without error
   * (returns all available paragraphs in random order).
   */
  function pickParagraphs(count) {
    var pool = [];
    var i;
    for (i = 0; i < PARAGRAPHS.length; i++) {
      pool.push(PARAGRAPHS[i]);
    }

    var max = Math.min(count, pool.length);
    var temp, randIdx;
    for (i = 0; i < max; i++) {
      randIdx = i + Math.floor(Math.random() * (pool.length - i));
      temp = pool[i];
      pool[i] = pool[randIdx];
      pool[randIdx] = temp;
    }

    return pool.slice(0, max);
  }

  // ── DOM References ────────────────────────────────────────────────

  var generateBtn = document.getElementById('generate-btn');
  var copyBtn     = document.getElementById('copy-btn');
  var outputArea  = document.getElementById('output-area');
  var countSelect = document.getElementById('paragraph-count');

  // ── Generation Lifecycle ──────────────────────────────────────────

  /**
   * Main generation handler.
   * 1. Clears previous output.
   * 2. Disables generate button (prevents double-fire).
   * 3. Populates output with <p> elements.
   * 4. Re-enables generate button and enables copy button.
   */
  function handleGenerate() {
    var count = parseInt(countSelect.value, 10) || 3;
    var paragraphs = pickParagraphs(count);

    // Step 1: Clear previous output
    outputArea.innerHTML = '';

    // Step 2: Disable generate button during generation
    generateBtn.disabled = true;
    copyBtn.disabled = true;

    // Step 3: Insert paragraphs
    var fragment = document.createDocumentFragment();
    var i, p;
    for (i = 0; i < paragraphs.length; i++) {
      p = document.createElement('p');
      p.textContent = paragraphs[i];
      fragment.appendChild(p);
    }
    outputArea.appendChild(fragment);

    // Step 4: Re-enable buttons after a frame
    // scheduleAfter ensures the DOM paint completes before state change.
    scheduleAfter(0, function () {
      generateBtn.disabled = false;
      copyBtn.disabled = false;
    });
  }

  // ── Bind ──────────────────────────────────────────────────────────

  if (generateBtn) {
    generateBtn.addEventListener('click', handleGenerate);
  }
})();
