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
	pointIndex: number

	constructor(sourceAction: Action, editor: Editor) {
		this.action = sourceAction
		this.editor = editor

		this.pointToAdd = editor.state.lastMousePosition

		// Add the last mouse position to the graph as a node
		this.pointIndex = this.editor.graph.addNode(
			this.pointToAdd.x,
			this.pointToAdd.y,
			{}
		)
	}

	run() {}

	end() {}

	undo() {
		// Note: this only works because we assume any actions taken after this
		// action are undone before this action is undone.
		this.editor.graph.removeNode(this.pointIndex)
	}
}

