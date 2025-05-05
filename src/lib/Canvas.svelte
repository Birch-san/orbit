<script lang="ts">
	import { onMount } from 'svelte'
	import { assert } from './assert'
    import type { MouseEventHandler, TouchEventHandler } from 'svelte/elements';

	let { width, height } = $props()
	
	let color = '#333'
	let background = '#fff'
	
	let canvas = $state<HTMLCanvasElement>()
	let ctx = $state<CanvasRenderingContext2D|null>()
	let isDrawing = $state(false)
	let start = { x: 0, y: 0}
	
	let t = $state(0)
	let l = $state(0)
	
	onMount(() => {
		assert(canvas)
		ctx = canvas.getContext('2d')
		assert(ctx)
		ctx.lineWidth = 3
		
		handleSize()
	})
	
	$effect(() => {
		if(ctx) {
			ctx.strokeStyle = color
		}
	})
	
	const handleStart = (({ x, y }: { x: number, y: number }) => { 
		assert(ctx)
		if(color === background) {
			ctx.clearRect(0, 0, width, height)
		} else {
			isDrawing = true
			start = { x, y }
		}
	})

	const handleMouseDown: MouseEventHandler<HTMLCanvasElement> = ({ offsetX: x, offsetY: y }) => {
		return handleStart({ x, y })
	}
	const handleTouch: TouchEventHandler<HTMLCanvasElement> = ({ touches }: TouchEvent) => {
        const { clientX, clientY } = touches[0]
        handleMove({
            offsetX: clientX - l,
            offsetY: clientY - t
        })
	}
	
	const handleEnd = () => { isDrawing = false }
	const handleMove = (({ offsetX: x1, offsetY: y1 }: { offsetX: number, offsetY: number }) => {
		assert(ctx)
		if(!isDrawing) return
		
		const { x, y } = start
		ctx.beginPath()
		ctx.moveTo(x, y)
		ctx.lineTo(x1, y1)
		ctx.closePath()
		ctx.stroke()
		
		start = { x: x1, y: y1 }
	})
	
	const handleSize = () => {
		assert(canvas)
		const { top, left } = canvas.getBoundingClientRect()
		t = top
		l = left
	}
</script>

<svelte:window on:resize={handleSize} />

<canvas>
    {width}
    {height}
    style:background
    bind:this={canvas} 
    on:mousedown={handleMouseDown}	
    on:touchstart={handleTouch}	
    on:mouseup={handleEnd}				
    on:touchend={handleEnd}				
    on:mouseleave={handleEnd}
    on:mousemove={handleMove}
    on:touchmove={handleTouch}
</canvas>