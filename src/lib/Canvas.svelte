<script module lang="ts">
  export type ReceiveCtx = (ctx: WebGL2RenderingContext) => void
  export interface Point {
    x: number,
    y: number,
  }
  export type ReceiveMouseDown = (pos: Point) => void
  export type ReceiveMouseUp = (pos: Point) => void
  export type ReceiveMouseMove = (pos: Point) => void
  export type ReceiveMouseLeave = (pos: Point) => void
  export interface CanvasProps {
    width: number,
    height: number,
    receiveCtx?: ReceiveCtx
    receiveMouseDown?: ReceiveMouseDown
    receiveMouseUp?: ReceiveMouseUp
    receiveMouseMove?: ReceiveMouseMove
    receiveMouseLeave?: ReceiveMouseLeave
  }
</script>

<script lang="ts">
	import { onMount } from 'svelte'
	import { assert } from './assert'
  import type { MouseEventHandler, TouchEventHandler } from 'svelte/elements';

	let {
    width,
    height,
    receiveCtx = () => {},
    receiveMouseDown = () => {},
    receiveMouseUp = () => {},
    receiveMouseMove = () => {},
    receiveMouseLeave = () => {},
  }: CanvasProps = $props()
	
	const background = '#fff'
	
	let canvas = $state<HTMLCanvasElement|null>()
	let ctx = $state<WebGL2RenderingContext|null>()
	const pos: Point = { x: 0, y: 0}
	
	let t = $state(0)
	let l = $state(0)
	
	onMount(() => {
		assert(canvas)
		ctx = canvas.getContext('webgl2')
		assert(ctx)
    receiveCtx?.(ctx)
	})

  // avoid heap allocation of new object, to reduce GC (would result in choppy framerate)
  const setPos = (x: number, y: number): Point => {
    pos.x = x
    pos.y = y
    return pos
  }

  const handleMouseUp: MouseEventHandler<HTMLCanvasElement> = ({ offsetX: x, offsetY: y }) =>
    receiveMouseUp(setPos(x, y))

  const handleMouseLeave: MouseEventHandler<HTMLCanvasElement> = ({ offsetX: x, offsetY: y }) =>
    receiveMouseLeave(setPos(x, y))

	const handleMouseDown: MouseEventHandler<HTMLCanvasElement> = ({ offsetX: x, offsetY: y }) =>
    receiveMouseDown(setPos(x, y))

	const handleMouseMove: MouseEventHandler<HTMLCanvasElement> = ({ offsetX: x, offsetY: y }) =>
    receiveMouseMove(setPos(x, y))
  
  // ontouchstart, ontouchend, ontouchmove probably need some thought.
	// const handleTouch: TouchEventHandler<HTMLCanvasElement> = ({ touches }: TouchEvent) => {
  //   const [touch, ..._] = touches
  //   const { clientX, clientY } = touch
  //   handleMove(clientX - l, clientY - t)
	// }
	
	// const handleTouchEnd: TouchEventHandler<HTMLCanvasElement> = ({ touches }: TouchEvent) => {
  //   if (!touches.length) {

  //   }
  // }
	
	const handleSize = () => {
		assert(canvas)
		const { top, left } = canvas.getBoundingClientRect()
		t = top
		l = left
	}
</script>

<svelte:window on:resize={handleSize} />

<canvas
  {width}
  {height}
  style:background
  bind:this={canvas}
  onmousedown={handleMouseDown}
  onmouseup={handleMouseUp}
  onmouseleave={handleMouseLeave}
  onmousemove={handleMouseMove}
></canvas>