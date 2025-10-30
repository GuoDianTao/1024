<template>
    <div class="video-shell">
        <header class="video-header" >
            <div class="navbar">
                <!-- <button class="navbar-menu-btn" @click="$emit('toggle-menu')">
          <span class="one"></span>
          <span class="two"></span>
          <span class="three"></span>
        </button> -->

                <a
                    v-if="logo && logo.href"
                    :href="logo.href"
                    class="navbar-brand"
                >
                    <!-- <img :src="logo.src" :alt="logo.alt || 'logo'" /> -->
                    鑫考
                </a>
                <div v-else class="navbar-brand" v-show="logo && logo.src">
                    <!-- <img :src="logo.src" :alt="logo.alt || 'logo'" /> -->
                    <span
                        style="font-size: 1.2rem;font-weight: bold; margin-left: 15px"
                        >送给鑫考的一句话</span
                    >
                </div>

                <nav v-if="navLinks && navLinks.length">
                    <!-- <ul class="navbar-nav">
            <li v-for="(nav, idx) in navLinks" :key="idx">
              <a :href="nav.href || '#'" class="navbar-link" :class="{ indicator: nav.indicator }">{{ nav.label }}</a>
            </li>
          </ul> -->
                </nav>

                <!-- <div class="navbar-actions"> -->
                <!-- <form class="navbar-form" @submit.prevent="onSearch">
            <input
              type="text"
              name="search"
              :placeholder="searchPlaceholder"
              class="navbar-form-search"
              v-model.trim="keyword"
              @input="$emit('update:keyword', keyword)"
            />

            <button type="submit" class="navbar-form-btn" aria-label="search">
              🔍
            </button>

            <button type="button" class="navbar-form-close" @click="clearSearch" aria-label="clear">
              ⨯
            </button>
          </form>

          <button class="navbar-search-btn" @click="focusSearch" aria-label="focus-search">🔍</button>

          <a v-if="signin && signin.text" :href="signin.href || '#'" class="navbar-signin">
            <span>{{ signin.text }}</span>
            <span class="signin-icon">↪</span>
          </a>
        </div> -->
            </div>
        </header>

        <div style="padding: 0 15px 15px 15px;">
            <div class="banner">
                <div
                    class="banner-card"
                    @click="openVideo(banner.src)"
                    role="button"
                    tabindex="0"
                    aria-label="点击播放视频"
                >
                    <video
                        :src="banner.src"
                        alt="banner"
                        class="banner-img"
                    ></video>

                    <div class="card-content">
                        <div class="card-info" v-if="banner.meta">
                            <div v-if="banner.meta.genre" class="genre">
                                <span class="icon">🎬</span>
                                <span>{{ banner.meta.genre }}</span>
                            </div>

                            <div v-if="banner.meta.year" class="year">
                                <span class="icon">📅</span>
                                <span>{{ banner.meta.year }}</span>
                            </div>

                            <div v-if="banner.meta.duration" class="duration">
                                <span class="icon">⏱</span>
                                <span>{{ banner.meta.duration }}</span>
                            </div>

                            <div v-if="banner.meta.quality" class="quality">
                                {{ banner.meta.quality }}
                            </div>
                        </div>
                        <h2 class="card-title">{{ banner.title }}</h2>
                    </div>
                </div>
            </div>

            <div class="movies">
                <div
                    class="movies-grid"
                    style="padding: 0 15px 15px 15px; overflow-y: auto; height: 45vh; -ms-overflow-style: none; scrollbar-width: none;"
                >
                    <div
                        class="movie-card"
                        v-for="(m, idx) in filteredMovies"
                        :key="m.id || idx"
                        @click="openVideo(m.cover)"
                    >
                        <div class="card-head">
                            <video
                                :src="m.cover"
                                alt="movie"
                                class="card-img"
                            ></video>

                            <div class="card-overlay">
                                <button class="play" type="button">▶</button>
                            </div>
                        </div>

                        <div class="card-body">
                            <h3 class="card-title">{{ m.title }}</h3>

                            <div class="card-info">
                                <span
                                    class="genre"
                                    v-if="m.genre"
                                    >{{ m.genre }}</span
                                >
                                <span
                                    class="year"
                                    v-if="m.year"
                                    >{{ m.year }}</span
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-if="isModalOpen"
                class="video-modal"
                @click.self="closeModal"
            >
                <div class="video-modal-content">
                    <div v-if="isLoading" class="loading-overlay">
                        <div class="loading-spinner"></div>
                    </div>
                    <button
                        class="video-modal-close"
                        aria-label="关闭"
                        @click="closeModal"
                    >
                        ×
                    </button>
                    <video
                        v-if="modalVideoSrc"
                        :src="modalVideoSrc"
                        controls
                        autoplay
                        class="video-player"
                    ></video>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const isLoading = ref(false)

