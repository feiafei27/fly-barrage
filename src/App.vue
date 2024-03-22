<!-- 基于弹幕库的上层应用 -->
<template>
  <div class="main">
    <div class="player">
      <!-- 播放器以及 Canvas -->
      <div id="container">
        <video
          ref="video"
          id="video"
          controls
          autoplay
          :src="videoSrc"
          :volume="0.05"
          @play="videoPlay"
          @pause="videoPause"
          @ended="changeNextVideo"
        />
      </div>
      <!-- 弹幕控制部分 -->
      <div class="barrage-container">
        <div class="controls">
          <!-- 弹幕开关 -->
          <el-switch
            v-model="barrageOpen"
            class="barrage-switch"
            @change="barrageOpenChange"
          />
          <!-- 弹幕渲染配置 -->
          <el-popover
            placement="top"
            :width="320"
            :show-arrow="false"
            :offset="10"
            popper-class="barrage-setting"
            trigger="hover"
          >
            <div class="barrage-setting-inner">
              <div class="setting-type">按类型屏蔽</div>
              <div class="barrage-render-list">
                <el-checkbox
                  v-for="item in barrageRenderList"
                  v-model="item.value"
                  :label="item.label"
                  :key="item.key"
                  size="large"
                  @change="renderFrame"
                />
              </div>
              <div class="setting-type">智能云屏蔽</div>
              <el-slider
                v-model="shieldGrade"
                :step="1"
                :min="1"
                :max="10"
                show-stops
                show-input
                size="small"
                @change="renderFrame"
              />
              <el-button
                type="primary"
                size="small"
                style="margin-top: 10px;"
                @click="isOpenDrawer = true"
              >添加屏蔽词
              </el-button>
              <div class="setting-type" style="margin-top: 10px;">不透明度</div>
              <el-slider v-model="opacity" @change="opacityChange" :min="0" :max="100" size="small"/>
              <div class="setting-type">显示区域</div>
              <el-radio-group
                v-model="currentRenderRegions"
                size="small"
                style="margin-top: 10px;"
                @change="renderRegionsChange"
              >
                <el-radio-button
                  v-for="item in renderRegions"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio-button>
              </el-radio-group>
              <div class="setting-type" style="margin-top: 10px;">弹幕速度（像素/每秒）</div>
              <el-radio-group
                v-model="currentSpeed"
                size="small"
                style="margin-top: 10px;"
                @change="speedChange"
              >
                <el-radio-button
                  v-for="item in speeds"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio-button>
              </el-radio-group>
              <div class="setting-type" style="margin-top: 10px;">弹幕禁止重叠</div>
              <el-switch
                v-model="avoidOverlap"
                class="barrage-switch"
                @change="avoidOverlapChange"
              />
            </div>
            <template #reference>
              <el-icon :size="25" style="cursor: pointer;">
                <Setting/>
              </el-icon>
            </template>
          </el-popover>
          <!-- 弹幕发送 -->
          <el-input
            v-model="barrageText"
            placeholder="ヾ(*´▽‘*)ﾉ 发个弹幕呗 ！！"
            size="small"
            style="margin-left: 10px;"
            @keyup.enter="sendBarrage"
          >
            <template #prepend>
              <el-popover
                placement="top"
                :width="250"
                :show-arrow="false"
                :offset="7"
                popper-class="barrage-setting"
                trigger="hover"
              >
                <div class="barrage-setting-inner">
                  <div class="setting-type">字号</div>
                  <el-radio-group
                    v-model="currentFontsize"
                    size="small"
                    class="mg-10"
                  >
                    <el-radio-button
                      v-for="item in fontSizes"
                      :label="item.value"
                    >
                      {{ item.label }}
                    </el-radio-button>
                  </el-radio-group>
                  <div class="setting-type">模式</div>
                  <el-radio-group
                    v-model="currentBarrageMode"
                    size="small"
                    class="mg-10"
                  >
                    <el-radio-button
                      v-for="item in barrageModes"
                      :label="item.value"
                    >
                      {{ item.label }}
                    </el-radio-button>
                  </el-radio-group>
                  <div class="setting-type">颜色</div>
                  <div class="colors mg-10">
                    <div
                      v-for="color in barrageColors"
                      :key="color"
                      :class="['color-item', { 'color-active': color === currentBarrageColor }]"
                      :style="`background:${color}`"
                      @click="currentBarrageColor = color"
                    ></div>
                  </div>
                </div>
                <template #reference>
                  <el-button class="flex-center">
                    <el-icon :size="20">
                      <HotWater/>
                    </el-icon>
                  </el-button>
                </template>
              </el-popover>
            </template>
            <template #suffix>
              <el-popover
                placement="top"
                :width="365"
                :show-arrow="false"
                :offset="13"
                popper-class="barrage-setting"
                trigger="hover"
              >
                <div class="image-select">
                  <el-radio-group
                    v-model="currentGroupId"
                    size="small"
                    style="margin-bottom: 10px;"
                  >
                    <el-radio-button
                      v-for="group in imageGroupsRef"
                      :label="group.id"
                    >
                      {{ group.label }}
                    </el-radio-button>
                  </el-radio-group>
                  <el-scrollbar height="370px">
                    <img
                      v-for="img in currentGroup.images"
                      :id="img.id"
                      :src="img.url"
                      class="barrage-img"
                      :style="`width: ${img.width}px;height: ${img.height}px;`"
                      @click="barrageImgClick(img)"
                    />
                  </el-scrollbar>
                </div>
                <template #reference>
                  <el-icon
                    :size="20"
                    style="cursor: pointer;"
                  >
                    <PictureFilled/>
                  </el-icon>
                </template>
              </el-popover>
            </template>
            <template #append>
              <el-button-group>
                <el-button @click="sendBarrage">发送</el-button>
                <el-button @click="sendBlessingBarrage">发祝福</el-button>
                <el-popover
                  placement="top"
                  :width="250"
                  :show-arrow="false"
                  :offset="7"
                  popper-class="barrage-setting"
                  trigger="hover"
                >
                  <div class="senior-barrage-config">
                    <div class="header">
                      <div class="title">高级弹幕配置</div>
                    </div>
                    <div class="content">
	                    <div class="setting-type">起始点</div>
	                    <div class="setting-items">
		                    <div class="setting-item">
			                    <div class="label">x</div>
			                    <div class="right-setting">
				                    <el-input-number v-model="seniorBarrageConfig.startLocation.x" :precision="1" :step="0.1" size="small" />
			                    </div>
		                    </div>
		                    <div class="setting-item">
			                    <div class="label">y</div>
			                    <div class="right-setting">
				                    <el-input-number v-model="seniorBarrageConfig.startLocation.y" :precision="1" :step="0.1" size="small" />
			                    </div>
		                    </div>
		                    <div class="setting-item">
			                    <div class="label">类型</div>
			                    <div class="right-setting">
				                    <el-radio-group v-model="seniorBarrageConfig.startLocation.type">
					                    <el-radio label="PERCENT">百分比</el-radio>
					                    <el-radio label="PIXEL">像素</el-radio>
				                    </el-radio-group>
			                    </div>
		                    </div>
		                    <div class="setting-item">
			                    <div class="label">x 轴偏移</div>
			                    <div class="right-setting">
				                    <el-input-number v-model="seniorBarrageConfig.startLocation.offsetX" :step="1" size="small" />
			                    </div>
		                    </div>
		                    <div class="setting-item">
			                    <div class="label">y 轴偏移</div>
			                    <div class="right-setting">
				                    <el-input-number v-model="seniorBarrageConfig.startLocation.offsetY" :step="1" size="small" />
			                    </div>
		                    </div>
	                    </div>
	                    <div class="setting-type">结束点</div>
	                    <div class="setting-items">
		                    <div class="setting-item">
			                    <div class="label">x</div>
			                    <div class="right-setting">
				                    <el-input-number v-model="seniorBarrageConfig.endLocation.x" :precision="1" :step="0.1" size="small" />
			                    </div>
		                    </div>
		                    <div class="setting-item">
			                    <div class="label">y</div>
			                    <div class="right-setting">
				                    <el-input-number v-model="seniorBarrageConfig.endLocation.y" :precision="1" :step="0.1" size="small" />
			                    </div>
		                    </div>
		                    <div class="setting-item">
			                    <div class="label">类型</div>
			                    <div class="right-setting">
				                    <el-radio-group v-model="seniorBarrageConfig.endLocation.type">
					                    <el-radio label="PERCENT">百分比</el-radio>
					                    <el-radio label="PIXEL">像素</el-radio>
				                    </el-radio-group>
			                    </div>
		                    </div>
		                    <div class="setting-item">
			                    <div class="label">x 轴偏移</div>
			                    <div class="right-setting">
				                    <el-input-number v-model="seniorBarrageConfig.endLocation.offsetX" :step="1" size="small" />
			                    </div>
		                    </div>
		                    <div class="setting-item">
			                    <div class="label">y 轴偏移</div>
			                    <div class="right-setting">
				                    <el-input-number v-model="seniorBarrageConfig.endLocation.offsetY" :step="1" size="small" />
			                    </div>
		                    </div>
	                    </div>
	                    <div class="setting-type">生存时间（毫秒为单位）</div>
	                    <div class="setting-items">
		                    <el-input-number v-model="seniorBarrageConfig.totalDuration" size="small" />
	                    </div>
	                    <div class="setting-type">延迟时间（毫秒为单位）</div>
	                    <div class="setting-items">
		                    <el-input-number v-model="seniorBarrageConfig.delay" size="small" />
	                    </div>
	                    <div class="setting-type">运动时长（毫秒为单位）</div>
	                    <div class="setting-items">
		                    <el-input-number v-model="seniorBarrageConfig.motionDuration" size="small" />
	                    </div>
                    </div>
	                  <div class="footer">
		                  <el-button type="primary" @click="sendSeniorBarrage">发送</el-button>
	                  </div>
                  </div>
                  <template #reference>
                    <el-button>高级弹幕</el-button>
                  </template>
                </el-popover>
              </el-button-group>
            </template>
          </el-input>
          <!-- 视频切换 -->
          <el-select
            v-model="currentVideo"
            style="margin-left: 10px;"
          >
            <el-option
              v-for="item in videos"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
      </div>
    </div>
    <!-- 屏蔽词相关 -->
    <el-drawer
      v-model="isOpenDrawer"
      title="屏蔽词管理"
      :direction="'rtl'"
      modal-class="drawer-modal"
    >
      <el-tag
        v-for="tag in shieldWords"
        :key="tag"
        style="margin-right: 10px;"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)"
      >
        {{ tag }}
      </el-tag>
      <el-input
        v-if="shieldWordInputVisible"
        ref="InputRef"
        v-model="shieldWordInputValue"
        class="ml-1 w-20"
        size="small"
        @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm"
      />
      <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
        + New Word
      </el-button>
      <el-button size="small" @click="shieldWords = []">
        Clear All
      </el-button>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import BarrageRenderer, { BaseBarrage } from '../lib';
