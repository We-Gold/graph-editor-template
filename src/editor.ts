import { ActionManager } from "./actions/action"
import { AddEdgeAction } from "./actions/add-edge"
import { AddNodeAction } from "./actions/add-node"
import { DeselectAction } from "./actions/deselect"
import { MoveNodeAction } from "./actions/move-node"
import { RemoveItemAction } from "./actions/remove-item"
import { UndoAction } from "./actions/undo"
import { Camera } from "./camera"
import { Config } from "./config"
import { Graph, GraphItem, NoneGraphItem } from "./graph"
import { colorToIndex } from "./helpers/mouse-event-helpers"
import {
	renderEdgeHovered,
	renderEdgeSelected,
	renderNodeHovered,
	renderNodeSelected,
} from "./helpers/render-helpers"
import { Vector, vector } from "./helpers/vector"

export class Editor {
	config: Config
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
		mouseDown: boolean
	} = {
		hovered: NoneGraphItem,
		selected: NoneGraphItem,
		lastMousePosition: vector(0, 0),
		mouseDown: false,
	}

	constructor(
		config: Config,
		graph: Graph,
		camera: Camera,
		canvas: HTMLCanvasElement,
		offscreenCanvas: OffscreenCanvas,
		container: HTMLElement
	) {
		this.config = config
		this.graph = graph
		this.camera = camera
		this.canvas = canvas
		this.offscreenCanvas = offscreenCanvas

		this.actionManager = new ActionManager(
			[
				new AddNodeAction(this),
				new AddEdgeAction(this),
				new MoveNodeAction(this),
				new RemoveItemAction(this),
				new DeselectAction(this),
				new UndoAction(),
			],
			container
		)

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

		// Update mouse down state
		this.state.mouseDown = true
	}

	handleMouseUp(e: MouseEvent) {
		// Update the last mouse position
		this.state.lastMousePosition = this.camera.getMousePosition(e)

		// Update mouse down state
		this.state.mouseDown = false
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
				renderNodeHovered(ctx, node.x, node.y, this.config)
		} else if (this.state.hovered.type === "edge") {
			const edge = this.graph.getEdgeValue(this.state.hovered.index)
			renderEdgeHovered(
				ctx,
				edge.u!.x,
				edge.u!.y,
				edge.v!.x,
				edge.v!.y,
				this.config
			)
		}

		// Render selected nodes and edges
		if (this.state.selected.type === "node") {
			const node = this.graph.getNode(this.state.selected.index)

			if (node !== null)
				renderNodeSelected(ctx, node.x, node.y, this.config)
		} else if (this.state.selected.type === "edge") {
			const edge = this.graph.getEdgeValue(this.state.selected.index)
			renderEdgeSelected(
				ctx,
				edge.u!.x,
				edge.u!.y,
				edge.v!.x,
				edge.v!.y,
				this.config
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

