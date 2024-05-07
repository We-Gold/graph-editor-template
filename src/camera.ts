import { Vector, add, scale, subtract, vector } from "./vector"

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

	constructor(canvas: HTMLCanvasElement, { zoomMin = 1, zoomMax = 5 } = {}) {
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
		// TODO add scroll wheel support
		this.#keyDownHandler = this.handleKeyDown.bind(this)
		this.#keyUpHandler = this.handleKeyUp.bind(this)
		this.#mouseDownHandler = this.handleMouseDown.bind(this)
		this.#mouseUpHandler = this.handleMouseUp.bind(this)
		this.#mouseMoveHandler = this.handleMouseMove.bind(this)

		document.addEventListener("keydown", this.#keyDownHandler)
		document.addEventListener("keyup", this.#keyUpHandler)
		canvas.addEventListener("mousedown", this.#mouseDownHandler)
		document.addEventListener("mouseup", this.#mouseUpHandler)
		canvas.addEventListener("mousemove", this.#mouseMoveHandler)
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
			this.scale = Math.max(
				this.zoomMin,
				Math.min(this.zoomMax, this.scale)
			)
		}
	}

	getMousePosition(e: MouseEvent, subtractDragOffset = false) {
		const v = vector(
			(e.offsetX - this.center.x) * this.scale - this.offset.x,
			(e.offsetY - this.center.y) * this.scale - this.offset.y
		)

		return subtractDragOffset ? subtract(v, this.drag.offset) : v
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
		document.removeEventListener("keydown", this.#keyDownHandler)
		document.removeEventListener("keyup", this.#keyUpHandler)
		this.canvas.removeEventListener("mousedown", this.#mouseDownHandler)
		document.removeEventListener("mouseup", this.#mouseUpHandler)
		this.canvas.removeEventListener("mousemove", this.#mouseMoveHandler)
	}
}

