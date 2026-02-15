# AI Video (Tauri v2)

本项目是一个本地桌面端 AI 视频处理工具，基于 `Tauri v2 + React + TypeScript`。

## 主要能力

- 视频超分辨率（`waifu2x-ncnn-vulkan`）
- 视频补帧（`rife-ncnn-vulkan`）
- 本地 `ffmpeg/ffprobe` 抽帧、编码、元数据读取
- 任务队列（`pending -> processing -> completed/error/cancelled`）
- 可配置输出目录、模型、倍率、GPU、主题

## 技术栈

- 前端：React 19、Vite 7、TypeScript、Tailwind CSS 4、Zustand
- 桌面容器：Tauri v2
- 插件：`@tauri-apps/plugin-shell`、`@tauri-apps/plugin-fs`、`@tauri-apps/plugin-dialog`

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发

```bash
npm run tauri dev
```

### 3. 构建

```bash
npm run build
npm run tauri build
```

## 目录说明

- `src/pages`：页面（首页、超分、补帧、队列、设置）
- `src/components`：UI 组件与布局
- `src/lib`：
  - `ffmpeg.ts`：ffmpeg/ffprobe 调用
  - `upscaler.ts`：waifu2x 调用
  - `interpolator.ts`：rife 调用
  - `pipeline.ts`：处理流水线（抽帧 -> AI 处理 -> 编码）
  - `processing-runner.ts`：任务调度与状态推进
- `src/hooks/useProcessing.ts`：任务创建、取消、与调度器连接
- `src/hooks/useVideoInfo.ts`：真实视频元数据读取
- `resources/models`：模型与 ffmpeg 可执行文件

## 模型说明

### 超分模型（waifu2x）

- `models-cunet`
- `models-upconv_7_anime_style_art_rgb`
- `models-upconv_7_photo`

### 补帧模型（RIFE）

- `rife-v4.6`
- `rife-v4`
- `rife-v3.1`
- `rife-v3.0`
- `rife-v2.4`
- `rife-v2.3`
- `rife-v2`
- `rife`
- `rife-anime`
- `rife-HD`
- `rife-UHD`

## 处理流程

1. 添加任务到队列
2. 调度器自动拉起待处理任务
3. `ffmpeg` 抽帧
4. waifu2x 或 RIFE 处理帧序列
5. `ffmpeg` 合成输出视频（可保留原音轨）
6. 更新任务进度与状态

## 当前限制

- 仅打包了 Windows 可执行文件（`*.exe`）；其他平台需自行提供对应二进制与模型资源。
- 部分模型速度较慢且显存占用较高，建议按 GPU 能力调节参数。

## 常见问题

### 队列里任务不动

- 检查 `resources/models` 下是否存在对应二进制和模型目录。
- 检查所选模型是否存在；当前版本会在模型缺失时明确报错。

### 元数据读取失败

- 仅桌面 Tauri 环境可读取真实元数据；纯浏览器调试无法调用本地二进制。

### 输出目录不生效

- 先在“设置”页面选择输出目录，再创建新任务（已有任务不会自动改输出路径）。
