/*
Plan: Create basic ECS, where nodes and edges are stored in arrays.
perhaps a static and dynamic option. Static uses typedarrays, dynamic uses arrays.
*/

import { incrementColor } from "./mouse-event-helpers"
import { renderEdge, renderNode, renderNodeOffscreen } from "./render-helpers"
import { Vector, distance, vector, distanceFromPointToLine } from "./vector"

export type GraphItem = { type: "node" | "edge" | "none"; index: number }
export const NoneGraphItem: GraphItem = { type: "none", index: -1 }

/**
 * The graph class manages all nodes and edges in the graph.
 * It can be used to add, render, and delete nodes and edges.
 *
 * @param {boolean} dynamic Whether to use dynamic arrays or typed arrays
 * @returns {Graph} The graph object
 */
export class Graph {
	x: number[]
	y: number[]
	edges: number[][]
	nodeData: object[]

	config: {
		nodeCircleColor: string
		nodeCircleRadius: number
		nodeAccentColor: string
		edgeColor: string
		edgeWidth: number
		nodeSelectedRadius: number
		nodeHoveredWidth: number
		edgeHoveredLength: number
		edgeHoveredColor: string
	}

	constructor(
		x: number[] = [],
		y: number[] = [],
		edges: number[][] = [],
		nodeData: object[] = [],
		config = {
			nodeCircleColor: "white",
			nodeCircleRadius: 12,
			nodeAccentColor: "turquoise",
			edgeColor: "gray",
			edgeWidth: 6,
			nodeSelectedRadius: 4,
			nodeHoveredWidth: 3,
			edgeHoveredLength: 20,
			edgeHoveredColor: "turquoise",
		}
	) {
		this.x = x
		this.y = y
		this.edges = edges
		this.nodeData = nodeData
		this.config = config
	}

	/**
	 * Add a node to the graph
	 * @param {number} x The x coordinate of the node
	 * @param {number} y The y coordinate of the node
	 * @param {object} data The data associated with the node
	 */
	addNode(x: number, y: number, data: object) {
		this.x.push(x)
		this.y.push(y)
		this.nodeData.push(data)
	}

	removeLastNode() {
		this.x.pop()
		this.y.pop()
		this.nodeData.pop()
	}

	getNode(i: number) {
		return { x: this.x[i], y: this.y[i], data: this.nodeData[i] }
	}

	getEdge(i: number) {
		return {
			u: this.getNode(this.edges[i][0]),
			v: this.getNode(this.edges[i][1]),
		}
	}

	removeLastEdge() {
		this.edges.pop()
	}

	/**
	 * Add an edge to the graph
	 * @param {number} i The index of the first node
	 * @param {number} j The index of the second node
	 */
	addEdge(i: number, j: number) {
		this.edges.push([i, j])
	}

	/**
	 * Get either a node or an edge at the given index
	 * @param mouse The mouse position in the world space
	 * @param i The index of the item based on the order in which it was added (edges are added first, then nodes)
	 * @returns {GraphItem} The type of item and its index in its respective array
	 */
	getItemAtIndex(mouse: Vector, i: number): GraphItem {
		if (
			this.isIndexNode(i) &&
			this.pointInNode(mouse, i - this.edges.length)
		) {
			return { type: "node", index: i - this.edges.length }
		} else if (this.isIndexEdge(i) && this.pointInEdge(mouse, i)) {
			return { type: "edge", index: i }
		} else {
			return NoneGraphItem
		}
	}

	isIndexNode(i: number) {
		return !this.isIndexEdge(i)
	}

	isIndexEdge(i: number) {
		return i < this.edges.length
	}

	pointInNode(point: Vector, i: number) {
		return (
			distance(point, vector(this.x[i], this.y[i])) <
			this.config.nodeCircleRadius
		)
	}

	pointInEdge(point: Vector, i: number) {
		const [u, v] = this.edges[i]

		return (
			distanceFromPointToLine(
				point,
				vector(this.x[u], this.y[u]),
				vector(this.x[v], this.y[v])
			) < this.config.edgeWidth
		)
	}

	/**
	 * Render the graph to a canvas.
	 * Note: Edges are rendered first, then nodes are rendered on top.
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
	render(ctx: CanvasRenderingContext2D) {
		const n = this.x.length

		// Render all edges
		for (const [i, j] of this.edges) {
			renderEdge(
				ctx,
				this.x[i],
				this.y[i],
				this.x[j],
				this.y[j],
				this.config
			)
		}

		// Render all nodes
		for (let i = 0; i < n; i++) {
			renderNode(ctx, this.x[i], this.y[i], this.config)
		}
	}

	/**
	 * Render the graph to an offscreen canvas (render unique colors for each node and edge)
	 * Note: Edges are rendered first, then nodes are rendered on top.
	 * @param {OffscreenCanvasRenderingContext2D} ctx The offscreen canvas rendering context
	 */
	renderOffscreen(ctx: OffscreenCanvasRenderingContext2D) {
		const color = {
			r: 0,
			g: 0,
			b: 0,
		}

		const n = this.x.length

		// Render all edges
		for (const [i, j] of this.edges) {
			const colorString = `rgb(${color.r}, ${color.g}, ${color.b})`

			renderEdge(ctx, this.x[i], this.y[i], this.x[j], this.y[j], {
				edgeColor: colorString,
				edgeWidth: this.config.edgeWidth,
			})

			// Increment the color
			incrementColor(color)
		}

		// Render all nodes
		for (let i = 0; i < n; i++) {
			const colorString = `rgb(${color.r}, ${color.g}, ${color.b})`

			renderNodeOffscreen(ctx, this.x[i], this.y[i], {
				nodeCircleColor: colorString,
				nodeCircleRadius: this.config.nodeCircleRadius,
			})

			incrementColor(color)
		}
	}
}

