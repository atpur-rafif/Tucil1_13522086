import { Worker } from "worker_threads"
import { FinishedMessage, StartMessage } from "./types"
import { resolve } from "path"

export class WorkerManager {
	private size: number
	private resolver: (() => void)[]
	private worker: Worker[]
	private freeWorker: Worker[]

	constructor(size: number) {
		this.size = size
		this.resolver = []

		this.worker = new Array(this.size)
			.fill(null)
			.map(_ => {
				const worker = new Worker(resolve(__dirname, "worker.js"))
				worker.addListener("message", () => {
					this.freeWorker.push(worker)
					if (this.resolver.length > 0) this.resolver.shift()()
				})

				return worker
			})

		this.freeWorker = [...this.worker]
	}

	waitForUnemployed() {
		if (this.freeWorker.length > 0) return Promise.resolve()
		else {
			return new Promise<void>(r => this.resolver.push(r))
		}
	}

	run(data: StartMessage) {
		if (this.freeWorker.length <= 0) throw Error("All worker busy, program should wait with `waitForUnemplyed` method");

		let resolver: any
		const promise = new Promise<FinishedMessage>(r => resolver = r)

		const worker = this.freeWorker.shift()
		worker.postMessage(JSON.stringify(data))

		const returner = (data: FinishedMessage) => {
			worker.removeListener("message", returner)
			resolver(data)
		}
		worker.addListener("message", returner)

		return promise
	}

	askToKill() {
		this.worker.forEach(worker => {
			worker.addListener("message", () => worker.terminate())
		})
		this.freeWorker.forEach(worker => worker.terminate())
	}
}
