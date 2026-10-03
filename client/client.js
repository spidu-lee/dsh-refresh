// dsh-refresh — make F5 and Ctrl+F5 reliably reload the DSH page.
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
        // F5 (key === "F5"), with or without Ctrl (Ctrl+F5 = hard reload).
        if (ev.key === "F5") {
          ev.preventDefault();
          ev.stopPropagation();
          // Bypass cache on Ctrl+F5; plain F5 is a soft reload.
          if (ev.ctrlKey || ev.metaKey) {
            location.reload(true);
          } else {
            location.reload();
          }
        }
      }
      window.addEventListener("keydown", onKeydown, { capture: true });
      return () => window.removeEventListener("keydown", onKeydown, { capture: true });
    }, "dsh-refresh: f5-reload");
  }

  exports.apply = apply;
  exports.inject = inject;
  exports.name = name;
  return module.exports;
} });
