# dsh-refresh

[简体中文](README.zh-CN.md) | English

Make **F5**, **Ctrl+F5**, and **Ctrl+R** / **Cmd+R** reliably reload the
DeepSeek Harness page.

DeepSeek Harness has no refresh button, and the browser's built-in reload
shortcuts are suppressed in some contexts. This plugin installs a `keydown`
listener that captures `F5` and `Ctrl+R` (`Cmd+R` on macOS) and calls
`location.reload()` — `Ctrl+F5` additionally bypasses the cache
(`location.reload(true)`).

## How it works

A minimal client-only plugin. It exports `name`, `inject`, and `apply(ctx)`,
and uses `ctx.effect` to register a capturing `keydown` listener that is
automatically removed when the plugin run is disposed.

```js
window.addEventListener("keydown", (ev) => {
  const isF5 = ev.key === "F5";
  const isCtrlR = (ev.ctrlKey || ev.metaKey) && (ev.key === "r" || ev.key === "R");
  if (!isF5 && !isCtrlR) return;
  ev.preventDefault();
  ev.stopPropagation();
  isF5 && (ev.ctrlKey || ev.metaKey) ? location.reload(true) : location.reload();
}, { capture: true });
```

## Install

```
dsh plugin add spidu-lee/dsh-refresh
```

## License

MIT
