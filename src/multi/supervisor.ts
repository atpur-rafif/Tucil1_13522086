import { Worker } from "worker_threads"
import { FinishedMessage, StartMessage } from "./types"
import { resolve } from "path"

class WorkerManager {
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
		const promise = new Promise(r => resolver = r)

		const worker = this.freeWorker.shift()
		worker.postMessage(data)

		const returner = (data: FinishedMessage) => {
			worker.removeListener("message", returner)
			resolver(data)
		}
		worker.addListener("message", returner)

		return promise
	}

	killAll() {
		this.worker.forEach(worker => {
			worker.terminate()
		})
	}
}
const count = 500
let counter = 0
const workerManager = new WorkerManager(12);

const start = performance.now();
(async function() {
	for (let i = 0; i < count; ++i) {
		await workerManager.waitForUnemployed()
		workerManager.run({
			data: 40
		}).then((data) => {
			console.log(i, data)

			const end = performance.now()
			counter++
			if (counter == count) {
				console.log(counter, end - start)
				workerManager.killAll()
			}
		})
	}
})();