const props = defineProps({
  showHeader: { type: Boolean, default: true },
  logo: { type: Object, default: () => ({ src: 'https://i.postimg.cc/KvjKVZXj/logo.png' }) },
  navLinks: { type: Array, default: () => ([{ label: 'Home', href: '#' }, { label: 'Category', href: '#category' }, { label: 'LIVE', href: '#live', indicator: true }]) },
  signin: { type: Object, default: () => ({ text: 'Sign In', href: '#' }) },
  searchPlaceholder: { type: String, default: "I'm looking for..." },
  keyword: { type: String, default: '' },

  banner: {
    type: Object,
    default: () => ({
      src: './videos/第一版.mp4',
      title: '鑫考股份·产品研发中心全体成员',
      meta: { genre: '点击播放', year: '2025', duration: '12min 26s', quality: '4k' }
    })
  },

  showFilter: { type: Boolean, default: true },
  genres: { type: Array, default: () => (['Action', 'Adventure', 'Animal', 'Animation', 'Biography', 'Drama', 'Fantasy', 'Horror', 'Sci-fi', 'War']) },
  years: { type: Array, default: () => (['2024', '2020-2023', '2010-2019', '2000-2009', '1980-1999']) },
  grades: { type: Array, default: () => ([{ label: 'Featured', value: 'featured' }, { label: 'Popular', value: 'popular' }, { label: 'Newest', value: 'newest' }]) },

  movies: {
    type: Array,
    default: () => ([
        { title: '活动开始前期', cover: './videos/开头.mp4', genre: '工作氛围', year: '2025', rating: 10.0 },
        { title: '尹学海', cover: './videos/尹学海.mp4', genre: '产品总监', year: '2025', rating: 10.0 },
        { title: '王成光', cover: './videos/王成光.mp4', genre: '架构师', year: '2025', rating: 10.0 },
      { title: '陶雯雯', cover: './videos/陶雯雯.mp4', genre: '助理', year: '2025', rating: 10.0 },
      { title: '郝艳丽', cover: './videos/郝艳丽.mp4', genre: '支撑组组长', year: '2025', rating: 10.0 },
      { title: '段沛雨', cover: './videos/段沛雨.mp4', genre: '研发一组组长', year: '2025', rating: 10.0 },

      { title: '田松涛', cover: './videos/田松涛.mp4', genre: '研发二组组长', year: '2025', rating: 10.0 },

      { title: '次晓雪', cover: './videos/次晓雪.mp4', genre: '产品经理', year: '2025', rating: 10.0 },
      { title: '代瑶瑶', cover: './videos/代瑶瑶.mp4', genre: '产品经理', year: '2025', rating: 10.0 },
      { title: '索永超', cover: './videos/索永超.mp4', genre: '产品经理', year: '2025', rating: 10.0 },

      { title: '孔科业', cover: './videos/孔科业.mp4', genre: 'UI设计师', year: '2025', rating: 10.0 },

      { title: '孟飞', cover: './videos/孟飞.mp4', genre: 'UI设计师', year: '2025', rating: 10.0 },

    //   { title: '冯金傲', cover: './videos/冯金傲.mp4', genre: '前端开发工程师（外协）', year: '2025', rating: 10.0 },
      { title: '吴梦楠', cover: './videos/吴梦楠.mp4', genre: '测试工程师', year: '2025', rating: 10.0 },

      { title: '付俊敏', cover: './videos/付俊敏.mp4', genre: '测试工程师', year: '2025', rating: 10.0 },
      { title: '郭凤', cover: './videos/郭凤.mp4', genre: '测试工程师', year: '2025', rating: 10.0 },
      { title: '何冰飒', cover: './videos/何冰飒.mp4', genre: '测试工程师', year: '2025', rating: 10.0 },

      { title: '刘璐', cover: './videos/刘璐.mp4', genre: '前端开发工程师', year: '2025', rating: 10.0 },
      { title: '冯蕊', cover: './videos/冯蕊.mp4', genre: '前端开发工程师', year: '2025', rating: 10.0 },
      { title: '郭殿涛', cover: './videos/郭殿涛.mp4', genre: '前端开发工程师', year: '2025', rating: 10.0 },
      { title: '王妙田', cover: './videos/王妙田.mp4', genre: '前端开发工程师', year: '2025', rating: 10.0 },
        { title: '彭存', cover: './videos/彭存.mp4', genre: 'Java开发工程师', year: '2025', rating: 10.0 },
      { title: '刘宏亮', cover: './videos/刘宏亮.mp4', genre: 'Java开发工程师', year: '2025', rating: 10.0 },

      { title: '周竞', cover: './videos/周竞.mp4', genre: 'Java开发工程师', year: '2025', rating: 10.0 },

      { title: '蒋世莲', cover: './videos/蒋世莲.mp4', genre: '前端开发工程师（外协）', year: '2025', rating: 10.0 },
      { title: '程瑞祥', cover: './videos/程瑞祥.mp4', genre: '前端开发工程师（外协）', year: '2025', rating: 10.0 },
      { title: '李童', cover: './videos/李童.mp4', genre: '前端开发工程师（外协）', year: '2025', rating: 10.0 },
      { title: '刘依泽', cover: './videos/刘依泽.mp4', genre: '前端开发工程师（外协）', year: '2025', rating: 10.0 },
            { title: '王玉龙', cover: './videos/王玉龙.mp4', genre: '前端开发工程师（外协）', year: '2025', rating: 10.0 },
      { title: '王子扬', cover: './videos/王子扬.mp4', genre: '前端开发工程师（外协）', year: '2025', rating: 10.0 },
      { title: '张宗凯', cover: './videos/张宗凯.mp4', genre: '前端开发工程师（外协）', year: '2025', rating: 10.0 },


      { title: '赵雅楠', cover: './videos/赵雅楠.mp4', genre: 'Java开发工程师（外协）', year: '2025', rating: 10.0 },
      { title: '赵永涛', cover: './videos/赵永涛.mp4', genre: 'Java开发工程师（外协）', year: '2025', rating: 10.0 },
      { title: '秦嘉辉', cover: './videos/秦嘉辉.mp4', genre: 'Java开发工程师（外协）', year: '2025', rating: 10.0 },
      { title: '王丙洋', cover: './videos/王丙洋.mp4', genre: 'Java开发工程师（外协）', year: '2025', rating: 10.0 },






      { title: '剪辑合集', cover: './videos/第一版.mp4', genre: '全体成员', year: '2025', rating: 10.0 },
    ])
  }
})

