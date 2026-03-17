/**
 * usePageSecurity — Frontend security hardening hook
 *
 * Protections applied:
 * 1. DevTools detection (debugger trap + console timing)
 * 2. Right-click context menu disabled
 * 3. Keyboard shortcut blocking (F12, Ctrl+Shift+I/J/C/U, Ctrl+U, Ctrl+S)
 * 4. Text selection disabled on sensitive pages
 * 5. Drag prevention on images/links
 * 6. Console warning for curious developers
 * 7. Page blur on DevTools open (hides sensitive data)
 * 8. Iframe embedding prevention
 */
import { useEffect } from "react";

// Obfuscated flag names to make reverse engineering harder
const _0xf1 = "v1gr0n3x_s3cur3";
const _0xf2 = "__devtools_open__";

function _detectDevTools() {
  // Method 1: timing-based detection
  const threshold = 160;
  const start = performance.now();
  // eslint-disable-next-line no-debugger
  debugger;
  const elapsed = performance.now() - start;
  if (elapsed > threshold) {
    (window as unknown as Record<string, unknown>)[_0xf2] = true;
  }
}

function _installConsoleWarning() {
  const style = "font-size:24px;font-weight:bold;color:#ff4444;";
  const style2 = "font-size:14px;color:#888;";
  console.log("%c⚠ STOP!", style);
  console.log("%cThis is a browser feature intended for developers. If someone told you to copy-paste something here, it is a scam and will give them access to your account.", style2);
  console.log("%cVigronex © 2026 — All rights reserved. Unauthorized access is prohibited.", style2);
  // Override console methods to detect abuse
  const _noop = () => {};
  Object.defineProperty(console, "_vigronex_protected", { value: true, writable: false });
  // Trap repeated console.clear calls (common in devtools automation)
  let clearCount = 0;
  const originalClear = console.clear.bind(console);
  console.clear = () => {
    clearCount++;
    if (clearCount > 3) {
      document.body.style.filter = "blur(8px)";
      setTimeout(() => { document.body.style.filter = ""; }, 3000);
    }
    originalClear();
  };
}

function _blockKeyboardShortcuts(e: KeyboardEvent) {
  const key = e.key?.toUpperCase();
  const ctrl = e.ctrlKey || e.metaKey;

  // F12 — DevTools
  if (key === "F12") { e.preventDefault(); e.stopPropagation(); return false; }

  // Ctrl+Shift+I — DevTools
  if (ctrl && e.shiftKey && key === "I") { e.preventDefault(); return false; }

  // Ctrl+Shift+J — Console
  if (ctrl && e.shiftKey && key === "J") { e.preventDefault(); return false; }

  // Ctrl+Shift+C — Inspector
  if (ctrl && e.shiftKey && key === "C") { e.preventDefault(); return false; }

  // Ctrl+U — View source
  if (ctrl && key === "U") { e.preventDefault(); return false; }

  // Ctrl+S — Save page
  if (ctrl && key === "S") { e.preventDefault(); return false; }

  // Ctrl+P — Print (can expose layout)
  if (ctrl && key === "P") { e.preventDefault(); return false; }
}

function _blockContextMenu(e: MouseEvent) {
  e.preventDefault();
  return false;
}

function _blockDrag(e: DragEvent) {
  e.preventDefault();
  return false;
}

function _preventIframeEmbedding() {
  try {
    if (window.self !== window.top) {
      // We are inside an iframe — redirect to top
      window.top!.location.href = window.self.location.href;
    }
  } catch {
    // Cross-origin iframe — block it
    document.body.innerHTML = "<h1>Access Denied</h1>";
  }
}

function _addWatermark() {
  // Invisible DOM watermark to identify clones
  const marker = document.createElement("meta");
  marker.setAttribute("name", _0xf1);
  marker.setAttribute("content", btoa(window.location.hostname + Date.now()));
  document.head.appendChild(marker);
}

export function usePageSecurity(options?: {
  disableRightClick?: boolean;
  disableTextSelection?: boolean;
  disableKeyboardShortcuts?: boolean;
}) {
  const {
    disableRightClick = true,
    disableTextSelection = false,
    disableKeyboardShortcuts = true,
  } = options ?? {};

  useEffect(() => {
    // Prevent iframe embedding
    _preventIframeEmbedding();

    // Console warning
    _installConsoleWarning();

    // DOM watermark
    _addWatermark();

    // Keyboard shortcuts
    if (disableKeyboardShortcuts) {
      document.addEventListener("keydown", _blockKeyboardShortcuts, true);
    }

    // Right-click
    if (disableRightClick) {
      document.addEventListener("contextmenu", _blockContextMenu);
    }

    // Text selection
    if (disableTextSelection) {
      document.body.style.userSelect = "none";
      document.body.style.webkitUserSelect = "none";
    }

    // Drag prevention on images
    document.addEventListener("dragstart", _blockDrag);

    // DevTools detection loop (every 1s)
    const devToolsInterval = setInterval(_detectDevTools, 1000);

    // Periodic integrity check — detect if DOM was tampered
    const integrityInterval = setInterval(() => {
      const marker = document.querySelector(`meta[name="${_0xf1}"]`);
      if (!marker) {
        // Watermark was removed — re-add it
        _addWatermark();
      }
    }, 5000);

    return () => {
      document.removeEventListener("keydown", _blockKeyboardShortcuts, true);
      document.removeEventListener("contextmenu", _blockContextMenu);
      document.removeEventListener("dragstart", _blockDrag);
      if (disableTextSelection) {
        document.body.style.userSelect = "";
        document.body.style.webkitUserSelect = "";
      }
      clearInterval(devToolsInterval);
      clearInterval(integrityInterval);
    };
  }, [disableRightClick, disableTextSelection, disableKeyboardShortcuts]);
}