import { onMounted, ref, computed, watch } from 'vue';

import { barrageImages, ImageGroups, imageGroups, generateBarrageData } from './data';
import {
  useBarrageOpen, useDisable, useResize,
  useOpacity, useRenderRegion, useSpeed,
  useAvoidOverlap, useVideoChange, useSendBarrage,
  usePortraitUnobstructed,
} from './composables';

const barrageRenderer = ref<BarrageRenderer>();
const video = ref();

// 所有的 group
const imageGroupsRef = ref<ImageGroups[]>(imageGroups);
// 当前显示的 group id
const currentGroupId = ref(2);
// 当前应该显示的 group
const currentGroup = computed(() => imageGroupsRef.value.find(group => group.id === currentGroupId.value)!);

onMounted(() => {
  // 蒙版相关
  const {beforeFrameRender} = usePortraitUnobstructed(video, currentVideoItem);

  barrageRenderer.value = new BarrageRenderer({
    container: 'container',
    video: video.value,
    barrageImages,
    renderConfig: {
      heightReduce: 60,
	    speed: currentSpeed.value,
      renderRegion: currentRenderRegions.value,
      fontWeight: 'bold',
      opacity: opacity.value / 100,
      avoidOverlap: avoidOverlap.value,
      barrageFilter: (barrage: BaseBarrage) => {
        // 弹幕类型的过滤
        if (disableJudges.value.some(disableJudge => disableJudge(barrage))) return false;
        // 弹幕等级过滤
        if (barrage.addition?.grade < shieldGrade.value) return false;
        // 关键词过滤
        if (shieldWords.value.some(word => barrage.text.includes(word))) return false;
        // 其他情况，不过滤
        return true;
      }
    },
    devConfig: {
      isRenderFPS: true,
      isRenderBarrageBorder: false,
      isLogKeyData: true
    },
    beforeFrameRender,
  });

  generateBarrageDataSet();
});

