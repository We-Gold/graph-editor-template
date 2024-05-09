import { Editor } from "../editor"
import { Action, ActionInstance } from "./action"

export class AddEdgeAction implements Action {
	keyboardShortcut: Set<string>[] = [new Set(["e"])]

	name: string = "Add Edge"
	icon: string = `<svg width="16" height="16" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
						<path opacity="1" fill="currentColor" d="M256 80C256 62.3 241.7 48 224 48C206.3 48 192 62.3 192 80V224H48C30.3 224 16 238.3 16 256C16 273.7 30.3 288 48 288H192V432C192 449.7 206.3 464 224 464C241.7 464 256 449.7 256 432V288H400C417.7 288 432 273.7 432 256C432 238.3 417.7 224 400 224H256V80Z"/>
						<circle cx="320.403" cy="86.4034" r="23.9034" opacity="1" stroke="currentColor" stroke-width="13"/>
						<circle cx="393.597" cy="159.597" r="23.9034" opacity="1" stroke="currentColor" stroke-width="13"/>
						<line x1="334.427" y1="102.783" x2="377.217" y2="145.573" stroke="currentColor" stroke-width="11"/>
					</svg>`

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

	isDone() {
		return this.endIndex !== null
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

