# 🎨 主题配置说明

## 概述

本项目使用 **Ant Design 蓝色 (`#1890ff`)** 作为主色调，提供统一的视觉体验。

---

## 🌈 主色调

### 主色系列

| 颜色名称 | 色值 | 用途 |
|---------|------|------|
| 主色 | `#1890ff` | 按钮、链接、激活状态 |
| 主色（浅） | `#40a9ff` | 鼠标悬停效果 |
| 主色（深） | `#096dd9` | 渐变、按下状态 |
| 主色背景 | `rgba(24, 144, 255, 0.1)` | 高亮背景 |
| 主色阴影 | `rgba(24, 144, 255, 0.2)` | 阴影效果 |

### 辅助色

| 颜色名称 | 色值 | 用途 |
|---------|------|------|
| 成功 | `#52c41a` | 成功提示 |
| 警告 | `#faad14` | 警告提示 |
| 错误 | `#ff4d4f` | 错误提示 |
| 信息 | `#1890ff` | 信息提示 |

---

## 📦 使用方式

### 1. 在 Vue 组件中使用

```vue
<style scoped>
.button {
  background: #1890ff;
}

.button:hover {
  background: #40a9ff;
}

.button:active {
  background: #096dd9;
}

.highlight {
  background: rgba(24, 144, 255, 0.1);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.25);
}
</style>
```

### 2. 使用主题配置文件

```typescript
import theme from '@/config/theme'

// JavaScript 中使用
const primaryColor = theme.colors.primary // '#1890ff'
const gradient = theme.colors.gradient.primary // 'linear-gradient(...)'

// 在 style 标签中使用（需要配合 CSS 变量）
const styles = {
  backgroundColor: theme.colors.primary,
  borderRadius: theme.borderRadius.md,
  padding: theme.spacing.md
}
```

### 3. 使用 CSS 变量（推荐）

在 `main.css` 中定义 CSS 变量：

```css
:root {
  --color-primary: #1890ff;
  --color-primary-light: #40a9ff;
  --color-primary-dark: #096dd9;
  --color-primary-bg: rgba(24, 144, 255, 0.1);
  --color-primary-shadow: rgba(24, 144, 255, 0.2);
}

/* 使用 */
.button {
  background: var(--color-primary);
}
```

---

## 🎯 应用位置

### 1. 侧边栏布局

**LayoutSidebarModern.vue：**
- Logo 图标背景：渐变 `#1890ff → #096dd9`
- 激活 Tab 背景：`rgba(24, 144, 255, 0.1)`
- 激活 Tab 文字：`#1890ff`
- 激活 Tab 阴影：`rgba(24, 144, 255, 0.2)`

### 2. 按钮

**全局按钮样式（main.css）：**
- 默认背景：`#1890ff`
- 鼠标悬停：`#40a9ff`
- 禁用状态：`#d9d9d9`

### 3. 输入框

**Textarea 聚焦边框：**
- 聚焦边框色：`#1890ff`

### 4. 流式光标

**TopicGenerator.vue：**
- 光标颜色：`#1890ff`
- 脉动动画

---

## 🔧 自定义主题

如需修改主题颜色，只需更新以下文件：

### 1. 修改主题配置

编辑 `src/frontend/src/config/theme.ts`：

```typescript
export const theme = {
  colors: {
    primary: '#your-color', // 修改为你的颜色
    primaryLight: '#your-light-color',
    primaryDark: '#your-dark-color',
    // ...
  }
}
```

### 2. 修改全局样式

编辑 `src/frontend/src/styles/main.css`：

```css
button {
  background: #your-color;
}

button:hover {
  background: #your-light-color;
}

textarea:focus {
  border-color: #your-color;
}
```

### 3. 修改布局组件

编辑 `src/frontend/src/layouts/LayoutSidebarModern.vue`：

```css
.logo-icon-wrapper {
  background: linear-gradient(135deg, #your-color 0%, #your-dark-color 100%);
  box-shadow: 0 4px 12px rgba(your-rgb, 0.25);
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(your-rgb, 0.1) 0%, rgba(your-dark-rgb, 0.1) 100%);
  color: #your-color;
  box-shadow: 0 2px 8px rgba(your-rgb, 0.2);
}
```

---

## 🌐 常用颜色搭配建议

### 蓝色主题（当前）

```
主色：#1890ff (Ant Design 蓝)
搭配：#096dd9 (深蓝)
适用：专业、稳重、商务场景
```

### 绿色主题

```
主色：#52c41a (Ant Design 绿)
搭配：#389e0d (深绿)
适用：健康、环保、自然场景
```

### 紫色主题

```
主色：#722ed1 (Ant Design 紫)
搭配：#531dab (深紫)
适用：创意、艺术、时尚场景
```

### 橙色主题

```
主色：#fa8c16 (Ant Design 橙)
搭配：#d46b08 (深橙)
适用：活力、热情、创新场景
```

---

## 📊 颜色对比度

确保文字与背景的对比度符合 WCAG 2.0 标准：

| 文字颜色 | 背景颜色 | 对比度 | 等级 |
|---------|---------|--------|------|
| `#1890ff` | 白色 | 3.28:1 | AA（大文字） |
| 白色 | `#1890ff` | 3.28:1 | AA（大文字） |
| `#096dd9` | 白色 | 4.66:1 | AA |
| 白色 | `#096dd9` | 4.66:1 | AA |

**建议：**
- 小文字（<18px）使用深色变体 `#096dd9`
- 大文字（≥18px）可使用主色 `#1890ff`
- 背景色建议使用淡色 `rgba(24, 144, 255, 0.1)`

---

## 🎨 渐变效果

### 主色渐变

```css
/* 水平渐变 */
background: linear-gradient(90deg, #1890ff 0%, #096dd9 100%);

/* 对角渐变 */
background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);

/* 径向渐变 */
background: radial-gradient(circle, #1890ff 0%, #096dd9 100%);
```

### 半透明渐变

```css
/* 淡入效果 */
background: linear-gradient(135deg, rgba(24, 144, 255, 0.1) 0%, rgba(9, 109, 217, 0.1) 100%);

/* 强调效果 */
background: linear-gradient(135deg, rgba(24, 144, 255, 0.3) 0%, rgba(9, 109, 217, 0.3) 100%);
```

---

## 🔍 调试工具

### 在浏览器控制台查看当前主色

```javascript
// 获取 CSS 变量
getComputedStyle(document.documentElement).getPropertyValue('--color-primary')

// 获取元素颜色
getComputedStyle(document.querySelector('.logo-icon-wrapper')).backgroundColor
```

### 修改主题色（临时测试）

```javascript
// 修改 CSS 变量
document.documentElement.style.setProperty('--color-primary', '#your-color')

// 修改所有按钮颜色
document.querySelectorAll('button').forEach(btn => {
  btn.style.background = '#your-color'
})
```

---

## 📝 更新日志

### v2.0.0 (2026-03-26)

- ✅ 将主色调从紫色（#667eea）改为 Ant Design 蓝（#1890ff）
- ✅ 更新所有布局组件的颜色
- ✅ 更新全局样式文件
- ✅ 创建主题配置文件（theme.ts）
- ✅ 统一所有组件的颜色系统

---

## 🚀 未来计划

- [ ] 支持多主题切换（蓝色/绿色/紫色/橙色）
- [ ] 支持暗黑模式
- [ ] 支持自定义主题色选择器
- [ ] 导出主题配置为 JSON
- [ ] 主题预览功能

---

**主题配置完成！** 🎉
