// dsh-refresh — make F5, Ctrl+F5, and Ctrl+R reliably reload the DSH page.
// Minimal client-only plugin: no React, no slots, just a keydown listener
// registered through ctx.effect so it is cleaned up with the plugin run.
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
        // Ctrl+R / Cmd+R is the other ubiquitous reload shortcut.
        const isCtrlR = (ev.ctrlKey || ev.metaKey) && (ev.key === "r" || ev.key === "R");
        if (!isF5 && !isCtrlR) return;

        ev.preventDefault();
        ev.stopPropagation();

        if (isF5 && (ev.ctrlKey || ev.metaKey)) {
          // Ctrl+F5: bypass cache (deprecated arg, but harmless).
          location.reload(true);
        } else {
          location.reload();
        }
      }
      window.addEventListener("keydown", onKeydown, { capture: true });
      return () => window.removeEventListener("keydown", onKeydown, { capture: true });
    }, "dsh-refresh: f5-ctrl-r-reload");
  }

  exports.apply = apply;
  exports.inject = inject;
  exports.name = name;
  return module.exports;
} });
