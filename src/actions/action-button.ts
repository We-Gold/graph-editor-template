import { Action, ActionManager } from "./action"

export class ActionButton {
	actionManager: ActionManager
	action: Action

	button: HTMLAnchorElement

	constructor(actionManager: ActionManager, action: Action) {
		this.actionManager = actionManager
		this.action = action

		this.button = this.#createButton()

		// Bind the button to the action manager's dispatch method
		this.#bindEvents()

		// Attach the button to the action manager's button area
		this.#attach()
	}

	#createButton() {
		const button = document.createElement("a")
		button.classList.add("action-button")
		button.title = this.action.name

		button.innerHTML = this.action.icon

		return button
	}

	#bindEvents() {
		// Dispatch the action when the button is clicked
		this.button.addEventListener("click", () => {
			// Avoid dispatching multiple actions at once
			if (this.actionManager.activeAction) return

			this.actionManager.dispatchAction(this.action)
			this.button.classList.add("selected-action-button")
		})

		// When the action ends, remove the active class from the button
		window.addEventListener("action-ended", ((e: CustomEvent) => {
			if (e.detail.actionName === this.action.name)
				this.button.classList.remove("selected-action-button")
		}) as EventListener)
	}

	#attach() {
		this.actionManager.actionButtonArea.appendChild(this.button)
	}
}