const emit = defineEmits(['update:keyword', 'search', 'filter-change', 'bookmark', 'play', 'toggle-menu'])

const keyword = ref(props.keyword)
watch(() => props.keyword, v => { keyword.value = v })

const selectedGenre = ref('')
const selectedYear = ref('')
const selectedGrade = ref((props.grades && props.grades[0] && props.grades[0].value) || '')

function formatRating(r) {
  const n = Number(r)
  return Number.isFinite(n) ? n.toFixed(1) : ''
}

function onSearch() {
  emit('search', keyword.value)
}

function clearSearch() {
  keyword.value = ''
  emit('update:keyword', '')
  emit('search', '')
}

function focusSearch() {
  const el = document.querySelector('.navbar-form-search')
  if (el) el.focus()
}

function emitFilter() {
  emit('filter-change', { genre: selectedGenre.value, year: selectedYear.value, grade: selectedGrade.value })
}

// 视频弹窗状态与控制
const isModalOpen = ref(false)
const modalVideoSrc = ref('')

function openVideo(src) {
  isLoading.value = true;
  if (typeof src === 'string' && src) {
    modalVideoSrc.value = src
    isModalOpen.value = true

    nextTick(() => {
      const videoElement = document.querySelector('.video-player')
      if (videoElement) {
        videoElement.onloadeddata = () => {
          isLoading.value = false
        }
      }
    })
    isModalOpen.value = true
  }
}

