import { resolve } from "path"
import { solve } from "./quickhacking"
import { readHackingBoardFile } from "./reader"

const board = readHackingBoardFile(resolve(process.cwd(), "board.txt"))
solve(board, { multi: true }).then((res) => {
	console.log(res)
})
