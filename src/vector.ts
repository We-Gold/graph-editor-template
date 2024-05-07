export type Vector = { x: number; y: number }

export const vector = (x: number, y: number): Vector => ({ x, y })

export const copy = (v: Vector): Vector => ({ x: v.x, y: v.y })

export const add = (u: Vector, v: Vector): Vector =>
	vector(u.x + v.x, u.y + v.y)

export const subtract = (u: Vector, v: Vector): Vector =>
	vector(u.x - v.x, u.y - v.y)

export const dot = (u: Vector, v: Vector): number => u.x * v.x + u.y * v.y

export const cross = (u: Vector, v: Vector): number => u.x * v.y - u.y * v.x

export const scale = (v: Vector, s: number): Vector => vector(v.x * s, v.y * s)

export const magnitude = (v: Vector): number => Math.hypot(v.x, v.y)

export const normalize = (v: Vector): Vector => scale(v, 1 / magnitude(v))

export const rotate = (v: Vector, angleRadians: number): Vector => {
	const cos = Math.cos(angleRadians)
	const sin = Math.sin(angleRadians)
	return vector(v.x * cos - v.y * sin, v.x * sin + v.y * cos)
}