function closeModal() {
  const v = document.querySelector('.video-player')
  if (v && typeof v.pause === 'function') v.pause()
  isModalOpen.value = false
  modalVideoSrc.value = ''
}

function handleKeydown(e) {
  if (e.key === 'Escape') closeModal()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const filteredMovies = computed(() => {
  // 基础搜索
  const kw = (keyword.value || '').toLowerCase()
  let list = props.movies.filter(m => !kw || (m.title && m.title.toLowerCase().includes(kw)))

  // 按流派
  if (selectedGenre.value) {
    list = list.filter(m => (m.genre || '').toLowerCase().includes(selectedGenre.value.toLowerCase()))
  }

  // 按年份/年份区段
  if (selectedYear.value) {
    const y = selectedYear.value
    if (/^\d{4}-\d{4}$/.test(y)) {
      const [s, e] = y.split('-').map(n => Number(n))
      list = list.filter(m => Number(m.year) >= s && Number(m.year) <= e)
    } else if (/^\d{4}$/.test(y)) {
      list = list.filter(m => String(m.year) === y)
    }
  }

  // grade 示例：仅演示，不改变顺序，可在外部根据事件自行排序
  return list
})
</script>

<style scoped>
  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  /* 添加滚动并隐藏滚动条 */
  ::-webkit-scrollbar {
    display: none;
  }
  .scroll-container {
    overflow-y: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
.navbar{
    backdrop-filter: blur(30px);
}
.video-shell{
    background: rgba(0, 0, 0, .1);

}
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

:root{
    --live-indicator-shadow: hsla(0, 79%, 63%, .5);
    --rich-blank-fogra-30: hsl(219, 32%, 10%);
    --rich-blank-fogra-29: hsl(222, 25%, 10%);
    --live-indicator: hsl(0, 79%, 63%);
    --oxford-blue-50: hsla(218, 39%, 14%, .8);
    --oxford-blue: hsl(218, 39%, 14%);
    --light-azure: hsl(214, 84%, 56%);
    --off-white: hsl(0, 0%, 88%);
    --yellow: hsl(45, 100%, 54%);
    --white: hsl(0, 0%, 100%);
    --azure: hsl(211, 100%, 50%);

    --font-family: "Inter", sans-serif;

    --section-heading: 40px;
    --font-size-large: 22px;
    --font-size-medium: 17px;
    --font-size-small: 14px;
    --font-size-extra-small: 12px;

    --fw7: 700;
    --fw6: 600;
    --fw5: 500;

    --padding-x: 120px;
}

*{
    margin: 0;
    padding: 0;
    transition: all .5s ease;
}

*, *::before, *::after {box-sizing: border-box;}

html{ font-family: var(--font-family);}

h1, h2, h3, h4, h5, h6 {color: var(--white);}

/* body{
    background: var(--rich-blank-fogra-29);
    color: var(--off-white);
    -webkit-font-smoothing: antialiased;
} */

img{
    display: block;
    width: 100%;
    height: 100%;
    pointer-events: none;
    object-fit: cover;
}

input, button, select{
    font: inherit;
    background: none;
    border: none;
    outline: none;
}

button{
    color: var(--off-white);
    cursor: pointer;
}

li{list-style: none;}

a{
    text-decoration: none;
    display: block;
    color: var(--off-white);
}

::-webkit-scrollbar{
    background: transparent;
    border-left: 1px solid var(--oxford-blue);
}

    ::-webkit-scrollbar-thumb{
        background: var(--light-azure);
        border-radius: 5em;
        border: 3px solid var(--rich-blank-fogra-29);
    }

header, nav { background: var(--rich-blank-fogra-29);}



.container{
    max-width: 1920px;
    margin: auto;
}

.navbar, .banner, .movies, .category, .live{ padding: 0 var(--padding-x);}

.section-heading{
    font-size: var(--section-heading);
    font-weight: var(--fw5);
    margin-bottom: 60px;
}

/*HEADER*/

.navbar{
    height: 100px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.navbar-menu-btn{ display: none;}

nav{ margin-right: 200px;}

.navbar-nav{ display: flex;}

    .navbar-nav li:not(:last-child) {margin-right: 60px;}

.navbar-link{
    font-size: var(--font-size-small);
    font-weight: var(--fw5);
}

    .navbar-link:hover{ color: var(--light-azure);}

.indicator{ position: relative;}

    .indicator::after{
        content: '';
        background: var(--live-indicator);
        position: absolute;
        top: calc(50% - 1px);
        right: -15px;
        width: 4px;
        height: 4px;
        box-shadow: 0 0 0 2px var(--live-indicator-shadow);
        border-radius: 5px;
    }

.navbar-actions{
    display: flex;
    align-items: center;
}

.navbar-form{
    position: relative;
    margin-right: 50px;
}

.navbar-form-search{
    background: var(--oxford-blue);
    width: 100%;
    padding: 12px 20px;
    border-radius: 15px;
    color: var(--off-white);
    font-size: var(--font-size-small);
    font-weight: var(--fw5);
}

.navbar-form-btn{
    background: var(--oxford-blue);
    position: absolute;
    top: calc(50% - 10px);
    right: 10px;
}

.navbar-form-btn ion-icon, .navbar-search-btn ion-icon{
    font-size: 20px;
    color: var(--light-azure);
    --ionicon-stroke-width: 50px;
}

    .navbar-form-btn:hover ion-icon, .navbar-form-search::placeholder { color: var(--off-white);}

.navbar-form-close, .navbar-search-btn{ display: none;}

.navbar-signin{
    display: flex;
    align-items: center;
    font-size: var(--font-size-small);
}

    .navbar-signin ion-icon{
        font-size: 22px;
        color: var(--light-azure);
        margin-left: 5px;
        --ionicon-stroke-width: 30px;
    }

    .navbar-signin:hover span{color: var(--light-azure);}

/*BANNER SECTION*/

.banner{ margin-bottom: 60px;}

.banner-card{
    position: relative;
    height: 400px;
    overflow: hidden;
    border-radius: 20px;
    cursor: pointer;
}

    .banner-card .card-content{
        position: absolute;
        right: 80px;
        bottom: 60px;
        left: 80px;
    }

    .banner-card .card-info{
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

        .banner-card .card-info div{
            display: flex;
            align-items: center;
            margin-right: 20px;
        }

        .banner-card .card-info ion-icon{
            font-size: 20px;
            color: var(--azure);
            margin-right: 5px;
        }

        .banner-card .card-info span{ font-weight: var(--fw6);}

        .banner-card .card-info .quality{
            background: var(--azure);
            padding: 2px 5px;
            border-radius: 5px;
            font-weight: var(--fw7);
        }

    .banner-card .card-title{
        font-size: 3em;
        color: var(--white);
        text-shadow: 2px 0 2px #0007;
    }

    .banner-card:hover .banner-img{ transform: scale(1.1);}

.banner-img{ object-position: top;}

/*MOVIES SECTION*/

.movies{ margin-bottom: 60px;}

.filter-bar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--oxford-blue);
    padding: 20px 30px;
    border-radius: 20px;
    margin-bottom: 30px;
}

    .filter-bar select{
        color: var(--white);
        font-size: var(--font-size-small);
        margin-right: 15px;
        cursor: pointer;
    }

    .filter-bar option{ background: var(--oxford-blue);}

.filter-radios{
    position: relative;
    background: var(--rich-blank-fogra-29);
    padding: 10px;
    border-radius: 15px;
}

    .filter-radios input{ display: none;}

    .filter-radios label{
        position: relative;
        margin: 0 10px;
        font-size: var(--font-size-small);
        user-select: none;
        cursor: pointer;
        z-index: 10;
    }

        .filter-radios input:checked + label, .filter-radios label:hover {color: var(--light-azure);}

input ~ .checked-radio-bg{
    --width: 85px;
    --left: 5px;

    background: var(--oxford-blue);
    position: absolute;
    top: 5px;
    left: var(--left);
    bottom: 5px;
    width: var(--width);
    border-radius: 10px;
}

    #popular:checked ~ .checked-radio-bg{
        --width: 73px;
        --left: 90px;
    }

    #newest:checked ~ .checked-radio-bg{
        --width: 81px;
        --left: 163px;
    }

