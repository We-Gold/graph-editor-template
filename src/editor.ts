import { Camera } from "./camera"
import { Graph } from "./graph"

export class Editor {
	graph: Graph
	camera: Camera
	canvas: HTMLCanvasElement
	offscreenCanvas: OffscreenCanvas
	offscreenCtx: OffscreenCanvasRenderingContext2D

	#mouseMoveHandler: (e: MouseEvent) => void

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

		canvas.addEventListener("mousemove", this.#mouseMoveHandler)
	}

	handleMouseMove(e: MouseEvent) {
		// TODO: This is a temporary solution to get the mouse position
		// Once zooming is implemented, this will need to be updated
		const mousePosition = this.camera.getMousePosition(e)

		// Get the color of the pixel at the mouse position on the offscreen canvas
		const color = this.offscreenCtx.getImageData(
			mousePosition.x,
			mousePosition.y,
			1,
			1
		).data

		// if (color[3] === 255) {
		// 	console.log(color)
		// }
	}

	render(ctx: CanvasRenderingContext2D) {
		this.graph.render(ctx)
	}

	renderOffscreen(ctx: OffscreenCanvasRenderingContext2D) {
		this.graph.renderOffscreen(ctx)
	}

	destroy() {
		// Remove mouse event listeners
		this.canvas.removeEventListener("mousemove", this.#mouseMoveHandler)
	}
}

