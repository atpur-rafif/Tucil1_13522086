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
	rcPos: number
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

const boardSize = 6
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

const flattenCoordinate = (row: number, col: number) => row * boardSize + col
const startState: HackingState = {
	matrix,
	sequence: [],
	taken: new Array(boardSize * boardSize).fill(false),
	isHorizontal: true,
	rcPos: 0
}

const queues: HackingState[] = [startState]
let max = 0
let seq = null

const startTime = performance.now()
while (queues.length > 0) {
	const {
		isHorizontal,
		matrix,
		sequence,
		rcPos,
		taken
	} = queues.shift()
	if (sequence.length == buffer) {
		const reward = countReward(sequence, rewardList)
		if (reward > max) {
			max = reward
			seq = sequence
		}
		continue
	}

	for (let newRcPos = 0; newRcPos < boardSize; ++newRcPos) {
		const row = isHorizontal ? rcPos : newRcPos
		const col = isHorizontal ? newRcPos : rcPos

		if (taken[flattenCoordinate(row, col)] == true) continue

		const newSequence = [...sequence, matrix[row][col]]
		const newTaken = [...taken]
		newTaken[flattenCoordinate(row, col)] = true

		queues.push({
			matrix,
			sequence: newSequence,
			taken: newTaken,
			isHorizontal: !isHorizontal,
			rcPos: newRcPos
		})
	}
}
const endTime = performance.now()

console.log(max, seq, endTime - startTime)
