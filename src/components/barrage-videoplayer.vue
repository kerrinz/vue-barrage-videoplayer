<!--  传入参数（props）-->
<!--  必填项：src,-->
<!--  可选项：width, height, speedList, cover, biBarrageXml-->
<template>
  <div
    ref="area"
    :style="`--primaryColor: ${primaryColor}`"
    :class="{'player-area': true, 'player-full-flxed': isPageFullscreen, 'cursor-lasting-static': isCursorStatic}"
  >
    <!-- 视频主体 -->
    <video
      ref="video"
      class="player-video cursor-pointer"
      @click="togglePlayStatus"
      @dblclick="toggleFullScreen"
      @keydown.f.prevent="toggleFullScreen"
      @keydown.space.prevent="togglePlayStatus"
      @keydown.left.prevent="backwardCurrentTime"
      @keydown.right.prevent="forwardCurrentTime"
      @keydown.up.prevent="increaseVolume"
      @keydown.down.prevent="lowerVolume"
      @keydown.esc.prevent="toggleFullScreen"
      tabindex="0"
      :width="width"
      :height="height"
    >
      <source :src="src" />
    </video>
    <!-- 封面图 -->
    <div v-if="cover!=null && isShowCover" class="player-cover">
      <img :src="cover" :width="width" :height="height" alt=""/>
    </div>
    <!-- 弹幕 -->
    <PlayerBarrageScreen
            v-if="biBarrageXml != null"
            :enable="isShowBarrage"
            :video-dom="videoDom"
            :barrage-timeline-start="barrageTimelineStart"
            :is-playing="isPlaying"
            :bi-barrage-xml="biBarrageXml"
    />
    <!-- 加载动画 -->
    <div v-show="isShowLoading" class="player-loading" @click="videoDom.focus({preventScroll: true})">
      <img src="@/assets/images/loading.svg"  alt="loading"/>
    </div>
    <!-- 控制栏 -->
    <div class="player-controls-container" @click="videoDom.focus({preventScroll: true})">
      <div v-show="isShowVolumeHint" class="player-volumeHint">
        <span class="player-volumeHint-text">当前音量:{{ volumePercent }}%</span>
      </div>
      <div class="player-paused-state">
        <svg v-show="!isPlaying" class="player-controls-icon" t="1655361508905" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1800" width="32" height="32"><path d="M829.696 584.405333c-3.626667 3.712-17.28 19.584-29.994667 32.597334-74.538667 82.133333-311.765333 216.533333-413.568 257.536-15.445333 6.613333-54.528 20.565333-75.434666 21.461333a123.733333 123.733333 0 0 1-57.301334-13.952 119.893333 119.893333 0 0 1-50.858666-57.856c-6.4-16.853333-16.426667-67.2-16.426667-68.096C176.213333 701.013333 170.666667 611.456 170.666667 512.512c0-94.293333 5.504-180.181333 13.653333-236.117333 0.938667-0.853333 10.922667-63.445333 21.802667-84.906667C226.176 152.32 265.258667 128 307.072 128h3.626667c27.264 0.938667 84.565333 25.258667 84.565333 26.197333 96.298667 41.088 329.002667 168.874667 405.376 253.824 0 0 21.504 21.802667 30.890667 35.413334 14.549333 19.626667 21.802667 43.861333 21.802666 68.096 0 27.093333-8.149333 52.309333-23.637333 72.832z" p-id="1801" fill="rgba(0,0,0,0.6)"></path></svg>
      </div>
      <div :class="{'player-controls': true, 'cursor-lasting-static': isCursorStatic}">
        <div class="player-progress-bar">
          <ProgressBar
            :duration="duration"
            :current-time="currentTime"
            :buffered="buffered"
            @dragging="onDraggingProgress"
            @released="onReleasedProgress"
            width="100%"
            height="3px"
          ></ProgressBar>
        </div>
        <div class="player-controls-bottom">
          <div class="player-controls-bottom-left">
            <div class="player-controls-btn cursor-pointer" @click="togglePlayStatus">
              <svg v-show="!isPlaying" t="1655360757890" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14071" width="24" height="24"><path d="M755.712 492.3904L250.368 223.3856a51.2 51.2 0 0 0-75.264 45.2096v538.0096a51.2 51.2 0 0 0 75.264 45.2096l505.3952-269.0048a51.2 51.2 0 0 0 0-90.4192z" p-id="14072" fill="#ffffff"></path></svg>
              <!-- <svg t="1655361209078" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="24029" width="24" height="24"><path d="M255.36 896c-42.432 0-63.36-34.368-63.36-76.8V204.8c0-42.432 20.928-76.8 63.36-76.8s63.36 34.368 63.36 76.8v614.4c0 42.432-20.928 76.8-63.36 76.8zM767.36 896c-42.432 0-63.36-34.368-63.36-76.8V204.8c0-42.432 20.928-76.8 63.36-76.8s63.36 34.368 63.36 76.8v614.4c0 42.432-20.928 76.8-63.36 76.8z" p-id="24030"></path></svg> -->
              <svg v-show="isPlaying" t="1655361096742" class="icon" viewBox="100 50 924 924" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22925" width="24" height="24"><path d="M685.237 808.447h-27.988c-33.594 0-56.016-27.988-56.016-55.996V310.049c0-33.594 28.008-55.996 56.016-55.996h27.988c33.594 0 56.016 28.008 56.016 55.996v436.816c5.585 33.594-22.423 61.582-56.016 61.582zM366.037 808.447h-27.988c-33.594 0-56.016-27.988-56.016-55.996V310.049c0-33.594 28.008-55.996 56.016-55.996h27.988c33.594 0 56.016 28.008 56.016 55.996v436.816c0 33.594-22.422 61.582-56.016 61.582z" p-id="22926" fill="#ffffff"></path></svg>
            </div>
            <div class="time-label">
              {{ currentTimeLabel }} / <span class="fulltime">{{ fullTimeLabel }}</span>
              </div>
          </div>
          <div class="player-controls-bottom-right">
            <div class="player-controls-btn" v-if="biBarrageXml != null" @click="toggleShowBarrage">
              <div class="cursor-pointer">
                <svg v-show="isShowBarrage" class="player-controls-icon" viewBox="0 -25 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3405" width="24" height="24"><path d="M714.752 555.008h-112.64v-26.624h61.44c24.576 0 36.864-14.336 36.864-36.864v-147.456c0-34.816-20.48-38.912-32.768-38.912h-16.384c6.144-8.192 10.24-14.336 14.336-20.48 8.192-14.336 4.096-24.576-8.192-32.768-12.288-6.144-24.576-2.048-32.768 8.192-2.048 2.048-6.144 8.192-8.192 12.288-10.24 16.384-18.432 26.624-20.48 32.768H552.96c-8.192-14.336-18.432-30.72-28.672-47.104-8.192-10.24-20.48-12.288-32.768-6.144-12.288 8.192-16.384 20.48-8.192 32.768 4.096 4.096 8.192 12.288 14.336 22.528h-8.192c-12.288-2.048-20.48 2.048-26.624 6.144-6.144 6.144-8.192 16.384-8.192 28.672V491.52c0 12.288 2.048 22.528 8.192 28.672 6.144 6.144 16.384 8.192 26.624 8.192H552.96v28.672h-102.4c-4.096 0-8.192 0-12.288 6.144v-43.008c0-28.672-16.384-36.864-28.672-36.864h-51.2s-2.048-2.048 0-10.24l2.048-45.056c0-4.096 0-8.192 2.048-8.192H395.264c8.192 0 16.384-2.048 20.48-6.144 6.144-6.144 10.24-16.384 10.24-32.768V307.2c0-14.336-2.048-24.576-10.24-30.72-6.144-6.144-16.384-10.24-30.72-10.24h-65.536c-8.192 0-20.48 2.048-22.528 22.528 0 14.336 6.144 22.528 20.48 24.576h53.248c6.144 0 10.24 2.048 10.24 12.288v30.72c0 14.336-6.144 16.384-12.288 16.384h-22.528c-12.288 0-20.48 2.048-26.624 8.192-6.144 6.144-8.192 16.384-8.192 28.672l-2.048 86.016c0 10.24 2.048 20.48 8.192 24.576 6.144 6.144 14.336 8.192 24.576 8.192h40.96c4.096 0 6.144 0 6.144 2.048 2.048 2.048 4.096 4.096 2.048 14.336 0 2.048 0 8.192-2.048 16.384-2.048 43.008-6.144 59.392-8.192 65.536-6.144 12.288-26.624 6.144-43.008 0-18.432-6.144-26.624 2.048-32.768 10.24-6.144 14.336-2.048 26.624 12.288 32.768 47.104 16.384 79.872 14.336 100.352-8.192 6.144-6.144 14.336-20.48 18.432-67.584 4.096 6.144 10.24 8.192 14.336 8.192h102.4v69.632c0 6.144 2.048 20.48 24.576 20.48 14.336 0 22.528-8.192 22.528-20.48v-69.632h110.592c6.144 0 18.432-2.048 20.48-22.528 2.048-20.48-8.192-24.576-16.384-24.576z m-151.552-65.536h-53.248c-10.24 2.048-14.336-6.144-12.288-18.432v-34.816h65.536v53.248z m0-90.112h-65.536v-43.008c-2.048-10.24 2.048-14.336 12.288-12.288h53.248v55.296z m32.768-53.248h51.2c10.24-2.048 14.336 2.048 14.336 12.288v43.008h-65.536v-55.296z m0 141.312v-53.248h65.536V471.04c0 10.24-6.144 16.384-16.384 16.384h-49.152zM724.992 145.408H299.008C200.704 145.408 122.88 223.232 122.88 321.536v288.768c0 96.256 77.824 176.128 176.128 176.128h106.496l83.968 83.968c6.144 6.144 14.336 8.192 22.528 8.192s16.384-2.048 22.528-8.192l83.968-83.968h106.496c96.256 0 176.128-77.824 176.128-176.128V321.536c0-98.304-77.824-176.128-176.128-176.128zM839.68 610.304c0 63.488-51.2 114.688-114.688 114.688h-118.784c-4.096 0-8.192 0-10.24 2.048-4.096 2.048-8.192 4.096-10.24 6.144L512 804.864l-71.68-71.68c-2.048-2.048-6.144-6.144-10.24-6.144-4.096-2.048-8.192-2.048-10.24-2.048h-118.784c-63.488 0-114.688-51.2-114.688-114.688V321.536c0-63.488 51.2-114.688 114.688-114.688h428.032c63.488 0 114.688 51.2 114.688 114.688v288.768z" p-id="3406"></path></svg>
                <svg v-show="!isShowBarrage" class="player-controls-icon" viewBox="0 -25 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3417"><path d="M714.752 555.008h-112.64v-26.624h61.44c24.576 0 36.864-14.336 36.864-36.864v-147.456c0-34.816-20.48-38.912-32.768-38.912h-16.384c6.144-8.192 10.24-14.336 14.336-20.48 8.192-14.336 4.096-24.576-8.192-32.768-12.288-6.144-24.576-2.048-32.768 8.192-2.048 2.048-6.144 8.192-8.192 12.288-10.24 16.384-18.432 26.624-20.48 32.768H552.96c-8.192-14.336-18.432-30.72-28.672-47.104-8.192-10.24-20.48-12.288-32.768-6.144-12.288 8.192-16.384 20.48-8.192 32.768 4.096 4.096 8.192 12.288 14.336 22.528h-8.192c-12.288-2.048-20.48 2.048-26.624 6.144-6.144 6.144-8.192 16.384-8.192 28.672V491.52c0 12.288 2.048 22.528 8.192 28.672 6.144 6.144 16.384 8.192 26.624 8.192H552.96v28.672h-102.4c-4.096 0-8.192 0-12.288 6.144v-43.008c0-28.672-16.384-36.864-28.672-36.864h-51.2s-2.048-2.048 0-10.24l2.048-45.056c0-4.096 0-8.192 2.048-8.192H395.264c8.192 0 16.384-2.048 20.48-6.144 6.144-6.144 10.24-16.384 10.24-32.768V307.2c0-14.336-2.048-24.576-10.24-30.72-6.144-6.144-16.384-10.24-30.72-10.24h-65.536c-8.192 0-20.48 2.048-22.528 22.528 0 14.336 6.144 22.528 20.48 24.576h53.248c6.144 0 10.24 2.048 10.24 12.288v30.72c0 14.336-6.144 16.384-12.288 16.384h-22.528c-12.288 0-20.48 2.048-26.624 8.192-6.144 6.144-8.192 16.384-8.192 28.672l-2.048 86.016c0 10.24 2.048 20.48 8.192 24.576 6.144 6.144 14.336 8.192 24.576 8.192h40.96c4.096 0 6.144 0 6.144 2.048 2.048 2.048 4.096 4.096 2.048 14.336 0 2.048 0 8.192-2.048 16.384-2.048 43.008-6.144 59.392-8.192 65.536-6.144 12.288-26.624 6.144-43.008 0-18.432-6.144-26.624 2.048-32.768 10.24-6.144 14.336-2.048 26.624 12.288 32.768 47.104 16.384 79.872 14.336 100.352-8.192 6.144-6.144 14.336-20.48 18.432-67.584 4.096 6.144 10.24 8.192 14.336 8.192h102.4v69.632c0 6.144 2.048 20.48 24.576 20.48 14.336 0 22.528-8.192 22.528-20.48v-69.632h110.592c6.144 0 18.432-2.048 20.48-22.528 2.048-20.48-8.192-24.576-16.384-24.576z m-151.552-155.648h-65.536v-43.008c-2.048-10.24 2.048-14.336 12.288-12.288h53.248v55.296z m0 90.112h-53.248c-10.24 2.048-14.336-6.144-12.288-18.432v-34.816h65.536v53.248z m32.768-143.36h51.2c10.24-2.048 14.336 2.048 14.336 12.288v43.008h-65.536v-55.296z m0 88.064h65.536V471.04c0 10.24-6.144 16.384-16.384 16.384H593.92v-53.248zM724.992 145.408H299.008c-49.152 0-94.208 20.48-126.976 53.248l-6.144 6.144s-2.048 2.048-2.048 4.096c-24.576 30.72-40.96 69.632-40.96 112.64v288.768c0 96.256 77.824 176.128 176.128 176.128h106.496l83.968 83.968c6.144 6.144 14.336 8.192 22.528 8.192s16.384-2.048 22.528-8.192l83.968-83.968h106.496c96.256 0 176.128-77.824 176.128-176.128V321.536c0-98.304-77.824-176.128-176.128-176.128z m0 61.44c63.488 0 114.688 51.2 114.688 114.688v288.768c0 18.432-4.096 36.864-12.288 51.2L239.616 223.232c16.384-10.24 36.864-16.384 57.344-16.384h428.032z m-118.784 516.096c-4.096 0-8.192 0-10.24 2.048-4.096 2.048-8.192 4.096-10.24 6.144L512 804.864l-71.68-71.68c-2.048-2.048-6.144-6.144-10.24-6.144-4.096-2.048-8.192-2.048-10.24-2.048h-118.784c-63.488 0-114.688-51.2-114.688-114.688V321.536c0-18.432 4.096-36.864 12.288-53.248l587.776 438.272c-16.384 10.24-36.864 16.384-59.392 16.384h-120.832z" p-id="3418"></path></svg>
                <div
                  class="player-controls-btn-hint"
                >{{isShowBarrage ? '关闭弹幕' : '开启弹幕'}}</div>
              </div>
            </div>
            <div class="player-controls-btn cursor-pointer btn-speed">
              <span>{{currentSpeed === 1 ? '倍速' : `${currentSpeed}x`}}</span>
              <div class="speed-control">
                <ul class="speed-control-list">
                  <li
                    v-for="item in speedList"
                    :key="item"
                    @click="changeSpeed"
                    :data-value="item"
                    :class="{'current': currentSpeed === Number(item)}"
                  >{{ item }}x</li>
                </ul>
              </div>
            </div>
            <div class="player-controls-btn btn-volume">
              <div class="cursor-pointer" @click="toggleMute">
                <svg v-if="volumePercent > 50" t="1655365046521" class="player-controls-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5503" width="24" height="24"><path d="M128 426.666667v170.666666c0 23.466667 19.2 42.666667 42.666667 42.666667h128l140.373333 140.373333c26.88 26.88 72.96 7.68 72.96-30.293333V273.493333c0-37.973333-46.08-57.173333-72.96-30.293333L298.666667 384H170.666667c-23.466667 0-42.666667 19.2-42.666667 42.666667z m576 85.333333A192 192 0 0 0 597.333333 340.053333v343.466667c63.146667-31.146667 106.666667-96 106.666667-171.52zM597.333333 189.866667v8.533333c0 16.213333 10.666667 30.293333 25.6 36.266667C733.013333 278.613333 810.666667 386.56 810.666667 512s-77.653333 233.386667-187.733334 277.333333c-15.36 5.973333-25.6 20.053333-25.6 36.266667v8.533333c0 26.88 26.88 45.653333 51.626667 36.266667C793.6 815.36 896 675.84 896 512s-102.4-303.36-247.04-358.4c-24.746667-9.813333-51.626667 9.386667-51.626667 36.266667z" p-id="5504" fill="#ffffff"></path></svg>
                <svg v-else-if="volumePercent == 0" t="1655365118782" class="player-controls-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6263" width="24" height="24"><path d="M154.88 154.88a42.496 42.496 0 0 0 0 60.16L311.04 371.2 298.666667 384H170.666667c-23.466667 0-42.666667 19.2-42.666667 42.666667v170.666666c0 23.466667 19.2 42.666667 42.666667 42.666667h128l140.373333 140.373333c26.88 26.88 72.96 7.68 72.96-30.293333v-177.92l178.346667 178.346667c-20.906667 15.786667-43.52 29.013333-68.266667 38.826666-15.36 6.4-24.746667 22.613333-24.746667 39.253334 0 30.72 31.146667 50.346667 59.306667 38.826666 34.133333-14.08 66.133333-32.853333 94.72-55.893333l57.173333 57.173333a42.496 42.496 0 1 0 60.16-60.16L215.466667 154.88c-16.64-16.64-43.52-16.64-60.586667 0zM810.666667 512c0 34.986667-6.4 68.693333-17.493334 99.84l65.28 65.28c23.893333-49.92 37.546667-105.813333 37.546667-165.12 0-163.413333-102.4-303.36-246.613333-358.4-25.173333-9.813333-52.053333 9.813333-52.053334 36.693333v8.106667c0 16.213333 10.666667 30.293333 26.026667 36.266667C733.013333 279.04 810.666667 386.56 810.666667 512z m-371.626667-268.373333l-7.253333 7.253333L512 331.093333V273.493333c0-37.973333-46.08-56.746667-72.96-29.866666zM704 512A192 192 0 0 0 597.333333 340.053333v76.373334l105.813334 105.813333c0.426667-3.413333 0.853333-6.826667 0.853333-10.24z" p-id="6264"></path></svg>
                <svg v-else t="1655365307592" class="player-controls-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6667" width="24" height="24"><path fill="#ffffff" d="m141.04361,426.66667l0,170.66666c0,23.46667 19.2,42.66667 42.66667,42.66667l128,0l140.37333,140.37333c26.88,26.88 72.96,7.68 72.96,-30.29333l0,-476.58667c0,-37.97333 -46.08,-57.17333 -72.96,-30.29333l-140.37333,140.8l-128,0c-23.46667,0 -42.66667,19.2 -42.66667,42.66667zm576,85.33333a192,192 0 0 0 -106.66667,-171.94667l0,343.46667c63.14667,-31.14667 106.66667,-96 106.66667,-171.52z"/><g stroke="null"><g stroke="null" transform="matrix(0.023577325882169053,0,0,0.023577325882169053,-2.5802111352677457,-0.4227954069756379) "><rect stroke="null" x="20565.485009" y="20471.25898" width="582" height="402" fill="none"/></g><g stroke="null" transform="matrix(1.0006136631769564,0,0,1.0006136631769564,-20566.151143688643,-20575.30244282175) "><path stroke="null" d="m20694.485009,21160.135034zm469.33333,-407.46666l0,8.53333c0,16.21333 10.66667,30.29333 25.6,36.26667c110.08,43.94666 187.73334,151.89333 187.73334,277.33333s-77.65334,233.38667 -187.73334,277.33333c-15.36,5.97334 -25.6,20.05334 -25.6,36.26667l0,8.53333c0,26.88 26.88,45.65334 51.62667,36.26667c144.64,-55.04 247.04,-194.56 247.04,-358.4s-102.4,-303.36 -247.04,-358.4c-24.74667,-9.81333 -51.62667,9.38667 -51.62667,36.26667z" fill-opacity="0.5" fill="#ffffff"/></g></g></svg>
              </div>
              <div class="volume-control">
                <div class="volume-control-wrap">
                  <div class="volume-text">{{ volumePercent }}</div>
                  <VolumeBar
                    class="volume-bar"
                    :current-volume="currentVolume"
                    @updateVolume="updateVolumeByClickBar"
                    width="4px"
                  ></VolumeBar>
                </div>
              </div>
            </div>
            <div v-if="pictureInPictureEnabled" class="player-controls-btn cursor-pointer" @click="togglePictureInPicture">
              <svg v-show="!isPictureInPicture" t="1655131432014" class="player-controls-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23193" width="24" height="24"><path d="M768 213.333333H256a85.333333 85.333333 0 0 0-85.333333 85.333334v426.666666a85.333333 85.333333 0 0 0 85.333333 85.333334h170.666667a42.666667 42.666667 0 1 1 0 85.333333H256a170.666667 170.666667 0 0 1-170.666667-170.666667V298.666667a170.666667 170.666667 0 0 1 170.666667-170.666667h512a170.666667 170.666667 0 0 1 170.666667 170.666667v128a42.666667 42.666667 0 1 1-85.333334 0V298.666667a85.333333 85.333333 0 0 0-85.333333-85.333334z m-128 341.333334a128 128 0 0 0-128 128v85.333333a128 128 0 0 0 128 128h170.666667a128 128 0 0 0 128-128v-85.333333a128 128 0 0 0-128-128h-170.666667z" p-id="23194" data-spm-anchor-id="a313x.7781069.0.i55" class="" fill="#ffffff"></path></svg>
              <svg v-show="isPictureInPicture" t="1655188154787" class="player-controls-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1999" width="24" height="24"><path d="m768,213.33333l-512,0a85.33333,85.33333 0 0 0 -85.33333,85.33334l0,426.66666a85.33333,85.33333 0 0 0 85.33333,85.33334l170.66667,0a42.66667,42.66667 0 1 1 0,85.33333l-170.66667,0a170.66667,170.66667 0 0 1 -170.66667,-170.66667l0,-426.66666a170.66667,170.66667 0 0 1 170.66667,-170.66667l512,0a170.66667,170.66667 0 0 1 170.66667,170.66667l0,128a42.66667,42.66667 0 1 1 -85.33334,0l0,-128a85.33333,85.33333 0 0 0 -85.33333,-85.33334zm-128,341.33334a128,128 0 0 0 -128,128l0,85.33333a128,128 0 0 0 128,128l170.66667,0a128,128 0 0 0 128,-128l0,-85.33333a128,128 0 0 0 -128,-128l-170.66667,0z"/><g stroke="null"><g stroke="null" transform="matrix(0.6896517266997474,0,0,0.6896517266997474,-10241.200782450309,-10001.206060939305) "><rect stroke="null" x="15122.523407" y="14826.656681" width="582" height="402" fill="none"/></g><g stroke="null" transform="matrix(0.6896517266997474,0,0,0.6896517266997474,-10241.200782450309,-10001.206060939305) "><path stroke="null" d="m15503.523407,14924.856681l-161.8,0c-66.2,0 -120,53.8 -120,120l0,161.8c0,22.1 17.9,40 40,40s40,-17.9 40,-40l0,-144.4l169.8,169.8c7.8,7.8 18,11.7 28.3,11.7c10.2,0 20.5,-3.9 28.3,-11.7c15.6,-15.6 15.6,-40.9 0,-56.6l-170.7,-170.6l146.1,0c22.1,0 40,-17.9 40,-40s-17.9,-40 -40,-40z"/></g></g></svg>
              <div
                class="player-controls-btn-hint"
              >{{isPictureInPicture ? '关闭画中画' : '开启画中画'}}</div>
            </div>
            <div class="player-controls-btn cursor-pointer" @click="togglePageFullscreen">
              <svg
                v-show="!isPageFullscreen"
                class="player-controls-icon"
                t="1596553111831"
                viewBox="-113 -113 1250 1250"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="10800"
                width="24"
                height="24"
              >
                <path
                  d="M0 232.732444A232.732444 232.732444 0 0 1 232.732444 0h558.535112A232.732444 232.732444 0 0 1 1024 232.732444v558.535112A232.732444 232.732444 0 0 1 791.267556 1024H232.732444A232.732444 232.732444 0 0 1 0 791.267556V232.732444z m232.732444-139.662222a139.662222 139.662222 0 0 0-139.662222 139.662222v558.535112a139.662222 139.662222 0 0 0 139.662222 139.662222h558.535112a139.662222 139.662222 0 0 0 139.662222-139.662222V232.732444a139.662222 139.662222 0 0 0-139.662222-139.662222H232.732444z"
                  p-id="10801"
                  fill="#ffffff"
                />
                <path
                  d="M549.575111 245.845333c0-25.799111 20.935111-46.734222 46.734222-46.734222h116.821334A140.202667 140.202667 0 0 1 853.333333 339.313778v116.821333a46.734222 46.734222 0 0 1-93.468444 0v-116.821333c0-25.827556-20.906667-46.734222-46.734222-46.734222h-116.821334a46.734222 46.734222 0 0 1-46.734222-46.734223zM245.845333 549.546667c25.799111 0 46.734222 20.935111 46.734223 46.734222v116.821333c0 25.827556 20.906667 46.734222 46.734222 46.734222h116.821333a46.734222 46.734222 0 0 1 0 93.468445h-116.821333A140.202667 140.202667 0 0 1 199.111111 713.130667v-116.821334c0-25.799111 20.935111-46.734222 46.734222-46.734222z"
                  p-id="10802"
                  fill="#ffffff"
                />
              </svg>
              <svg
                v-show="isPageFullscreen"
                t="1596958879235"
                class="player-controls-icon"
                viewBox="-113 -113 1250 1250"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2734"
                width="24"
                height="24"
              >
                <path
                  d="M0.739556 233.130667a232.391111 232.391111 0 0 1 232.391111-232.391111h557.738666a232.391111 232.391111 0 0 1 232.391111 232.391111v557.738666a232.391111 232.391111 0 0 1-232.391111 232.391111H233.130667a232.391111 232.391111 0 0 1-232.391111-232.391111V233.130667z m232.391111-139.434667a139.434667 139.434667 0 0 0-139.434667 139.434667v557.738666a139.434667 139.434667 0 0 0 139.434667 139.434667h557.738666a139.434667 139.434667 0 0 0 139.434667-139.434667V233.130667a139.434667 139.434667 0 0 0-139.434667-139.434667H233.130667z"
                  p-id="2735"
                  fill="#ffffff"
                />
                <path
                  d="M601.088 186.652444c25.685333 0 46.506667 20.792889 46.506667 46.478223v96.796444c0 25.685333 20.792889 46.478222 46.478222 46.478222h96.796444a46.478222 46.478222 0 1 1 0 92.984889h-96.796444a139.434667 139.434667 0 0 1-139.463111-139.463111V233.130667c0-25.685333 20.821333-46.478222 46.478222-46.478223z m-414.435556 414.435556c0-25.656889 20.792889-46.478222 46.478223-46.478222h96.796444a139.434667 139.434667 0 0 1 139.463111 139.463111v96.796444a46.478222 46.478222 0 0 1-92.984889 0v-96.796444c0-25.685333-20.792889-46.478222-46.478222-46.478222H233.130667a46.478222 46.478222 0 0 1-46.478223-46.506667z"
                  p-id="2736"
                  fill="#ffffff"
                />
              </svg>
              <div
                class="player-controls-btn-hint"
              >{{isPageFullscreen ? '退出网页全屏' : '网页全屏'}}</div>
            </div>
            <div class="player-controls-btn cursor-pointer" @click="toggleFullScreen">
              <svg t="1655114887825" v-show="!isFullscreen" class="player-controls-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18260" width="24" height="24"><path id="svg_1" d="m380,97.2l-161.8,0c-66.2,0 -120,53.8 -120,120l0,161.8c0,22.1 17.9,40 40,40s40,-17.9 40,-40l0,-144.4c-0.01199,-30.72452 26.01714,-57.53697 55.7,-57.4l146.1,0c22.1,0 40,-17.9 40,-40s-17.9,-40 -40,-40zm505.8,507.8c-22.1,0 -40,17.9 -40,40c0,48.13333 -0.03176,111.59892 0,144.4c0.03176,32.80108 -23.05908,57.404 -54.96651,57.5l-146.83349,0c-22.1,0 -40,17.9 -40,40s17.9,40 40,40l161.9,0c66.2,0 120,-53.8 120,-120l0,-161.9c-0.1,-22.1 -18,-40 -40.1,-40zm-506.8,240.8l-144.4,0l169.8,-169.8c15.6,-15.6 15.6,-40.9 0,-56.6c-15.6,-15.6 -40.9,-15.6 -56.6,0l-170.6,170.7l0,-146.1c0,-22.1 -17.9,-40 -40,-40s-40,17.9 -40,40l0,161.9c0,66.2 53.8,120 120,120l161.8,0c22.1,0 40,-17.9 40,-40s-17.9,-40.1 -40,-40.1zm427.8,-747.6l-161.8,0c-22.1,0 -40,17.9 -40,40s17.9,40 40,40l144.4,0l-169.8,169.8c-15.6,15.6 -15.6,40.9 0,56.6c7.8,7.8 18,11.7 28.3,11.7c10.2,0 20.5,-3.9 28.3,-11.7l170.7,-170.7l0,146.1c0,22.1 17.9,40 40,40s40,-17.9 40,-40l0,-161.8c-0.1,-66.2 -53.9,-120 -120.1,-120z"/></svg>
              <svg t="1655114887825" v-show="isFullscreen" class="player-controls-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18260" width="24" height="24">
                <g>
                  <rect x="-1" y="-1" width="1026" height="1026" fill="none"/>
                </g>
                <g>
                  <path d="m380,97.2l-161.8,0c-66.2,0 -120,53.8 -120,120l0,161.8c0,22.1 17.9,40 40,40s40,-17.9 40,-40l0,-144.4c-0.01199,-30.72452 26.01714,-57.53697 55.7,-57.4l146.1,0c22.1,0 40,-17.9 40,-40s-17.9,-40 -40,-40zm505.8,507.8c-22.1,0 -40,17.9 -40,40c0,48.13333 -0.03176,111.59892 0,144.4c0.03176,32.80108 -23.05908,57.404 -54.96651,57.5l-146.83349,0c-22.1,0 -40,17.9 -40,40s17.9,40 40,40l161.9,0c66.2,0 120,-53.8 120,-120l0,-161.9c-0.1,-22.1 -18,-40 -40.1,-40z"/>
                  <g stroke="null">
                  <g stroke="null" transform="matrix(0.9957858808448392,0,0,0.9957858808448392,-3349.1231593465923,-3349.1463172975646) ">
                    <rect stroke="null" x="2857.812198" y="3872.903436" width="1026" height="1026" fill="none"/>
                  </g>
                  <g stroke="null" transform="matrix(0.9957858808448392,0,0,0.9957858808448392,-3349.1231593465923,-3349.1463172975646) ">
                    <path stroke="null" d="m3077.012198,3971.103436zm588.6,1l-161.8,0c-22.1,0 -40,17.9 -40,40s17.9,40 40,40l144.4,0l-169.8,169.8c-15.6,15.6 -15.6,40.9 0,56.6c7.8,7.8 18,11.7 28.3,11.7c10.2,0 20.5,-3.9 28.3,-11.7l170.7,-170.7l0,146.1c0,22.1 17.9,40 40,40s40,-17.9 40,-40l0,-161.8c-0.1,-66.2 -53.9,-120 -120.1,-120z"/>
                    <path stroke="null" d="m3077.012198,3971.103436zm588.6,1l-161.8,0c-22.1,0 -40,17.9 -40,40s17.9,40 40,40l144.4,0l-169.8,169.8c-15.6,15.6 -15.6,40.9 0,56.6c7.8,7.8 18,11.7 28.3,11.7c10.2,0 20.5,-3.9 28.3,-11.7l170.7,-170.7l0,146.1c0,22.1 17.9,40 40,40s40,-17.9 40,-40l0,-161.8c-0.1,-66.2 -53.9,-120 -120.1,-120z"/>
                  </g>
                  </g>
                  <g stroke="null">
                  <g stroke="null" transform="matrix(0.9926195208669554,0,0,0.9926195208669554,-15173.84311031432,-15173.842709950044) ">
                    <rect stroke="null" x="15798.520739" y="14779.091967" width="1026" height="1026" fill="none"/>
                  </g>
                  <g stroke="null" transform="matrix(0.9926195208669554,0,0,0.9926195208669554,-15173.84311031432,-15173.842709950044) ">
                    <path stroke="null" d="m16017.720739,14877.291967zm160.8,748.6l-144.4,0l169.8,-169.8c15.6,-15.6 15.6,-40.9 0,-56.6c-15.6,-15.6 -40.9,-15.6 -56.6,0l-170.6,170.7l0,-146.1c0,-22.1 -17.9,-40 -40,-40s-40,17.9 -40,40l0,161.9c0,66.2 53.8,120 120,120l161.8,0c22.1,0 40,-17.9 40,-40s-17.9,-40.1 -40,-40.1z"/>
                  </g>
                  </g>
                </g>
              </svg><div
                class="player-controls-btn-hint btn-fullscreen-hint"
              >{{isFullscreen ? '退出全屏' : '进入全屏'}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VolumeBar from "./volume-bar.vue";
import ProgressBar from "./progress-bar.vue";
import PlayerBarrageScreen from "./player-barrage-screen.vue";

export default {
  name: "barrage-videoplayer",
  components: { VolumeBar, ProgressBar, PlayerBarrageScreen },
  props: {
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "100%",
    },
    // 倍速列表
    speedList: {
      type: Array,
      default: function () {
        return ["2.0", "1.5", "1.25", "1.0", "0.75", "0.5"];
      },
    },
    // 视频链接
    src: {
      type: String,
      default: null,
    },
    // 主题色
    primaryColor: {
      type: String,
      default: "cornflowerblue",
    },
    // 封面图的链接
    cover: {
      type: String,
      default: null,
    },
    // 弹幕的链接地址（XML文件格式，B站风格）
    biBarrageXml: {
      type: String,
      default: null,
    }
  },
  computed: {
    // 当前音量的百分比显示值
    volumePercent() {
      if (this.currentVolume < 0.005) return Math.ceil(this.currentVolume * 100);
      else return Math.round(this.currentVolume * 100);
    },
  },
  data() {
    return {
      videoDom: null, //视频dom
      duration: 0, // 视频全长
      buffered: null, // 缓冲(TimeRanges)
      isShowCover: true, // 是否显示封面
      isShowBarrage: true, // 是否显示弹幕
      isFullscreen: false, // 是否处于全屏模式
      isPageFullscreen: false, // 是否处于网页全屏模式
      isPictureInPicture: false, // 是否处于画中画模式
      pictureInPictureEnabled: false, // 浏览器是否支持画中画模式
      isCursorStatic: false, // 鼠标是否长时间静止不动
      isDraggingProgressBar: false, // 是否处于拖动进度条的过程中
      isPlaying: false, // 是否正在播放
      isShowLoading: false, // 是否显示加载框
      isShowVolumeHint: false, // 是否显示音量提示条（键盘触发）
      volumeHintTimeout: 0, // 音量提示条多久ms后隐藏
      controlsHintTimeout: 0, // 控制面板多久ms后隐藏
      currentSpeed: 1.0, // 当前倍速
      currentVolume: 1, // 当前音量（0-1），同时作用于当前音量条的长度；currentVolumeCache为该值的缓存
      currentTime: 0, // 当前播放进度，仅作用于进度条UI，变更该项并不会作用于video.currentTime
      currentTimeLabel: "00:00", // 当前播放进度的文字
      fullTimeLabel: "00:00", // 视频总长度的文字
      barrageTimelineStart: 0, // 弹幕时间轴的起始时间点（手动调整进度条触发更新）
      listeners: [], // 事件监听列表，列表项格式：{eventName: String, element: ELement, method: Function}
      intervals: [], // 定时器列表，列表项格式：Function
    };
  },
  created() {},
  mounted() {
    this.videoDom = this.$refs.video;
    this.videoDom.focus({preventScroll: true});
    this.pictureInPictureEnabled = document.pictureInPictureEnabled && !this.videoDom.disablePictureInPicture;
    let interval = function() {
      // 定时更新进度条
      if (this.isPlaying && !this.isDraggingProgressBar) {
        this.currentTime = this.videoDom.currentTime;
      }
      // 定时更新进度的文字显示
      this.updateProgressText();
      // 音量提示面板的定时隐藏
      if (this.volumeHintTimeout == null) {
        // 当定时为null，直接跳过
      } else if (this.volumeHintTimeout === 0) {
        this.isShowVolumeHint = false;
        this.isCursorStatic = false;
        this.volumeHintTimeout = null;
      } else if (this.volumeHintTimeout > 0) {
        this.volumeHintTimeout -= 1000;
      } else {
        this.volumeHintTimeout = 0;
      }
      // 总控制面板的定时隐藏
      if (
        this.controlsHintTimeout == null ||
        this.currentTime === 0 ||
        this.currentTime === this.duration
      ) {
        // 当定时为null、视频还未播放或播放完毕的时候，直接跳过
      } else if (this.controlsHintTimeout === 0) {
        this.isCursorStatic = true;
        this.controlsHintTimeout = null;
      } else if (this.controlsHintTimeout > 0) {
        this.controlsHintTimeout -= 1000;
      } else {
        this.controlsHintTimeout = 0;
      }
      // 根据视频的readyState判断下一帧是否已加载，并控制loading的显示
      this.isShowLoading = this.videoDom.readyState < 3;
    }.bind(this);
    this.intervals.push(interval);
    setInterval(interval, 1000);
    let mouseMove = {
      eventName: "mousemove",
      element: this.videoDom,
      method: function() {
        this.isCursorStatic = false;
        this.controlsHintTimeout = 2000;
      }.bind(this),
    } // 视频dom监听器，用于控制鼠标的显示
    let fullscreenchange = {
      eventName: "fullscreenchange",
      element: window,
      method: function() {
        this.isFullscreen = this.checkIsFullScreen();
      }.bind(this),
    } // 监听全屏事件的变化，保存数据
    let pic = {
      eventName: "leavepictureinpicture",
      element: this.videoDom,
      method: function() {
        this.isPictureInPicture = false;
      }.bind(this),
    } // 画中画监听
    let onprogress = {
      eventName: "progress",
      element: this.videoDom,
      method: function() {
        this.buffered = this.videoDom.buffered;
      }.bind(this),
    } // 视频加载下载过程中触发
    let onDurationchange = {
      eventName: "durationchange",
      element: this.videoDom,
      method: function(e) {
        this.duration = e.target.duration;
      }.bind(this),
    } // 视频音频时长发生变化时触发
    this.listeners.push(mouseMove);
    this.listeners.push(fullscreenchange);
    this.listeners.push(pic);
    this.listeners.push(onprogress);
    this.listeners.push(onDurationchange);
    this.videoDom.addEventListener("mousemove", mouseMove.method, false);
    window.addEventListener("fullscreenchange", fullscreenchange.method, false);
    this.videoDom.addEventListener("leavepictureinpicture", pic.method, false);
    this.videoDom.addEventListener("progress", onprogress.method, false);
    this.videoDom.addEventListener("durationchange", onDurationchange.method, false);
  },
  beforeDestroy() {
    // 销毁事件监听器
    for (const index in this.listeners) {
      const item = this.listeners[index];
      item.element.removeEventListener(item.eventName, item.method);
    }
    // 销毁定时器
    for (const index in this.intervals) {
      clearInterval(this.intervals[index])
    }
  },
  methods: {
    /* 切换播放状态
     */
    togglePlayStatus() {
      if (this.videoDom.paused) {
        this.videoDom.play();
        this.isPlaying = true;
      } else {
        this.videoDom.pause();
        this.isPlaying = false;
      }
      this.isShowCover = false;
    },
    /* 更新视频进度的文字显示
     */
    updateProgressText() {
      this.currentTimeLabel = this.secondTimeFormat(this.videoDom.currentTime);
      this.fullTimeLabel = this.secondTimeFormat(this.videoDom.duration);
    },
    /* 时间格式化，秒格式化成xx:xx:xx
     */
    secondTimeFormat(second) {
      const result = parseInt(second);
      const h =
        Math.floor(result / 3600) < 10
          ? "0" + Math.floor(result / 3600)
          : Math.floor(result / 3600);
      const m =
        Math.floor((result / 60) % 60) < 10
          ? "0" + Math.floor((result / 60) % 60)
          : Math.floor((result / 60) % 60);
      const s =
        Math.floor(result % 60) < 10
          ? "0" + Math.floor(result % 60)
          : Math.floor(result % 60);
      if(h == '00')
        return `${m}:${s}`;
      else
        return `${h}:${m}:${s}`;
    },
    // 更新视频的当前播放时间，同时更新其他依赖
    updateVideoCurrentTime(newCurrentTime) {
      this.videoDom.currentTime = newCurrentTime;
      this.barrageTimelineStart = newCurrentTime;
      this.currentTime = newCurrentTime;
      this.updateProgressText();
    },
    /* 前进视频播放进度
     */
    forwardCurrentTime() {
      this.updateVideoCurrentTime(this.videoDom.currentTime + 5);
    },
    /* 后退视频播放进度
     */
    backwardCurrentTime() {
      this.updateVideoCurrentTime(this.videoDom.currentTime - 5);
    },
    /* 拖动进度条
     */
    onDraggingProgress(value) {
      this.currentTime = value;
      this.isDraggingProgressBar = true;
    },
    /* 松开/释放拖动的进度条
     */
    onReleasedProgress(value) {
      this.updateVideoCurrentTime(value);
      this.isDraggingProgressBar = false;
    },
    /* 提高视频音量
     */
    increaseVolume() {
      this.isShowVolumeHint = true;
      this.volumeHintTimeout = 2000;
      const nowVolume = this.videoDom.volume;
      if (nowVolume >= 0.9) {
        this.videoDom.volume = 1;
        this.currentVolume = 1;
      } else {
        const newVolume = this.videoDom.volume + 0.1;
        this.videoDom.volume = newVolume;
        this.currentVolume = newVolume;
      }
    },
    /* 降低视频音量
     */
    lowerVolume() {
      this.isShowVolumeHint = true;
      this.volumeHintTimeout = 2000;
      const nowVolume = this.videoDom.volume;
      if (nowVolume <= 0.1) {
        this.videoDom.volume = 0;
        this.currentVolume = 0;
      } else {
        const newVolume = this.videoDom.volume - 0.1;
        this.videoDom.volume = newVolume;
        this.currentVolume = newVolume;
      }
    },
    /*  视频倍速播放
     */
    changeSpeed(e) {
      // 获取选择的倍速
      const value = e.currentTarget.dataset.value;
      // 应用视频倍速
      this.videoDom.playbackRate = value;
      // 标记变更后的倍速，用于显示文字
      this.currentSpeed = Number(value);
    },
    /* 点击音量条后更新音量（value范围：0-1）
     */
    updateVolumeByClickBar(value) {
      if (this.videoDom.muted && value) {
        this.videoDom.muted = false;
      }
      this.videoDom.volume = value;
      this.currentVolume = value;
    },
    /**
     * 切换弹幕显示状态
     */
    toggleShowBarrage() {
      this.isShowBarrage = !this.isShowBarrage;
    },
    /**
     * 切换静音模式
     */
    toggleMute() {
      if (this.videoDom.muted) {
        this.videoDom.muted = false;
        this.updateVolumeByClickBar(this.currentVolumeCache ?? 0.1);
      } else if(this.videoDom.volume == 0) {
        this.updateVolumeByClickBar(0.1);
      }else {
        this.videoDom.muted = true;
        this.currentVolumeCache = this.currentVolume;
        this.updateVolumeByClickBar(0);
      }
    },
    /**
     * 切换画中画模式
     */
    togglePictureInPicture() {
      try {
        const flag = !document.pictureInPictureElement;
        flag ? this.videoDom.requestPictureInPicture() : document.exitPictureInPicture();
        this.isPictureInPicture = flag;
      } catch (error) {
        console.error(error);
      }
    },
    /* 切换全屏模式
     */
    toggleFullScreen() {
      const element = this.$refs.area;
      if (!this.checkIsFullScreen()) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if(element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        } else if (element.oRequestFullscreen) {
          element.oRequestFullscreen();
        }
        this.isFullscreen = true;
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.oRequestFullscreen) {
          document.oCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
        this.isFullscreen = false;
      }
      this.isPageFullscreen = false;
    },
    /**
     * 切换网页全屏
     */
    togglePageFullscreen() {
      if (this.checkIsFullScreen()) {
        this.toggleFullScreen();
      }
      this.isPageFullscreen = !this.isPageFullscreen;
    },
    /* 判断是否进入了全屏模式
     */
    checkIsFullScreen () {
      return !!(
        document.fullscreen ||
        document.mozFullScreen ||
        document.webkitIsFullScreen ||
        document.webkitFullScreen ||
        document.msFullScreen
      );
    },
  },
  watch: {
    currentTime: function () {
      // 进度条到终点时修改播放状态
      if (this.currentTime === this.duration) {
        this.isPlaying = false;
      }
    },
    src: function () {
      // 当视频地址变更时，重载视频
      this.videoDom.load();
    },
  },
};
</script>

