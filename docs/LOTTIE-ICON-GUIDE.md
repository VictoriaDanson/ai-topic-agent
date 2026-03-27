# LottieIcon 组件使用指南

## 📦 概述

`LottieIcon` 是一个基于 `lottie-web` 库的 Vue3 组件，用于渲染 Lottie JSON 动画。支持动态加载、播放控制、自定义尺寸等功能。

---

## 🚀 快速开始

### 1. 准备动画文件

将 Lottie JSON 动画文件放入 `src/frontend/src/assets/json/` 目录：

```
src/frontend/src/assets/json/
├── loading.json          # 加载动画
├── success.json          # 成功动画
├── error.json            # 错误动画
├── stream.json           # 流式动画
├── hotspot.json          # 热点动画
└── structured.json       # 结构化动画
```

> **获取免费 Lottie 动画：**
>
> - [LottieFiles](https://lottiefiles.com/) - 海量免费动画
> - [阿里巴巴矢量图标库](https://www.iconfont.cn/) - 下载 JSON 格式

### 2. 基础使用

```vue
<template>
  <div>
    <!-- 最简单的用法 -->
    <LottieIcon name="loading" />

    <!-- 自定义尺寸 -->
    <LottieIcon name="success" :width="64" :height="64" />

    <!-- 自定义播放选项 -->
    <LottieIcon
      name="stream"
      :width="48"
      :height="48"
      :loop="true"
      :autoplay="true"
      :speed="1.5"
    />
  </div>
</template>

<script setup lang="ts">
import LottieIcon from '@/components/LottieIcon.vue'
</script>
```

---

## 📝 Props 参数

| 参数       | 类型               | 默认值   | 说明                                   |
| ---------- | ------------------ | -------- | -------------------------------------- |
| `name`     | `string`           | **必填** | 动画文件名（不含 .json 扩展名）        |
| `width`    | `number \| string` | `32`     | 宽度（数字自动添加 px，也可传 '100%'） |
| `height`   | `number \| string` | `32`     | 高度（数字自动添加 px，也可传 '100%'） |
| `loop`     | `boolean`          | `true`   | 是否循环播放                           |
| `autoplay` | `boolean`          | `true`   | 是否自动播放                           |
| `speed`    | `number`           | `1`      | 播放速度（1为正常速度，2为2倍速）      |

---

## 🎮 暴露的方法

通过 `ref` 可以访问组件实例的控制方法：

```vue
<template>
  <div>
    <LottieIcon ref="lottieRef" name="loading" :autoplay="false" />

    <button @click="handlePlay">播放</button>
    <button @click="handlePause">暂停</button>
    <button @click="handleStop">停止</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LottieIcon from '@/components/LottieIcon.vue'

const lottieRef = ref<InstanceType<typeof LottieIcon> | null>(null)

const handlePlay = () => {
  lottieRef.value?.play()
}

const handlePause = () => {
  lottieRef.value?.pause()
}

const handleStop = () => {
  lottieRef.value?.stop()
}
</script>
```

### 可用方法列表

| 方法                           | 参数                                         | 说明                   |
| ------------------------------ | -------------------------------------------- | ---------------------- |
| `play()`                       | -                                            | 播放动画               |
| `pause()`                      | -                                            | 暂停动画               |
| `stop()`                       | -                                            | 停止动画并重置到第一帧 |
| `setSpeed(speed: number)`      | `speed`: 播放速度                            | 设置播放速度           |
| `goToAndPlay(value, isFrame?)` | `value`: 帧数或时间<br>`isFrame`: 是否为帧数 | 跳转到指定位置并播放   |
| `goToAndStop(value, isFrame?)` | `value`: 帧数或时间<br>`isFrame`: 是否为帧数 | 跳转到指定位置并停止   |

---

## 💡 使用示例

### 示例 1: 侧边栏菜单图标

```vue
<template>
  <nav class="sidebar-nav">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      :class="['nav-item', { active: activeTab === tab.id }]"
      @click="activeTab = tab.id"
    >
      <!-- 使用 Lottie 动画图标 -->
      <LottieIcon :name="tab.icon" :width="32" :height="32" class="nav-icon" />
      <span class="nav-label">{{ tab.label }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LottieIcon from '@/components/LottieIcon.vue'

const tabs = [
  { id: 'stream', label: '流式生成', icon: 'stream' },
  { id: 'hotspot', label: '热点选题', icon: 'hotspot' },
  { id: 'structured', label: '结构化', icon: 'structured' }
]

const activeTab = ref('stream')
</script>
```

### 示例 2: 加载状态

```vue
<template>
  <div class="loading-container">
    <LottieIcon name="loading" :width="64" :height="64" :speed="1.5" />
    <p>加载中...</p>
  </div>
</template>

<script setup lang="ts">
import LottieIcon from '@/components/LottieIcon.vue'
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}
</style>
```

### 示例 3: 成功/错误提示

```vue
<template>
  <div class="toast" :class="type">
    <LottieIcon :name="type" :width="48" :height="48" :loop="false" />
    <span>{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import LottieIcon from '@/components/LottieIcon.vue'

defineProps<{
  type: 'success' | 'error' | 'warning'
  message: string
}>()
</script>

<style scoped>
.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast.success {
  border-left: 4px solid #52c41a;
}

.toast.error {
  border-left: 4px solid #ff4d4f;
}
</style>
```

### 示例 4: 手动控制播放

```vue
<template>
  <div class="animation-player">
    <LottieIcon
      ref="animationRef"
      name="celebration"
      :width="200"
      :height="200"
      :autoplay="false"
      :loop="false"
    />

    <div class="controls">
      <button @click="play">▶️ 播放</button>
      <button @click="pause">⏸️ 暂停</button>
      <button @click="stop">⏹️ 停止</button>
      <button @click="replay">🔄 重播</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LottieIcon from '@/components/LottieIcon.vue'

const animationRef = ref<InstanceType<typeof LottieIcon> | null>(null)

const play = () => animationRef.value?.play()
const pause = () => animationRef.value?.pause()
const stop = () => animationRef.value?.stop()
const replay = () => {
  animationRef.value?.stop()
  setTimeout(() => animationRef.value?.play(), 100)
}
</script>

<style scoped>
.animation-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
}

.controls {
  display: flex;
  gap: 0.75rem;
}

.controls button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.controls button:hover {
  background: #f5f5f5;
  border-color: #1890ff;
}
</style>
```

### 示例 5: Logo 动画

```vue
<template>
  <div class="logo">
    <div class="logo-icon-wrapper">
      <!-- 使用 Lottie 动画作为 Logo -->
      <LottieIcon name="logo" :width="48" :height="48" :speed="0.8" />
    </div>
    <div class="logo-info">
      <div class="logo-title">选题 Agent</div>
      <div class="logo-subtitle">AI 助手</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LottieIcon from '@/components/LottieIcon.vue'
</script>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon-wrapper {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.25);
}
</style>
```

---

## 🎨 从阿里图标库获取动画

### 步骤 1: 访问阿里巴巴矢量图标库

访问 [iconfont.cn](https://www.iconfont.cn/)

### 步骤 2: 搜索图标

在搜索框输入关键词，例如：

- "加载" / "loading"
- "成功" / "success"
- "火" / "fire"
- "文件" / "document"

### 步骤 3: 下载 Lottie 格式

1. 点击图标
2. 选择 **"下载"**
3. 选择 **"Lottie"** 格式
4. 下载 JSON 文件

### 步骤 4: 放入项目

将下载的 `.json` 文件放入：

```
src/frontend/src/assets/json/
```

### 步骤 5: 使用

```vue
<LottieIcon name="your-icon-name" />
```

---

## 🌐 推荐的 Lottie 资源网站

### 1. LottieFiles（最推荐）

- **网址：** https://lottiefiles.com/
- **特点：** 海量免费动画，质量高，分类全
- **搜索关键词：**
  - "stream" - 流动效果
  - "fire" - 火焰/热门
  - "document" - 文档
  - "chart" - 图表
  - "success" - 成功
  - "loading" - 加载

### 2. 阿里巴巴矢量图标库

- **网址：** https://www.iconfont.cn/
- **特点：** 国内访问快，中文搜索友好
- **下载格式：** 选择 Lottie/JSON 格式

### 3. Lordicon

- **网址：** https://lordicon.com/
- **特点：** 精美的动画图标，部分免费

---

## 🔧 常见问题

### Q1: 动画不显示？

**检查：**

1. JSON 文件是否存在于 `src/frontend/src/assets/json/` 目录
2. 文件名是否正确（不含 .json 扩展名）
3. 浏览器控制台是否有错误信息

### Q2: 动画太大或太小？

**解决：**

```vue
<!-- 使用 width 和 height 调整尺寸 -->
<LottieIcon name="loading" :width="64" :height="64" />

<!-- 或使用百分比 -->
<LottieIcon name="loading" width="100%" height="100%" />
```

### Q3: 动画播放太快或太慢？

**解决：**

```vue
<!-- 使用 speed 调整播放速度 -->
<LottieIcon name="loading" :speed="0.5" />
<!-- 慢速 -->
<LottieIcon name="loading" :speed="2" />
<!-- 快速 -->
```

### Q4: 如何只播放一次？

**解决：**

```vue
<LottieIcon name="success" :loop="false" />
```

### Q5: 如何在特定时机播放动画？

**解决：**

```vue
<template>
  <LottieIcon
    ref="lottieRef"
    name="celebration"
    :autoplay="false"
    :loop="false"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LottieIcon from '@/components/LottieIcon.vue'

const lottieRef = ref()

// 在需要的时候播放
const celebrate = () => {
  lottieRef.value?.play()
}
</script>
```

---

## 🎯 实战：更新侧边栏菜单图标

### 步骤 1: 下载图标

从 [LottieFiles](https://lottiefiles.com/) 下载以下动画：

1. **流式生成** - 搜索 "stream water"
2. **热点选题** - 搜索 "fire flame"
3. **结构化生成** - 搜索 "document list"

保存为：

- `src/frontend/src/assets/json/stream.json`
- `src/frontend/src/assets/json/hotspot.json`
- `src/frontend/src/assets/json/structured.json`

### 步骤 2: 更新布局组件

编辑 `src/frontend/src/layouts/LayoutSidebarModern.vue`：

```vue
<template>
  <div class="layout-sidebar-modern">
    <aside class="sidebar">
      <nav class="sidebar-nav">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['nav-item', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <!-- 使用 LottieIcon 替代 Emoji -->
          <LottieIcon
            :name="tab.icon"
            :width="32"
            :height="32"
            class="nav-icon"
          />
          <div class="nav-content">
            <span class="nav-label">{{ tab.label }}</span>
            <span class="nav-desc">{{ tab.desc }}</span>
          </div>
        </button>
      </nav>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LottieIcon from '@/components/LottieIcon.vue'

const tabs = [
  {
    id: 'stream',
    label: '流式生成',
    desc: '实时生成选题',
    icon: 'stream' // 对应 stream.json
  },
  {
    id: 'hotspot',
    label: '热点选题',
    desc: '基于实时热点',
    icon: 'hotspot' // 对应 hotspot.json
  },
  {
    id: 'structured',
    label: '结构化生成',
    desc: '高级定制选题',
    icon: 'structured' // 对应 structured.json
  }
]
</script>
```

---

## 📦 TypeScript 类型定义

如果需要更严格的类型检查，可以创建类型定义文件：

```typescript
// src/frontend/src/types/lottie.d.ts

export interface LottieIconProps {
  name: string
  width?: number | string
  height?: number | string
  loop?: boolean
  autoplay?: boolean
  speed?: number
}

export interface LottieIconInstance {
  play: () => void
  pause: () => void
  stop: () => void
  setSpeed: (speed: number) => void
  goToAndPlay: (value: number, isFrame?: boolean) => void
  goToAndStop: (value: number, isFrame?: boolean) => void
  instance: any
}
```

---

## 🚀 性能优化建议

### 1. 懒加载动画

对于不常用的动画，可以延迟加载：

```vue
<LottieIcon v-if="showAnimation" name="celebration" />
```

### 2. 使用合适的渲染器

```typescript
// 在 LottieIcon.vue 中修改
renderer: 'svg' // 推荐：质量好，性能佳
// renderer: 'canvas'  // 备选：性能更好但质量略差
// renderer: 'html'  // 不推荐：兼容性最好但性能差
```

### 3. 优化 JSON 文件大小

- 使用在线工具压缩 Lottie JSON
- 移除不必要的图层和效果
- 推荐工具：https://lottiefiles.com/tools/compress

---

**LottieIcon 组件使用指南完成！** 🎉

现在你可以在项目中使用流畅的 Lottie 动画了！
