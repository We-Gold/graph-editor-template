import { ActionManager } from "./actions/action"
import { AddNodeAction } from "./actions/add-node"
import { RemoveItemAction } from "./actions/remove-item"
import { UndoAction } from "./actions/undo"
import { Camera } from "./camera"
import { Graph, GraphItem, NoneGraphItem } from "./graph"
import { colorToIndex } from "./mouse-event-helpers"
import {
	renderEdgeHovered,
	renderEdgeSelected,
	renderNodeHovered,
	renderNodeSelected,
} from "./render-helpers"
import { Vector, vector } from "./vector"

export class Editor {
	graph: Graph
	camera: Camera
	canvas: HTMLCanvasElement
	offscreenCanvas: OffscreenCanvas
	offscreenCtx: OffscreenCanvasRenderingContext2D

	actionManager: ActionManager

	#mouseMoveHandler: (e: MouseEvent) => void
	#mouseDownHandler: (e: MouseEvent) => void
	#mouseUpHandler: (e: MouseEvent) => void

	state: {
		hovered: GraphItem
		selected: GraphItem
		lastMousePosition: Vector
	} = {
		hovered: { type: "none", index: -1 },
		selected: { type: "none", index: -1 },
		lastMousePosition: vector(0, 0),
	}

	constructor(
		graph: Graph,
		camera: Camera,
		canvas: HTMLCanvasElement,
		offscreenCanvas: OffscreenCanvas
	) {
		this.graph = graph
		this.camera = camera
		this.canvas = canvas
		this.offscreenCanvas = offscreenCanvas

		this.actionManager = new ActionManager([
			new AddNodeAction(this),
			new UndoAction(),
			new RemoveItemAction(this),
		])

		// Create an internal offscreen canvas context for the editor
		const offscreenCtx = offscreenCanvas.getContext("2d", {
			willReadFrequently: true,
		})
		if (offscreenCtx === null) {
			throw new Error("Error: Could not get rendering context")
		}
		this.offscreenCtx = offscreenCtx

		this.#mouseMoveHandler = this.handleMouseMove.bind(this)
		this.#mouseDownHandler = this.handleMouseDown.bind(this)
		this.#mouseUpHandler = this.handleMouseUp.bind(this)

		canvas.addEventListener("mousemove", this.#mouseMoveHandler)
		canvas.addEventListener("mousedown", this.#mouseDownHandler)
		window.addEventListener("mouseup", this.#mouseUpHandler)
	}

	getState() {
		return this.state
	}

	handleMouseMove(e: MouseEvent) {
		const item = this.#getItemFromMouseEvent(e)

		if (item.type !== "none") {
			this.state.hovered = item
		} else {
			this.state.hovered = NoneGraphItem
		}

		// Update the last mouse position
		this.state.lastMousePosition = this.camera.getMousePosition(e)
	}

	handleMouseDown(e: MouseEvent) {
		const item = this.#getItemFromMouseEvent(e)

		if (item.type !== "none") {
			this.state.selected = item
		}

		// Update the last mouse position
		this.state.lastMousePosition = this.camera.getMousePosition(e)
	}

	handleMouseUp(e: MouseEvent) {
		// Update the last mouse position
		this.state.lastMousePosition = this.camera.getMousePosition(e)
	}

	/**
	 * Get the item at the mouse position based on the color of the pixel at the mouse position
	 * @param e The mouse event
	 * @returns {GraphItem} The type of item and its index in its respective array
	 */
	#getItemFromMouseEvent(e: MouseEvent): GraphItem {
		const mousePosition = this.camera.getPhysicalMousePosition(e)

		// Get the color of the pixel at the mouse position on the offscreen canvas
		const color = this.offscreenCtx.getImageData(
			mousePosition.x,
			mousePosition.y,
			1,
			1
		).data

		if (color[3] !== 0) {
			// If the alpha value is not 0, then the pixel has been colored intentionally
			const index = colorToIndex(color)

			return this.graph.getItemAtIndex(
				this.camera.getMousePosition(e),
				index
			)
		} else {
			return NoneGraphItem
		}
	}

	render(ctx: CanvasRenderingContext2D) {
		// Run any active actions
		this.actionManager.runCurrentAction()

		this.graph.render(ctx)

		// Render hovered nodes and edges
		if (this.state.hovered.type === "node") {
			const node = this.graph.getNode(this.state.hovered.index)

			if (node !== null)
				renderNodeHovered(ctx, node.x, node.y, this.graph.config)
		} else if (this.state.hovered.type === "edge") {
			const edge = this.graph.getEdgeValue(this.state.hovered.index)
			renderEdgeHovered(
				ctx,
				edge.u!.x,
				edge.u!.y,
				edge.v!.x,
				edge.v!.y,
				this.graph.config
			)
		}

		// Render selected nodes and edges
		if (this.state.selected.type === "node") {
			const node = this.graph.getNode(this.state.selected.index)

			if (node !== null)
				renderNodeSelected(ctx, node.x, node.y, this.graph.config)
		} else if (this.state.selected.type === "edge") {
			const edge = this.graph.getEdgeValue(this.state.selected.index)
			renderEdgeSelected(
				ctx,
				edge.u!.x,
				edge.u!.y,
				edge.v!.x,
				edge.v!.y,
				this.graph.config
			)
		}
	}

	renderOffscreen(ctx: OffscreenCanvasRenderingContext2D) {
		this.graph.renderOffscreen(ctx)
	}

	destroy() {
		// Remove mouse event listeners
		this.canvas.removeEventListener("mousemove", this.#mouseMoveHandler)
		this.canvas.removeEventListener("mousedown", this.#mouseDownHandler)
		window.removeEventListener("mouseup", this.#mouseUpHandler)

		this.actionManager.destroy()
	}
}

