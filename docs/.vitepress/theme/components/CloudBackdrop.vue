<script setup lang="ts">
/**
 * Cloud Halo 背景系统（五层）
 *  1. 基础渐变      —— 纯 CSS
 *  2. 云雾光团      —— 纯 CSS，3~5 个模糊光团
 *  3. 精细网格      —— 线性渐变 + mask 边缘消隐
 *  4. 节点星图      —— 轻量 Canvas，节点数按视口分级
 *  5. 指针光晕      —— 仅桌面端，requestAnimationFrame 平滑跟随
 *
 * 约束：
 *  - 全部图层 pointer-events: none，不拦截滚动与点击
 *  - devicePixelRatio 上限 1.5
 *  - 页面隐藏 / 失焦时暂停动画
 *  - prefers-reduced-motion 时只保留静态渐变
 *  - 组件卸载时清理监听与动画帧
 */
import { onMounted, onBeforeUnmount, ref, shallowRef } from 'vue'

const canvasEl = ref<HTMLCanvasElement | null>(null)
const pointerEl = ref<HTMLDivElement | null>(null)

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  /** 因指针作用产生的临时位移 */
  ox: number
  oy: number
}

const nodes = shallowRef<Node[]>([])
let ctx: CanvasRenderingContext2D | null = null
let rafId = 0
let running = false
let width = 0
let height = 0
let dpr = 1

/** 指针状态 */
const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false }

let cleanupFns: Array<() => void> = []

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function isCoarsePointer(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
}

/** 按视口宽度分级：桌面 32 / 平板 20 / 手机 12 */
function nodeBudget(w: number): number {
  if (w >= 1024) return 32
  if (w >= 768) return 20
  return 12
}

function linkDistance(w: number): number {
  if (w >= 1024) return 168
  if (w >= 768) return 148
  return 122
}

function seedNodes() {
  const count = nodeBudget(width)
  const list: Node[] = []
  for (let i = 0; i < count; i++) {
    // 用索引做确定性分布，避免完全随机造成的聚堆
    const gx = ((i * 37) % 100) / 100
    const gy = ((i * 61) % 100) / 100
    list.push({
      x: gx * width,
      y: gy * height,
      vx: (((i % 7) - 3) / 3) * 0.09,
      vy: (((i % 5) - 2) / 2) * 0.08,
      r: 1.1 + ((i % 4) * 0.45),
      ox: 0,
      oy: 0
    })
  }
  nodes.value = list
}

function viewportSize() {
  const w = window.innerWidth || document.documentElement.clientWidth || 0
  const h = window.innerHeight || document.documentElement.clientHeight || 0
  return { w, h }
}

function resize() {
  const canvas = canvasEl.value
  if (!canvas) return
  const { w, h } = viewportSize()
  // 视口尺寸尚不可用时（例如页面在后台标签中加载）先跳过，等待 ResizeObserver 再次触发
  if (w === 0 || h === 0) return
  if (w === width && h === height && canvas.width > 0) return

  dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  width = w
  height = h
  canvas.width = Math.floor(width * dpr)
  canvas.height = Math.floor(height * dpr)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  ctx = canvas.getContext('2d', { alpha: true })
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  seedNodes()
}

function readTheme() {
  const dark =
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  return dark
    ? { node: 'rgba(150, 195, 255, 0.55)', link: 'rgba(120, 175, 245, ' }
    : { node: 'rgba(36, 107, 253, 0.34)', link: 'rgba(36, 107, 253, ' }
}

function draw() {
  if (!ctx) return
  const theme = readTheme()
  const list = nodes.value
  const maxLink = linkDistance(width)
  const maxLinkSq = maxLink * maxLink

  ctx.clearRect(0, 0, width, height)

  // 更新位置
  for (const n of list) {
    n.x += n.vx
    n.y += n.vy
    if (n.x < -40) n.x = width + 40
    if (n.x > width + 40) n.x = -40
    if (n.y < -40) n.y = height + 40
    if (n.y > height + 40) n.y = -40

    // 指针轻微排斥，幅度很小，只做氛围提示
    if (pointer.active) {
      const dx = n.x - pointer.x
      const dy = n.y - pointer.y
      const distSq = dx * dx + dy * dy
      const radius = 150
      if (distSq < radius * radius && distSq > 0.01) {
        const dist = Math.sqrt(distSq)
        const force = (1 - dist / radius) * 9
        n.ox += ((dx / dist) * force - n.ox) * 0.08
        n.oy += ((dy / dist) * force - n.oy) * 0.08
      } else {
        n.ox += (0 - n.ox) * 0.06
        n.oy += (0 - n.oy) * 0.06
      }
    } else {
      n.ox += (0 - n.ox) * 0.06
      n.oy += (0 - n.oy) * 0.06
    }
  }

  // 连线：只连接邻近节点
  ctx.lineWidth = 1
  for (let i = 0; i < list.length; i++) {
    const a = list[i]
    const ax = a.x + a.ox
    const ay = a.y + a.oy
    for (let j = i + 1; j < list.length; j++) {
      const b = list[j]
      const bx = b.x + b.ox
      const by = b.y + b.oy
      const dx = ax - bx
      const dy = ay - by
      const distSq = dx * dx + dy * dy
      if (distSq > maxLinkSq) continue
      const alpha = (1 - Math.sqrt(distSq) / maxLink) * 0.16
      ctx.strokeStyle = `${theme.link}${alpha.toFixed(3)})`
      ctx.beginPath()
      ctx.moveTo(ax, ay)
      ctx.lineTo(bx, by)
      ctx.stroke()
    }
  }

  // 节点
  ctx.fillStyle = theme.node
  for (const n of list) {
    ctx.beginPath()
    ctx.arc(n.x + n.ox, n.y + n.oy, n.r, 0, Math.PI * 2)
    ctx.fill()
  }
}

