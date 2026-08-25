/**
 * LinApple Landing Page Interactive Logic
 * - Simulated Apple II DOS 3.3 / Applesoft Terminal
 * - CRT Monitor Theme Switcher (Color NTSC, P31 Green, P134 Amber, Crisp Flat)
 * - Quick-Install Tabs & Clipboard Copy
 * - GitHub Releases REST API Dynamic Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initTerminal();
  initTabs();
  initCopyButtons();
  initGalleryModes();
  fetchLatestRelease();
});

/* ==========================================================================
   1. Theme Switcher (CRT Monitor Modes)
   ========================================================================== */
function initThemeSwitcher() {
  const themeSelect = document.getElementById('theme-select');
  const savedTheme = localStorage.getItem('linapple_theme') || 'color';

  document.documentElement.setAttribute('data-theme', savedTheme);
  if (themeSelect) {
    themeSelect.value = savedTheme;
    themeSelect.addEventListener('change', (e) => {
      const selected = e.target.value;
      document.documentElement.setAttribute('data-theme', selected);
      localStorage.setItem('linapple_theme', selected);
    });
  }
}

/* ==========================================================================
   2. Interactive Apple II Terminal Simulator
   ========================================================================== */
function initTerminal() {
  const termOutput = document.getElementById('terminal-output');
  const termInput = document.getElementById('term-input');
  const promptChar = document.querySelector('.prompt-char');
  const driveLed = document.getElementById('drive-led');
  const chips = document.querySelectorAll('.chip-btn');

  if (!termInput || !termOutput) return;

  let mode = 'applesoft'; // 'applesoft' (]) or 'monitor' (*)
  let loadedProgram = null;
  let is80Col = false;
  let isInverse = false;

  const HELLO_SRC = [
    '10 REM *** LINAPPLE //E SYSTEM MASTER ***',
    '20 HOME : PRINT CHR$(4);"PR#3"',
    '30 PRINT "========================================"',
    '40 PRINT "   WELCOME TO LINAPPLE FOR LINUX"',
    '50 PRINT "   HIGH-FIDELITY APPLE ][ EMULATION"',
    '60 PRINT "========================================"',
    '70 PRINT "TYPE \'RUN LINAPPLE\' TO DOWNLOAD & INSTALL"',
    '80 END'
  ];

  function flashLed(durationMs = 600) {
    if (!driveLed) return;
    driveLed.classList.add('active');
    setTimeout(() => driveLed.classList.remove('active'), durationMs);
  }

  function updatePrompt() {
    if (promptChar) {
      promptChar.textContent = mode === 'monitor' ? '*' : ']';
    }
  }

  function printLine(text, isHighlight = false) {
    const line = document.createElement('div');
    line.className = 'term-line';
    if (isInverse) line.classList.add('term-inverse-line');
    if (isHighlight) line.innerHTML = `<span class="term-hl">${text}</span>`;
    else line.textContent = text;
    termOutput.appendChild(line);
    termOutput.scrollTop = termOutput.scrollHeight;
  }

  function executeApplesoft(rawCmd) {
    const cmd = rawCmd.trim().toUpperCase();
    printLine(`] ${rawCmd}`);
    flashLed();

    if (!cmd) return;

    if (cmd === 'CATALOG' || cmd === 'CAT') {
      printLine('DISK VOLUME 254');
      printLine(' *A 002 HELLO');
      printLine(' *B 034 LINAPPLE-SDL3');
      printLine(' *B 028 LINAPPLE-TUI');
      printLine(' *B 128 MASTER.DSK (140KB)');
      printLine(' *B 512 TOTAL_REPLAY.2MG (32MB)');
    } else if (cmd === 'LOAD HELLO') {
      loadedProgram = 'HELLO';
      printLine('LOADING HELLO...');
      printLine('PROGRAM LOADED. TYPE "LIST" OR "RUN".', true);
    } else if (cmd === 'LIST') {
      if (loadedProgram === 'HELLO' || !loadedProgram) {
        loadedProgram = 'HELLO';
        HELLO_SRC.forEach((l) => printLine(l));
      } else {
        printLine('?NO PROGRAM LOADED');
      }
    } else if (cmd === 'RUN' || cmd === 'RUN HELLO') {
      loadedProgram = 'HELLO';
      printLine('========================================', true);
      printLine('   WELCOME TO LINAPPLE FOR LINUX', true);
      printLine('   CYCLE-ACCURATE APPLE ][ EMULATION', true);
      printLine('========================================', true);
      printLine('TYPE "RUN LINAPPLE" TO GO TO INSTALLATION.');
    } else if (cmd === 'RUN LINAPPLE' || cmd === 'BRUN LINAPPLE' || cmd === 'BRUN LINAPPLE-SDL3') {
      printLine('BOOTING LINAPPLE //e CORE...');
      printLine('65C02 CPU 1.023 MHz OK.');
      printLine('128K AUX RAM INITIALIZED.');
      printLine('SDL3 HARDWARE ACCELERATION READY.');
      printLine('READY FOR GAMES AND SOFTWARE.', true);
      const installSection = document.getElementById('quick-start');
      if (installSection) {
        setTimeout(() => {
          installSection.scrollIntoView({ behavior: 'smooth' });
        }, 400);
      }
    } else if (cmd === 'CALL -151' || cmd === 'MON' || cmd === 'MONITOR') {
      mode = 'monitor';
      updatePrompt();
      printLine('* 6502 MONITOR ACTIVE (TYPE "300L", "300.310", OR "3D0G" TO EXIT)', true);
    } else if (cmd === 'PR#3') {
      is80Col = true;
      termOutput.classList.add('term-80col');
      printLine('80-COLUMN CARD ACTIVE.');
    } else if (cmd === 'PR#0') {
      is80Col = false;
      termOutput.classList.remove('term-80col');
      printLine('40-COLUMN MODE RESTORED.');
    } else if (cmd === 'INVERSE' || cmd === 'POKE 50,63') {
      isInverse = true;
      printLine('INVERSE TEXT MODE ENABLED.');
    } else if (cmd === 'NORMAL' || cmd === 'POKE 50,255') {
      isInverse = false;
      printLine('NORMAL TEXT MODE RESTORED.');
    } else if (cmd === 'CLEAR' || cmd === 'HOME' || cmd === 'CLS') {
      termOutput.innerHTML = '';
    } else if (cmd === 'HELP') {
      printLine('AVAILABLE COMMANDS:');
      printLine('  CATALOG       - List disk contents');
      printLine('  LOAD HELLO    - Load Applesoft BASIC program');
      printLine('  LIST          - Display BASIC program listing');
      printLine('  RUN HELLO     - Execute Applesoft greeting');
      printLine('  RUN LINAPPLE  - Boot emulator & scroll to downloads');
      printLine('  CALL -151     - Enter 6502 Machine Language Monitor');
      printLine('  PR#3 / PR#0   - Toggle 80-column / 40-column mode');
      printLine('  INVERSE       - Toggle inverse text mode');
      printLine('  BENCHMARK     - Display CPU & frame timing');
      printLine('  HOME          - Clear screen');
    } else if (cmd === 'BENCHMARK') {
      printLine('LINAPPLE BENCHMARK METRICS:');
      printLine('  CPU CORE: 65C02 Cycle Accurate @ 1.023 MHz');
      printLine('  DISPLAY: 60 FPS (59.92 Hz NTSC / 50.00 Hz PAL)');
      printLine('  AUDIO: Stereo AY-3-8910 + 1-bit Speaker DAC');
      printLine('  STATUS: OPTIMAL ACCURACY', true);
    } else if (cmd === 'ABOUT') {
      printLine('LINAPPLE V3.X FOR MODERN LINUX');
      printLine('  ARCHITECTURE: Tiered Decoupled Core Bridge');
      printLine('  FRONTENDS: SDL3, Terminal TUI (SSH), Headless, SDL2, SDL1');
      printLine('  LICENSE: GNU General Public License v2.0');
    } else if (cmd.startsWith('PRINT ') || cmd.startsWith('? ')) {
      const expr = cmd.replace(/^(PRINT|\?)\s*/i, '').trim();
      try {
        if (/^[\d\s+\-*/().%]+$/.test(expr)) {
          // Safe arithmetic evaluation
          // eslint-disable-next-line no-eval
          const res = Function(`'use strict'; return (${expr})`)();
          printLine(String(res));
        } else {
          printLine(expr.replace(/^"(.*)"$/, '$1'));
        }
      } catch {
        printLine('?SYNTAX ERROR');
      }
    } else {
      printLine(`?SYNTAX ERROR IN: "${cmd}"`);
      printLine('TYPE "HELP" FOR A LIST OF COMMANDS.');
    }
  }

  function executeMonitor(rawCmd) {
    const cmd = rawCmd.trim().toUpperCase();
    printLine(`* ${rawCmd}`);
    flashLed();

    if (!cmd) return;

    if (cmd === '3D0G' || cmd === '3DOG' || cmd === 'EXIT' || cmd === 'QUIT' || cmd === 'BASIC' || cmd === 'CONTROL-C') {
      mode = 'applesoft';
      updatePrompt();
      printLine('] RETURNED TO APPLESOFT BASIC');
      return;
    }

    if (cmd === '300L' || cmd === 'L' || cmd === '0300L') {
      printLine('0300-   A9 4C       LDA   #$4C');
      printLine('0302-   8D 00 04    STA   $0400');
      printLine('0305-   A9 49       LDA   #$49');
      printLine('0307-   8D 01 04    STA   $0401');
      printLine('030A-   60          RTS');
      return;
    }

    if (cmd === '300.310' || cmd === '300' || cmd === '0300.0310') {
      printLine('0300- A9 4C 8D 00 04 A9 49 8D');
      printLine('0308- 01 04 60 EA EA EA 00 00');
      return;
    }

    if (cmd === 'HELP') {
      printLine('6502 MONITOR COMMANDS:');
      printLine('  300L    - Disassemble instructions at $0300');
      printLine('  300.310 - Examine memory range $0300..$0310');
      printLine('  3D0G    - Return to Applesoft BASIC prompt');
      return;
    }

    printLine(`* ERR: "${cmd}" (TYPE "3D0G" TO EXIT TO BASIC)`);
  }

  function executeCommand(rawCmd) {
    if (mode === 'monitor') {
      executeMonitor(rawCmd);
    } else {
      executeApplesoft(rawCmd);
    }
  }

  const termTextMirror = document.getElementById('term-text-mirror');

  function syncMirror() {
    if (termTextMirror) {
      termTextMirror.textContent = termInput.value.toUpperCase();
    }
  }

  termInput.addEventListener('input', syncMirror);

  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = termInput.value;
      termInput.value = '';
      syncMirror();
      executeCommand(val);
    }
  });

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
      }
    });
  });
}

