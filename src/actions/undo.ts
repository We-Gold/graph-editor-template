import { Action, ActionInstance, ActionManager } from "./action"

export class UndoAction implements Action {
	keyboardShortcut: Set<string>[] = [
		new Set(["Control", "z"]),
		new Set(["Meta", "z"]),
	]

	name: string = "Undo"
	icon: string = ""

	actionManager: ActionManager | null = null

	linkActionManager(actionManager: ActionManager) {
		this.actionManager = actionManager
	}

	dispatchInstance(): ActionInstance {
		return new UndoActionInstance(this, this.actionManager)
	}
}

export class UndoActionInstance implements ActionInstance {
	action: Action
	actionManager: ActionManager | null

	constructor(sourceAction: Action, actionManager: ActionManager | null) {
		this.action = sourceAction
		this.actionManager = actionManager
	}

	run() {
		this.actionManager?.undo()
	}

	undo() {}
}

