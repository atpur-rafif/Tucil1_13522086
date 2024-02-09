import { Sequence, RewardList } from "./types"
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

