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
} from "../src/vector"

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
})

