/*
Plan: Create basic ECS, where nodes and edges are stored in arrays.
perhaps a static and dynamic option. Static uses typedarrays, dynamic uses arrays.
*/

import { Config } from "./config"
import { incrementColor } from "./helpers/mouse-event-helpers"
import {
	renderEdge,
	renderNode,
	renderNodeOffscreen,
} from "./helpers/render-helpers"
import {
	Vector,
	distance,
	vector,
	distanceFromPointToLine,
} from "./helpers/vector"

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
	x: (number | null)[]
	y: (number | null)[]
	edges: number[][]
	nodeData: (object | null)[]

	config: Config

	constructor(
		config: Config,
		x: number[] = [],
		y: number[] = [],
		edges: number[][] = [],
		nodeData: object[] = []
	) {
		this.config = config
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
	 * @returns {number} The index of the node in the graph
	 */
	addNode(x: number, y: number, data: object): number {
		this.x.push(x)
		this.y.push(y)
		this.nodeData.push(data)

		return this.x.length - 1
	}

	nodeExists(i: number) {
		return this.x[i] !== null && this.y[i] !== null
	}

	insertNode(i: number, x: number, y: number, data: object) {
		this.moveNode(i, x, y)
		this.nodeData[i] = data
	}

	moveNode(i: number, x: number, y: number) {
		this.x[i] = x
		this.y[i] = y
	}

	/**
	 * Remove a node from the graph.
	 * Sets the x and y coordinates, and data to null,
	 * since removing the node would shift the indices of the other nodes,
	 * breaking edges in the graph.
	 * @param i The index of the node to remove
	 */
	removeNode(i: number) {
		this.x[i] = null
		this.y[i] = null
		this.nodeData[i] = null
	}

	removeLastNode() {
		this.removeNode(this.x.length - 1)
	}

	getNode(i: number): { x: number; y: number; data: object } | null {
		if (!this.nodeExists(i)) return null

		return { x: this.x[i]!, y: this.y[i]!, data: this.nodeData[i]! }
	}

	/**
	 * Add an edge to the graph
	 * @param {number} i The index of the first node
	 * @param {number} j The index of the second node
	 */
	addEdge(i: number, j: number) {
		this.edges.push([i, j])
	}

	insertEdge(i: number, u: number, v: number) {
		this.edges.splice(i, 0, [u, v])
	}

	removeLastEdge() {
		this.edges.pop()
	}

	/**
	 * Remove multiple edges from the graph
	 * @param edgeIndices The indices of the edges to remove
	 */
	removeEdges(edgeIndices: number[]) {
		for (let i = edgeIndices.length - 1; i >= 0; i--) {
			this.removeEdge(edgeIndices[i])
		}
	}

	removeEdge(i: number) {
		this.edges.splice(i, 1)
	}

	removeEdgeWithEndpoints(u: number, v: number) {
		for (let i = 0; i < this.edges.length; i++) {
			if (this.edges[i][0] === u && this.edges[i][1] === v) {
				this.removeEdge(i)
				return
			}
		}
	}

	/**
	 * Get the edge value (node values included) at the given index
	 * @param i
	 * @returns
	 */
	getEdgeValue(i: number) {
		return {
			u: this.getNode(this.edges[i][0]),
			v: this.getNode(this.edges[i][1]),
		}
	}

	/**
	 * Get the edge value stored at the given index
	 * @param i
	 * @returns
	 */
	getEdge(i: number) {
		return { u: this.edges[i][0], v: this.edges[i][1] }
	}

	/**
	 * Get the value of a node or edge
	 * @param item The item to get the value of
	 * @returns The value of the item
	 */
	getItemValue(item: GraphItem): any {
		if (item.type === "node") {
			return this.getNode(item.index)
		} else if (item.type === "edge") {
			return this.getEdge(item.index)
		} else {
			return null
		}
	}

	insertItem(item: GraphItem, value: any) {
		if (item.type === "node") {
			this.insertNode(item.index, value.x, value.y, value.data)
		} else if (item.type === "edge") {
			this.insertEdge(item.index, value.u, value.v)
		}
	}

	removeItem(item: GraphItem) {
		if (item.type === "node") {
			this.removeNode(item.index)
		} else if (item.type === "edge") {
			this.removeEdge(item.index)
		}
	}

	/**
	 * Get all edges connected to a node
	 * @param i The index of the node
	 * @returns An array of edges connected to the node
	 */
	getEdgesConnectedToNode(i: number): GraphItem[] {
		const edges: GraphItem[] = []
		for (let j = 0; j < this.edges.length; j++) {
			const [u, v] = this.edges[j]
			if (u === i || v === i) {
				edges.push({ type: "edge", index: j })
			}
		}
		return edges
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

	/**
	 * Check if a point is in a node,
	 * ASSUMING that the node is not null
	 * @param point
	 * @param i
	 * @returns
	 */
	pointInNode(point: Vector, i: number) {
		return (
			distance(point, vector(this.x[i]!, this.y[i]!)) <
			this.config.nodeCircleRadius
		)
	}

	/**
	 * Check if a point is in an edge,
	 * ASSUMING that the edge and points are not null
	 * @param point
	 * @param i
	 * @returns
	 */
	pointInEdge(point: Vector, i: number) {
		const [u, v] = this.edges[i]

		return (
			distanceFromPointToLine(
				point,
				vector(this.x[u]!, this.y[u]!),
				vector(this.x[v]!, this.y[v]!)
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
				this.x[i]!,
				this.y[i]!,
				this.x[j]!,
				this.y[j]!,
				this.config
			)
		}

		// Render all nodes
		for (let i = 0; i < n; i++) {
			if (!this.nodeExists(i)) continue

			renderNode(ctx, this.x[i]!, this.y[i]!, this.config)
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

			renderEdge(ctx, this.x[i]!, this.y[i]!, this.x[j]!, this.y[j]!, {
				edgeColor: colorString,
				edgeWidth: this.config.edgeWidth,
			})

			// Increment the color
			incrementColor(color)
		}

		// Render all nodes
		for (let i = 0; i < n; i++) {
			const colorString = `rgb(${color.r}, ${color.g}, ${color.b})`

			if (!this.nodeExists(i)) continue

			renderNodeOffscreen(ctx, this.x[i]!, this.y[i]!, {
				nodeCircleColor: colorString,
				nodeCircleRadius: this.config.nodeCircleRadius,
			})

			incrementColor(color)
		}
	}
}

