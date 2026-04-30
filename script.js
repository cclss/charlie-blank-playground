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
