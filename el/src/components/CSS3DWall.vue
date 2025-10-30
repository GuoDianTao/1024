<template>
  <div class="css3d-wall">
    <div class="confetti-land" id="confetti-land"></div>
    <div id="container"></div>
    <!-- 全页 loading 覆盖层 -->
    <div id="global-loading" v-if="loading" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)">
      <div style="text-align:center;">
        <!-- SVG 旋转加载器，避免依赖全局 CSS keyframes -->
        <svg width="56" height="56" viewBox="0 0 50 50" style="display:block;margin:0 auto;">
          <circle cx="25" cy="25" r="20" stroke="#007acc" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="31.4 31.4">
            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
          </circle>
        </svg>
        <div style="margin-top:12px;color:#fff;font-weight:500;z-index:9999;">滚动滚轮开始场景载入...</div>
      </div>
    </div>
    <div id="menu">
      <button id="table" @click="transform('table')">团结之墙布局</button>
      <button id="sphere" @click="transform('sphere')">十面埋伏布局</button>
      <button id="helix" @click="transform('helix')">向上漩涡布局</button>
      <button id="grid" @click="transform('grid')">太阳系舰队布局</button>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import TWEEN from 'three/examples/jsm/libs/tween.module.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default {
  name: 'CSS3DWall',
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      controls: null,
      cameraRotate: null,
      objects: [],
      nodelist: [],
      targets: {
        table: [],
        sphere: [],
        helix: [],
        grid: [],
      },
      total: 101, // 总数
      max: 102, // 最合适数值
      confetti_num: 7, // 彩纸数量
      imagePromises: [], // 图片加载Promise集合
      loading: true,
    };
  },
  mounted() {

    this.init();

    // 等待所有图片加载完成后再进入动画与布局
    const startAfterImages = () => {
      this.animate();
      this.makeItConfetti();
      // 初始化为表格布局（延后）
      this.transform('table', 2000);

      // 自动切换目标位置
      const types = ['table', 'sphere', 'helix', 'grid'];
      let currentIndex = 0;

      // 隐藏全页 loading
      this.loading = false;
      
    };

    if (Array.isArray(this.imagePromises) && this.imagePromises.length > 0) {
      Promise.all(this.imagePromises).then(startAfterImages);
    } else {
      startAfterImages();
    }
    
  },
  beforeUnmount() {
    if (this.autoTransformInterval) {
      clearInterval(this.autoTransformInterval);
    }
  },
  methods: {
    init() {
      this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
      this.camera.position.z = 3000;

      this.scene = new THREE.Scene();

      // 初始化元素
      for (let i = 0; i < this.total; i++) {
        const element = document.createElement('div');
        element.className = 'element';
        element.style.backgroundColor = `rgba(0,127,127,${Math.random() * 0.5 + 0.25})`;

        const symbol = document.createElement('div');
        symbol.className = 'symbol';
        const img = document.createElement('img');
        const photoImages = ['_DSC0145.JPG', '_DSC0152.JPG', '_DSC0154.JPG', '_DSC0155.JPG', '_DSC0163.JPG', '_DSC0165.JPG', '_DSC0174.JPG', '_DSC0189.JPG', '_DSC0190.JPG', '_DSC0191.JPG', '_DSC0192.JPG', '_DSC0193.JPG', '_DSC0194.JPG', '_DSC0195.JPG', '_DSC0203.JPG', '_DSC0205.JPG', '_DSC0210.JPG', '_DSC0211.JPG', '_DSC0212.JPG', '_DSC0216.JPG', '_DSC0217.JPG', '_DSC0220.JPG', '_DSC0224.JPG', '_DSC0225.JPG', '_DSC0244.JPG', '_DSC0247.JPG', '_DSC0248.JPG', '_DSC0251.JPG', '_DSC0253.JPG', '_DSC0255.JPG', '_DSC0256.JPG', '_DSC0257.JPG', '_DSC0259.JPG', '_DSC0260.JPG', '_DSC0262.JPG', '_DSC0264.JPG', '_DSC0265.JPG', '_DSC0266.JPG', '_DSC0267.JPG', '_DSC0275.JPG', '_DSC0276.JPG', '_DSC0277.JPG', '_DSC0278.JPG', '_DSC0279.JPG', '_DSC0280.JPG', '_DSC0281.JPG', '_DSC0282.JPG', '_DSC0283.JPG', '_DSC0285.JPG', '_DSC0286.JPG', '_DSC0288.JPG', '_DSC0289.JPG', '_DSC0292.JPG', '_DSC0293.JPG', '_DSC0294.JPG', '_DSC0295.JPG', '_DSC0296.JPG', '_DSC0299.JPG', '_DSC0301.JPG', 'DSC_2807.JPG', 'DSC_2808.JPG', 'DSC_2810.JPG', 'DSC_2815.JPG', 'DSC_2816.JPG', 'DSC_2817.JPG', 'DSC_2818.JPG', 'DSC_2819.JPG', 'DSC_2820.JPG', 'DSC_2822.JPG', 'DSC_2823.JPG', 'DSC_2824.JPG', 'DSC_2826.JPG', 'DSC_2827.JPG', 'DSC_2829.JPG', 'DSC_2838.JPG', 'DSC_2840.JPG', 'DSC_2841.JPG', 'DSC_2845.JPG', 'DSC_2846.JPG', 'DSC_2847.JPG', 'DSC_2850.JPG', 'DSC_2852.JPG', 'DSC_2857.JPG', 'DSC_2862.JPG', 'DSC_2867.JPG', 'DSC_2869.JPG', 'DSC_2871.JPG', 'DSC_2873.JPG', 'DSC_2875.JPG', 'DSC_2876.JPG', 'DSC_2884.JPG', 'DSC_2887.JPG', 'DSC_2892.JPG', 'DSC_2898.JPG', 'DSC_2900.JPG', 'DSC_2901.JPG', 'DSC_2904.JPG', 'DSC_2905.JPG'];
        const randomImage = photoImages[Math.floor(Math.random() * photoImages.length)];
        const originalUrl = `./images/photo/${randomImage}`;
        img.dataset.original = originalUrl;
        img.src = originalUrl;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.onerror = () => { console.error('Failed to load image:', img.src); };
        console.log('Image source:', img.src);
        // 使用原图生成缩略图，替换展示为低清版本，点击放大再用原图
        img.addEventListener('load', () => {
          try {
            const maxDim = 320;
            const w = img.naturalWidth || img.width;
            const h = img.naturalHeight || img.height;
            const scale = Math.min(1, maxDim / Math.max(w, h));
            const tw = Math.max(1, Math.round(w * scale));
            const th = Math.max(1, Math.round(h * scale));
            const canvas = document.createElement('canvas');
            canvas.width = tw;
            canvas.height = th;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(img, 0, 0, tw, th);
              const thumbDataUrl = canvas.toDataURL('image/jpeg', 0.7);
              if (thumbDataUrl && typeof thumbDataUrl === 'string') {
                img.src = thumbDataUrl;
              }
            }
          } catch (e) { console.warn('thumbnail generation failed', e); }
        }, { once: true });
        // 将图片加载Promise加入集合，全部完成后再启动动画
        const loadPromise = new Promise((resolve) => {
          if (img.complete) resolve();
          else {
            img.addEventListener('load', () => resolve(), { once: true });
            img.addEventListener('error', () => resolve(), { once: true });
          }
        });
        this.imagePromises.push(loadPromise);
        img.style.cursor = 'pointer';
        img.addEventListener('click', (event) => {
          event.stopPropagation();
          event.preventDefault();

          // 若已有覆盖层，先移除，避免残留导致后续点击失效
          const oldOverlay = document.getElementById('image-overlay');
          if (oldOverlay) {
            try { document.body.removeChild(oldOverlay); } catch (e) {}
          }

          const overlay = document.createElement('div');
          overlay.id = 'image-overlay';
          overlay.style.position = 'fixed';
          overlay.style.top = '0';
          overlay.style.left = '0';
          overlay.style.width = '100%';
          overlay.style.height = '100%';
          overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
          overlay.style.display = 'flex';
          overlay.style.justifyContent = 'center';
          overlay.style.alignItems = 'center';
          overlay.style.zIndex = '10000';
          
          const enlargedImg = document.createElement('img');
          enlargedImg.src = (img.dataset && img.dataset.original) ? img.dataset.original : (img.src || 'https://via.placeholder.com/150');
          enlargedImg.style.maxWidth = '90%';
          enlargedImg.style.maxHeight = '90%';
          enlargedImg.style.borderRadius = '8px';
          enlargedImg.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
          
          overlay.appendChild(enlargedImg);
          document.body.appendChild(overlay);

          // 打开覆盖层时禁用控制器，避免拦截后续点击
          if (this.controls) this.controls.enabled = false;
          if (this.cameraRotate) this.cameraRotate.enabled = false;
          // 打开覆盖层时禁用页面滚动
          const prevOverflow = document.body.style.overflow;
          document.body.style.overflow = 'hidden';

          // 放大预览交互：滚轮缩放、拖拽平移、双击缩放，点击空白处关闭
          let scale = 1;
          const minScale = 1;
          const maxScale = 5;
          let posX = 0, posY = 0;
          let isDragging = false;
          let lastX = 0, lastY = 0;

          enlargedImg.style.cursor = 'grab';
          enlargedImg.style.userSelect = 'none';
          enlargedImg.style.willChange = 'transform';

          const updateTransform = () => {
            enlargedImg.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
          };
          updateTransform();

          const onWheel = (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.2 : 0.2;
            const next = Math.max(minScale, Math.min(maxScale, scale + delta));
            if (next !== scale) {
              scale = next;
              updateTransform();
            }
          };

          const onMouseDown = (e) => {
            e.preventDefault();
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
            enlargedImg.style.cursor = 'grabbing';
          };
          const onMouseMove = (e) => {
            if (!isDragging) return;
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            lastX = e.clientX;
            lastY = e.clientY;
            posX += dx;
            posY += dy;
            updateTransform();
          };
          const onMouseUp = () => {
            isDragging = false;
            enlargedImg.style.cursor = 'grab';
          };

          const onTouchStart = (e) => {
            if (!e.touches || e.touches.length === 0) return;
            e.preventDefault();
            isDragging = true;
            lastX = e.touches[0].clientX;
            lastY = e.touches[0].clientY;
          };
          const onTouchMove = (e) => {
            if (!isDragging || !e.touches || e.touches.length === 0) return;
            e.preventDefault();
            const dx = e.touches[0].clientX - lastX;
            const dy = e.touches[0].clientY - lastY;
            lastX = e.touches[0].clientX;
            lastY = e.touches[0].clientY;
            posX += dx;
            posY += dy;
            updateTransform();
          };
          const onTouchEnd = () => { isDragging = false; };

          const onDblClick = (e) => {
            e.preventDefault();
            if (scale === 1) {
              scale = 2;
            } else {
              scale = 1;
              posX = 0;
              posY = 0;
            }
            updateTransform();
          };

          const closeOverlay = () => {
            try { document.body.removeChild(overlay); } catch (e) {}
            overlay.removeEventListener('click', overlayClickHandler);
            overlay.removeEventListener('wheel', onWheel, { passive: false });
            window.removeEventListener('keydown', escHandler);
            enlargedImg.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            enlargedImg.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
            enlargedImg.removeEventListener('dblclick', onDblClick);
            if (this.controls) this.controls.enabled = true;
            if (this.cameraRotate) this.cameraRotate.enabled = true;
            document.body.style.overflow = prevOverflow || '';
          };

          const overlayClickHandler = (e) => {
            // 仅点击遮罩空白处才关闭
            if (e.target === overlay) closeOverlay();
          };
          overlay.addEventListener('click', overlayClickHandler);
          overlay.addEventListener('wheel', onWheel, { passive: false });

          enlargedImg.addEventListener('mousedown', onMouseDown);
          window.addEventListener('mousemove', onMouseMove);
          window.addEventListener('mouseup', onMouseUp);
          enlargedImg.addEventListener('touchstart', onTouchStart, { passive: false });
          window.addEventListener('touchmove', onTouchMove, { passive: false });
          window.addEventListener('touchend', onTouchEnd);
          enlargedImg.addEventListener('dblclick', onDblClick);

          // 按下 ESC 关闭并恢复控制器与滚动
          const escHandler = (e) => {
            if (e.key === 'Escape') {
              closeOverlay();
            }
          };
          window.addEventListener('keydown', escHandler);
        });

        // 拦截按下以避免控制器抢占，确保点击正常生效
        img.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault(); }, { passive: false });
        img.addEventListener('mousedown', (e) => { e.stopPropagation(); e.preventDefault(); });
        img.addEventListener('touchstart', (e) => { e.stopPropagation(); e.preventDefault(); }, { passive: false });
        // 明确允许图片接收指针事件
        img.style.pointerEvents = 'auto';
        symbol.appendChild(img);
        element.appendChild(symbol);

        const details = document.createElement('div');
        details.className = 'details';
        details.innerHTML = 'PFT';
        element.appendChild(details);

        this.nodelist.push({
          picture: img,
          name: details,
        });

        const objectCSS = new CSS3DObject(element);
        objectCSS.position.x = Math.random() * 4000 - 2000;
        objectCSS.position.y = Math.random() * 4000 - 2000;
        objectCSS.position.z = Math.random() * 4000 - 2000;
        this.scene.add(objectCSS);

        this.objects.push(objectCSS);

        // 初始化目标位置
        const object = new THREE.Object3D();
        object.position.x = (i % 18) * 140 - 1190;
        object.position.y = - (Math.ceil((i + 1) / 18) * 180) + 1020;
        this.targets.table.push(object);

        // 初始化 sphere 目标位置
        const sphereObject = new THREE.Object3D();
        const phi = Math.acos(-1 + (2 * i) / this.total);
        const theta = Math.sqrt(this.total * Math.PI) * phi;
        sphereObject.position.x = 800 * Math.sin(phi) * Math.cos(theta);
        sphereObject.position.y = 800 * Math.sin(phi) * Math.sin(theta);
        sphereObject.position.z = 800 * Math.cos(phi);
        this.targets.sphere.push(sphereObject);

        // 初始化 helix 目标位置
        const helixObject = new THREE.Object3D();
        const thetaHelix = i * 0.175 + Math.PI;
        helixObject.position.x = 900 * Math.sin(thetaHelix);
        helixObject.position.y = - (i * 8) + 450;
        helixObject.position.z = 900 * Math.cos(thetaHelix);
        this.targets.helix.push(helixObject);

        // 初始化 grid 目标位置
        const gridObject = new THREE.Object3D();
        gridObject.position.x = (i % 5) * 400 - 800;
        gridObject.position.y = (- (Math.floor(i / 5) % 5) * 400) + 800;
        gridObject.position.z = Math.floor(i / 25) * 1000 - 2000;
        this.targets.grid.push(gridObject);
      }

      // 初始化渲染器
      this.renderer = new CSS3DRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById('container').appendChild(this.renderer.domElement);

      // 初始化控制器
      this.controls = new TrackballControls(this.camera, this.renderer.domElement);
      this.controls.minDistance = 0;
      this.controls.maxDistance = 6000;
      this.controls.addEventListener('change', this.render);

      this.cameraRotate = new OrbitControls(this.camera, this.renderer.domElement);
      this.cameraRotate.addEventListener('change', this.render);
      this.cameraRotate.autoRotate = true;

      // 初始化窗口大小调整事件
      window.addEventListener('resize', this.onWindowResize);

      // 初始化为表格布局：延后到图片加载完成后在 mounted 中触发
    },
    transform(type, duration = 2000) {
      TWEEN.removeAll();

      if (!this.targets[type] || this.targets[type].length === 0) {
        console.error(`Target type '${type}' is not defined or empty.`);
        return;
      }

      for (let i = 0; i < this.objects.length; i++) {
        const object = this.objects[i];
        const target = this.targets[type][i];

        if (!target) {
          console.error(`Target at index ${i} for type '${type}' is undefined.`);
          continue;
        }

        new TWEEN.Tween(object.position)
          .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();

        new TWEEN.Tween(object.rotation)
          .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();
      }

      new TWEEN.Tween(this)
        .to({}, duration * 2)
        .onUpdate(this.render)
        .start();
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.render();
    },
    animate(timestamp) {
      requestAnimationFrame(this.animate);
      if (timestamp === undefined) {
        timestamp = (typeof performance !== 'undefined' ? performance.now() : Date.now());
      }
      if (!this._fpsInterval) {
        this._fpsInterval = 1000 / 20; // 20 FPS
      }
      if (this._lastFrameTime === undefined) {
        this._lastFrameTime = timestamp;
      }
      const elapsed = timestamp - this._lastFrameTime;
      if (elapsed >= this._fpsInterval) {
        this._lastFrameTime = timestamp - (elapsed % this._fpsInterval);
        TWEEN.update();
        this.controls.update();
        this.cameraRotate.update();
      }
    },
    render() {
      this.renderer.render(this.scene, this.camera);
    },
    makeItConfetti() {
      let html = '';
      for (let i = 0; i < this.confetti_num; i++) {
        html += '<div class="confetti"></div>';
      }
      document.getElementById('confetti-land').innerHTML = html;

      const confetti = document.querySelectorAll('.confetti');
      if (!confetti[0]?.animate) return;

      for (let i = 0; i < confetti.length; i++) {
        const confettiEl = confetti[i];
        confettiEl.innerHTML = '<div class="rotate"><div class="askew"></div></div>';
        const scale = Math.random() * 0.8 + 0.2;
        confettiEl.animate([
          { transform: `translate3d(${(i / confetti.length) * 100}vw,0,0) scale(${scale})`, opacity: scale },
          { transform: `translate3d(${(i / confetti.length) * 100 + 10}vw,100vh,0) scale(${scale})`, opacity: 1 },
        ], {
          duration: Math.random() * 3000 + 3000,
          iterations: Infinity,
          delay: -(Math.random() * 5000),
        });
      }
    },
  },
};
</script>

