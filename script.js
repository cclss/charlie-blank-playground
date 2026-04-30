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
// Text Generation Engine — with Character-by-Character Typing Animation
// ─────────────────────────────────────────────────────────────────────

/**
 * Generation Module
 *
 * Manages the Lorem ipsum paragraph pool, the generate-button lifecycle,
 * and a cinematic character-by-character typing animation.
 *
 * Typing features:
 *   - Variable speed with natural punctuation pauses
 *   - Blinking gold cursor that follows the typed position
 *   - Fade+rise entrance for each paragraph
 *   - Button shows "주조 중…" with pulse during typing
 *   - Interrupt support: clicking mid-type completes instantly, then regenerates
 *   - prefers-reduced-motion: all typing animation is bypassed
 *   - 60fps: only transform/opacity are animated (no layout thrashing)
 */

(function initGenerationEngine() {
  'use strict';

  // ── Paragraph Pool ────────────────────────────────────────────────

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

  // ── Typing Speed Constants ────────────────────────────────────────
  // Tuned for a natural, unhurried cadence that feels cinematic
  // rather than mechanical.

  var CHAR_BASE_DELAY    = 38;   // ms — base per character
  var CHAR_VARIANCE      = 14;   // ms — ± random jitter for natural feel
  var PAUSE_PERIOD       = 300;  // ms — full stop, exclamation, question mark
  var PAUSE_COMMA        = 160;  // ms — comma, semicolon, colon
  var PAUSE_PARAGRAPH    = 420;  // ms — gap between paragraphs
  var CURSOR_FADE_DELAY  = 400;  // ms — cursor fade-out after final character

  var PUNCTUATION_LONG  = '.!?';
  var PUNCTUATION_SHORT = ',;:';

  // ── Button Labels ─────────────────────────────────────────────────

  var BTN_LABEL_DEFAULT    = '주조하기';
  var BTN_LABEL_GENERATING = '주조 중\u2026'; // 주조 중…

  // ── State ─────────────────────────────────────────────────────────

  var currentAnim = null; // non-null while typing is in progress

  // ── Accessibility ─────────────────────────────────────────────────

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ── Helpers ────────────────────────────────────────────────────────

  /**
   * Schedules a callback via setTimeout → requestAnimationFrame.
   * Keeps animations vsync-aligned while allowing arbitrary delays.
   */
  function scheduleAfter(ms, callback) {
    setTimeout(function () {
      requestAnimationFrame(callback);
    }, ms);
  }

  /**
   * Returns an array of `count` paragraphs randomly selected from the
   * pool without repetition. Uses Fisher-Yates partial shuffle.
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

  /**
   * Calculates the typing delay after a given character.
   * Punctuation gets a longer pause; other characters get a base + jitter.
   */
  function charDelay(ch) {
    if (PUNCTUATION_LONG.indexOf(ch) !== -1)  return PAUSE_PERIOD;
    if (PUNCTUATION_SHORT.indexOf(ch) !== -1) return PAUSE_COMMA;
    return CHAR_BASE_DELAY + Math.floor(Math.random() * CHAR_VARIANCE * 2) - CHAR_VARIANCE;
  }

  // ── DOM References ────────────────────────────────────────────────

  var generateBtn = document.getElementById('generate-btn');
  var copyBtn     = document.getElementById('copy-btn');
  var outputArea  = document.getElementById('output-area');
  var countSelect = document.getElementById('paragraph-count');

  // ── Button State Helpers ──────────────────────────────────────────

  function setButtonGenerating() {
    generateBtn.textContent = BTN_LABEL_GENERATING;
    generateBtn.classList.add('btn--generating');
    generateBtn.disabled = false; // stay enabled for interrupt
    copyBtn.disabled = true;
  }

  function setButtonIdle() {
    generateBtn.textContent = BTN_LABEL_DEFAULT;
    generateBtn.classList.remove('btn--generating');
    generateBtn.disabled = false;
    copyBtn.disabled = false;
  }

  // ── Instant Completion ────────────────────────────────────────────

  /**
   * Completes any in-progress typing animation instantly.
   * Fills all remaining paragraph text and removes the cursor.
   */
  function completeInstantly() {
    if (!currentAnim) return;
    var anim = currentAnim;
    currentAnim = null;

    // Fill every paragraph with its full text
    for (var i = 0; i < anim.pEls.length; i++) {
      // Remove cursor from this paragraph if present
      var cursor = anim.pEls[i].querySelector('.typing-cursor');
      if (cursor) cursor.remove();

      // Set full text (replacing any partial text node)
      anim.pEls[i].textContent = anim.texts[i];
      anim.pEls[i].classList.add('output__para--visible');
    }

    setButtonIdle();
  }

  // ── Reduced-Motion Path ───────────────────────────────────────────

  /**
   * Inserts all paragraphs at once without any animation.
   * Used when prefers-reduced-motion is active.
   */
  function insertInstant(paragraphs) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < paragraphs.length; i++) {
      var p = document.createElement('p');
      p.className = 'output__para output__para--visible';
      p.textContent = paragraphs[i];
      fragment.appendChild(p);
    }
    outputArea.appendChild(fragment);
    setButtonIdle();
  }

  // ── Typing Engine ─────────────────────────────────────────────────

  /**
   * Begins the typing animation for one paragraph.
   * Creates a text node + cursor inside the <p>, then types character
   * by character via scheduleAfter recursion.
   */
  function beginParagraph(anim) {
    // Guard: animation was cancelled
    if (currentAnim !== anim) return;

    var pEl  = anim.pEls[anim.pIdx];
    var text = anim.texts[anim.pIdx];

    // Reveal paragraph container (fade + rise)
    pEl.classList.add('output__para--visible');

    // Insert empty text node and cursor
    var textNode = document.createTextNode('');
    pEl.appendChild(textNode);
    pEl.appendChild(anim.cursor);

    // Start character loop
    typeChar(anim, textNode, text, 0);
  }

  /**
   * Types a single character, then schedules the next.
   * When the paragraph is complete, transitions to the next paragraph
   * or finishes the animation.
   */
  function typeChar(anim, textNode, text, idx) {
    // Guard: animation was cancelled
    if (currentAnim !== anim) return;

    // Paragraph complete
    if (idx >= text.length) {
      anim.pIdx++;

      // More paragraphs?
      if (anim.pIdx < anim.pEls.length) {
        // Move cursor to next paragraph after a pause
        scheduleAfter(PAUSE_PARAGRAPH, function () {
          beginParagraph(anim);
        });
      } else {
        // All paragraphs typed — fade out cursor, then clean up
        anim.cursor.classList.add('typing-cursor--done');
        scheduleAfter(CURSOR_FADE_DELAY, function () {
          if (anim.cursor.parentNode) anim.cursor.remove();
          currentAnim = null;
          setButtonIdle();
        });
      }
      return;
    }

    // Reveal one character
    var ch = text[idx];
    textNode.nodeValue = text.substring(0, idx + 1);

    // Schedule next character with variable delay
    var delay = charDelay(ch);
    scheduleAfter(delay, function () {
      typeChar(anim, textNode, text, idx + 1);
    });
  }

  // ── Generation Lifecycle ──────────────────────────────────────────

  /**
   * Kicks off a new generation run.
   * Creates empty <p> elements, a cursor, and starts the typing loop.
   */
  function startGeneration() {
    var count = parseInt(countSelect.value, 10) || 3;
    var paragraphs = pickParagraphs(count);

    // Clear previous output
    outputArea.innerHTML = '';

    // Reduced motion: skip animation entirely
    if (reducedMotion.matches) {
      insertInstant(paragraphs);
      return;
    }

    // Set button to generating state
    setButtonGenerating();

    // Create empty paragraph elements
    var pEls = [];
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < paragraphs.length; i++) {
      var p = document.createElement('p');
      p.className = 'output__para';
      fragment.appendChild(p);
      pEls.push(p);
    }
    outputArea.appendChild(fragment);

    // Create cursor element
    var cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.setAttribute('aria-hidden', 'true');

    // Build animation state
    currentAnim = {
      pEls:   pEls,
      texts:  paragraphs,
      cursor: cursor,
      pIdx:   0
    };

    // Begin typing the first paragraph after a brief beat
    // (allows the first paragraph's entrance transition to start)
    scheduleAfter(80, function () {
      beginParagraph(currentAnim);
    });
  }

  /**
   * Click handler for the generate button.
   * If typing is in progress, completes instantly then starts a new run.
   */
  function handleGenerate() {
    if (currentAnim) {
      completeInstantly();
      // Brief pause so the user sees the completed text before it clears
      scheduleAfter(60, function () {
        startGeneration();
      });
      return;
    }
    startGeneration();
  }

  // ── Clipboard + Ink Spread ─────────────────────────────────────────

  /**
   * Copies the full text content of #output-area to the clipboard.
   * Uses the modern Clipboard API with a fallback to document.execCommand.
   */
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function () {
        copyFallback(text);
      });
    } else {
      copyFallback(text);
    }
  }

  /**
   * Fallback clipboard copy via a temporary textarea and execCommand.
   */
  function copyFallback(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    // Position off-screen to avoid visual flash
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    textarea.setAttribute('aria-hidden', 'true');
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (e) {
      // Silently fail — no meaningful recovery available
    }
    document.body.removeChild(textarea);
  }

  /**
   * Triggers the ink-spread CSS animation on the copy button.
   * Sets --ink-x and --ink-y custom properties from the click
   * coordinates so the blot originates from the pointer position.
   */
  function triggerInkSpread(btn, event) {
    var rect = btn.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    btn.style.setProperty('--ink-x', x + 'px');
    btn.style.setProperty('--ink-y', y + 'px');

    // Reset animation: remove class, force reflow, re-add
    btn.classList.remove('ink-spreading');
    // Force layout recalculation so the browser recognises a new animation cycle
    void btn.offsetWidth;
    btn.classList.add('ink-spreading');
  }

  /**
   * Click handler for the copy button.
   * Copies all generated text and triggers ink-spread visual feedback.
   */
  function handleCopy(event) {
    var text = (outputArea.textContent || '').trim();
    if (!text) return;

    copyToClipboard(text);

    // Visual feedback — ink blot from click point
    if (!reducedMotion.matches) {
      triggerInkSpread(copyBtn, event);
    }
  }

  // Clean up ink-spreading class after animation ends
  if (copyBtn) {
    copyBtn.addEventListener('animationend', function () {
      copyBtn.classList.remove('ink-spreading');
    });
  }

  // ── Custom Stepper ─────────────────────────────────────────────────

  /**
   * Stepper UI Module
   *
   * Wires the custom stepper (−/value/+) to the hidden <select>.
   * The <select> remains the source of truth for paragraph count;
   * startGeneration reads countSelect.value. The stepper syncs
   * its display and the select's value on every interaction.
   */

  var stepperDecBtn   = document.querySelector('.stepper__btn--dec');
  var stepperIncBtn   = document.querySelector('.stepper__btn--inc');
  var stepperValueEl  = document.querySelector('.stepper__value');

  /**
   * Reads the current min/max from the <select> options.
   * Returns { min: Number, max: Number }.
   */
  function getStepperRange() {
    var options = countSelect.options;
    return {
      min: parseInt(options[0].value, 10),
      max: parseInt(options[options.length - 1].value, 10)
    };
  }

  /**
   * Updates the stepper display and the hidden <select> value.
   * Disables −/+ buttons at range boundaries.
   */
  function syncStepper(newValue) {
    var range = getStepperRange();
    var clamped = Math.max(range.min, Math.min(range.max, newValue));

    // Update the hidden <select>
    countSelect.value = String(clamped);

    // Update visual display
    stepperValueEl.textContent = String(clamped);

    // Update button disabled states at boundaries
    stepperDecBtn.disabled = (clamped <= range.min);
    stepperIncBtn.disabled = (clamped >= range.max);
  }

  /**
   * Initializes stepper state from the <select>'s current value.
   */
  function initStepper() {
    if (!countSelect || !stepperDecBtn || !stepperIncBtn || !stepperValueEl) return;

    var initial = parseInt(countSelect.value, 10) || 3;
    syncStepper(initial);

    stepperDecBtn.addEventListener('click', function () {
      var current = parseInt(countSelect.value, 10);
      syncStepper(current - 1);
    });

    stepperIncBtn.addEventListener('click', function () {
      var current = parseInt(countSelect.value, 10);
      syncStepper(current + 1);
    });

    // If the hidden <select> changes externally, sync the stepper
    countSelect.addEventListener('change', function () {
      syncStepper(parseInt(countSelect.value, 10));
    });
  }

  initStepper();

  // ── Bind ──────────────────────────────────────────────────────────

  if (generateBtn) {
    generateBtn.addEventListener('click', handleGenerate);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', handleCopy);
  }
})();


