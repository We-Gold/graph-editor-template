import { ActionButton } from "./action-button"

import "./action.css"

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

/**
 * An instance of an action. This is created when an action is dispatched,
 * and it is what performs the action and is added to the undo stack.
 *
 * The lifecycle of an action instance is as follows:
 * 1. The action instance is created when the action is dispatched (either when a key is pressed or when a button is clicked)
 * 2. The constructor of the action instance is called once to create the instance, so any one-time operations go here.
 * 3. The run method is called continuously while the action is active.
 * 4. The end method is called once the action is disabled by the action manager.
 * 5. The undo method is called if the action is undone, assuming that all following actions have been undone.
 */
export interface ActionInstance {
	action: Action

	/**
	 * Runs continuously while the action is active
	 */
	run: () => void

	/**
	 * Returns true if the action is complete
	 * @returns true if the action is complete, false otherwise
	 */
	isDone: () => boolean

	/**
	 * Runs once the action is disabled by the action manager
	 */
	end: () => void

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

	container: HTMLElement
	actionButtonArea: HTMLElement
	shortcutInfoArea: HTMLElement

	undoStack: ActionInstance[] = []

	maxUndoStack: number
	tolerance: number

	#keyDownHandler: (e: KeyboardEvent) => void
	#keyUpHandler: (e: KeyboardEvent) => void

	keysHeld: Set<string> = new Set()

	activeAction: ActionInstance | null = null

	constructor(
		actions: Action[],
		container: HTMLElement,
		{ maxUndoStack = 15, tolerance = 10 } = {}
	) {
		this.maxUndoStack = maxUndoStack
		this.tolerance = tolerance

		this.container = container

		// Add the action button area to the container
		this.actionButtonArea = document.createElement("div")
		this.actionButtonArea.classList.add("action-button-area")
		this.container.appendChild(this.actionButtonArea)

		// Add the shortcut info area to the container
		this.shortcutInfoArea = document.createElement("div")
		this.shortcutInfoArea.classList.add("shortcut-info-area")
		this.shortcutInfoArea.style.display = "none"
		this.container.appendChild(this.shortcutInfoArea)

		// Show or hide the shortcut info area based on the info button state
		window.addEventListener("info-button-active", () => {
			this.shortcutInfoArea.style.display = "flex"
		})
		window.addEventListener("info-button-inactive", () => {
			this.shortcutInfoArea.style.display = "none"
		})

		this.#keyDownHandler = this.handleKeyDown.bind(this)
		this.#keyUpHandler = this.handleKeyUp.bind(this)

		window.addEventListener("keydown", this.#keyDownHandler)
		window.addEventListener("keyup", this.#keyUpHandler)

		// Add the actions to the manager
		actions.forEach((action) => this.addAction(action))
	}

	/**
	 * To be called in the render loop,
	 * runs the current action if there is one.
	 */
	runCurrentAction() {
		if (this.activeAction) {
			this.activeAction.run()

			if (this.activeAction.isDone()) {
				this.#endCurrentAction()
			}
		}
	}

	handleKeyDown(e: KeyboardEvent) {
		this.keysHeld.add(e.key)

		// Avoid dispatching multiple actions at once
		if (this.activeAction !== null) return

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

		this.activeAction = instance

		// Broadcast an event that the active action has started
		const event = new CustomEvent("action-started", {
			detail: {
				actionName: action.name,
			},
		})
		window.dispatchEvent(event)

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
		if (e.key === "Meta" || this.keysHeld.has("Meta")) {
			this.keysHeld = new Set()
		} else {
			this.keysHeld.delete(e.key)
		}

		// End the active action if the active action no longer matches the keys held
		if (this.activeAction !== null) {
			let shouldEnd = true

			// Check if the keyboard shortcut for the action matches the keys held
			for (const shortcut of this.activeAction.action.keyboardShortcut)
				if (areSetsEqual(shortcut, this.keysHeld)) shouldEnd = false

			if (shouldEnd) {
				this.#endCurrentAction()
			}
		}
	}

	#endCurrentAction() {
		if (this.activeAction !== null) {
			this.activeAction.end()

			// Broadcast an event that the active action has ended
			const event = new CustomEvent("action-ended", {
				detail: {
					actionName: this.activeAction.action.name,
				},
			})
			window.dispatchEvent(event)

			// Clear the active action
			this.activeAction = null
		}
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

	addAction(action: Action) {
		action.linkActionManager(this)
		this.actions.push(action)

		// Add a button for the action
		new ActionButton(this, action)
	}

	destroy() {
		window.removeEventListener("keydown", this.#keyDownHandler)
		window.removeEventListener("keyup", this.#keyUpHandler)
	}
}

