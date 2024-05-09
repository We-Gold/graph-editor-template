import { describe, test, expect } from "vitest"

import {
	incrementColor,
	colorStringToIndex,
} from "../src/helpers/mouse-event-helpers"

describe("incrementColor", () => {
	test("incrementColor works correctly from rgb(0, 0, 0)", () => {
		const testColor = { r: 0, g: 0, b: 0 }

		incrementColor(testColor)

		expect(testColor).toStrictEqual({ r: 0, g: 0, b: 1 })
	})

	test("incrementColor works correctly from rgb(0, 0, 255)", () => {
		const testColor = { r: 0, g: 0, b: 255 }

		incrementColor(testColor)

		expect(testColor).toStrictEqual({ r: 0, g: 1, b: 0 })
	})

	test("incrementColor works correctly from rgb(0, 255, 255)", () => {
		const testColor = { r: 0, g: 255, b: 255 }

		incrementColor(testColor)

		expect(testColor).toStrictEqual({ r: 1, g: 0, b: 0 })
	})

	test("incrementColor works correctly from rgb(255, 0, 0)", () => {
		const testColor = { r: 255, g: 0, b: 0 }

		incrementColor(testColor)

		expect(testColor).toStrictEqual({ r: 255, g: 0, b: 1 })
	})

	test("incrementColor works correctly from rgb(255, 255, 255)", () => {
		const testColor = { r: 255, g: 255, b: 255 }

		incrementColor(testColor)

		expect(testColor).toStrictEqual({ r: 0, g: 0, b: 0 })
	})
})

describe("colorStringToIndex", () => {
	test("colorStringToIndex works correctly for rgb(0, 0, 0)", () => {
		expect(colorStringToIndex("rgb(0, 0, 0)")).toBe(0)
	})

	test("colorStringToIndex works correctly for rgb(0, 0, 255)", () => {
		expect(colorStringToIndex("rgb(0, 0, 255)")).toBe(255)
	})

	test("colorStringToIndex works correctly for rgb(0, 255, 0)", () => {
		expect(colorStringToIndex("rgb(0, 255, 0)")).toBe(255 * 256)
	})

	test("colorStringToIndex works correctly for rgb(0, 255, 1)", () => {
		expect(colorStringToIndex("rgb(0, 255, 1)")).toBe(255 * 256 + 1)
	})

	test("colorStringToIndex works correctly for rgb(255, 255, 255)", () => {
		expect(colorStringToIndex("rgb(255, 255, 255)")).toBe(256 ** 3 - 1)
	})
})

