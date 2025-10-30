<template>
    <div>
        <Transition>
            <component :is="currentComponent" v-if="show"></component>
        </Transition>

        <!-- <component :is="currentComponent" v-if="show"></component> -->
        <div class="navigation">
            <button class="lg-btn" @click="prevComponent">上一步</button>
            <button class="lg-btn" @click="nextComponent">下一步</button>
        </div>
        <small id="info">鑫考股份·产品研发中心制作-素材来源：https://codepen.io :)</small>

        <svg style="display: none">
            <filter
                id="filter"
                color-interpolation-filters="linearRGB"
                filterUnits="objectBoundingBox"
                primitiveUnits="userSpaceOnUse"
            >
                <feDisplacementMap
                    in="SourceGraphic"
                    in2="SourceGraphic"
                    scale="20"
                    xChannelSelector="R"
                    yChannelSelector="B"
                    x="0%"
                    y="0%"
                    width="100%"
                    height="100%"
                    result="displacementMap"
                />
                <feGaussianBlur
                    stdDeviation="3 3"
                    x="0%"
                    y="0%"
                    width="100%"
                    height="100%"
                    in="displacementMap"
                    edgeMode="none"
                    result="blur"
                />
            </filter>
        </svg>
        <video autoplay loop muted playsinline class="bg-video" poster="">
            <source
                src="https://videos.pexels.com/video-files/5495781/5495781-uhd_2560_1080_30fps.mp4"
                type="video/mp4"
            />
            Tu navegador no admite la reproducción de video.
        </video>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import ParticleAnimation from '../../components/ParticleAnimation.vue'
import CSS3DWall from '../../components/CSS3DWall.vue'
import GameContainer from '../../components/GameContainer.vue'
import Info from '../../components/Info.vue'
import Resolving from '../../components/Resolving.vue'
import Video from '../../components/Video.vue'
import End from '../../components/End.vue'

const components = ref([
  // {
  //   name: 'Info',
  //   component: Info
  // },
  {
    name: 'Resolving',
    component: Resolving
  },
  {
    name: 'ParticleAnimation',
    component: ParticleAnimation
  },

  {
    name: 'Video',
    component: Video
  },
  {
    name: 'CSS3DWall',
    component: CSS3DWall
  },
  {
    name:'End',
    component:End
  }
])

const currentIndex = ref(0)


// watch(currentIndex, (newVal, oldVal) => {
//   if (newVal == 1) {
//     setTimeout(() => {
//       nextComponent()

//     }, 20000)
//   }
// })
const currentComponent = ref(components.value[currentIndex.value].component)

const show = ref(true)
const prevComponent = () => {

  if (currentIndex.value > 1) {
    show.value = false
    currentIndex.value--
    currentComponent.value = components.value[currentIndex.value].component
    setTimeout(() => {
      show.value = true
    }, 300)
  }
}

const nextComponent = () => {


  if (currentIndex.value < components.value.length - 1) {
    show.value = false
    currentIndex.value++
    currentComponent.value = components.value[currentIndex.value].component
     setTimeout(() => {
    show.value = true
    },300)
  }
}

onMounted(() => {
  // setTimeout(() => {
  //   nextComponent()
  // }, 5000)
})
</script>
<style>
.navigation {
  position: absolute;
  top: 5%;
  left: 50%;
  gap: 10px;
  transform: translate(-50%, -50%);
  display: flex;
  /* width: 100%; */
  /* height: 300px; */
  z-index: 2;
}

.lg-btn {
  width: 100px;
  height: 50px;
  border-radius: 10.2vmin 9.8vmin 10.2vmin 9.8vmin;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(4px);
  box-shadow: inset 2px 2px 1px 0 rgba(255, 255, 255, 0.3),
    inset -2px -2px 2px 1px rgba(255, 255, 255, 0.3), 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
  ;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.5);
  cursor: pointer;
}

.gl {

  backdrop-filter: url(#filter);
  -webkit-backdrop-filter: blur(3px);
}


.lg-btn:hover {
  transform: scale(1.05);
  border-radius: 9.8vmin 10.2vmin 9.8vmin 10.2vmin;
}

.lg-btn:select {
  transform: scale(0.95);
}



@keyframes drift {
  0% {
    background-position: 50% 50%;
  }

  25% {
    background-position: 60% 40%;
  }

  50% {
    background-position: 40% 60%;
  }

  75% {
    background-position: 55% 45%;
  }

  100% {
    background-position: 50% 50%;
  }
}


/* reset */
button {
  display: inline-block;
  border: none;
  margin: 0;
  text-decoration: none;
  padding: 0;
  background: none;
  border-radius: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  overflow: hidden;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

button:focus {
  outline: none;
}

/* 全屏视频背景 */
.bg-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: -1;
  pointer-events: none;
}

/* 夸张丝滑的组件切换动画（匹配 Transition name="fade"） */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 600ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 600ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 600ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform, filter;
  perspective: 1000px;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate3d(0, 30px, 0) scale(0.92) rotateZ(0.8deg) rotateX(6deg);
  filter: blur(8px) saturate(120%);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translate3d(0, 0, 0) scale(1) rotateZ(0deg) rotateX(0deg);
  filter: blur(0) saturate(100%);
}

/* 离场时稍微加速以保证无缝感 */
.fade-leave-active {
  transition-duration: 500ms;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