<style scoped>
.css3d-wall {
  position: relative;
  background-image:url('/images/allperson.JPG');
  backdrop-filter: blur(35px);
  

  background-size: cover;
  /* filter: blur(5px); */
  width: 100%;
  height: 100vh;
  /* overflow: hidden; */
  /* Cinematic look */
  background-color: #0b618bfd;
  background-blend-mode: multiply;
  filter: contrast(1.08) saturate(1.1);
  box-shadow: inset 0 0 180px rgba(20, 14, 141, 0.55);
}

.css3d-wall::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse at center, rgba(20, 31, 151, 0.37) 50%, rgba(0,0,0,0.35) 100%);
  z-index: 1;
}

.css3d-wall::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:url('/images/allperson.JPG');
  background-size: cover;
  background-position: center;
  filter: blur(1px);
  transform: translateZ(0);
  will-change: filter;
  z-index: 0;
}

.css3d-wall > * { position: relative; z-index: 2; }

.confetti-land {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

#container {
  position: absolute;
  width: 100%;
  height: 100%;
}

#menu {
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
}

button {
  color: rgba(127, 255, 255, 0.75);
  background: transparent;
  outline: 1px solid rgba(127, 255, 255, 0.75);
  border: 0px;
  padding: 5px 10px;
  cursor: pointer;
  margin: 0 5px;
}

