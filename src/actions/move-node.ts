import { Editor } from "../editor"
import { Vector } from "../helpers/vector"
import { Action, ActionInstance } from "./action"

export class MoveNodeAction implements Action {
	keyboardShortcut: Set<string>[] = [new Set(["w"])]

	name: string = "Move Node"
	icon: string = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512">
						<!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
						<path opacity="1" fill="currentColor"
						d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8h32v96H128V192c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V288h96v96H192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8H288V288h96v32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6v32H288V128h32c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-64-64z"/>
					</svg>`

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

	dragging: boolean = false
	done: boolean = false

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

		if (this.editor.state.mouseDown) {
			const currentPosition = this.editor.state.lastMousePosition

			this.editor.graph.moveNode(
				this.pointIndex!,
				currentPosition.x,
				currentPosition.y
			)

			this.dragging = true
		} else if (this.dragging && !this.editor.state.mouseDown) {
			this.done = true
		}
	}

	isDone() {
		return !this.valid || this.done
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

