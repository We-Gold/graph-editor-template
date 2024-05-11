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

	// const sampleGraph = {
	// 	x: [100, 200, 300, 400],
	// 	y: [100, 200, 300, 400],
	// 	edges: [
	// 		[0, 1],
	// 		[1, 2],
	// 		[2, 3],
	// 	],
	// 	nodeData: [{}, {}, {}, {}],
	// }

	const x = []
	const y = []

	const numNodes = 100
	const rowCapacity = 12

	for (let i = 0; i < numNodes; i++) {
		x.push(100 + 40 * (i % rowCapacity))
		y.push(50 + 40 * Math.floor(i / rowCapacity))
	}

	const edges = []

	// Fully Connected
	// for (let i = 0; i < x.length; i++) {
	// 	for (let j = 0; j < y.length; j++) {
	// 		if (i !== j) {
	// 			edges.push([i, j])
	// 		}
	// 	}
	// }

	// Sparsely Connected
	for (let i = 0; i < x.length - 1; i++) {
		edges.push([i, i + 1])
	}

	const sampleGraph = {
		x: x,
		y: y,
		edges: edges,
		nodeData: x.map((_) => ({})),
	}

	const graph = new Graph(
		config,
		sampleGraph.x,
		sampleGraph.y,
		sampleGraph.edges,
		sampleGraph.nodeData
	)

	const camera = new Camera(canvas)
	camera.matchGraphData(sampleGraph.x, sampleGraph.y)

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

