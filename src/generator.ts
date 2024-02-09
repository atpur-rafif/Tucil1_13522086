import { mkdirSync, writeFileSync } from "fs"
import { dirname } from "path"
import { promptOrDefault, prompt } from "./script/prompt"

const io = async () => {
	console.log("Value inside square bracket mean default, fill empty (just enter) to use that value\n")

	const def = {
		tokenCount: "5",
		token: "BD 1C 7A 55 E9",
		bufferSize: "7",
		width: "6",
		height: "6",
		sequenceCount: "3",
		maxSequence: "4"
	}

	const tokenCount = parseInt(await promptOrDefault(`Unique token count [${def.tokenCount}]: `, def.tokenCount))
	const token = (await promptOrDefault(`Unique token (separated by space) [${def.token}]: `, def.token))
		.split(" ")
		.filter(s => s.length != 0)
		.slice(0, tokenCount)
	const bufferSize = parseInt(await promptOrDefault(`Buffer size [${def.bufferSize}]: `, def.bufferSize))
	const width = parseInt(await promptOrDefault(`Board width [${def.width}]: `, def.width))
	const height = parseInt(await promptOrDefault(`Board height [${def.height}]: `, def.height))
	const sequenceCount = parseInt(await promptOrDefault(`Sequence count [${def.sequenceCount}]: `, def.sequenceCount))
	const maxSequence = parseInt(await promptOrDefault(`Max sequence length [${def.maxSequence}]: `, def.maxSequence))
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
				Math.floor(Math.random() * 200) - 100
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