// 和 video 结合
const videoPlay = () => {
  // console.log('app play');
  barrageRenderer.value?.play();
};
const videoPause = () => {
  // console.log('app pause');
  barrageRenderer.value?.pause();
};

// 是否打开弹幕
const {barrageOpen, barrageOpenChange} = useBarrageOpen(barrageRenderer);

// 屏蔽相关
const {
  barrageRenderList, disableJudges, shieldGrade, shieldWords,
  isOpenDrawer, handleClose, shieldWordInputVisible, shieldWordInputValue,
  handleInputConfirm, InputRef, showInput
} = useDisable();

// 触发一帧的渲染
const renderFrame = () => {
  barrageRenderer.value?.renderFrame();
};

watch(shieldWords, renderFrame, {
  deep: true
});

// 尺寸变化 Canvas 自适应
useResize(barrageRenderer);

// 弹幕透明度
const {opacity, opacityChange} = useOpacity(barrageRenderer);

// 显示区域
const {renderRegions, currentRenderRegions, renderRegionsChange} = useRenderRegion(barrageRenderer);

// 弹幕速度
const {speeds, currentSpeed, speedChange} = useSpeed(barrageRenderer);

// 弹幕是否遮挡
const {avoidOverlap, avoidOverlapChange} = useAvoidOverlap(barrageRenderer);

