import { dirname, resolve } from "path"
import { solve } from "./quickhacking"
import { readHackingBoardFile } from "./reader"
import { createInterface } from "readline"
import { mkdirSync, writeFileSync } from "fs"

const readline = createInterface({
	input: process.stdin,
	output: process.stdout
})

readline.question("File path: ", (filepath) => {
	const board = readHackingBoardFile(resolve(process.cwd(), filepath))
	solve(board, { multi: true }).then((res) => {
		console.log("=== Raw Result ===")
		console.log(res)
		console.log("\n")

		console.log("=== Formatted Result ===")
		let str = ""
		str += res.reward + "\n"
		str += res.sequence.join(" ") + "\n"
		res.steps.forEach(([a, b]) => str += `${a}, ${b}\n`)
		str += `\n${Math.floor(res.totalTime)}ms\n`
		console.log(str)

		readline.question("Save to file? (blank to ignore): ", (filepath) => {
			if (filepath.length > 0) {
				mkdirSync(dirname(filepath), { recursive: true })
				writeFileSync(filepath, str)
			}
			process.exit()
		})
	})
})
