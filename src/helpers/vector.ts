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

export const distance = (u: Vector, v: Vector): number =>
	magnitude(subtract(u, v))

export const distanceFromPointToLine = (v: Vector, p1: Vector, p2: Vector) => {
	// Calculate the squared distance between p1 and p2
	const l2 = distance(p1, p2) ** 2

	// Handle the case where p1 and p2 are the same point
	if (l2 === 0) return distance(v, p1)

	// Calculate the projection of v onto the line segment
	const t = Math.max(
		0,
		Math.min(1, dot(subtract(v, p1), subtract(p2, p1)) / l2)
	)
	const projection = add(p1, scale(subtract(p2, p1), t))

	// Return the distance between v and the projection
	return distance(v, projection)
}

export const midpoint = (u: Vector, v: Vector): Vector => scale(add(u, v), 0.5)
