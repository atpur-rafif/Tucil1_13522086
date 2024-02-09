import { WorkerManager } from "./WorkerManager";
import { FinishedMessage, HackingBoard, HackingState } from "./types";

export async function solve(board: HackingBoard) {
	const state = {
		board,
		rcPos: 0,
		isHorizontal: true,
		steps: [],
		sequence: [],
		taken: new Array(board.width * board.height),
	}

	let workerCount = 0
	const divergePoint = 5
	const workerManager = new WorkerManager(12);
	const runnerDivergePoint = divergePoint < state.board.buffer ? divergePoint : 0
	const promisedOptimalStepsCandidate: Promise<FinishedMessage>[] = []
	const runner = async () => {
		if (state.sequence.length == runnerDivergePoint) {
			await workerManager.waitForUnemployed()
			const promise = workerManager.run(state); workerCount++
			promisedOptimalStepsCandidate.push(promise)
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

			await runner()

			state.taken[flatten] = false
			state.sequence.pop()
			state.steps.pop()
		}

		state.isHorizontal = oldIsHorizontal
		state.rcPos = oldRcPos
	}

	const start = performance.now()
	await runner()
	const optimalStepsCandidate = await Promise.all(promisedOptimalStepsCandidate)
	const end = performance.now()
	workerManager.askToKill()

	let totalWorkerTime = 0
	let optimalStep = optimalStepsCandidate[0]
	optimalStepsCandidate.forEach(candidate => {
		if (candidate.reward > optimalStep.reward) {
			optimalStep = candidate
		}
		totalWorkerTime += candidate.time
	})

	delete optimalStep.time
	return {
		...optimalStep,
		totalTime: end - start,
		totalWorkerTime,
		averageWorkerTime: totalWorkerTime / workerCount,
	}
}
