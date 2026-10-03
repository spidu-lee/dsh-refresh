# dsh-refresh

[简体中文](README.zh-CN.md) | English

Make **F5** and **Ctrl+F5** reliably reload the DeepSeek Harness page.

DeepSeek Harness has no refresh button, and F5 alone doesn't reload the page
(the browser's built-in reload is suppressed in some contexts). This plugin
installs a `keydown` listener that captures `F5` and calls `location.reload()` —
`Ctrl+F5` additionally bypasses the cache (`location.reload(true)`).

## How it works

A minimal client-only plugin. It exports `name`, `inject`, and `apply(ctx)`,
and uses `ctx.effect` to register a capturing `keydown` listener that is
automatically removed when the plugin run is disposed.

```js
window.addEventListener("keydown", (ev) => {
  if (ev.key === "F5") {
    ev.preventDefault();
    ev.ctrlKey || ev.metaKey ? location.reload(true) : location.reload();
  }
}, { capture: true });
```

## Install

```
dsh plugin add spidu-lee/dsh-refresh
```

## License

MIT
