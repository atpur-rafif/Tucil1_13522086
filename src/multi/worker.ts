import { parentPort } from "worker_threads"
import { FinishedMessage, StartMessage } from "./types";

function fib(n: number) {
	if (n < 2) return n;
	return fib(n - 1) + fib(n - 2)
}

parentPort.addListener("message", (msg: StartMessage) => {
	const result = fib(msg.data)
	parentPort.postMessage({
		data: result
	} satisfies FinishedMessage)
})
