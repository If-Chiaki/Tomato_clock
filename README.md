# 🍅 极简番茄钟 (Pomodoro Clock)

一个基于 Electron + React + Tailwind CSS 构建的现代化、极简风格的番茄钟应用。支持迷你悬浮窗模式。

## 实机演示
<img width="255" height="405" alt="image" src="https://github.com/user-attachments/assets/cf81c673-4e4b-4ef1-9706-d886e64e931e" />


## ✨ 功能特性

- **极简设计**：无边框窗口，磨砂玻璃效果。
- **双模式切换**：
  - **普通模式**：包含完整控制和设置。
  - **迷你模式**：超小悬浮窗，仅显示倒计时和进度环，支持拖拽。
- **自定义设置**：可调整专注时长。
- **平滑动画**：基于 Framer Motion 的流畅交互。
- **国内优化**：预配置 npm 镜像，解决 Electron 下载慢的问题。

## 🛠️ 开发与编译指南

如果您下载了源码并希望自己编译或修改，请按照以下步骤操作。

### 1. 环境准备

确保您的电脑上已安装：
- [Node.js](https://nodejs.org/) (建议版本 v16 或更高)
- Git

### 2. 安装依赖

在项目根目录下打开终端（Terminal / PowerShell），运行：

```bash
npm install
```

> **提示**：项目根目录已包含 `.npmrc` 文件，预配置了淘宝镜像源和 Electron 镜像，通常可以解决国内网络下载 Electron 失败的问题。

### 3. 启动开发模式

如果您想修改代码并实时预览效果：

```bash
npm run electron:dev
```

此命令会同时启动 Vite 开发服务器和 Electron 窗口。

### 4. 打包构建 (生成 .exe)

如果您想生成可直接运行的 `.exe` 安装包：

```bash
npm run dist
```

- 构建过程可能需要几分钟。
- 构建完成后，安装包位于 `release/` 目录下。
- 免安装版（解压即用）位于 `release/win-unpacked/` 目录下，运行其中的 `番茄钟.exe` 即可。

## 📁 项目结构

```
├── electron/        # Electron 主进程代码
│   ├── main.js      # 主进程入口，处理窗口创建、IPC通信
│   └── preload.js   # 预加载脚本，暴露 API 给渲染进程
├── src/             # React 渲染进程代码
│   ├── App.jsx      # 主应用组件 (包含所有 UI 逻辑)
│   ├── styles/      # CSS 样式文件
│   └── components/  # React 组件
├── release/         # 打包输出目录 (git ignored)
└── package.json     # 项目配置与脚本
```

## 常见问题

**Q: 打包时报错下载失败？**
A: 请检查网络连接。虽然配置了镜像，但有时网络波动仍会导致下载超时。您可以尝试重新运行 `npm run dist`。

## 许可证

MIT License
