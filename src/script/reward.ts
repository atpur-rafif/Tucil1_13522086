import { Sequence, RewardList, FinishedMessage, HackingState } from "./types"
export const countReward = (sequence: Sequence, rewardList: RewardList) => {
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

export const refreshOptimal = (optimal: FinishedMessage, current: HackingState) => {
	const reward = countReward(current.sequence, current.board.rewardList)
	if (
		(reward > optimal.reward) ||
		(reward == optimal.reward && current.sequence.length < optimal.sequence.length)
	) {
		optimal.reward = reward
		optimal.sequence = [...current.sequence]
		optimal.steps = [...current.steps]
	}
}
