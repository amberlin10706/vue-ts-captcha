<script setup lang="ts">
import { computed, defineExpose, defineProps, onMounted, ref } from 'vue'
import type { PropType } from 'vue'

type CodeType = 'A' | 'a' | '0'

const props = defineProps({
  /**
   * 驗證碼長度
   */
  codeLength: {
    type: Number,
    default: 4
  },
  /**
   * A A~Z
   * a a~z
   * 0 0~9
   */
  codeType: {
    type: Array as PropType<Array<CodeType>>,
    default: () => ['A', 'a', '0']
  },
  /**
   * 容器寬度
   */
  contentWidth: {
    type: Number,
    default: 120
  },
  /**
   * 容器高度
   */
  contentHeight: {
    type: Number,
    default: 40
  },
  /**
   * 字型最小值
   */
  fontSizeMin: {
    type: Number,
    default: 24
  },
  /**
   * 字型最大值
   */
  fontSizeMax: {
    type: Number,
    default: 36
  },
  /**
   * 指定文字顏色
   */
  textColor: {
    type: String,
    default: null
  },
  /**
   * 文字顏色最小值
   */
  textColorMin: {
    type: Number,
    default: 50
  },
  /**
   * 文字顏色最大值
   */
  textColorMax: {
    type: Number,
    default: 160
  },
  /**
   * 文字旋轉最小值
   */
  textDegMin: {
    type: Number,
    default: -30
  },
  /**
   * 文字旋轉最大值
   */
  textDegMax: {
    type: Number,
    default: 30
  },
  /**
   * 指定圖片背景色
   */
  backgroundColor: {
    type: String,
    default: null
  },
  /**
   * 圖片背景色最小值
   */
  backgroundColorMin: {
    type: Number,
    default: 200
  },
  /**
   * 圖片背景色最大值
   */
  backgroundColorMax: {
    type: Number,
    default: 220
  },
  /**
   * 干擾點數量
   */
  dotCount: {
    type: Number,
    default: 20
  },
  /**
   * 干擾點顏色最小值
   */
  dotColorMin: {
    type: Number,
    default: 0
  },
  /**
   * 干擾點顏色最大值
   */
  dotColorMax: {
    type: Number,
    default: 255
  },
  /**
   * 干擾線數量
   */
  lineCount: {
    type: Number,
    default: 4
  },
  /**
   * 干擾線顏色最小值
   */
  lineColorMin: {
    type: Number,
    default: 40
  },
  /**
   * 干擾線顏色最大值
   */
  lineColorMax: {
    type: Number,
    default: 180
  },
  /**
   * 點擊是否重整
   */
  refreshable: {
    type: Boolean,
    default: true
  }
})

const codeTypeMap: Record<CodeType, string> = {
  A: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  a: 'abcdefghijklmnopqrstuvwxyz',
  0: '0123456789'
}

const verificationCode = ref('0000')

const codeRandomList = computed(() => {
  return props.codeType.map((it: CodeType) => codeTypeMap[it]).join('')
})

// 生成一個隨機整數
function randomNum(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min)
}

// 生成一個隨機顏色
function randomColor(min: number, max: number) {
  let r = randomNum(min, max)
  let g = randomNum(min, max)
  let b = randomNum(min, max)
  return `rgb(${r},${g},${b})`
}

// 生成一個隨機驗證碼
function randomCode() {
  let code = ''
  for (let i = 0; i < props.codeLength; i++) {
    const i = randomNum(0, codeRandomList.value.length)
    code += codeRandomList.value[i]
  }
  verificationCode.value = code
}

function drawText(ctx: CanvasRenderingContext2D, txt: string, i: number) {
  // 繪製文字
  ctx.fillStyle = props.textColor || randomColor(props.textColorMin, props.textColorMax) //隨機生成字型顏色
  ctx.font = 'bold ' + randomNum(props.fontSizeMin, props.fontSizeMax) + 'px Arial' //隨機生成字型大小

  const x = i * ((props.contentWidth - 15) / props.codeLength) + 10
  const y = randomNum(props.fontSizeMax, props.contentHeight)
  const deg = randomNum(props.textDegMin, props.textDegMax)

  // 修改座標原點和旋轉角度
  ctx.translate(x, y)
  ctx.rotate((deg * Math.PI) / 180)

  ctx.fillText(txt, 0, 0)

  // 恢復座標原點和旋轉角度
  ctx.rotate((-deg * Math.PI) / 180)
  ctx.translate(-x, -y)
}

function drawLine(ctx: CanvasRenderingContext2D) {
  // 繪製干擾線
  for (let i = 0; i < props.lineCount; i++) {
    ctx.strokeStyle = randomColor(props.lineColorMin, props.lineColorMax)
    ctx.beginPath()
    ctx.moveTo(randomNum(0, props.contentWidth), randomNum(0, props.contentHeight))
    ctx.lineTo(randomNum(0, props.contentWidth), randomNum(0, props.contentHeight))
    ctx.stroke()
  }
}

function drawDot(ctx: CanvasRenderingContext2D) {
  // 繪製干擾點
  for (let i = 0; i < props.dotCount; i++) {
    ctx.fillStyle = randomColor(props.dotColorMin, props.dotColorMax)
    ctx.beginPath()
    ctx.arc(randomNum(0, props.contentWidth), randomNum(0, props.contentHeight), 1, 0, 2 * Math.PI)
    ctx.fill()
  }
}

function drawPic() {
  randomCode()
  let canvas = document.getElementById('id-canvas') as HTMLCanvasElement
  let ctx = canvas.getContext('2d')
  if (!ctx) {
    throw Error('Can not find context!')
  }

  ctx.textBaseline = 'bottom'
  // 繪製背景
  ctx.fillStyle =
    props.backgroundColor || randomColor(props.backgroundColorMin, props.backgroundColorMax)
  ctx.fillRect(0, 0, props.contentWidth, props.contentHeight)

  for (let i = 0; i < props.codeLength; i++) {
    drawText(ctx, verificationCode.value[i], i)
  }
  drawLine(ctx)
  drawDot(ctx)
}

function refresh() {
  drawPic()
}

function validate(input: string, ignoreCase = false): boolean {
  if (ignoreCase) {
    return input.toLowerCase() === verificationCode.value.toLowerCase()
  }
  return input === verificationCode.value
}

defineExpose({
  validate,
  refresh,
  verificationCode
})

onMounted(() => {
  drawPic()
})
</script>

<template>
  <div class="captcha-image" :class="{ clickable: refreshable }" @click="refreshable && refresh()">
    <canvas id="id-canvas" :width="contentWidth" :height="contentHeight"></canvas>
  </div>
</template>

<style lang="css" scoped>
.captcha-image {
  user-select: none;
}

.captcha-image.clickable {
  cursor: pointer;
}
</style>
