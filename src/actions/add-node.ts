import { Editor } from "../editor"
import { Vector } from "../helpers/vector"
import { Action, ActionInstance } from "./action"

export class AddNodeAction implements Action {
	keyboardShortcut: Set<string>[] = [new Set(["a"])]

	name: string = "Add Node"
	icon: string = `<svg width="16" height="16" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="364" cy="116" r="37" stroke="currentColor" opacity="1" stroke-width="28"/>
                        <path fill="currentColor" opacity="1" 
                        d="M256 80C256 62.3 241.7 48 224 48C206.3 48 192 62.3 192 80V224H48C30.3 224 16 238.3 16 256C16 273.7 30.3 288 48 288H192V432C192 449.7 206.3 464 224 464C241.7 464 256 449.7 256 432V288H400C417.7 288 432 273.7 432 256C432 238.3 417.7 224 400 224H256V80Z"/>
                    </svg>`

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

	pointToAdd: Vector | null = null
	pointIndex: number | null = null

	mouseUp: boolean = false
	done: boolean = false

	constructor(sourceAction: Action, editor: Editor) {
		this.action = sourceAction
		this.editor = editor
	}

	run() {
		if (this.editor.state.mouseDown && !this.done) {
			this.pointToAdd = this.editor.state.lastMousePosition

			// Add the last mouse position to the graph as a node
			this.pointIndex = this.editor.graph.addNode(
				this.pointToAdd.x,
				this.pointToAdd.y,
				{}
			)

			this.done = true
		} else if (this.done && !this.editor.state.mouseDown) {
			this.mouseUp = true
		}
	}

	isDone() {
		return this.done && this.mouseUp
	}

	end() {}

	undo() {
		if (this.pointIndex !== null)
			this.editor.graph.removeNode(this.pointIndex)
	}
}

