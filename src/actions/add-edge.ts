import { Editor } from "../editor"
import { Action, ActionInstance } from "./action"

export class AddEdgeAction implements Action {
	keyboardShortcut: Set<string>[] = [new Set(["e"])]

	name: string = "Add Edge"
	icon: string = ""

	editor: Editor

	constructor(editor: Editor) {
		this.editor = editor
	}

	linkActionManager() {}

	dispatchInstance(): ActionInstance {
		return new AddEdgeActionInstance(this, this.editor)
	}
}

export class AddEdgeActionInstance implements ActionInstance {
	action: Action
	editor: Editor

	sourceIndex: number | null = null
	endIndex: number | null = null

	valid: boolean = false

	constructor(sourceAction: Action, editor: Editor) {
		this.action = sourceAction
		this.editor = editor

		const selected = editor.state.selected

		this.valid = selected.type === "node"

		if (this.valid) {
			this.sourceIndex = selected.index
		}
	}

	run() {
		if (!this.valid) return

		const selected = this.editor.state.selected

		if (selected.type !== "node") return

		// Populate source and end indices so that we can create an edge
		if (this.endIndex === null && selected.index !== this.sourceIndex) {
			this.endIndex = selected.index
			this.editor.graph.addEdge(this.sourceIndex!, this.endIndex)
		}
	}

	end() {}

	undo() {
		if (this.valid) {
			this.editor.graph.removeEdgeWithEndpoints(
				this.sourceIndex!,
				this.endIndex!
			)
		}
	}
}

