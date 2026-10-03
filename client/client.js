// dsh-refresh — make F5, Ctrl+F5, and Ctrl+Shift+R reliably reload the DSH page.
// Minimal client-only plugin: no React, no slots, just a keydown listener
// registered through ctx.effect so it is cleaned up with the plugin run.
//
// NOTE: Ctrl+R / Cmd+R is intentionally NOT handled here. DeepSeek Harness
// registers Ctrl+R as its built-in "page.refresh" shortcut at the Electron
// `before-input-event` layer, where it calls `preventDefault()` before the
// keydown ever reaches the page. A page-level listener can never see it, so
// this plugin supports F5, Ctrl+F5, and Ctrl+Shift+R instead.
window.__ModuleLoader__.load({ id: "dsh-refresh", factory: (require) => {
  var module = { exports: {} };
  var exports = module.exports;
  Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

  const name = "dsh-refresh";
  const inject = []; // no client services needed

  function apply(ctx) {
    ctx.effect(() => {
      function onKeydown(ev) {
        // F5 (with or without Ctrl/Cmd) — Ctrl+F5 / Cmd+F5 = hard reload.
        const isF5 = ev.key === "F5";
        // Ctrl+Shift+R / Cmd+Shift+R = hard reload (Ctrl+R is taken by DSH).
        const isHardReload = (ev.ctrlKey || ev.metaKey) && ev.shiftKey && (ev.key === "r" || ev.key === "R");
        if (!isF5 && !isHardReload) return;

        ev.preventDefault();
        ev.stopPropagation();

        if ((isF5 && (ev.ctrlKey || ev.metaKey)) || isHardReload) {
          // Ctrl+F5 / Ctrl+Shift+R: bypass cache (deprecated arg, but harmless).
          location.reload(true);
        } else {
          location.reload();
        }
      }
      window.addEventListener("keydown", onKeydown, { capture: true });
      return () => window.removeEventListener("keydown", onKeydown, { capture: true });
    }, "dsh-refresh: f5-hard-reload");
  }

  exports.apply = apply;
  exports.inject = inject;
  exports.name = name;
  return module.exports;
} });
