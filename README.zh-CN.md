# dsh-refresh

[English](README.md) | 简体中文

让 **F5** 和 **Ctrl+F5** 都能可靠地刷新 DeepSeek Harness 页面。

DeepSeek Harness 没有刷新按钮，单独按 F5 也不会刷新页面（浏览器内置的刷新
在某些场景下被抑制了）。这个插件安装一个 `keydown` 监听器，捕获 `F5` 并调用
`location.reload()` —— `Ctrl+F5` 则额外绕过缓存（`location.reload(true)`）。

## 工作原理

一个极简的纯客户端插件。它导出 `name`、`inject` 和 `apply(ctx)`，并通过
`ctx.effect` 注册一个捕获阶段的 `keydown` 监听器；当插件运行时被销毁时，该
监听器会自动移除。

```js
window.addEventListener("keydown", (ev) => {
  if (ev.key === "F5") {
    ev.preventDefault();
    ev.ctrlKey || ev.metaKey ? location.reload(true) : location.reload();
  }
}, { capture: true });
```

## 安装

```
dsh plugin add spidu-lee/dsh-refresh
```

## 许可证

MIT
