import { cpus } from "os";
import { WorkerManager } from "./WorkerManager";
import { FinishedMessage, HackingBoard } from "./types";
import { countReward } from "./reward";

const CPU_COUNT = cpus().length

type SolveOption = {
	multi?: false,
} | {
	multi?: true,
	worker?: number,
	divergePoint?: number
}

export async function solve(board: HackingBoard, option?: SolveOption) {
	const state = {
		board,
		rcPos: 0,
		isHorizontal: true,
		steps: [],
		sequence: [],
		taken: new Array(board.width * board.height),
	}

	option = {
		multi: true,
		worker: CPU_COUNT,
		divergePoint: 3,
		...option
	}

	const mainOptimal: FinishedMessage = {
		reward: 0,
		sequence: [],
		steps: [],
		time: 0
	}

	let workerCount = 0
	const divergePoint = option.multi ? option.divergePoint : 0
	const workerManager = new WorkerManager(option.multi ? option.worker : 1);
	const runnerDivergePoint = divergePoint < state.board.buffer ? divergePoint : 0
	const promisedOptimalStepsCandidate: Promise<FinishedMessage>[] = []
	const runner = async () => {
		const reward = countReward(state.sequence, state.board.rewardList)
		if (reward > mainOptimal.reward) {
			mainOptimal.reward = reward
			mainOptimal.sequence = [...state.sequence]
			mainOptimal.steps = [...state.steps]
		}

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
	let optimalStep = mainOptimal
	optimalStepsCandidate.forEach(candidate => {
		if (
			(candidate.reward > optimalStep.reward) ||
			(candidate.reward == optimalStep.reward && candidate.steps.length < optimalStep.steps.length)
		) {
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