button:hover {
  background-color: rgba(0, 255, 255, 0.5);
}

button:active {
  color: #000000;
  background-color: rgba(0, 255, 255, 0.75);
}
</style>

<style>
/* 全局样式 */
body {
  margin: 0;
  background-color: #443fb5;
  color: #fff;
  font-family: Monospace;
  font-size: 13px;
  line-height: 24px;
  overscroll-behavior: none;
  overflow: hidden;
}

.element {
  width: 120px;
  height: 160px;
  box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.5);
  border: 1px solid rgba(127, 255, 255, 0.25);
  font-family: Helvetica, sans-serif;
  text-align: center;
  line-height: normal;
  cursor: default;
  position: relative;
}

.element:hover {
  box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.75);
  border: 1px solid rgba(127, 255, 255, 0.75);
}

.element .symbol {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 60px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.75);
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.95);
}

.element .symbol img {
  position: relative;
  transform: scale(1);
  opacity: 1;
  transition-duration: 0.6s;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.element .details {
  transition-duration: 0.6s;
  opacity: 0;
  position: absolute;
  bottom: 15px;
  left: 0px;
  right: 0px;
  font-size: 12px;
  color: rgba(127, 255, 255, 0.75);
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 50%;
  transform: translate3d(0, 0, 0);
  top: -10px;
  opacity: 0;
}
</style>