import "./style.css"

import {
	defaultContainer,
	configureContainer,
	initializeCanvases,
	renderLoop,
} from "./canvas-helpers"
import { Graph } from "./graph"

const containerSelector = "#container"

document.addEventListener("DOMContentLoaded", () => {
	const container =
		document.querySelector<HTMLElement>(containerSelector) ??
		defaultContainer()

	configureContainer(container)

	const [canvas, offscreenCanvas] = initializeCanvases(container)

	const sampleGraph = {
		x: [100, 200, 300, 400],
		y: [100, 200, 300, 400],
		edges: [
			[0, 1],
			[1, 2],
			[2, 3],
		],
		nodeDate: [{}, {}, {}, {}],
	}

	const graph = new Graph(
		sampleGraph.x,
		sampleGraph.y,
		sampleGraph.edges,
		sampleGraph.nodeDate
	)

	renderLoop(canvas, offscreenCanvas, (ctx, offscreenCtx) => {
		// Clear the canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height)

		graph.render(ctx)
		graph.renderOffscreen(offscreenCtx)

		// Render the offscreen canvas
		// ctx.drawImage(offscreenCanvas, 0, 0)
	})
})

