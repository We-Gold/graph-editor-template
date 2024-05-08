export interface Action {
	name: string

	/**
	 * An SVG icon to display in the action menu
	 */
	icon: string

	keyboardShortcut: Set<string>[]

	/**
	 * Link the action manager to the action,
	 * which may be necessary for some actions like the undo action
	 * @param actionManager
	 */
	linkActionManager: (actionManager: ActionManager) => void

	/**
	 * Dispatch an instance of the action,
	 * which performs the action and adds it to the undo stack
	 * @returns an instance of the action
	 */
	dispatchInstance: () => ActionInstance
}

export interface ActionInstance {
	action: Action

	/**
	 * Run the action
	 */
	run: () => void

	/**
	 * Undo the action, assuming that all following actions have been undone
	 */
	undo: () => void
}

/**
 * Compare two sets for equality
 * Does NOT do a deep comparison
 * https://stackoverflow.com/a/74226286
 * @param a
 * @param b
 * @returns true if the sets are equal, false otherwise
 */
export const areSetsEqual = <T>(a: Set<T>, b: Set<T>) => {
	if (a === b) return true
	if (a.size !== b.size) return false
	for (const value of a) if (!b.has(value)) return false
	return true
}

export class ActionManager {
	actions: Action[] = []

	undoStack: ActionInstance[] = []

	maxUndoStack: number
	tolerance: number

	#keyDownHandler: (e: KeyboardEvent) => void
	#keyUpHandler: (e: KeyboardEvent) => void

	keysHeld: Set<string> = new Set()

	constructor(actions: Action[], { maxUndoStack = 15, tolerance = 10 } = {}) {
		this.maxUndoStack = maxUndoStack
		this.tolerance = tolerance

		this.#keyDownHandler = this.handleKeyDown.bind(this)
		this.#keyUpHandler = this.handleKeyUp.bind(this)

		window.addEventListener("keydown", this.#keyDownHandler)
		window.addEventListener("keyup", this.#keyUpHandler)

		// Add the actions to the manager
		actions.forEach((action) => this.addAction(action))
	}

	handleKeyDown(e: KeyboardEvent) {
		this.keysHeld.add(e.key)

		// Check if any actions should be dispatched
		this.actions.forEach((action) => {
			// Check if the keyboard shortcut for the action matches the keys held
			for (const shortcut of action.keyboardShortcut) {
				if (areSetsEqual(shortcut, this.keysHeld)) {
					this.dispatchAction(action)
				}
			}
		})
	}

	dispatchAction(action: Action) {
		const instance = action.dispatchInstance()
		instance.run()

		// Do not add to the undo stack if the action is an undo action
		if (action.name === "Undo") return

		this.undoStack.push(instance)

		// Limit the undo stack size
		if (this.undoStack.length > this.maxUndoStack + this.tolerance) {
			// Remove enough actions to get back to the maxUndoStack size
			this.undoStack = this.undoStack.slice(-this.maxUndoStack)
		}
	}

	handleKeyUp(e: KeyboardEvent) {
		// The Meta key only triggers keyup events for itself, so reset the keys held
		if (e.key === "Meta") {
			this.keysHeld = new Set()
			return
		}

		this.keysHeld.delete(e.key)
	}

	undo() {
		const action = this.undoStack.pop()
		if (action) {
			action.undo()
			return action
		} else {
			return null
		}
	}

	getActiveAction() {
		if (this.undoStack.length === 0) return null

		return this.undoStack[this.undoStack.length - 1]
	}

	addAction(action: Action) {
		action.linkActionManager(this)
		this.actions.push(action)
	}

	destroy() {
		window.removeEventListener("keydown", this.#keyDownHandler)
		window.removeEventListener("keyup", this.#keyUpHandler)
	}
}

