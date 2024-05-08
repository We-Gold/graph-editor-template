import { Editor } from "../editor"
import { Vector } from "../vector"
import { Action, ActionInstance } from "./action"

export class MoveNodeAction implements Action {
	keyboardShortcut: Set<string>[] = [new Set(["w"])]

	name: string = "Move Node"
	icon: string = ""

	editor: Editor

	constructor(editor: Editor) {
		this.editor = editor
	}

	linkActionManager() {}

	dispatchInstance(): ActionInstance {
		return new MoveNodeActionInstance(this, this.editor)
	}
}

export class MoveNodeActionInstance implements ActionInstance {
	action: Action
	editor: Editor

	startingPosition: Vector | null = null
	pointIndex: number | null = null

	valid: boolean

	constructor(sourceAction: Action, editor: Editor) {
		this.action = sourceAction
		this.editor = editor

		this.valid = editor.state.selected.type === "node"

		if (!this.valid) return

		this.pointIndex = editor.state.selected.index
		this.startingPosition = editor.graph.getItemValue(editor.state.selected)
	}

	run() {
		if (!this.valid) return

		const currentPosition = this.editor.state.lastMousePosition

		this.editor.graph.moveNode(
			this.pointIndex!,
			currentPosition.x,
			currentPosition.y
		)
	}

	end() {}

	undo() {
		if (!this.valid) return

		this.editor.graph.moveNode(
			this.pointIndex!,
			this.startingPosition!.x,
			this.startingPosition!.y
		)
	}
}

