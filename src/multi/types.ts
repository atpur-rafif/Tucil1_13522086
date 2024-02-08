export type Token = string;
export type Matrix = Token[][];
export type Sequence = Token[];
export type Reward = number;
export type Step = [number, number]
export type RewardList = [Token[], Reward][]

export type HackingBoard = {
	matrix: Matrix,
	rewardList: RewardList,
	width: number,
	height: number,
	buffer: number
}

export type HackingState = {
	board: HackingBoard
	sequence: Sequence,
	isHorizontal: boolean,
	rcPos: number,
	taken: boolean[],
	steps: Step[]
}

export type OptimalStep = {
	sequence: Sequence,
	reward: Reward,
	steps: Step[]
}

export type StartMessage = HackingState
export type FinishedMessage = OptimalStep
