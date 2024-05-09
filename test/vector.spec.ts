import { describe, test, expect } from "vitest"

import {
	vector,
	copy,
	add,
	subtract,
	dot,
	cross,
	scale,
	magnitude,
	normalize,
	rotate,
	distance,
	distanceFromPointToLine,
	midpoint,
} from "../src/helpers/vector"

describe("Vector Functions", () => {
	test("vector", () => {
		const v = vector(3, 4)
		expect(v).toEqual({ x: 3, y: 4 })
	})

	test("copy", () => {
		const v = vector(3, 4)
		const copied = copy(v)
		expect(copied).toEqual(v)
		expect(copied).not.toBe(v)
	})

	test("add", () => {
		const u = vector(1, 2)
		const v = vector(3, 4)
		const result = add(u, v)
		expect(result).toEqual({ x: 4, y: 6 })
	})

	test("subtract", () => {
		const u = vector(3, 4)
		const v = vector(1, 2)
		const result = subtract(u, v)
		expect(result).toEqual({ x: 2, y: 2 })
	})

	test("dot", () => {
		const u = vector(1, 2)
		const v = vector(3, 4)
		const result = dot(u, v)
		expect(result).toBe(11)
	})

	test("cross", () => {
		const u = vector(1, 2)
		const v = vector(3, 4)
		const result = cross(u, v)
		expect(result).toBe(-2)
	})

	test("scale", () => {
		const v = vector(3, 4)
		const s = 2
		const result = scale(v, s)
		expect(result).toEqual({ x: 6, y: 8 })
	})

	test("magnitude", () => {
		const v = vector(3, 4)
		const result = magnitude(v)
		expect(result).toBe(5)
	})

	test("normalize", () => {
		const v = vector(3, 4)
		const result = normalize(v)
		expect(result.x).toBeCloseTo(0.6)
		expect(result.y).toBeCloseTo(0.8)
	})

	test("rotate", () => {
		const v = vector(1, 0)
		const angleRadians = Math.PI / 2
		const result = rotate(v, angleRadians)
		expect(result.x).toBeCloseTo(0)
		expect(result.y).toBeCloseTo(1)
	})

	test("distance", () => {
		const u = vector(1, 2)
		const v = vector(4, 6)
		const result = distance(u, v)
		expect(result).toBeCloseTo(5)
	})

	test("distanceFromPointToLine", () => {
		const v1 = vector(1, 1)
		const p11 = vector(0, 0)
		const p12 = vector(2, 0)
		const result1 = distanceFromPointToLine(v1, p11, p12)
		expect(result1).toBeCloseTo(1)

		const v2 = vector(3, 3)
		const p21 = vector(0, 0)
		const p22 = vector(3, 0)
		const result2 = distanceFromPointToLine(v2, p21, p22)
		expect(result2).toBeCloseTo(3)

		const v3 = vector(1, 1)
		const p31 = vector(0, 0)
		const p32 = vector(0, 2)
		const result3 = distanceFromPointToLine(v3, p31, p32)
		expect(result3).toBeCloseTo(1)

		const v4 = vector(1, 1)
		const p41 = vector(0, 0)
		const p42 = vector(0, -2)
		const result4 = distanceFromPointToLine(v4, p41, p42)
		expect(result4).toBeCloseTo(Math.sqrt(2))
	})

	test("midpoint", () => {
		const u = vector(1, 2)
		const v = vector(3, 4)
		const result = midpoint(u, v)
		expect(result).toEqual({ x: 2, y: 3 })
	})
})

