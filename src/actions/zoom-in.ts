import { Camera } from "../camera"
import { Action, ActionInstance } from "./action"

export class ZoomInAction implements Action {
	keyboardShortcut: Set<string>[] = [
		new Set(["Control", "="]),
		new Set(["Meta", "="]),
	]

	name: string = "Zoom In"
	icon: string = `<svg width="16" height="16" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" opacity="1" 
                        d="M256 80C256 62.3 241.7 48 224 48C206.3 48 192 62.3 192 80V224H48C30.3 224 16 238.3 16 256C16 273.7 30.3 288 48 288H192V432C192 449.7 206.3 464 224 464C241.7 464 256 449.7 256 432V288H400C417.7 288 432 273.7 432 256C432 238.3 417.7 224 400 224H256V80Z"/>
                    </svg>`

	camera: Camera

	constructor(camera: Camera) {
		this.camera = camera
	}

	linkActionManager() {}

	dispatchInstance(): ActionInstance {
		return new ZoomInActionInstance(this, this.camera)
	}
}

export class ZoomInActionInstance implements ActionInstance {
	action: Action
	camera: Camera

	constructor(sourceAction: Action, camera: Camera) {
		this.action = sourceAction
		this.camera = camera

		camera.zoomIn()
	}

	run() {}

	isDone() {
		return true
	}

	end() {}

	undo() {
		this.camera.zoomOut()
	}
}

