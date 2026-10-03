# dsh-refresh

[English](README.md) | 简体中文

让 **F5**、**Ctrl+F5** 和 **Ctrl+R** / **Cmd+R** 都能可靠地刷新 DeepSeek
Harness 页面。

DeepSeek Harness 没有刷新按钮，浏览器内置的刷新快捷键在某些场景下也被抑制了。
这个插件安装一个 `keydown` 监听器，捕获 `F5` 和 `Ctrl+R`（macOS 上是 `Cmd+R`）
并调用 `location.reload()` —— `Ctrl+F5` 则额外绕过缓存（`location.reload(true)`）。

## 工作原理

一个极简的纯客户端插件。它导出 `name`、`inject` 和 `apply(ctx)`，并通过
`ctx.effect` 注册一个捕获阶段的 `keydown` 监听器；当插件运行时被销毁时，该
监听器会自动移除。

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

## 安装

```
dsh plugin add spidu-lee/dsh-refresh
```

## 许可证

MIT
