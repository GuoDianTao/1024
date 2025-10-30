<template>
    <div class="game-loader-container">
        <div
            class="game-loader"
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <div class="loader-header">
                <span class="title">正在努力加载中...</span>
                <span class="percent">{{ Math.floor(progress) }}%</span>
            </div>

            <div class="task">{{ currentTaskLabel }}</div>

            <div class="progress" aria-label="加载进度">
                <div class="bar">
                    <div class="fill" :style="{ width: progress + '%' }"></div>
                </div>
            </div>

            <div
                v-if="progress >= 100"
                class="done"
                aria-live="assertive"
                aria-busy="false"
            >
                加载完成
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'GameLoader',
  props: {
    // 总加载时长，单位毫秒
    duration: {
      type: Number,
      default: 4000,
      validator(v) {
        return Number.isFinite(v) && v >= 500 && v <= 60000;
      }
    },
    // 伪造的加载任务描述
    tasks: {
      type: Array,
      default() {
        return [
          '加载资源包...（Textures）',
          '初始化场景...（Scene）',
          '构建物理世界...（Physics）',
          '载入角色与动画...（Actors）',
          '同步配置...（Configs）',
          '准备音效...（Audio）'
        ];
      }
    }
  },
  data() {
    return {
      progress: 0,
      _timer: null,
      _startTs: 0
    };
  },
  computed: {
    currentTaskLabel() {
      if (!Array.isArray(this.tasks) || this.tasks.length === 0) return '加载中...';
      const elapsed = Date.now() - (this._startTs || Date.now());
      // 根据时间片段轮换任务名称
      const slots = Math.max(1, Math.floor(this.duration / 800));
      const idx = Math.min(this.tasks.length - 1, Math.floor((elapsed / this.duration) * slots));
      return this.tasks[idx] || this.tasks[this.tasks.length - 1];
    }
  },
  mounted() {
    this.start();
  },
  beforeUnmount() {
    this._clear();
  },
  methods: {
    start() {
      this._clear();
      this.progress = 0;
      this._startTs = Date.now();
      const stepMs = 100; // 每100ms更新一次
      const steps = Math.max(1, Math.floor(this.duration / stepMs));
      const delta = 100 / steps;

      this._timer = setInterval(() => {
        if (this.progress + delta >= 100) {
          this.progress = 100;
          this.$emit('finished');
          this._clear();
        } else {
          this.progress += delta;
        }
      }, stepMs);
    },
    _clear() {
      if (this._timer) {
        clearInterval(this._timer);
        this._timer = null;
      }
    }
  }
};
</script>

<style scoped>
.game-loader-container{
    width: 100%;
    height: 100vh;
    background-color: #fff;
}
.game-loader {
  width: 100vw;
  max-width: 520px;
  /* height: 100%; */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 40px auto;
  padding: 16px 18px;
  background: #ffffff;
  color: #e6e6e6;
  border-radius: 12px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35), inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft Yahei UI', 'Microsoft Yahei', sans-serif;
}

.loader-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.title {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.percent {
  font-variant-numeric: tabular-nums;
  color: #9fd46f;
}

.task {
  font-size: 13px;
  color: #aeb6c2;
  margin-bottom: 10px;
  min-height: 18px;
}

.progress .bar {
  position: relative;
  height: 10px;
  width: 100%;
  background: linear-gradient(180deg, #222833, #1a1f27);
  border-radius: 999px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.06);
}

.progress .fill {
  height: 100%;
  background: linear-gradient(90deg, #59c173, #a17fe0, #5d26c1);
  background-size: 200% 100%;
  animation: shimmer 1.8s linear infinite;
  transition: width 100ms linear;
}

.done {
  margin-top: 10px;
  font-size: 13px;
  color: #9fd46f;
}

@keyframes shimmer {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}
</style>
