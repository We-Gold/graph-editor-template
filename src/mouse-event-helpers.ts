export type Color = {
	r: number
	g: number
	b: number
}

/**
 * Increment the color by treating r, g, and b as a base 256 number
 * @param {Color} color The color object
 * @param {number} increment The amount to increment the color by
 */
export const incrementColor = (color: Color, increment: number = 1) => {
	if (color.b < 255) color.b += increment
	else if (color.b >= 255 && color.g < 255) {
		color.g += increment
		color.b = 0
	} else if (color.g >= 255 && color.r < 255) {
		color.r += increment
		color.g = 0
		color.b = 0
	} else {
		color.r = 0
		color.g = 0
		color.b = 0
	}
}

/**
 * Convert a color string to a number in base 256
 * @param {string} color a color string in the format "rgb(r, g, b)"
 * @returns a number representing the color
 */
export const colorStringToIndex = (color: string) => {
	const colorArray = color
		.slice(4, -1)
		.split(",")
		.map((value) => parseInt(value))

	// Convert the color into a number in base 256
	return colorToIndex(colorArray)
}

/**
 * Convert a color string to a number in base 256
 * @param {Uint8ClampedArray | number[]} color an array representing the color
 * @returns a number representing the color
 */
export const colorToIndex = (color: Uint8ClampedArray | number[]) => {
	const [r, g, b] = color

	// Convert the color into a number in base 256
	return r * 256 ** 2 + g * 256 + b
}

