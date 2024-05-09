import { Editor } from "../editor"
import { GraphItem, NoneGraphItem } from "../graph"
import { Action, ActionInstance } from "./action"

export class DeselectAction implements Action {
	keyboardShortcut: Set<string>[] = [new Set(["d"])]

	name: string = "Deselect"
	icon: string = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512">
						<!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
						<path opacity="1" fill="currentColor"
						d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
					</svg>`

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

	isDone() {
		return true
	}

	end() {}

	undo() {
		this.editor.state.selected = this.selectedItem
	}
}

