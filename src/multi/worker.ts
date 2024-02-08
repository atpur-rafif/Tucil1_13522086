import { parentPort } from "worker_threads"
import { FinishedMessage, StartMessage } from "./types";

const countReward = (sequence: Sequence, rewardList: RewardList) => {
	let total = 0
	for (const [targetSequence, reward] of rewardList) {
		let matchCount = 0
		for (const token of sequence) {
			if (token != targetSequence[matchCount]) matchCount = 0
			if (token == targetSequence[matchCount]) matchCount++
			if (matchCount == targetSequence.length) {
				total += reward
				break
			}
		}
	}
	return total
}

parentPort.addListener("message", (msg: StartMessage) => {
	const state = msg

	const optimal: FinishedMessage = {
		reward: 0,
		sequence: null as any,
		steps: null as any
	}

	const runner = () => {
		if (state.sequence.length == state.board.buffer) {
			const reward = countReward(state.sequence, state.board.rewardList)
			if (reward > optimal.reward) {
				optimal.reward = reward
				optimal.sequence = [...state.sequence]
				optimal.steps = [...state.steps]
			}
			return
		}

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
	runner()

	parentPort.postMessage(optimal)
})
