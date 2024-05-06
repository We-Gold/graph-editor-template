export type Color = {
	r: number
	g: number
	b: number
}

/**
 * Increment the color by treating r, g, and b as a base 256 number
 * @param {Color} color The color object
 */
export const incrementColor = (color: Color) => {
	if (color.b < 255) color.b++
	else if (color.b >= 255 && color.g < 255) {
		color.g++
		color.b = 0
	} else if (color.g >= 255 && color.r < 255) {
		color.r++
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
 * @param color a color string in the format "rgb(r, g, b)"
 * @returns a number representing the color
 */
export const colorToIndex = (color: string) => {
	const [r, g, b] = color
		.slice(4, -1)
		.split(",")
		.map((value) => parseInt(value))

	// Convert the color into a number in base 256
	return r * 256 ** 2 + g * 256 + b
}

