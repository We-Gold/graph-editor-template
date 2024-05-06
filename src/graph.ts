/*
Plan: Create basic ECS, where nodes and edges are stored in arrays.
perhaps a static and dynamic option. Static uses typedarrays, dynamic uses arrays.
*/

import { incrementColor } from "./mouse-event-helpers"
import { renderEdge, renderNode } from "./render-helpers"

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

	constructor(
		x: number[] = [],
		y: number[] = [],
		edges: number[][] = [],
		nodeData: object[] = []
	) {
		this.x = x
		this.y = y
		this.edges = edges
		this.nodeData = nodeData
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

	/**
	 * Add an edge to the graph
	 * @param {number} i The index of the first node
	 * @param {number} j The index of the second node
	 */
	addEdge(i: number, j: number) {
		this.edges.push([i, j])
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
			renderEdge(ctx, this.x[i], this.y[i], this.x[j], this.y[j], {
				edgeColor: "gray",
				edgeWidth: 6,
			})
		}

		// Render all nodes
		for (let i = 0; i < n; i++) {
			renderNode(ctx, this.x[i], this.y[i], {
				nodeCircleColor: "white",
				nodeCircleRadius: 12,
				nodeAccentColor: "turquoise",
			})
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
				edgeWidth: 6,
			})

			// Increment the color
			incrementColor(color)
		}

		// Render all nodes
		for (let i = 0; i < n; i++) {
			const colorString = `rgb(${color.r}, ${color.g}, ${color.b})`

			renderNode(ctx, this.x[i], this.y[i], {
				nodeCircleColor: colorString,
				nodeCircleRadius: 12,
				nodeAccentColor: colorString,
			})

			incrementColor(color)
		}
	}
}

