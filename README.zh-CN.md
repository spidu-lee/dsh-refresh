# dsh-refresh

[English](README.md) | 简体中文

让 **F5**、**Ctrl+F5** 和 **Ctrl+Shift+R** / **Cmd+Shift+R** 都能可靠地刷新
DeepSeek Harness 页面。

DeepSeek Harness 没有刷新按钮，浏览器内置的刷新快捷键在某些场景下也被抑制了。
这个插件安装一个 `keydown` 监听器，捕获 `F5` 和 `Ctrl+Shift+R`（macOS 上是
`Cmd+Shift+R`）并调用 `location.reload()` —— `Ctrl+F5` 和 `Ctrl+Shift+R` 则
额外绕过缓存（`location.reload(true)`）。

## 为什么不支持 Ctrl+R？

`Ctrl+R` / `Cmd+R` **不受支持**，而且无法在页面级插件里修复。DeepSeek Harness
把 `Ctrl+R` 注册成了它内置的 `page.refresh` 快捷键，并在 Electron 的
`before-input-event` 层就把它消费掉了——在 `keydown` 事件到达页面**之前**就调用了
`preventDefault()`。因此 `window.addEventListener("keydown", …)` 根本收不到这个按键。

请改用 **F5**（刷新）、**Ctrl+F5**（硬刷新）或 **Ctrl+Shift+R**（硬刷新）。如果你
想找回 `Ctrl+R`，可以在 DeepSeek Harness 的键盘快捷键设置里把 `page.refresh` 改绑到
其他按键，这样 `Ctrl+R` 就会重新穿透到页面。

## 工作原理

一个极简的纯客户端插件。它导出 `name`、`inject` 和 `apply(ctx)`，并通过
`ctx.effect` 注册一个捕获阶段的 `keydown` 监听器；当插件运行时被销毁时，该
监听器会自动移除。

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

## 安装

从 npm 安装（推荐）：

```
dsh plugin add dsh-refresh
```

或从 GitHub 安装：

```
dsh plugin add spidu-lee/dsh-refresh
```

## 许可证

MIT
