# 🎬 LottieIcon 组件 - 快速上手

## 安装完成 ✅

LottieIcon 组件已创建并可以使用！

---

## 📦 文件结构

```
src/frontend/src/
├── components/
│   ├── LottieIcon.vue          # Lottie 动画组件（已创建）
│   └── LottieDemo.vue           # 演示页面（已创建）
├── assets/
│   └── json/
│       └── loading.json         # 示例动画（已创建）
└── layouts/
    └── LayoutSidebarModern.vue  # 可在此使用 LottieIcon
```

---

## 🚀 使用步骤

### 1️⃣ 下载 Lottie 动画

**推荐网站：**

- [LottieFiles](https://lottiefiles.com/) - 最推荐，海量免费动画
- [阿里图标库](https://www.iconfont.cn/) - 国内访问快

**搜索关键词：**

- "stream water" - 流动效果（流式生成）
- "fire flame hot" - 火焰（热点选题）
- "document list" - 文档列表（结构化）

### 2️⃣ 保存 JSON 文件

将下载的 JSON 文件重命名并放入：

```
src/frontend/src/assets/json/
├── stream.json       # 流式生成图标
├── hotspot.json      # 热点选题图标
└── structured.json   # 结构化生成图标
```

### 3️⃣ 在组件中使用

**基础用法：**

```vue
<template>
  <LottieIcon name="stream" />
</template>

<script setup lang="ts">
import LottieIcon from '@/components/LottieIcon.vue'
</script>
```

**自定义尺寸：**

```vue
<LottieIcon name="stream" :width="48" :height="48" />
```

**控制播放：**

```vue
<template>
  <LottieIcon ref="iconRef" name="stream" :autoplay="false" :loop="false" />
  <button @click="iconRef?.play()">播放</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LottieIcon from '@/components/LottieIcon.vue'

const iconRef = ref()
</script>
```

---

## 🎯 更新侧边栏菜单

编辑 `src/frontend/src/layouts/LayoutSidebarModern.vue`：

```vue
<template>
  <button class="nav-item">
    <!-- 替换 emoji 为 Lottie 动画 -->
    <LottieIcon :name="tab.icon" :width="32" :height="32" />
    <span>{{ tab.label }}</span>
  </button>
</template>

<script setup lang="ts">
import LottieIcon from '@/components/LottieIcon.vue'

const tabs = [
  { icon: 'stream', label: '流式生成' },
  { icon: 'hotspot', label: '热点选题' },
  { icon: 'structured', label: '结构化' }
]
</script>
```

---

## 📝 Props 参数

| 参数     | 类型          | 默认值   | 说明                    |
| -------- | ------------- | -------- | ----------------------- |
| name     | string        | **必填** | 动画文件名（不含.json） |
| width    | number/string | 32       | 宽度                    |
| height   | number/string | 32       | 高度                    |
| loop     | boolean       | true     | 是否循环                |
| autoplay | boolean       | true     | 是否自动播放            |
| speed    | number        | 1        | 播放速度                |

---

## 🎨 查看演示

创建一个演示页面查看效果：

**文件：** `src/frontend/src/components/LottieDemo.vue` （已创建）

在路由中添加演示页面，或在任意组件中引入：

```vue
<template>
  <LottieDemo />
</template>

<script setup lang="ts">
import LottieDemo from '@/components/LottieDemo.vue'
</script>
```

---

## 📚 完整文档

查看详细使用指南：

- [docs/LOTTIE-ICON-GUIDE.md](./LOTTIE-ICON-GUIDE.md) - 完整使用文档

---

## ⚡ 快速测试

启动项目并测试：

```bash
bun run dev
```

访问：http://localhost:8000

你应该可以看到 loading 动画在运行！

---

## 💡 常见问题

**Q: 动画不显示？**

- 检查 JSON 文件是否存在于 `src/frontend/src/assets/json/`
- 检查文件名是否正确（不含 .json 扩展名）
- 查看浏览器控制台错误信息

**Q: 从哪里下载免费的 Lottie 动画？**

- LottieFiles: https://lottiefiles.com/
- 搜索关键词，下载 JSON 格式

**Q: 如何调整动画尺寸？**

```vue
<LottieIcon name="stream" :width="64" :height="64" />
```

**Q: 如何让动画播放一次就停止？**

```vue
<LottieIcon name="celebration" :loop="false" />
```

---

**开始使用 LottieIcon 组件吧！** 🎉
