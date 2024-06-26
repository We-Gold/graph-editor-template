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

/**
 * Configure the style variables of the root element based on the given configuration
 * @param config
 */
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

/**
 * Add a button to show and hide shortcut information
 * @param container the container element of the graph editor
 */
export const addInfoButton = (container: HTMLElement) => {
	const infoButton = document.createElement("a")
	infoButton.title = "Show or hide shortcut information"
	infoButton.setAttribute("aria-label", "Show or hide shortcut information")
	infoButton.classList.add("info-button")
	infoButton.classList.add("base-button")
	infoButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 320 512">
								<!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
								<path opacity="1" fill="currentColor" 
								d="M80 160c0-35.3 28.7-64 64-64h32c35.3 0 64 28.7 64 64v3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74V320c0 17.7 14.3 32 32 32s32-14.3 32-32v-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7V160c0-70.7-57.3-128-128-128H144C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"/>
							</svg>`

	const infoButtonActiveEvent = new Event("show-shortcut-info")
	const infoButtonInactiveEvent = new Event("hide-shortcut-info")

	infoButton.addEventListener("click", () => {
		window.dispatchEvent(
			infoButton.classList.contains("info-button-active")
				? infoButtonInactiveEvent
				: infoButtonActiveEvent
		)
		infoButton.classList.toggle("info-button-active")
	})

	container.appendChild(infoButton)
}

export const addPanel = (container: HTMLElement, config: Config) => {
	const panel = document.createElement("div")
	panel.classList.add("panel")
	panel.classList.add("fadeable")
	panel.innerHTML = `<h1>Graph Editor</h1>
						<p>Add description here</p>`

	if (!config.showPanelDefault) panel.classList.add("fade")

	// Create a button to hide the panel
	const closeButton = document.createElement("a")
	closeButton.title = "Close the panel"
	closeButton.setAttribute("aria-label", "Close the panel")
	closeButton.classList.add("close-panel-button")

	closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 448 512">
								<!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
								<path opacity="1" fill="currentColor" 
								d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
							</svg>`

	// Create a button to show the panel
	const showButton = document.createElement("a")
	showButton.title = "Show the panel"
	showButton.setAttribute("aria-label", "Show the panel")
	showButton.classList.add("show-panel-button")
	showButton.classList.add("fadeable")

	if (config.showPanelDefault) showButton.classList.add("fade")

	showButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 448 512">
								<!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
								<path opacity="1" fill="currentColor" 
								d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
							</svg>`

	closeButton.addEventListener("click", () => {
		panel.classList.add("fade")
		showButton.classList.remove("fade")
	})

	showButton.addEventListener("click", () => {
		panel.classList.remove("fade")
		showButton.classList.add("fade")
	})

	// Add the close button to the panel
	panel.appendChild(closeButton)

	// Add the show button to the container
	container.appendChild(showButton)

	container.appendChild(panel)
}

