type Token = string;
type Matrix = Token[][];
type Sequence = Token[];
type Reward = number;
type RewardList = [Token[], Reward][]
type HackingState = {
	matrix: Matrix,
	sequence: Sequence,
	taken: boolean[],
	isHorizontal: boolean,
	rcPos: number,
	step: [number, number][]
}

export function hack() {
	console.log("Hacking...")
}

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

const boardWidth = 6
const boardHeight = 3
const buffer = 7
const matrix = [
	['7A', '55', 'E9', 'E9', '1C', '55'],
	['55', '7A', '1C', '7A', 'E9', '55'],
	['55', '1C', '1C', '55', 'E9', 'BD'],
	['BD', '1C', '7A', '1C', '55', 'BD'],
	['BD', '55', 'BD', '7A', '1C', '1C'],
	['1C', '55', '55', '7A', '55', '7A']
]
const rewardList: RewardList = [
	[['BD', 'E9', 'BD'], 15],
	[['BD', '7A', 'BD'], 20],
	[['BD', '1C', 'BD', '55'], 30]
]

// console.log(countReward(['7A', 'BD', '7A', 'BD', '1C', 'BD', '55'], rewardList))

const flattenCoordinate = (row: number, col: number) => row * boardWidth + col

const startTime = performance.now()

const state: HackingState = {
	matrix,
	sequence: [],
	taken: new Array(boardWidth * boardWidth).fill(false),
	isHorizontal: true,
	rcPos: 0,
	step: []
}

const optimal = {
	reward: 0,
	sequence: null as Sequence,
	step: [] as [number, number][]
}

const process = () => {
	if (state.sequence.length == buffer) {
		const reward = countReward(state.sequence, rewardList)
		if (reward > optimal.reward) {
			optimal.reward = reward
			optimal.sequence = [...state.sequence]
			optimal.step = [...state.step]
		}
		return
	}

	const oldIsHorizontal = state.isHorizontal
	const oldRcPos = state.rcPos
	state.isHorizontal = !state.isHorizontal

	// Iteration
	const maxRcPos = oldIsHorizontal ? boardWidth : boardHeight
	for (let newRcPos = 0; newRcPos < maxRcPos; ++newRcPos) {
		const row = oldIsHorizontal ? oldRcPos : newRcPos
		const col = oldIsHorizontal ? newRcPos : oldRcPos

		const flatten = row * boardWidth + col
		if (state.taken[flatten] == true) continue

		const token = state.matrix[row][col]
		state.rcPos = newRcPos
		state.sequence.push(token)
		state.step.push([row, col])
		state.taken[flatten] = true

		process()

		state.taken[flatten] = false
		state.sequence.pop()
		state.step.pop()
	}

	state.isHorizontal = oldIsHorizontal
	state.rcPos = oldRcPos
}
process()
const endTime = performance.now()

console.log(optimal, endTime - startTime)
