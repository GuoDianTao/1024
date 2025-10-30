<template>
  <!-- Modal dialog div -->
  <div id="modal_parent">
    <div id="modal_content">
      <span id="modal_close_button">&times;</span>
      <div id="store_link_modal_content" class="modal_inner"></div>
      <div id="share_file_modal_content" class="modal_inner"></div>
    </div>
  </div>

  <!-- 
      Game canvas and overlay. Emscripten makes some assumptions about how the canvas is positioned in order
      to translate document to game coordinates
    -->
  <div id="canvas_border" class="emscripten_border">
    <div id="play_content" class="middle center">
      <div class="edge">
        <div class="box">
          <div class="black">
            <img src="/images/sample.jpg" class="cover">
            <p class="title">Drive Mad</p>
            <p class="author">Fancade</p>
          </div>
        </div>
      </div>
      <div id="progress_or_play">
        <progress id="progress" class="loading" value="0" max="100"></progress>
      </div>
      <p class="description"></p>
    </div>
    <canvas class="emscripten" id="canvas" tabindex="-1">
    </canvas>
    <div id="gradient"></div>
    <div id="webview_content"></div>
  </div>
</template>

<script>
export default {
  name: 'GameContainer'
};
</script>
