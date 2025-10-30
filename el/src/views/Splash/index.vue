<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 进度与文案
const progress = ref(0)
const message = ref('正在初始化组件...')
const canSkip = ref(false)
const hasError = ref(false)
const tips = [
  '加载配置与本地缓存',
  '初始化渲染引擎',
  '检查网络与服务状态',
  '预热资源与纹理',
  '准备完成，即将进入系统'
]
let tipIdx = 0
let timer: number | undefined

function goHome() {
  router.replace({ name: 'Home' })
}

function skip() {
  if (canSkip.value) goHome()
}

function startProgress() {
  // 以缓动方式推进进度，避免一次性到 100
  const start = performance.now()
  timer = window.setInterval(() => {
    const elapsed = (performance.now() - start) / 1000
    const base = Math.min(99, Math.floor(100 * (1 - Math.exp(-elapsed)))) // 逐渐逼近 100
    progress.value = Math.max(progress.value, base)
    // 切换提示
    if (progress.value >= (tipIdx + 1) * 20 && tipIdx < tips.length - 1) {
      tipIdx++
      message.value = tips[tipIdx]
    }
    // 可跳过阈值
    if (progress.value >= 30) canSkip.value = true
  }, 80)
}

function bindDesktopReady() {
  // 桌面端（如 Electron）就绪信号对接（存在即用，不依赖）
  const anyWin = window as any
  const ipc = anyWin?.electron?.ipcRenderer
  if (ipc?.on) {
    try {
      ipc.on('app-ready', () => {
        progress.value = 100
        message.value = '系统已就绪'
        setTimeout(goHome, 200)
      })
      ipc.on('app-init-error', (_: unknown, errMsg: string) => {
        hasError.value = true
        message.value = errMsg || '初始化失败，请重试'
        canSkip.value = true
      })
    } catch (_) {
      // 忽略桌面端桥接异常，继续走前端流程
    }
  }
}

onMounted(() => {
  message.value = tips[0]
  startProgress()
  bindDesktopReady()
  // 超时兜底：前端独立完成
  const done = () => {
    progress.value = 100
    message.value = '进入系统...'
    setTimeout(goHome, 1000)
  }
  setTimeout(done, 3500)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="splash">
    <div class="brand">
      <div class="logo">Hello</div>
      <div class="sub">惊喜启动中</div>
    </div>

    <div class="progress">
      <div class="bar"><div class="fill" :style="{ width: progress + '%' }"></div></div>
      <div class="meta">
        <span class="msg" :class="{ error: hasError }">{{ message }}</span>
        <span class="percent">{{ progress }}%</span>
      </div>
    </div>

    <div class="actions">
      <button class="skip" :disabled="!canSkip" @click="skip">{{ canSkip ? '跳过' : '准备中...' }}</button>
      <span class="ver">鑫考股份-@v1.0.0</span>
    </div>

    <div class="dots" aria-hidden="true">
      <span></span><span></span><span></span><span></span>
    </div>
  </div>
</template>

<style scoped>
.splash { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; padding: 24px; background: radial-gradient(120% 120% at 50% 10%, #101625 0%, #0b1020 60%, #05070f 100%); color:#e5e7eb; user-select:none; gap: 28px; }
.brand { text-align:center; }
.logo { font-size: 44px; font-weight: 900; letter-spacing: .04em; color: #8b5cf6; text-shadow: 0 10px 40px rgba(139,92,246,.35); text-transform: lowercase; }
.sub { margin-top: 6px; opacity:.85; letter-spacing:.16em; font-size: 12px; text-transform: uppercase; color:#c7d2fe }

.progress { width: min(520px, 82vw); }
.bar { height: 8px; background: rgba(148,163,184,.18); border-radius: 999px; overflow: hidden; box-shadow: inset 0 0 0 1px rgba(148,163,184,.12); }
.fill { height: 100%; background: linear-gradient(90deg, #60a5fa, #34d399, #f59e0b); background-size: 200% 100%; animation: flow 2.2s linear infinite; box-shadow: 0 0 24px rgba(96,165,250,.4); }
.meta { margin-top: 10px; display:flex; align-items:center; justify-content:space-between; font-size: 12px; color:#cbd5e1 }
.msg.error { color: #fda4af }
.percent { font-variant-numeric: tabular-nums; color:#e5e7eb }

.actions { display:flex; align-items:center; gap: 14px; }
.skip { padding: 8px 14px; border-radius: 10px; border: 1px solid rgba(148,163,184,.24); background: rgba(15,23,42,.4); color:#e5e7eb; cursor: pointer; transition: all .2s ease; }
.skip:disabled { opacity:.5; cursor:not-allowed }
.skip:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 10px 22px rgba(0,0,0,.25); border-color: rgba(148,163,184,.44) }
.ver { font-size: 12px; color:#94a3b8 }

.dots { position: absolute; bottom: 32px; display:flex; gap: 10px; opacity:.8 }
.dots span { width:8px; height:8px; border-radius:50%; background:#93c5fd; opacity:.2; animation: pulse 1.2s infinite ease-in-out; box-shadow:0 0 18px rgba(147,197,253,.35); }
.dots span:nth-child(2){ animation-delay:.15s }
.dots span:nth-child(3){ animation-delay:.3s }
.dots span:nth-child(4){ animation-delay:.45s }

@keyframes pulse { 0%,100%{ transform:scale(.6); opacity:.25 } 50%{ transform:scale(1); opacity:1 } }
@keyframes flow { 0% { background-position: 200% 0 } 100% { background-position: 0 0 } }
</style>
