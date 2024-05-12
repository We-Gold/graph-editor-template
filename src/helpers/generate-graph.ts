export const generateGraphData = (
	numNodes: number,
	rowCapacity: number,
	fullyConnected: boolean,
	{ startX = 100, startY = 50, gap = 40 } = {}
) => {
	const x = []
	const y = []

	for (let i = 0; i < numNodes; i++) {
		x.push(startX + gap * (i % rowCapacity))
		y.push(startY + gap * Math.floor(i / rowCapacity))
	}

	const edges = []

	if (fullyConnected) {
		// Fully Connected
		for (let i = 0; i < x.length; i++) {
			for (let j = 0; j < y.length; j++) {
				if (i !== j) {
					edges.push([i, j])
				}
			}
		}
	} else {
		// Sparsely Connected
		for (let i = 0; i < x.length - 1; i++) {
			edges.push([i, i + 1])
		}
	}

	return {
		x: x,
		y: y,
		edges: edges,
		nodeData: x.map((_) => ({})),
	}
}

