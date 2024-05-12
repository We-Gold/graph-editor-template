import { Vector, add, scale, subtract, vector } from "./helpers/vector"

export class Camera {
	canvas: HTMLCanvasElement

	offset: Vector
	center: Vector

	scale: number
	dragging: boolean = false
	controlHeld: boolean = false
	shiftHeld: boolean = false

	zoomMin: number
	zoomMax: number

	drag: {
		start: Vector
		last: Vector
		offset: Vector
	}

	#keyDownHandler: (e: KeyboardEvent) => void
	#keyUpHandler: (e: KeyboardEvent) => void
	#mouseDownHandler: (e: MouseEvent) => void
	#mouseUpHandler: (e: MouseEvent) => void
	#mouseMoveHandler: (e: MouseEvent) => void

	constructor(
		canvas: HTMLCanvasElement,
		{ zoomMin = 0.5, zoomMax = 5 } = {}
	) {
		this.zoomMin = zoomMin
		this.zoomMax = zoomMax

		// Initilize the camera with a scale based on the device pixel ratio
		this.scale = 1

		this.center = vector(
			canvas.width / 2 / window.devicePixelRatio,
			canvas.height / 2 / window.devicePixelRatio
		)
		this.offset = scale(this.center, -1)

		this.drag = {
			start: vector(0, 0),
			last: vector(0, 0),
			offset: vector(0, 0),
		}

		this.canvas = canvas

		// Create bindings for zooming and panning (Click/Drag + Ctrl, Click/Drag + Shift)
		// TODO add scroll wheel support, iPad touch support
		this.#keyDownHandler = this.handleKeyDown.bind(this)
		this.#keyUpHandler = this.handleKeyUp.bind(this)
		this.#mouseDownHandler = this.handleMouseDown.bind(this)
		this.#mouseUpHandler = this.handleMouseUp.bind(this)
		this.#mouseMoveHandler = this.handleMouseMove.bind(this)

		window.addEventListener("keydown", this.#keyDownHandler)
		window.addEventListener("keyup", this.#keyUpHandler)
		canvas.addEventListener("mousedown", this.#mouseDownHandler)
		window.addEventListener("mouseup", this.#mouseUpHandler)
		canvas.addEventListener("mousemove", this.#mouseMoveHandler)
	}

	/**
	 * Centers the camera on the graph data and scales it to fit the canvas.
	 * Note: the scaling factor and zoomMinFactor are optional parameters that
	 * control how zoomed out the graph is on the graph data, and the minimum
	 * zoom level respectively.
	 * @param x
	 * @param y
	 * @param configuration
	 */
	matchGraphData(
		x: number[],
		y: number[],
		{ scalingFactor = 1.5, zoomMinFactor = 0.25 } = {}
	) {
		const minX = Math.min(...x)
		const minY = Math.min(...y)
		const maxX = Math.max(...x)
		const maxY = Math.max(...y)

		const width = maxX - minX
		const height = maxY - minY

		const canvasWidth = this.canvas.width / window.devicePixelRatio
		const canvasHeight = this.canvas.height / window.devicePixelRatio

		const scaleWidth = width / canvasWidth
		const scaleHeight = height / canvasHeight

		// Center the graph in the canvas
		this.offset = scale(vector((minX + maxX) / 2, (minY + maxY) / 2), -1)

		// Set the scale based on the larger of the two scaling axes
		this.scale = Math.max(scaleWidth, scaleHeight) * scalingFactor
		this.zoomMin = this.scale * zoomMinFactor
	}

	handleKeyDown(e: KeyboardEvent) {
		if (e.key === "Control" || e.key == "Alt") this.controlHeld = true
		if (e.key === "Shift") this.shiftHeld = true
	}

	handleKeyUp(e: KeyboardEvent) {
		if (e.key === "Control" || e.key == "Alt") this.controlHeld = false
		if (e.key === "Shift") this.shiftHeld = false
	}

	handleMouseDown(e: MouseEvent) {
		this.dragging = true
		this.drag.start = this.getMousePosition(e)
	}

	handleMouseUp() {
		if (this.dragging) {
			this.offset = add(this.offset, this.drag.offset)

			this.drag = {
				start: vector(0, 0),
				last: vector(0, 0),
				offset: vector(0, 0),
			}
			this.dragging = false
		}
	}

	handleMouseMove(e: MouseEvent) {
		if (this.dragging && this.shiftHeld) {
			this.drag.last = this.getMousePosition(e)
			this.drag.offset = subtract(this.drag.last, this.drag.start)
		} else if (this.dragging && this.controlHeld) {
			this.drag.last = this.getMousePosition(e)

			const dx = this.drag.last.x - this.drag.start.x

			this.scale -= dx / (2 * this.canvas.width)

			// Constrain the scale to between zoomMin and zoomMax
			this.constrainScale(this.scale)
		}
	}

	constrainScale(newScale: number) {
		this.scale = Math.max(this.zoomMin, Math.min(this.zoomMax, newScale))
	}

	zoomIn(zoomFactor: number = 0.08) {
		// Zoom in by zoomFactor % of the total scale
		const totalScale = this.zoomMax - this.zoomMin

		this.constrainScale(this.scale - totalScale * zoomFactor)
	}

	zoomOut(zoomFactor: number = 0.08) {
		// Zoom out by zoomFactor % of the total scale
		const totalScale = this.zoomMax - this.zoomMin

		this.constrainScale(this.scale + totalScale * zoomFactor)
	}

	/**
	 * Get the mouse position in the world space, so that it can be used to interact with the graph
	 * @param e The mouse event
	 * @param subtractDragOffset If true, subtract the drag offset from the mouse position
	 * @returns {Vector} The mouse position in the world space
	 */
	getMousePosition(e: MouseEvent, subtractDragOffset = false): Vector {
		const v = vector(
			(e.offsetX - this.center.x) * this.scale - this.offset.x,
			(e.offsetY - this.center.y) * this.scale - this.offset.y
		)

		return subtractDragOffset ? subtract(v, this.drag.offset) : v
	}

	/**
	 * Get the physical mouse position in the canvas space
	 * @param e The mouse event
	 * @returns {Vector} The physical mouse position in the canvas space
	 */
	getPhysicalMousePosition(e: MouseEvent): Vector {
		return vector(
			e.offsetX * window.devicePixelRatio,
			e.offsetY * window.devicePixelRatio
		)
	}

	render(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
		ctx.restore()
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		ctx.save()
		ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
		ctx.translate(this.center.x, this.center.y)
		ctx.scale(1 / this.scale, 1 / this.scale)
		const offset = add(this.offset, this.drag.offset)
		ctx.translate(offset.x, offset.y)
	}

	renderOffscreen(ctx: OffscreenCanvasRenderingContext2D) {
		this.render(ctx)
	}

	destroy() {
		window.removeEventListener("keydown", this.#keyDownHandler)
		window.removeEventListener("keyup", this.#keyUpHandler)
		this.canvas.removeEventListener("mousedown", this.#mouseDownHandler)
		window.removeEventListener("mouseup", this.#mouseUpHandler)
		this.canvas.removeEventListener("mousemove", this.#mouseMoveHandler)
	}
}

