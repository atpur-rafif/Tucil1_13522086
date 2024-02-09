import { exampleBoard } from "./example"
import { solve } from "./quickhacking"

solve(exampleBoard, { multi: true }).then((res) => {
	console.log(res)
})
