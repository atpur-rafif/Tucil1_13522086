import { mkdirSync, writeFileSync } from "fs"
import { dirname } from "path"
import { createInterface } from "readline"

const readline = createInterface({
	input: process.stdin,
	output: process.stdout
})

const prompt = (p: string) => new Promise<string>((r) => readline.question(p, r))

const io = async () => {
	const tokenCount = parseInt(await prompt("Unique token count: "))
	const token = (await prompt("Unique token (separated by space): "))
		.split(" ")
		.filter(s => s.length != 0)
		.slice(0, tokenCount)
	const bufferSize = parseInt(await prompt("Buffer size: "))
	const width = parseInt(await prompt("Board width: "))
	const height = parseInt(await prompt("Board height: "))
	const sequenceCount = parseInt(await prompt("Sequence count: "))
	const maxSequence = parseInt(await prompt("Max sequence length: "))
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

	console.log(`\n\n${str}\n\n`)

	const filepath = await prompt("Save to file (empty to ignore): ")
	if (filepath.length > 0) {
		mkdirSync(dirname(filepath), { recursive: true })
		writeFileSync(filepath, str)
	}

	process.exit()
}

io()
