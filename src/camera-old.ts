export class Camera {
	canvas: HTMLCanvasElement

	offset: { x: number; y: number }
	prevDragPosition: { x: number; y: number } | null = null
	scale: number
	dragging: boolean = false
	controlHeld: boolean = false
	shiftHeld: boolean = false

	#keyDownHandler: (e: KeyboardEvent) => void
	#keyUpHandler: (e: KeyboardEvent) => void
	#mouseDownHandler: (e: MouseEvent) => void
	#mouseUpHandler: (e: MouseEvent) => void
	#mouseMoveHandler: (e: MouseEvent) => void

	constructor(canvas: HTMLCanvasElement) {
		const dpr = window.devicePixelRatio

		// Initilize the camera with a scale based on the device pixel ratio
		this.scale = dpr

		this.offset = {
			x: 200,
			y: 200,
		}

		// this.offset = {
		// 	x: canvas.width / (2 * dpr),
		// 	y: canvas.height / (2 * dpr),
		// }
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
		this.prevDragPosition = { x: e.clientX, y: e.clientY }
	}

	handleMouseUp() {
		this.dragging = false
		this.prevDragPosition = null
	}

	handleMouseMove(e: MouseEvent) {
		if (this.dragging && this.shiftHeld) {
			const scalar = window.devicePixelRatio / this.scale

			const mouse = { x: e.clientX, y: e.clientY }

			// Skip any invalid drag event
			if (this.prevDragPosition === null) {
				this.prevDragPosition = mouse
				return
			}

			this.offset.x += (mouse.x - this.prevDragPosition.x) * scalar * 2
			this.offset.y += (mouse.y - this.prevDragPosition.y) * scalar * 2

			this.prevDragPosition = mouse
		} else if (this.dragging && this.controlHeld) {
			const mouse = { x: e.clientX, y: e.clientY }

			// Skip any invalid drag event
			if (this.prevDragPosition === null) {
				this.prevDragPosition = mouse
				return
			}

			const dx = mouse.x - this.prevDragPosition.x

			const scale = Math.exp(dx / 100)
			this.scale *= scale

			this.prevDragPosition = mouse
		}
	}

	getMousePosition(e: MouseEvent) {
		const scalar = window.devicePixelRatio / this.scale

		return {
			x: (e.clientX - this.offset.x) * scalar,
			y: (e.clientY - this.offset.y) * scalar,
		}
	}

	render(ctx: CanvasRenderingContext2D) {
		// const dpr = window.devicePixelRatio

		ctx.restore()
		ctx.save()
		ctx.scale(this.scale, this.scale)
		ctx.translate(
			this.offset.x, // + this.canvas.width / (2 * dpr),
			this.offset.y // + this.canvas.height / (2 * dpr)
		)

		// ctx.translate(
		// 	this.canvas.width / (2 * dpr),
		// 	this.canvas.height / (2 * dpr)
		// )
		// ctx.translate(
		// 	this.offset.x + this.canvas.width / (2 * dpr),
		// 	this.offset.y + this.canvas.height / (2 * dpr)
		// )
		// ctx.scale(this.scale, this.scale)
	}

	renderOffscreen(ctx: OffscreenCanvasRenderingContext2D) {
		ctx.restore()
		ctx.save()
		// TODO
		ctx.translate(this.offset.x, this.offset.y)
		ctx.scale(this.scale, this.scale)
	}

	destroy() {
		document.removeEventListener("keydown", this.#keyDownHandler)
		document.removeEventListener("keyup", this.#keyUpHandler)
		this.canvas.removeEventListener("mousedown", this.#mouseDownHandler)
		document.removeEventListener("mouseup", this.#mouseUpHandler)
		this.canvas.removeEventListener("mousemove", this.#mouseMoveHandler)
	}
}