// ─────────────────────────────────────────────────────────────────────
// Scroll Parallax & Viewport Reveal Module
// ─────────────────────────────────────────────────────────────────────

/**
 * Scroll Effects Module
 *
 * Two independent scroll-driven behaviors:
 *
 *   1. Hero Parallax — Elements with [data-parallax-speed] translate
 *      vertically at different rates as the page scrolls, creating a
 *      layered depth illusion. Speed 0 = no movement, 1 = full scroll
 *      speed. Lower values feel further away.
 *
 *   2. Viewport Reveal — Below-the-fold sections fade+rise into view
 *      when they enter the viewport, using IntersectionObserver for
 *      performant off-main-thread detection.
 *
 * Performance:
 *   - Parallax uses rAF-throttled scroll listener (one rAF per frame max).
 *   - Only transform is updated (GPU-composited, no layout/paint).
 *   - IntersectionObserver is passive and fires only on threshold crossing.
 *   - Respects prefers-reduced-motion: all effects are skipped.
 */

(function initScrollEffects() {
  'use strict';

  // ── Accessibility ─────────────────────────────────────────────────
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) return;

  // ── Hero Parallax ─────────────────────────────────────────────────

  var parallaxElements = document.querySelectorAll('[data-parallax-speed]');
  var hero = document.querySelector('.hero');
  var ticking = false;

  /**
   * Applies parallax translateY to each element based on scroll position.
   * The offset is: scrollY × (speed - 1), so:
   *   speed 0.3 → moves upward at 70% of scroll speed (feels far away)
   *   speed 0.7 → moves upward at 30% of scroll speed (feels closer)
   * This differential creates the layered depth illusion.
   */
  function updateParallax() {
    ticking = false;

    // Only apply parallax while the hero is in view.
    // Once scrolled past, no point in updating transforms.
    if (!hero) return;
    var heroRect = hero.getBoundingClientRect();
    if (heroRect.bottom <= 0) return;

    var scrollY = window.pageYOffset || document.documentElement.scrollTop;

    for (var i = 0; i < parallaxElements.length; i++) {
      var el = parallaxElements[i];
      var speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0;
      // Negative offset: slower elements lag behind, creating depth
      var yOffset = scrollY * (speed - 1);
      el.style.transform = 'translateY(' + yOffset + 'px)';
    }
  }

  /**
   * Scroll handler — throttled to one rAF per frame.
   * Prevents layout thrashing from multiple scroll events per frame.
   */
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateParallax);
    }
  }

  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── Viewport Reveal (Below-the-Fold Sections) ────────────────────

  /**
   * Sections to reveal on scroll. These are the direct children of
   * <main> — all content below the hero fold.
   * The footer is excluded because it uses the intro .reveal system.
   * Classes are added via JS to avoid a flash of hidden content
   * if JS fails to load.
   */
  var revealTargets = document.querySelectorAll(
    'main > .controls, main > .actions, main > .output'
  );

  if (revealTargets.length > 0 && 'IntersectionObserver' in window) {
    // Add scroll-reveal class to targets (initially hidden via CSS).
    // This is done in JS so content is visible if JS is disabled.
    for (var j = 0; j < revealTargets.length; j++) {
      revealTargets[j].classList.add('scroll-reveal');
    }

    var revealObserver = new IntersectionObserver(
      function (entries) {
        for (var k = 0; k < entries.length; k++) {
          if (entries[k].isIntersecting) {
            entries[k].target.classList.add('scroll-reveal--visible');
            // Once revealed, stop observing — no need to re-hide
            revealObserver.unobserve(entries[k].target);
          }
        }
      },
      {
        // Trigger when 15% of the element is visible — feels natural,
        // the element starts appearing before it's fully in frame
        threshold: 0.15,
        // Slight negative margin to trigger slightly before the
        // element reaches the viewport edge
        rootMargin: '0px 0px -60px 0px'
      }
    );

    for (var m = 0; m < revealTargets.length; m++) {
      revealObserver.observe(revealTargets[m]);
    }
  }
})();
