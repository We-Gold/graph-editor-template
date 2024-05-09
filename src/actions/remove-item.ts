import { Editor } from "../editor"
import { GraphItem, NoneGraphItem } from "../graph"
import { Action, ActionInstance } from "./action"

export class RemoveItemAction implements Action {
	keyboardShortcut: Set<string>[] = [
		new Set(["Backspace"]),
		new Set(["Delete"]),
	]

	name: string = "Remove Item"
	icon: string = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 448 512">
						<!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
						<path opacity="1" fill="currentColor" 
						d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
					</svg>`

	editor: Editor

	constructor(editor: Editor) {
		this.editor = editor
	}

	linkActionManager() {}

	dispatchInstance(): ActionInstance {
		return new RemoveItemActionInstance(this, this.editor)
	}
}

export class RemoveItemActionInstance implements ActionInstance {
	action: Action
	editor: Editor

	itemToRemove: GraphItem
	valueOfItemToRemove: any
	valid: boolean

	/**
	 * Optional properties for if a node is removed
	 */
	edgesToRemove: GraphItem[] | null = null
	valueOfEdgesToRemove: { u: number; v: number }[] | null = null

	constructor(sourceAction: Action, editor: Editor) {
		this.action = sourceAction
		this.editor = editor

		this.itemToRemove = editor.state.selected
		this.valueOfItemToRemove = editor.graph.getItemValue(this.itemToRemove)

		this.valid = this.itemToRemove.type !== "none"

		if (this.valid) {
			// If the item is a node, remove all edges connected to it and store them
			if (this.itemToRemove.type === "node") {
				// Get the edges connected to the node
				this.edgesToRemove = editor.graph.getEdgesConnectedToNode(
					this.itemToRemove.index
				)

				// Store the values of the edges to remove
				this.valueOfEdgesToRemove = this.edgesToRemove.map((edge) =>
					editor.graph.getEdge(edge.index)
				)

				// Remove the edges from the graph
				editor.graph.removeEdges(
					this.edgesToRemove.map((edge) => edge.index)
				)
			}

			editor.graph.removeItem(this.itemToRemove)

			// Remove focus from the item
			editor.state.selected = NoneGraphItem

			// Remove hover from the item if it was hovered
			if (
				editor.state.hovered.index === this.itemToRemove.index &&
				editor.state.hovered.type === this.itemToRemove.type
			) {
				editor.state.hovered = NoneGraphItem
			}
		}
	}

	run() {}

	isDone() {
		return true
	}

	end() {}

	undo() {
		if (this.valid) {
			// Insert the item back into the graph
			this.editor.graph.insertItem(
				this.itemToRemove,
				this.valueOfItemToRemove
			)

			// If the item was a node, insert the edges back into the graph
			if (this.itemToRemove.type === "node") {
				for (let i = 0; i < this.edgesToRemove!.length; i++) {
					const edge = this.valueOfEdgesToRemove![i]

					// Push each edge back into the graph
					this.editor.graph.addEdge(edge.u, edge.v)
				}
			}
		}
	}
}

