import { parentPort } from "worker_threads"
import { FinishedMessage } from "./types";
import { refreshOptimal } from "./reward";

parentPort.addListener("message", (msg) => {
	const state = JSON.parse(msg)

	const optimal: FinishedMessage = {
		reward: 0,
		sequence: [],
		steps: [],
		time: 0
	}

	const runner = () => {
		refreshOptimal(optimal, state)
		if (state.sequence.length == state.board.buffer) return;

		const oldIsHorizontal = state.isHorizontal
		const oldRcPos = state.rcPos
		state.isHorizontal = !state.isHorizontal

		// Iteration
		const maxRcPos = oldIsHorizontal ? state.board.width : state.board.height
		for (let newRcPos = 0; newRcPos < maxRcPos; ++newRcPos) {
			const row = oldIsHorizontal ? oldRcPos : newRcPos
			const col = oldIsHorizontal ? newRcPos : oldRcPos

			const flatten = row * state.board.width + col
			if (state.taken[flatten] == true) continue

			const token = state.board.matrix[row][col]
			state.rcPos = newRcPos
			state.sequence.push(token)
			state.steps.push([row, col])
			state.taken[flatten] = true

			runner()

			state.taken[flatten] = false
			state.sequence.pop()
			state.steps.pop()
		}

		state.isHorizontal = oldIsHorizontal
		state.rcPos = oldRcPos
	}

	const start = performance.now()
	runner()
	const end = performance.now()
	optimal.time = end - start

	parentPort.postMessage(optimal)
})
