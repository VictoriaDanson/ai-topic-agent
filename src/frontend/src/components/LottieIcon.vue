<template>
  <div ref="lottieContainer" class="lottie-icon" :style="containerStyle"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import lottie, { AnimationItem } from 'lottie-web'

interface Props {
  name: string // 动画文件名（不含扩展名）
  width?: number | string // 宽度
  height?: number | string // 高度
  loop?: boolean // 是否循环播放
  autoplay?: boolean // 是否自动播放
  speed?: number // 播放速度（1为正常速度）
}

const props = withDefaults(defineProps<Props>(), {
  width: 52,
  height: 52,
  loop: true,
  autoplay: true,
  speed: 1
})

const lottieContainer = ref<HTMLDivElement | null>(null)
let animationInstance: AnimationItem | null = null

// 计算容器样式
const containerStyle = computed(() => {
  const width =
    typeof props.width === 'number' ? `${props.width}px` : props.width
  const height =
    typeof props.height === 'number' ? `${props.height}px` : props.height
  return {
    width,
    height,
    display: 'inline-block'
  }
})

// 加载并渲染动画
const loadAnimation = async () => {
  if (!lottieContainer.value) return

  try {
    // 动态导入 JSON 文件
    const animationData = await import(`@/assets/json/${props.name}.json`)

    // 销毁旧的动画实例
    if (animationInstance) {
      animationInstance.destroy()
    }

    // 创建新的动画实例
    animationInstance = lottie.loadAnimation({
      container: lottieContainer.value,
      renderer: 'svg', // 使用 SVG 渲染器（也可选 'canvas' 或 'html'）
      loop: props.loop,
      autoplay: props.autoplay,
      animationData: animationData.default || animationData
    })

    // 设置播放速度
    animationInstance.setSpeed(props.speed)
  } catch (error) {
    console.error(`Failed to load Lottie animation: ${props.name}`, error)
  }
}

// 监听 name 变化，重新加载动画
watch(
  () => props.name,
  () => {
    loadAnimation()
  }
)

// 监听播放速度变化
watch(
  () => props.speed,
  (newSpeed) => {
    if (animationInstance) {
      animationInstance.setSpeed(newSpeed)
    }
  }
)

// 生命周期
onMounted(() => {
  loadAnimation()
})

onBeforeUnmount(() => {
  if (animationInstance) {
    animationInstance.destroy()
    animationInstance = null
  }
})

// 暴露方法供父组件调用
const play = () => {
  animationInstance?.play()
}

const pause = () => {
  animationInstance?.pause()
}

const stop = () => {
  animationInstance?.stop()
}

const setSpeed = (speed: number) => {
  animationInstance?.setSpeed(speed)
}

const goToAndPlay = (value: number, isFrame?: boolean) => {
  animationInstance?.goToAndPlay(value, isFrame)
}

const goToAndStop = (value: number, isFrame?: boolean) => {
  animationInstance?.goToAndStop(value, isFrame)
}

defineExpose({
  play,
  pause,
  stop,
  setSpeed,
  goToAndPlay,
  goToAndStop,
  instance: animationInstance
})
</script>

<style scoped>
.lottie-icon {
  display: inline-block;
  vertical-align: middle;
}

/* 确保 SVG 完全填充容器 */
.lottie-icon :deep(svg) {
  width: 100% !important;
  height: 100% !important;
}
</style>
