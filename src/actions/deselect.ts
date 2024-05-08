import { Editor } from "../editor"
import { GraphItem, NoneGraphItem } from "../graph"
import { Action, ActionInstance } from "./action"

export class DeselectAction implements Action {
	keyboardShortcut: Set<string>[] = [new Set(["d"])]

	name: string = "Deselect"
	icon: string = ""

	editor: Editor

	constructor(editor: Editor) {
		this.editor = editor
	}

	linkActionManager() {}

	dispatchInstance(): ActionInstance {
		return new DeselectActionInstance(this, this.editor)
	}
}

export class DeselectActionInstance implements ActionInstance {
	action: Action
	editor: Editor

	selectedItem: GraphItem

	constructor(sourceAction: Action, editor: Editor) {
		this.action = sourceAction
		this.editor = editor

		this.selectedItem = editor.state.selected

		// Remove the current selection
		editor.state.selected = NoneGraphItem
	}

	run() {}

	end() {}

	undo() {
		this.editor.state.selected = this.selectedItem
	}
}