.movies-grid{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 30px;
    margin-bottom: 60px;
}

.movie-card{
    --scale: .8;

    cursor: pointer;
}

    .movie-card .card-head{
        position: relative;
        height: 250px;
        border-radius: 15px;
        margin-bottom: 15px;
        overflow: hidden;
    }

        .movie-card:hover .card-img{ transform: scale(1.1);}

        /* Ensure video inside card is centered and covers the area */
        .movie-card .card-img{
            width: 100%;
            height: 100%;
            display: block;
            object-fit: cover;
            object-position: center;
        }

    .movie-card .card-overlay{
        position: absolute;
        inset: 0;
        opacity: 0;
        backdrop-filter: blur(5px);
    }

        .movie-card:hover .card-overlay{ opacity: 1;}

    .movie-card .bookmark, .movie-card .rating{
        position: absolute;
        top: 15px;
        padding: 6px;
        border-radius: 10px;
        color: var(--light-azure);
        transform: scale(var(--scale));
    }

        .movie-card .bookmark{
            background: var(--oxford-blue);
            left: 15px;
        }

            .movie-card .bookmark:hover{ color: var(--yellow);}

        .movie-card .rating{
            display: flex;
            align-items: center;
            right: 15px;
            background: var(--oxford-blue-50);
        }

            .movie-card .rating span{
                color: var(--white);
                font-size: 13px;
                font-weight: var(--fw5);
                margin-left: 5px;
            }

    .movie-card ion-icon{
        font-size: 16px;
        display: block;
        --ionicon-stroke-width: 50px;
    }

    .movie-card .play{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(var(--scale));
    }

        .movie-card .play ion-icon{
            font-size: 60px;
            --ionicon-stroke-width: 20px;
        }

            .movie-card:hover :is(.bookmark, .rating, .play){ --scale: 1;}

    .movie-card .card-title{
        font-size: var(--font-size-medium);
        font-weight: var(--fw5);
        margin-bottom: 5px;
        text-align: center;
    }

        .movie-card:hover .card-title{ color: var(--light-azure);}

    .movie-card .card-info{
        display: flex;
        justify-content: space-evenly;
        font-size: var(--font-size-extra-small);
        font-weight: var(--fw5);
    }

