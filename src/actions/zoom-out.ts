import { Camera } from "../camera"
import { Action, ActionInstance } from "./action"

export class ZoomOutAction implements Action {
	keyboardShortcut: Set<string>[] = [
		new Set(["Control", "-"]),
		new Set(["Meta", "-"]),
	]

	name: string = "Zoom Out"
	icon: string = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 448 512">
						<!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
						<path fill="currentColor" opacity="1" 
						d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/>
					</svg>`

	camera: Camera

	constructor(camera: Camera) {
		this.camera = camera
	}

	linkActionManager() {}

	dispatchInstance(): ActionInstance {
		return new ZoomOutActionInstance(this, this.camera)
	}
}

export class ZoomOutActionInstance implements ActionInstance {
	action: Action
	camera: Camera

	constructor(sourceAction: Action, camera: Camera) {
		this.action = sourceAction
		this.camera = camera

		camera.zoomOut()
	}

	run() {}

	isDone() {
		return true
	}

	end() {}

	undo() {
		this.camera.zoomIn()
	}
}

