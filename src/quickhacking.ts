type Token = string;
type Matrix = Token[][];
type Sequence = Token[];
type Reward = number;
type RewardList = [Token[], Reward][]
type HackingState = {
	matrix: Matrix,
	sequence: Sequence,
	state: boolean[][]
}

export function hack() {
	console.log("Hacking...")
}

const countReward = ({ sequence }: HackingState, rewardList: RewardList) => {
	let total = 0
	for (const [targetSequence, reward] of rewardList) {
		let matchCount = 0
		console.log(targetSequence, reward)
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

console.log(countReward({
	sequence: ['7A', 'BD', '7A', 'BD', '1C', 'BD', '55'],
	matrix: null as any,
	state: null as any
}, [
	[['BD', 'E9', 'BD'], 15],
	[['BD', '7A', 'BD'], 20],
	[['BD', '1C', 'BD', '55'], 30]
]))