// 视频切换
const {videos, currentVideo, currentVideoItem, videoSrc, changeNextVideo} = useVideoChange();

// 获取新的弹幕并 set
const generateBarrageDataSet = () => {
  // 获取弹幕数据
  const barrages = generateBarrageData(currentVideo.value, {
    isFixed: true,
    isScroll: true,
    isSenior: true,
    isSpecial: true,

    fixedNum: 100,
    scrollNum: 600,
    seniorNum: 0,
    specialNum: 200,
  });

  barrageRenderer.value?.setBarrages(barrages);
}

watch(currentVideo, generateBarrageDataSet);

// 发送的弹幕（这里只处理发送滚动弹幕、顶部弹幕、底部弹幕）
const {
  barrageText, barrageImgClick, fontSizes,
  currentFontsize, barrageModes, currentBarrageMode,
  barrageColors, currentBarrageColor, sendBarrage,
  seniorBarrageConfig, sendSeniorBarrage, sendBlessingBarrage,
} = useSendBarrage(barrageRenderer, video);
</script>

<style scoped lang="less">
.main {
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #374B6A;

  .player {
    width: calc(100vw - 60px);
    height: calc(100vh - 60px);

    display: flex;
    flex-direction: column;

    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);

    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;

    #container {
      flex: 1;
      max-height: calc(100vh - 60px - 46px);
      overflow: hidden;

      #video {
        width: 100%;
        height: 100%;
        background-color: #000;
      }
    }

    .barrage-container {
      height: 46px;

      display: flex;
      justify-content: center;
      align-items: center;

      background-color: white;

      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;

      .controls {
        height: 32px;

        display: flex;
        justify-content: center;
        align-items: center;

        .barrage-switch {
          margin-right: 10px;
        }
      }
    }
  }
}

.senior-barrage-config {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
	  margin-bottom: 5px;
	  .title {
		  color: white;
	  }
  }
	.content {
		.setting-type {
			color: coral;
		}
		.setting-items {
			margin: 5px 0;
			.setting-item {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				margin-bottom: 5px;
				.label {
					color: white;
					width: 70px;
				}
				.right-setting {
					flex: 1;
				}
			}
		}
	}
	.footer {
		display: flex;
		justify-content: flex-end;
		margin-top: 10px;
		button {
			width: 100%;
		}
	}
}
</style>
<style lang="less">
.barrage-setting {
  background-color: hsla(0, 0%, 8%, .9) !important;
  border: none !important;
}

.setting-type {
	color: #fff;
	line-height: 16px;
}

.drawer-modal {
  background-color: rgba(0, 0, 0, 0) !important;
}

.flex-center {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

.barrage-img {
  cursor: pointer;
  margin: 4px;

  &:hover {
    border: 1px solid white;
    box-sizing: border-box;
  }
}

.mg-10 {
  margin-top: 10px;
  margin-bottom: 10px;
}

.colors {
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(7, 1fr);
  gap: 7px;

  .color-item {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .color-active {
    border: 1px solid white;
    box-sizing: border-box;
  }
}
</style>
