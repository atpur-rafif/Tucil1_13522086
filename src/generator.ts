const tokenCount = 5
const token = ['A', 'B', 'C', 'D', 'E']
const bufferSize = 7
const width = 6
const height = 6
const sequenceCount = 3
const maxSequence = 4

const randomToken = () => token[Math.floor(Math.random() * token.length)] || token[token.length - 1]

const board = new Array(width)
	.fill(null)
	.map(() =>
		new Array(height)
			.fill(null)
			.map(() => randomToken())
	)

const sequence = new Array(sequenceCount)
	.fill(null)
	.map(() =>
		[
			new Array(
				Math.max(
					Math.floor(Math.random() * maxSequence),
					2
				)
			)
				.fill(null)
				.map(() => randomToken()),
			Math.floor(Math.random() * 100)
		] as const
	)

let str = ""
str += bufferSize + "\n"
str += width + " " + height + "\n"
for (let i = 0; i < height; ++i) {
	for (let j = 0; j < width; ++j) {
		str += board[i][j] + " "
	}
	str += "\n"
}
str += sequenceCount + "\n"
for (let i = 0; i < sequenceCount; ++i) {
	for (let j = 0; j < sequence[i][0].length; ++j) {
		str += sequence[i][0][j] + " "
	}
	str += "\n" + sequence[i][1]
	if (i != sequenceCount - 1) str += "\n"
}

console.log(str)


