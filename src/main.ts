import "./style.css"

import {
	defaultContainer,
	configureContainer,
	initializeCanvases,
	renderLoop,
	configureStyles,
	addInfoButton,
	addPanel,
} from "./helpers/dom-helpers"
import { Graph } from "./graph"
import { Editor } from "./editor"
import { Camera } from "./camera"
import { config } from "./config"

const containerSelector = "#container"

window.addEventListener("DOMContentLoaded", () => {
	const container =
		document.querySelector<HTMLElement>(containerSelector) ??
		defaultContainer()

	configureStyles(config)
	configureContainer(container)

	addInfoButton(container)
	addPanel(container, config)

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
		config,
		sampleGraph.x,
		sampleGraph.y,
		sampleGraph.edges,
		sampleGraph.nodeData
	)

	const camera = new Camera(canvas)
	const editor = new Editor(
		config,
		graph,
		camera,
		canvas,
		offscreenCanvas,
		container
	)

	renderLoop(canvas, offscreenCanvas, (ctx, offscreenCtx) => {
		camera.render(ctx)
		camera.renderOffscreen(offscreenCtx)

		editor.render(ctx)
		editor.renderOffscreen(offscreenCtx)
	})
})

