import { Config } from "../config"

/**
 * Create a container element
 * @returns {HTMLElement} The container element
 */
export const defaultContainer = (): HTMLElement => {
	const container = document.createElement("div")
	document.appendChild(container)
	return container
}

/**
 * Configure the container element to be full screen
 * and to be centered in the document
 * @param {HTMLElement} container The container element
 */
export const configureContainer = (container: HTMLElement) => {
	// Center the container in the document
	container.style.position = "absolute"
	container.style.top = "0"
	container.style.left = "0"

	// Make the container full screen
	container.style.width = "100vw"
	container.style.height = "100vh"
	container.style.margin = "0"
	container.style.padding = "0"
	container.style.display = "flex"
	container.style.justifyContent = "center"
	container.style.alignItems = "center"
	container.style.overflow = "hidden"
	container.style.backgroundColor = "rgb(30, 30, 30)"

	// Make sure the container does not scroll on mobile
	container.style.touchAction = "none"
}

export const configureStyles = (config: Config) => {
	const root: HTMLElement | null = document.querySelector(":root")

	if (root === null) {
		throw new Error("Error: No root element found")
	}

	root.style.setProperty("--button-accent-color", config.buttonAccentColor)
	root.style.setProperty(
		"--button-background-color",
		config.buttonBackgroundColor
	)
	root.style.setProperty("--button-hover-color", config.buttonHoverColor)
	root.style.setProperty("--button-text-color", config.buttonTextColor)
	root.style.setProperty("--button-width", config.buttonWidth)
}

/**
 * Initialize the main canvas and the offscreen canvas.
 * The main canvas will be initialized to take up the whole parent element,
 * and to automatically resize when the window is resized. Its resulution will
 * be set to the device's pixel ratio.
 * @param {HTMLElement} container The container element
 * @returns {[HTMLCanvasElement, OffscreenCanvas]} The main canvas and the offscreen canvas
 */
export const initializeCanvases = (
	container: HTMLElement
): [HTMLCanvasElement, OffscreenCanvas] => {
	const canvas = document.createElement("canvas")

	// Create an offscreen canvas with the same size as the main canvas
	const offscreenCanvas = new OffscreenCanvas(canvas.width, canvas.height)

	const resizeCanvas = () => {
		const { width, height } = container.getBoundingClientRect()

		canvas.width = width * window.devicePixelRatio
		canvas.height = height * window.devicePixelRatio
		canvas.style.width = `${width}px`
		canvas.style.height = `${height}px`

		// Resize the offscreen canvas
		// Note: the DOM size of the canvas is irrelevant since the offscreen canvas
		// is not rendered to the screen
		offscreenCanvas.width = canvas.width
		offscreenCanvas.height = canvas.height
	}

	window.addEventListener("resize", resizeCanvas)
	resizeCanvas()

	// Add the canvas to the container
	container.appendChild(canvas)

	return [canvas, offscreenCanvas]
}

/**
 * Create a loop that renders the canvas and the offscreen canvas,
 * while calling a callback function.
 * @param {HTMLCanvasElement} canvas The main canvas
 * @param {OffscreenCanvas} offscreenCanvas The offscreen canvas
 * @param {(ctx: CanvasRenderingContext2D, offscreenCtx: OffscreenCanvasRenderingContext2D) => void} callback The callback function
 * @returns {() => void} A function that stops the loop
 */
export const renderLoop = (
	canvas: HTMLCanvasElement,
	offscreenCanvas: OffscreenCanvas,
	callback: (
		ctx: CanvasRenderingContext2D,
		offscreenCtx: OffscreenCanvasRenderingContext2D
	) => void
): (() => void) => {
	const ctx = canvas.getContext("2d")
	const offscreenCtx = offscreenCanvas.getContext("2d")

	if (ctx === null || offscreenCtx === null) {
		throw new Error("Error: Could not get rendering context")
	}

	let lastAnimationRequestID = -1

	const loop = () => {
		callback(ctx, offscreenCtx)
		lastAnimationRequestID = requestAnimationFrame(loop)
	}

	loop()

	return () => {
		// Stop the loop
		cancelAnimationFrame(lastAnimationRequestID)
	}
}