/* ==========================================================================
   3. Quick-Install Tabs
   ========================================================================== */
function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');

      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });

      panels.forEach((p) => {
        p.classList.remove('active');
        p.hidden = true;
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
        targetPanel.hidden = false;
      }
    });
  });
}

/* ==========================================================================
   4. Copy-to-Clipboard
   ========================================================================== */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const targetSelector = btn.getAttribute('data-copy');
      const targetElement = document.querySelector(targetSelector);

      if (targetElement) {
        const textToCopy = targetElement.textContent.trim();
        try {
          await navigator.clipboard.writeText(textToCopy);
          const originalText = btn.textContent;
          btn.textContent = '✓ COPIED!';
          btn.style.borderColor = 'var(--a2-green)';
          btn.style.color = 'var(--a2-green)';

          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.borderColor = '';
            btn.style.color = '';
          }, 2000);
        } catch (err) {
          console.error('Failed to copy: ', err);
        }
      }
    });
  });
}

/* ==========================================================================
   5. CRT Gallery Display Mode & Game Switcher
   ========================================================================== */
function initGalleryModes() {
  const galleryViewport = document.getElementById('gallery-viewport');
  const galleryImg = document.getElementById('gallery-img');
  const galleryTitle = document.getElementById('gallery-title');
  const galleryAuthor = document.getElementById('gallery-author');
  const modeButtons = document.querySelectorAll('.gallery-mode-btn');
  const gameButtons = document.querySelectorAll('.game-btn');

  if (!galleryViewport) return;

  // Game Switcher (Karateka, Lode Runner, etc.)
  gameButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const imgSrc = btn.getAttribute('data-img');
      const title = btn.getAttribute('data-title');
      const author = btn.getAttribute('data-author');
      const alt = btn.getAttribute('data-alt');

      gameButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      if (galleryImg && imgSrc) {
        galleryImg.src = imgSrc;
        if (alt) galleryImg.alt = alt;
      }
      if (galleryTitle && title) {
        galleryTitle.textContent = title;
      }
      if (galleryAuthor && author) {
        galleryAuthor.textContent = author;
      }
    });
  });

  // CRT Phosphor Mode Switcher (Color, Green, Amber, RGB)
  modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');

      modeButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      galleryViewport.className = 'showcase-viewport scanlines';
      if (mode === 'green') {
        galleryViewport.classList.add('filter-green');
      } else if (mode === 'amber') {
        galleryViewport.classList.add('filter-amber');
      } else if (mode === 'rgb') {
        galleryViewport.classList.add('filter-rgb');
      }
    });
  });
}

/* ==========================================================================
   6. Dynamic GitHub Releases Fetcher
   ========================================================================== */
async function fetchLatestRelease() {
  const versionEl = document.getElementById('release-version');
  const titleEl = document.getElementById('release-title');
  const descEl = document.getElementById('release-description');
  const downloadLink = document.getElementById('release-download-link');

  try {
    const res = await fetch('https://api.github.com/repos/linappleii/linapple/releases/latest');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (versionEl) versionEl.textContent = data.tag_name || 'Latest';
    if (titleEl) titleEl.textContent = data.name || `LinApple ${data.tag_name}`;
    if (descEl) {
      descEl.textContent = `Includes native .deb, .rpm, .pkg.tar.zst packages and standalone binary archives for x86_64 and ARM64.`;
    }
    if (downloadLink && data.html_url) {
      downloadLink.href = data.html_url;
    }
  } catch (err) {
    if (descEl) {
      descEl.textContent = 'Native Linux packages (.deb, .rpm, Arch) and portable binaries available on GitHub Releases.';
    }
  }
}
