# Orbit

Project template based on [`create-vite/template-svelte-ts`](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-svelte-ts).

Will try to use [box2d3-wasm](https://github.com/Birch-san/box2d3-wasm) bring back something like [Orbit](https://birchlabs.co.uk/experiments#orbit) or [Lunar Survey](https://birchlabs.co.uk/experiments#lunar-survey).  
The hope is to see WASM SIMD + threading + WebGL working together to make a high-performance demo. With enough particles, we can use shaders to make something like water, and subject it to interesting gravity.

## Setup

Install:

```bash
npm i
```

## Run

```bash
npm run dev
```