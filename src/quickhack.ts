import { dirname, resolve } from "path"
import { solve } from "./script/solver"
import { readHackingBoardFile } from "./script/reader"
import { mkdirSync, writeFileSync } from "fs"
import { prompt } from "./script/prompt"

const io = async () => {
	const inputFile = await prompt("File path: ")
	const board = readHackingBoardFile(resolve(process.cwd(), inputFile))
	const res = await solve(board, { multi: true })

	console.log("=== Raw Result ===")
	console.log(res)
	console.log("\n")

	console.log("=== Formatted Result ===")
	let str = ""
	str += res.reward + "\n"
	str += res.sequence.join(" ") + "\n"
	res.steps.forEach(([a, b]) => str += `${b + 1}, ${a + 1}\n`)
	str += `\n${Math.floor(res.totalTime)}ms\n`
	console.log(str)

	const outputFile = await prompt("Save to file? (blank to ignore): ")

	if (outputFile.length > 0) {
		mkdirSync(dirname(outputFile), { recursive: true })
		writeFileSync(outputFile, str)
	}
	process.exit()
}
io()
