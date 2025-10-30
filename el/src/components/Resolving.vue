<template>
    <div class="container">
        <span class="heading" data-target-resolver ref="resolverEl"></span>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'

const resolver = {
    resolve: function resolve(options, callback) {
        // The string to resolve
        const resolveString = options.resolveString || options.element.getAttribute('data-target-resolver');
        const combinedOptions = Object.assign({}, options, { resolveString: resolveString });

        function getRandomInteger(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        function randomCharacter(characters) {
            return characters[getRandomInteger(0, characters.length - 1)];
        };

        function doRandomiserEffect(options, callback) {
            const characters = options.characters;
            const timeout = options.timeout;
            const element = options.element;
            const partialString = options.partialString;

            let iterations = options.iterations;

            setTimeout(() => {
                if (iterations >= 0) {
                    const nextOptions = Object.assign({}, options, { iterations: iterations - 1 });

                    // Ensures partialString without the random character as the final state.
                    if (iterations === 0) {
                        element && (element.textContent = partialString);
                    } else {
                        // Replaces the last character of partialString with a random character
                        element && (element.textContent = partialString.substring(0, partialString.length - 1) + randomCharacter(characters));
                    }

                    doRandomiserEffect(nextOptions, callback)
                } else if (typeof callback === "function") {
                    callback();
                }
            }, options.timeout);
        };

        function doResolverEffect(options, callback) {
            const resolveString = options.resolveString;
            const characters = options.characters;
            const offset = options.offset;
            const partialString = resolveString.substring(0, offset);
            const combinedOptions = Object.assign({}, options, { partialString: partialString });

            doRandomiserEffect(combinedOptions, () => {
                const nextOptions = Object.assign({}, options, { offset: offset + 1 });

                if (offset <= resolveString.length) {
                    doResolverEffect(nextOptions, callback);
                } else if (typeof callback === "function") {
                    callback();
                }
            });
        };

        doResolverEffect(combinedOptions, callback);
    }
}

/* Some GLaDOS quotes from Portal 2 chapter 9: The Part Where He Kills You
 * Source: http://theportalwiki.com/wiki/GLaDOS_voice_lines#Chapter_9:_The_Part_Where_He_Kills_You
 */
const strings = [
    '前言',
    '10月24日对应着 1024 和字节相等，就成为了程序员节，我们准备了有趣的活动，节日蛋糕，并且我们的 “总经理·张辉，架构师·王成光”，也为产品研发中心送上了节日祝福。',
    '这里的彩蛋是封存的一些我们鑫考股份2025年程序员节的过往，希望2026的你可以再接再厉，继续为产品研发中心贡献自己的力量。',
    '最后我作为这个彩蛋的作者，在这个节日对大家说：',
    'Hello Would.',
];

let counter = 0;

const options = {
    // Initial position
    offset: 0,
    // Timeout between each random character
    timeout: 5,
    // Number of random characters to show
    iterations: 10,
    // Random characters to pick from
    characters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'x', '#', '%', '&', '-', '+', '_', '?', '/', '\\', '='],
    // String to resolve
    resolveString: strings[counter],
    // The element
    element: null
}

const resolverEl = ref(null)

// Callback function when resolve completes
function callback() {
    setTimeout(() => {
        counter++;

        if (counter >= strings.length) {
            return
        }

        let nextOptions = Object.assign({}, options, { resolveString: strings[counter] });
        resolver.resolve(nextOptions, callback);
    }, 1000);
}

onMounted(() => {
    options.element = resolverEl.value
    resolver.resolve(options, callback);
})
</script>
<style scoped>
* {
    /* box-sizing: border-box; */
}

html,
body {
    height: 100%;
    margin: 0;
    font-family: 'Unica One', sans-serif;
    background: #111;
}

.container {
    position: absolute;
    background-color: black;
    width: 100%;
    height: 100vh;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    /* height: 100%; */
    /* padding: 5rem; */
}

.heading {
    color: #eee;
    /* height: 50%; */
    font-size: 1rem;
    font-weight: 300;
    text-transform: uppercase;
}
</style>
