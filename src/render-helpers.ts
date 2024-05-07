type RenderingContext =
	| CanvasRenderingContext2D
	| OffscreenCanvasRenderingContext2D

// TODO: Add active, hover, and dash features for nodes and edges

/**
 * Render a node based on the given configuration
 * @param {RenderingContext} ctx The rendering context
 * @param {number} x The x coordinate of the node
 * @param {number} y The y coordinate of the node
 * @param {object} config The configuration object
 */
export const renderNode = (
	ctx: RenderingContext,
	x: number,
	y: number,
	{
		nodeCircleColor,
		nodeCircleRadius,
	}: {
		nodeCircleColor: string
		nodeCircleRadius: number
	}
) => {
	ctx.fillStyle = nodeCircleColor

	// Move to the center of the node
	ctx.save()
	ctx.translate(x, y)

	// Draw the node circle
	ctx.beginPath()
	ctx.arc(0, 0, nodeCircleRadius, 0, 2 * Math.PI)
	ctx.fill()

	ctx.restore()
}

/**
 * Render a node based on the given configuration
 * @param {RenderingContext} ctx The rendering context
 * @param {number} x The x coordinate of the node
 * @param {number} y The y coordinate of the node
 * @param {object} config The configuration object
 */
export const renderNodeOffscreen = (
	ctx: RenderingContext,
	x: number,
	y: number,
	{
		nodeCircleColor,
		nodeCircleRadius,
	}: {
		nodeCircleColor: string
		nodeCircleRadius: number
	}
) => {
	ctx.save()
	ctx.fillStyle = nodeCircleColor

	// Move to the center of the node
	ctx.translate(x, y)

	// Draw the node circle
	ctx.beginPath()
	ctx.arc(0, 0, nodeCircleRadius, 0, 2 * Math.PI)
	ctx.fill()

	ctx.restore()
}

/**
 * Render a node based on the given configuration
 * @param {RenderingContext} ctx The rendering context
 * @param {number} x The x coordinate of the node
 * @param {number} y The y coordinate of the node
 * @param {object} config The configuration object
 */
export const renderNodeHovered = (
	ctx: RenderingContext,
	x: number,
	y: number,
	{
		nodeCircleRadius,
		nodeAccentColor,
		nodeHoverWidth,
	}: {
		nodeCircleRadius: number
		nodeAccentColor: string
		nodeHoverWidth: number
	}
) => {
	// Move to the center of the node
	ctx.save()
	ctx.translate(x, y)

	// Draw the node circle
	ctx.beginPath()
	ctx.arc(0, 0, nodeCircleRadius - nodeHoverWidth / 2, 0, 2 * Math.PI)
	ctx.fill()

	// Draw a border around the node circle in the accent color
	ctx.strokeStyle = nodeAccentColor
	ctx.lineWidth = nodeHoverWidth
	ctx.stroke()

	ctx.restore()
}

/**
 * Render a node based on the given configuration
 * @param {RenderingContext} ctx The rendering context
 * @param {number} x The x coordinate of the node
 * @param {number} y The y coordinate of the node
 * @param {object} config The configuration object
 */
export const renderNodeSelected = (
	ctx: RenderingContext,
	x: number,
	y: number,
	{
		nodeAccentColor,
		nodeSelectedRadius,
	}: {
		nodeAccentColor: string
		nodeSelectedRadius: number
	}
) => {
	// Move to the center of the node
	ctx.save()
	ctx.fillStyle = nodeAccentColor

	ctx.translate(x, y)

	// Draw the node circle
	ctx.beginPath()
	ctx.arc(0, 0, nodeSelectedRadius, 0, 2 * Math.PI)
	ctx.fill()

	ctx.restore()
}

/**
 * Render an edge based on the given configuration
 * @param {RenderingContext} ctx The rendering context
 * @param {number} x1 The x coordinate of the first node
 * @param {number} y1 The y coordinate of the first node
 * @param {number} x2 The x coordinate of the second node
 * @param {number} y2 The y coordinate of the second node
 * @param {object} config The configuration object
 */
export const renderEdge = (
	ctx: RenderingContext,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	{
		edgeColor,
		edgeWidth,
	}: {
		edgeColor: string
		edgeWidth: number
	}
) => {
	ctx.strokeStyle = edgeColor
	ctx.lineWidth = edgeWidth

	ctx.beginPath()
	ctx.moveTo(x1, y1)
	ctx.lineTo(x2, y2)
	ctx.stroke()
}

