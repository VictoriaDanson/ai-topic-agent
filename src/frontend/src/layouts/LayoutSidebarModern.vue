<template>
  <div class="layout-sidebar-modern">
    <!-- 侧边栏 -->
    <aside class="sidebar" :class="{ collapsed: isCollapsed }">
      <!-- Logo 区域 -->
      <div class="sidebar-header">
        <div class="logo">
          <img src="@/assets/images/logo.gif" />
          <transition name="fade">
            <div v-if="!isCollapsed" class="logo-info">
              <div class="logo-title">选题 Agent</div>
              <div class="logo-subtitle">AI 助手</div>
            </div>
          </transition>
        </div>
      </div>

      <!-- 导航菜单 -->
      <nav class="sidebar-nav">
        <div class="nav-section">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="['nav-item', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
            :title="tab.label"
          >
            <LottieIcon :name="tab.icon" />
            <transition name="fade">
              <div v-if="!isCollapsed" class="nav-content">
                <span class="nav-label">{{ tab.label }}</span>
                <span v-if="tab.desc" class="nav-desc">{{ tab.desc }}</span>
              </div>
            </transition>
            <transition name="fade">
              <span v-if="tab.badge && !isCollapsed" class="nav-badge">{{
                tab.badge
              }}</span>
            </transition>
          </button>
        </div>
      </nav>

      <!-- 底部操作 -->
      <div class="sidebar-footer"></div>
    </aside>

    <!-- 主内容区 -->
    <div class="main-container">
      <!-- 顶部栏 -->
      <header class="page-header">
        <div class="header-content">
          <div class="header-title-group">
            <h1 class="page-title">{{ currentTabLabel }}</h1>
            <span class="page-subtitle">{{ currentTabDesc }}</span>
          </div>
        </div>
      </header>

      <!-- 内容区 -->
      <main class="page-content">
        <transition name="fade-slide" mode="out-in">
          <component :is="currentComponent" :key="activeTab" />
        </transition>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import LottieIcon from '@/components/LottieIcon.vue'
import { ref, computed, defineAsyncComponent } from 'vue'

interface Tab {
  id: string
  label: string
  desc: string
  icon: string
  component: any
  badge?: string
}

// 动态导入 topic 目录下的所有组件
const tabs: Tab[] = [
  {
    id: 'stream',
    label: '流式生成',
    desc: '实时生成选题',
    icon: 'writeBack',
    component: defineAsyncComponent(
      () => import('@/pages/topic/TopicGenerator.vue')
    )
  },
  {
    id: 'hotSpot',
    label: '热点选题',
    desc: '基于实时热点',
    icon: 'data',
    component: defineAsyncComponent(
      () => import('@/pages/topic/FunctionCallTopic.vue')
    )
  },
  {
    id: 'structured',
    label: '结构化生成',
    desc: '高级定制选题',
    icon: 'tidy',
    component: defineAsyncComponent(
      () => import('@/pages/topic/TopicStructured.vue')
    )
  },
  {
    id: 'agentTopic',
    label: '分步生成',
    desc: 'Agent选题',
    icon: 'data',
    component: defineAsyncComponent(
      () => import('@/pages/topic/AgentTopic.vue')
    )
  },
  {
    id: 'topicCheck',
    label: '合规检查',
    desc: '合规检查',
    icon: 'writeBack',
    component: defineAsyncComponent(
      () => import('@/pages/topic/TopicCheck.vue')
    )
  },
  {
    id: 'topicEvaluator',
    label: '高质量选题',
    desc: '生成高质量选题',
    icon: 'data',
    component: defineAsyncComponent(
      () => import('@/pages/topic/TopicEvaluator.vue')
    )
  }
]

const activeTab = ref(localStorage.getItem('activeTab') || 'stream')
const isCollapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true')

// 保存状态到 localStorage
import { watch } from 'vue'
watch(activeTab, (newTab) => {
  localStorage.setItem('activeTab', newTab)
})
watch(isCollapsed, (newValue) => {
  localStorage.setItem('sidebarCollapsed', String(newValue))
})

const currentComponent = computed(() => {
  return tabs.find((tab) => tab.id === activeTab.value)?.component
})

const currentTabLabel = computed(() => {
  return tabs.find((tab) => tab.id === activeTab.value)?.label || ''
})

const currentTabDesc = computed(() => {
  return tabs.find((tab) => tab.id === activeTab.value)?.desc || ''
})
</script>

<style scoped>
.layout-sidebar-modern {
  display: flex;
  min-height: 100vh;
  background: #fafbfc;
}

/* === 侧边栏 === */
.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 80px;
}

/* Logo 区域 */
.sidebar-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  img {
    width: 80px;
    height: 80px;
  }
}

.logo-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.logo-info {
  flex: 1;
  min-width: 0;
}

.logo-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.3;
}

.logo-subtitle {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.125rem;
}

/* 导航菜单 */
.sidebar-nav {
  flex: 1;
  padding: 1.5rem 1rem;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 3px;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.25rem;
}

.nav-item {
  width: 100%;
  background: none;
  border: none;
  color: #6b7280;
  /* padding: 0.875rem 0.875rem; */
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  transition: all 0.3s ease;
  text-align: left;
  border-radius: 10px;
  position: relative;
}

.nav-item:hover {
  background: #f9fafb;
  color: #374151;
}

.nav-item.active {
  background: linear-gradient(
    135deg,
    rgba(24, 144, 255, 0.1) 0%,
    rgba(9, 109, 217, 0.1) 100%
  );
  color: #1890ff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
}

.nav-icon {
  font-size: 1.5rem;
  min-width: 32px;
  text-align: center;
  flex-shrink: 0;
}

.nav-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.nav-label {
  font-size: 0.9375rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-desc {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-item.active .nav-desc {
  color: #69c0ff;
}

.nav-badge {
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  color: white;
  font-size: 0.625rem;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

/* 底部操作 */
.sidebar-footer {
  border-top: 1px solid #f3f4f6;
  padding: 1rem;
}

.toggle-btn {
  width: 100%;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  padding: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
}

.toggle-btn:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #374151;
}

.toggle-icon {
  font-size: 1rem;
}

/* === 主内容区 === */
.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #fafbfc;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1.75rem 2rem;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.header-title-group {
  flex: 1;
  min-width: 0;
}

.page-title {
  margin: 0 0 0.375rem 0;
  font-size: 1.625rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 0.9375rem;
  color: #6b7280;
  font-weight: 500;
}

.action-btn {
  background: white;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  padding: 0.625rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #374151;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.action-text {
  white-space: nowrap;
}

.page-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 响应式 */
@media (max-width: 1024px) {
  .sidebar {
    width: 80px;
  }

  .sidebar.collapsed {
    width: 0;
  }

  .action-text {
    display: none;
  }

  .action-btn {
    padding: 0.625rem;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 1.25rem 1rem;
  }

  .page-title {
    font-size: 1.375rem;
  }

  .page-content {
    padding: 1rem;
  }

  .header-actions {
    gap: 0.5rem;
  }
}
</style>
