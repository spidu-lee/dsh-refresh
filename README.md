# dsh-refresh

[简体中文](README.zh-CN.md) | English

Make **F5**, **Ctrl+F5**, and **Ctrl+Shift+R** / **Cmd+Shift+R** reliably
reload the DeepSeek Harness page.

DeepSeek Harness has no refresh button, and the browser's built-in reload
shortcuts are suppressed in some contexts. This plugin installs a `keydown`
listener that captures `F5` and `Ctrl+Shift+R` (`Cmd+Shift+R` on macOS) and
calls `location.reload()` — `Ctrl+F5` and `Ctrl+Shift+R` additionally bypass
the cache (`location.reload(true)`).

## Why not Ctrl+R?

`Ctrl+R` / `Cmd+R` is **not** supported, and it cannot be fixed from a
page-level plugin. DeepSeek Harness registers `Ctrl+R` as its built-in
`page.refresh` shortcut, and it consumes the key at the Electron
`before-input-event` layer — calling `preventDefault()` *before* the `keydown`
event ever reaches the page. A `window.addEventListener("keydown", …)`
listener simply never sees it.

Use **F5** (reload), **Ctrl+F5** (hard reload), or **Ctrl+Shift+R** (hard
reload) instead. If you want `Ctrl+R` back, rebind the `page.refresh` shortcut
in DeepSeek Harness's keyboard-shortcut settings to a different key; then
`Ctrl+R` will flow through to the page again.

## How it works

A minimal client-only plugin. It exports `name`, `inject`, and `apply(ctx)`,
and uses `ctx.effect` to register a capturing `keydown` listener that is
automatically removed when the plugin run is disposed.

```js
window.addEventListener("keydown", (ev) => {
  const isF5 = ev.key === "F5";
  const isHardReload = (ev.ctrlKey || ev.metaKey) && ev.shiftKey && (ev.key === "r" || ev.key === "R");
  if (!isF5 && !isHardReload) return;
  ev.preventDefault();
  ev.stopPropagation();
  (isF5 && (ev.ctrlKey || ev.metaKey)) || isHardReload ? location.reload(true) : location.reload();
}, { capture: true });
```

## Install

From npm (recommended):

```
dsh plugin add dsh-refresh
```

Or from GitHub:

```
dsh plugin add spidu-lee/dsh-refresh
```

## License

MIT
