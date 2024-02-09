import { HackingBoard } from "./types";

export const exampleBoard: HackingBoard = {
	width: 6,
	height: 6,
	buffer: 12,
	matrix: [
		['7A', '55', 'E9', 'E9', '1C', '55'],
		['55', '7A', '1C', '7A', 'E9', '55'],
		['55', '1C', '1C', '55', 'E9', 'BD'],
		['BD', '1C', '7A', '1C', '55', 'BD'],
		['BD', '55', 'BD', '7A', '1C', '1C'],
		['1C', '55', '55', '7A', '55', '7A']
	],
	rewardList: [
		[['1C', 'BD', '55'], 15],
		[['BD', '7A', 'BD'], 20],
		[['BD', '1C', 'BD', '55'], 30]
	]
}
