import { Editor } from "../editor"
import { Vector } from "../vector"
import { Action, ActionInstance } from "./action"

export class AddNodeAction implements Action {
	keyboardShortcut: Set<string>[] = [new Set(["a"])]

	name: string = "Add Node"
	icon: string = ""

	editor: Editor

	constructor(editor: Editor) {
		this.editor = editor
	}

	linkActionManager() {}

	dispatchInstance(): ActionInstance {
		return new AddNodeActionInstance(this, this.editor)
	}
}

export class AddNodeActionInstance implements ActionInstance {
	action: Action
	editor: Editor

	pointToAdd: Vector

	constructor(sourceAction: Action, editor: Editor) {
		this.action = sourceAction
		this.editor = editor

		this.pointToAdd = editor.state.lastMousePosition
	}

	run() {
		// Add the last mouse position to the graph as a node
		this.editor.graph.addNode(this.pointToAdd.x, this.pointToAdd.y, {})
	}

	undo() {
		// TODO: Breaks if remove node is called on the same node
		this.editor.graph.removeLastNode()
	}
}