.load-more{
    background: var(--oxford-blue);
    display: block;
    padding: 20px 50px;
    margin: auto;
    font-size: var(--font-size-small);
    font-weight: var(--fw5);
    border-radius: 15px;
    color: var(--white);
}

    .load-more:hover{ background: var(--light-azure);}

/*CATEGORY SECTION*/

.category{ margin-bottom: 60px;}

.category-grid{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
}

.category-card{
    position: relative;
    height: 150px;
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
}

    .category-card::after{
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, transparent 20%, #000a);
    }

    .category-card .name, .category-card .total{
        position: absolute;
        bottom: 20px;
        color: var(--white);
        z-index: 20;
    }

        .category-card .name{
            left: 20px;
            font-size: 20px;
        }

            .category-card:hover .name{ color: var(--light-azure);}

        .category-card .total{
            right: 20px;
            font-size: 18px;
            background: var(--oxford-blue-50);
            padding: 5px 8px;
            border-radius: 8px;
        }

/*LIVE SECTION*/

.live{ margin-bottom: 60px;}

.live-grid{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
}

.live-card{ cursor: pointer;}

    .live-card .card-head{
        position: relative;
        height: 250px;
        border-radius: 20px;
        margin-bottom: 15px;
        overflow: hidden;
    }

        .live-card .card-head::after{
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, transparent 20%, #000a);
        }

        .live-card:hover .card-img{ transform: scale(1.1);}

    .live-card .live-badge, .live-card .total-viewers{
        position: absolute;
        left: 30px;
        border-radius: 10px;
        padding: 5px 10px;
        z-index: 10;
    }

        .live-card .live-badge{
            top: 30px;
            font-size: var(--font-size-extra-small);
            font-weight: var(--fw5);
            background: var(--live-indicator);
        }

        .live-card .total-viewers{
            bottom: 30px;
            font-size: 15px;
            font-weight: var(--fw6);
            background: var(--oxford-blue-50);
        }

    .live-card .play{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(.8);
        opacity: 0;
        z-index: 10;
    }

        .live-card:hover .play{
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }

        .live-card .play ion-icon{
            font-size: 60px;
            --ionicon-stroke-width: 20px;
        }

    .live-card .card-body{
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .live-card .avatar{
        width: 40px;
        border-radius: 10px;
        margin-right: 15px;
    }

    .live-card .card-title{
        font-size: var(--font-size-large);
        font-weight: var(--fw5);
    }

        .live-card:hover .card-title{ color: var(--light-azure);}

/*FOOTER*/

footer{
    background: var(--rich-blank-fogra-30);
    padding: 80px var(--padding-x) 40px;
}

.footer-content{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid var(--oxford-blue-50);
    padding-bottom: 80px;
}

.footer-brand{
    max-width: 250px;
    margin-right: 130px;
}

.footer-logo{
    width: 100px;
    margin-bottom: 30px;
}

.slogan{
    font-size: var(--font-size-small);
    line-height: 20px;
    margin-bottom: 20px;
}

.social-link a { display: inline-block;}

.social-link ion-icon{
    font-size: 25px;
    margin-right: 20px;
}

.footer-links{
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 50px;
    align-items: flex-end;
}

.link-heading{ margin-bottom: 20px;}

.link-item{ font-size: var(--font-size-small);}

    ul .link-item:not(:last-child) { margin-bottom: 10px;}

    .link-item:hover a{ color: var(--light-azure);}

.footer-copyright{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 40px;
}

    .footer-copyright p, .wrapper a{ font-size: var(--font-size-small);}

        .wrapper a:hover { color: var(--light-azure);}

        .wrapper a:not(:last-child) { margin-right: 50px;}

.wrapper{ display: flex;}

/*MEDIA QUERIES*/

@media screen and (max-width: 1200px){
    :root{
        --padding-x: 80px;
    }

    header{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        overflow: hidden;
        z-index: 50;
    }

        header.active{ top: 250px;}

    .navbar-menu-btn{
        display: block;
        position: absolute;
        top: 50%;
        left: var(--padding-x);
        transform: translateY(-50%);
    }

        .navbar-menu-btn span{
            display: block;
            background: var(--off-white);
            width: 25px;
            height: 2px;
            margin: 8px;
        }

            .navbar-menu-btn.active span{ background: var(--light-azure);}

        .navbar-menu-btn .two {width: 20px;}
        .navbar-menu-btn .three{ width: 15px;}

            .navbar-menu-btn.active .one{ transform: rotate(45deg) translateY(14px);}
            .navbar-menu-btn.active .two{ width: 0;}
            .navbar-menu-btn.active .three{
                width: 25px;
                transform: rotate(-45deg) translateY(-14px);
            }

    .navbar-brand{ margin-left: 50px;}

    nav{
        position: fixed;
        top: -250px;
        left: 0;
        width: 100%;
        z-index: 100;
    }

        nav.active {top: 0;}

    .navbar-nav{
        height: 250px;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding-left: var(--padding-x);
        border-bottom: 1px solid var(--oxford-blue);
    }

        .navbar-nav li:not(:last-child){
            margin-right: 0;
            margin-bottom: 30px;
        }

    .navbar-form{
        position: absolute;
        top: 100%;
        left: var(--padding-x);
        right: var(--padding-x);
        height: 100%;
        background: var(--rich-blank-fogra-29);
        margin-right: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 100;
    }

        .navbar-form.active{ top: 0;}

    .navbar-form-search{ margin-right: 40px;}

    .navbar-form-btn{ right: 80px;}

    .navbar-form-close{
        display: block;
        padding-top: 4px;
        opacity: .8;
    }

        .navbar-form-close:hover{ opacity: 1;}

        .navbar-form-close ion-icon{
            font-size: 30px;
            color: var(--light-azure);
        }

    .navbar-search-btn{
        display: block;
        margin-right: 100px;
        padding-top: 5px;
    }

    .banner{ margin-top: 100px;}

    .banner-card .card-title{ font-size: 2.5em;}

    .category-grid{ grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));}

    .footer-content{ flex-direction: column;}

    .footer-brand{
        margin-right: 0;
        margin-bottom: 60px;
    }

    .footer-links{ grid-template-columns: repeat(auto-fit, minmax(125px, 1fr));}

}

