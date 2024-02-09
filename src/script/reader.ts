import { readFileSync } from "fs";
import { HackingBoard } from "./types";

export function readHackingBoardFile(path: string) {
	const content = readFileSync(path, "utf8")

	const symbol = content.replaceAll("\n", " \n ").split(' ').filter(s => s.length != 0).reverse()

	const popNewLine = () => {
		while (symbol[symbol.length - 1] == '\n') symbol.pop();
	}

	const popSymbol = () => {
		popNewLine()
		return symbol.pop()
	}

	const popInt = () => {
		const curr = popSymbol()
		if (isNaN(curr as any)) throw Error(`Invalid format at ${curr}`)
		return parseInt(curr)
	}

	const buffer = popInt()
	const width = popInt()
	const height = popInt()
	const matrix = new Array(height)
		.fill(null)
		.map(() =>
			new Array(width)
				.fill(null)
				.map(() => popSymbol())
		)

	const rewardList = new Array(popInt())
		.fill(null)
		.map(() => {
			popNewLine()
			const sequence: string[] = []
			while (symbol[symbol.length - 1] != '\n') {
				sequence.push(symbol.pop())
			}

			return [sequence, popInt()] as [string[], number]
		})

	return {
		buffer, width, height, matrix, rewardList
	} as HackingBoard
}
