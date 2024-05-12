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
import { ActionManager } from "./actions/action"
import { AddNodeAction } from "./actions/add-node"
import { AddEdgeAction } from "./actions/add-edge"
import { MoveNodeAction } from "./actions/move-node"
import { RemoveItemAction } from "./actions/remove-item"
import { DeselectAction } from "./actions/deselect"
import { UndoAction } from "./actions/undo"
import { ZoomInAction } from "./actions/zoom-in"
import { ZoomOutAction } from "./actions/zoom-out"
import { generateGraphData } from "./helpers/generate-graph"

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

	const sampleGraph = generateGraphData(100, 12, false)

	const graph = new Graph(
		config,
		sampleGraph.x,
		sampleGraph.y,
		sampleGraph.edges,
		sampleGraph.nodeData
	)

	const camera = new Camera(canvas)
	camera.matchGraphData(sampleGraph.x, sampleGraph.y)

	const editor = new Editor(config, graph, camera, canvas, offscreenCanvas)

	const actionManager = new ActionManager(
		[
			new AddNodeAction(editor),
			new AddEdgeAction(editor),
			new MoveNodeAction(editor),
			new RemoveItemAction(editor),
			new DeselectAction(editor),
			new UndoAction(),
			new ZoomInAction(camera),
			new ZoomOutAction(camera),
		],
		container
	)

	renderLoop(canvas, offscreenCanvas, (ctx, offscreenCtx) => {
		camera.render(ctx)
		camera.renderOffscreen(offscreenCtx)

		// Run any active actions
		actionManager.runCurrentAction()

		editor.render(ctx)
		editor.renderOffscreen(offscreenCtx)
	})
})

