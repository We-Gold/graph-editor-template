import { Camera } from "./camera"
import { Graph, GraphItem, NoneGraphItem } from "./graph"
import { colorToIndex } from "./mouse-event-helpers"
import { renderNodeHovered, renderNodeSelected } from "./render-helpers"

export class Editor {
	graph: Graph
	camera: Camera
	canvas: HTMLCanvasElement
	offscreenCanvas: OffscreenCanvas
	offscreenCtx: OffscreenCanvasRenderingContext2D

	#mouseMoveHandler: (e: MouseEvent) => void
	#mouseDownHandler: (e: MouseEvent) => void
	#mouseUpHandler: (e: MouseEvent) => void

	state: {
		hovered: GraphItem
		selected: GraphItem
	} = {
		hovered: { type: "none", index: -1 },
		selected: { type: "none", index: -1 },
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
		document.addEventListener("mouseup", this.#mouseUpHandler)
	}

	handleMouseMove(e: MouseEvent) {
		const item = this.#getItemFromMouseEvent(e)

		if (item.type !== "none") {
			this.state.hovered = item
		} else {
			this.state.hovered = NoneGraphItem
		}
	}

	handleMouseDown(e: MouseEvent) {
		const item = this.#getItemFromMouseEvent(e)

		if (item.type !== "none") {
			this.state.selected = item
		}
	}

	handleMouseUp(_e: MouseEvent) {
		// const item = this.#getItemFromMouseEvent(e)
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
		this.graph.render(ctx)

		// Render hover and select
		if (this.state.hovered.type === "node") {
			const node = this.graph.getNode(this.state.hovered.index)
			renderNodeHovered(ctx, node.x, node.y, this.graph.config)
		}

		if (this.state.selected.type === "node") {
			const node = this.graph.getNode(this.state.selected.index)
			renderNodeSelected(ctx, node.x, node.y, this.graph.config)
		}
	}

	renderOffscreen(ctx: OffscreenCanvasRenderingContext2D) {
		this.graph.renderOffscreen(ctx)
	}

	destroy() {
		// Remove mouse event listeners
		this.canvas.removeEventListener("mousemove", this.#mouseMoveHandler)
		this.canvas.removeEventListener("mousedown", this.#mouseDownHandler)
		document.removeEventListener("mouseup", this.#mouseUpHandler)
	}
}

