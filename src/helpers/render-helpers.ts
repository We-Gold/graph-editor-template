import { Config } from "../config"
import { add, midpoint, normalize, scale, subtract, vector } from "./vector"

type RenderingContext =
	| CanvasRenderingContext2D
	| OffscreenCanvasRenderingContext2D

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
		nodeHoveredWidth,
	}: {
		nodeCircleRadius: number
		nodeAccentColor: string
		nodeHoveredWidth: number
	}
) => {
	// Move to the center of the node
	ctx.save()
	ctx.translate(x, y)

	// Draw the node circle
	ctx.beginPath()
	ctx.arc(0, 0, nodeCircleRadius - nodeHoveredWidth / 2, 0, 2 * Math.PI)
	ctx.fill()

	// Draw a border around the node circle in the accent color
	ctx.strokeStyle = nodeAccentColor
	ctx.lineWidth = nodeHoveredWidth
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
 */
export const batchRenderEdge = (
	ctx: RenderingContext,
	x1: number,
	y1: number,
	x2: number,
	y2: number
) => {
	ctx.moveTo(x1, y1)
	ctx.lineTo(x2, y2)
}

/**
 * Render many edges based on the given configuration
 * @param ctx
 * @param edges
 * @param config
 */
export const batchRenderEdges = (
	ctx: RenderingContext,
	x: (number | null)[],
	y: (number | null)[],
	edges: number[][],
	config: Config
) => {
	// Configure the context for drawing edges
	ctx.strokeStyle = config.edgeColor
	ctx.lineWidth = config.edgeWidth
	ctx.setLineDash([])
	ctx.beginPath()

	// Render all edges
	for (const [i, j] of edges) {
		batchRenderEdge(ctx, x[i]!, y[i]!, x[j]!, y[j]!)
	}

	// Draw all the edges
	ctx.stroke()
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
	ctx.setLineDash([])

	ctx.beginPath()
	ctx.moveTo(x1, y1)
	ctx.lineTo(x2, y2)
	ctx.stroke()
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
export const renderEdgeHovered = (
	ctx: RenderingContext,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	{
		edgeHoveredColor,
		edgeHoveredLength,
		edgeWidth,
	}: {
		edgeHoveredColor: string
		edgeHoveredLength: number
		edgeWidth: number
	}
) => {
	ctx.strokeStyle = edgeHoveredColor
	ctx.lineWidth = edgeWidth / 2

	const v1 = vector(x1, y1)
	const v2 = vector(x2, y2)

	const _midpoint = midpoint(v1, v2)
	const normal = normalize(subtract(v2, v1))

	const side1 = add(_midpoint, scale(normal, edgeHoveredLength / 2))
	const side2 = add(_midpoint, scale(normal, -edgeHoveredLength / 2))

	ctx.setLineDash([edgeHoveredLength / 8, edgeHoveredLength / 4])
	ctx.lineCap = "round"

	ctx.beginPath()
	ctx.moveTo(side1.x, side1.y)
	ctx.lineTo(side2.x, side2.y)
	ctx.stroke()
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
export const renderEdgeSelected = (
	ctx: RenderingContext,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	{
		edgeHoveredColor,
		edgeHoveredLength,
		edgeWidth,
	}: {
		edgeHoveredColor: string
		edgeHoveredLength: number
		edgeWidth: number
	}
) => {
	ctx.strokeStyle = edgeHoveredColor
	ctx.lineWidth = edgeWidth / 2

	const v1 = vector(x1, y1)
	const v2 = vector(x2, y2)

	const _midpoint = midpoint(v1, v2)
	const normal = normalize(subtract(v2, v1))

	const side1 = add(_midpoint, scale(normal, edgeHoveredLength / 2))
	const side2 = add(_midpoint, scale(normal, -edgeHoveredLength / 2))

	ctx.setLineDash([])
	ctx.lineCap = "round"

	ctx.beginPath()
	ctx.moveTo(side1.x, side1.y)
	ctx.lineTo(side2.x, side2.y)
	ctx.stroke()
}