@media screen and (max-width: 1200px){
    :root{
        --padding-x: 60px;
    }

    .banner-card .card-content{
        bottom: 40px;
        left: 60px;
        right: 60px;
    }
}

@media screen and (max-width: 768px){
    :root{
        --padding-x: 40px;
    }

    .banner{ display: none;}

    .movies{ margin-top: 120px;}

    .filter-bar{
        flex-direction: column;
        align-items: center;
    }

        .filter-bar select{margin-bottom: 20px;}

}

@media screen and (max-width: 575px){
    :root{
        --padding-x: 20px;
        --section-heading: 32px;
        --font-size-large: 20px;
    }

    .navbar-search-btn{ margin-right: 20px;}

    .navbar-form-search { margin-right: 20px;}

    .navbar-form-btn{ right: 55px;}

    .footer-copyright{ flex-direction: column-reverse;}

    .wrapper{ margin-bottom: 20px;}
}

.video-modal{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}
.video-modal-content{
  position: relative;
  width: min(100%, 980px);
  max-height: 80vh;
  background: #000;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,.5);
  overflow: hidden;
}
.video-modal-close{
  position: absolute;
  top: 10px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,.12);
  color: #fff;
  font-size: 22px;
  line-height: 36px;
  text-align: center;
}
.video-modal-close:hover{ background: rgba(255,255,255,.24); }
.video-player{
  display: block;
  width: 100%;
  height: auto;
  max-height: 80vh;
}
</style>