function movePointerHalo() {
  const el = pointerEl.value
  if (!el) return
  pointer.x += (pointer.tx - pointer.x) * 0.075
  pointer.y += (pointer.ty - pointer.y) * 0.075
  el.style.transform = `translate3d(${pointer.x.toFixed(1)}px, ${pointer.y.toFixed(1)}px, 0)`
}

function loop() {
  if (!running) return
  movePointerHalo()
  draw()
  rafId = requestAnimationFrame(loop)
}

function start() {
  if (running) return
  running = true
  rafId = requestAnimationFrame(loop)
}

function stop() {
  running = false
  if (rafId) cancelAnimationFrame(rafId)
  rafId = 0
}

function onVisibility() {
  if (document.hidden) stop()
  else start()
}

function on<K extends keyof WindowEventMap>(
  target: Window | Document,
  type: K | string,
  handler: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions
) {
  target.addEventListener(type, handler, options)
  cleanupFns.push(() => target.removeEventListener(type, handler, options))
}

onMounted(() => {
  if (prefersReducedMotion()) return

  const coarse = isCoarsePointer()

  resize()
  let resizeTimer: number | undefined
  on(window, 'resize', () => {
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(resize, 180)
  })

  // 视口在挂载时可能还没有尺寸（后台标签、慢速布局），用 ResizeObserver 兜底
  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => resize())
    ro.observe(document.documentElement)
    cleanupFns.push(() => ro.disconnect())
  }

  on(document, 'visibilitychange', onVisibility)
  on(window, 'blur', stop)
  on(window, 'focus', start)

  if (!coarse) {
    on(window, 'pointermove', ((e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      pointer.tx = e.clientX
      pointer.ty = e.clientY
      if (!pointer.active) {
        pointer.active = true
        pointer.x = e.clientX
        pointer.y = e.clientY
        pointerEl.value?.classList.add('is-visible')
      }
    }) as EventListener)

    on(document, 'pointerleave', (() => {
      pointer.active = false
      pointerEl.value?.classList.remove('is-visible')
    }) as EventListener)

    on(window, 'blur', () => {
      pointer.active = false
      pointerEl.value?.classList.remove('is-visible')
    })
  }

  // 延迟到浏览器空闲再启动，避免与首屏渲染争夺主线程
  const idle =
    (window as any).requestIdleCallback?.bind(window) ||
    ((cb: () => void) => window.setTimeout(cb, 320))
  idle(() => start())
})

onBeforeUnmount(() => {
  stop()
  cleanupFns.forEach((fn) => fn())
  cleanupFns = []
  ctx = null
  nodes.value = []
})
</script>

<template>
  <div class="jc-backdrop" aria-hidden="true" data-pagefind-ignore>
    <!-- 第一层：基础渐变 -->
    <div class="jc-backdrop__base"></div>

    <!-- 第二层：云雾光团 -->
    <div class="jc-backdrop__halos">
      <span class="jc-halo jc-halo--a"></span>
      <span class="jc-halo jc-halo--b"></span>
      <span class="jc-halo jc-halo--c"></span>
      <span class="jc-halo jc-halo--d"></span>
      <span class="jc-halo jc-halo--e"></span>
    </div>

    <!-- 第三层：精细网格 -->
    <div class="jc-backdrop__grid"></div>

    <!-- 第四层：节点星图 -->
    <canvas ref="canvasEl" class="jc-backdrop__canvas"></canvas>

    <!-- 第五层：指针光晕 -->
    <div ref="pointerEl" class="jc-backdrop__pointer"></div>
  </div>
</template>