<style scoped>
.player-area {
  position: relative;
  display: inline-block;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.player-full-flxed {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #000;
  z-index: 1003;
}
.cursor-pointer {
  cursor: pointer;
}
.cursor-lasting-static .cursor-pointer {
  cursor: none;
}
.cursor-lasting-static.player-controls {
  visibility: hidden;
  opacity: 0;
}
.player-video {
  outline: none;
  vertical-align: middle;
  object-fit: contain;
}
.player-cover {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  background: #000;
  pointer-events: none;
}
.player-cover > img{
  object-fit: contain;
}
.player-loading {
  position: absolute;
  top: 50%;
  bottom: 50%;
  left: 50%;
  right: 50%;
  width: 80px;
  height: 80px;
  transform: translate(-50%, -50%);
}
.player-loading img {
  fill: #fff;
  width: inherit;
  height: inherit;
}
.player-paused-state {
  position: absolute;
  pointer-events: none;
  top: 0;
  right: 2%;
  transform: translate(0, -100%);
  border-radius: 8px;
  box-shadow: 1px 1px 5px rgba(34, 34, 34, 0.5);
  background: rgba(255, 255, 255, 0.6);
}
.player-paused-state > svg {
  margin: 0.4rem 1rem;
}
.player-controls-container {
  position: absolute;
  bottom: 0;
  width: 100%;
}
.player-volumeHint {
  position: absolute;
  top: 0;
  left: 12px;
  pointer-events: none;
  transform: translate(0, -100%);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.8);
}
.player-volumeHint-text {
  position: relative;
  display: inline-block;
  padding: 0.4rem 0.6rem;
  color: #fff;
  font-size: 1rem;
}
.player-controls {
  padding-top: 12px;
  visibility: visible;
  opacity: 1;
  position: relative;
  display: block;
  transition: visibility 0.3s, opacity 0.3s;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
}
.player-controls-container:hover .player-controls {
  visibility: visible;
  opacity: 1;
}
.player-controls-container:hover .cursor-pointer {
  cursor: pointer;
}
.player-controls-bottom {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.player-controls-bottom-left {
  display: inline-flex;
  align-items: center;
}
.player-controls-bottom-right {
  display: inline-flex;
  padding: 0.6rem 0.5rem;
  align-items: center;
}
.player-full-flxed .player-controls-bottom > .player-controls-bottom-right {
  padding: 1rem 0.5rem;
}
.player-controls-btn {
  position: relative;
  display: inline-block;
  color: #e5e5e5;
  padding: 0 0.5rem;
  transition: color 0.3s;
}
.player-controls-bottom-left > .player-controls-btn {
  margin: 0 0.25rem;
}
.player-controls-btn .player-controls-icon {
  height: 1.5rem;
  display: block;
  transition: height 0.3s;
}
.player-controls-btn svg path {
  fill: #e5e5e5;
  transition: fill 0.2s;
}
.player-controls-btn:hover svg > path {
  fill: #ffffff;
}
.player-controls-btn:hover {
  color: #fff;
}
.player-controls-btn:hover .player-controls-btn-hint {
  visibility: visible;
  opacity: 1;
}
.player-controls-btn-hint {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 50%;
  white-space: nowrap;
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  background: rgba(21, 21, 21, 0.8);
  transition: opacity 0.3s, visibility 0s;
  transform: translate(-50%, -200%);
}
.btn-fullscreen-hint {
  margin-left: -1rem;
}
.time-label {
  display: inline-block;
  color: #e5e5e5;
}
.time-label .fulltime{
  color: #fff;
  opacity: 0.45;
}
.btn-speed:hover .speed-control {
  visibility: visible;
}
.speed-control {
  visibility: hidden;
  position: absolute;
  top: 0;
  left: 50%;
  padding-bottom: 24px;
  transition: visibility 0.3s;
  transform: translate(-50%, -100%);
}
.speed-control .speed-control-list {
  list-style: none;
  color: #e5e5e5;
  width: 80px;
  padding: 0;
  margin: 0;
  overflow: hidden;
  border-radius: 4px;
  background: rgba(21, 21, 21, 0.8);
}
.speed-control .speed-control-list li {
  position: relative;
  display: block;
  height: 35px;
  line-height: 35px;
}
.speed-control .speed-control-list li:hover {
  color: #fff;
  background: rgba(99, 99, 99, 0.8);
}
.speed-control .speed-control-list li.current {
  color: var(--primaryColor);
}
.btn-volume:hover .volume-control {
  visibility: visible;
}
.volume-control {
  visibility: hidden;
  position: absolute;
  top: 0;
  left: 50%;
  padding: 24px 10px;
  transition: visibility 0.3s;
  transform: translate(-50%, -100%);
}
.volume-control .volume-bar {
  flex: 1;
}
.volume-control-wrap {
  display: flex;
  text-align: center;
  flex-direction: column;
  margin: auto;
  width: 45px;
  height: 120px;
  padding: 0.6rem 0 1rem;
  background: rgba(21, 21, 21, 0.8);
  border-radius: 4px;
}
.volume-text {
  color: #fff;
  margin-bottom: 0.5rem;
}
@media (min-width: 1000px) {
  .player-loading {
    width: 100px;
    height: 100px;
  }
}
</style>