import { Worker } from "worker_threads"
import { FinishedMessage, StartMessage } from "./types"
import { resolve } from "path"

const worker = new Worker(resolve(__dirname, "worker.js"))
worker.postMessage({
	data: 40
} as StartMessage)
worker.addListener("message", (msg: FinishedMessage) => {
	console.log(msg.data)
})

