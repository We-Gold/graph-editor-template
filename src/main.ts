import "./style.css"

import {
	defaultContainer,
	configureContainer,
	initializeCanvases,
	renderLoop,
} from "./canvas-helpers"
import { Graph } from "./graph"
import { Editor } from "./editor"
import { Camera } from "./camera"

const containerSelector = "#container"

window.addEventListener("DOMContentLoaded", () => {
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
		nodeData: [{}, {}, {}, {}],
	}

	const graph = new Graph(
		sampleGraph.x,
		sampleGraph.y,
		sampleGraph.edges,
		sampleGraph.nodeData
	)

	const camera = new Camera(canvas)
	const editor = new Editor(graph, camera, canvas, offscreenCanvas)

	renderLoop(canvas, offscreenCanvas, (ctx, offscreenCtx) => {
		camera.render(ctx)
		camera.renderOffscreen(offscreenCtx)

		editor.render(ctx)
		editor.renderOffscreen(offscreenCtx)
	})
})

