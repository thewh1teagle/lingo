import { invoke } from '@tauri-apps/api/core'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as config from '../config'
import { listen } from '@tauri-apps/api/event'

export default function Setup() {
	const [progress, setProgress] = useState<number | null>(0)
	const navigate = useNavigate()

	async function downloadModel() {
		await new Promise((resolve) => setTimeout(resolve, 1000))
		await invoke<string>('download_model', {
			filename: config.modelFilename,
			url: config.modelURL,
		})
		navigate('/')
	}

	async function listenForProgress() {
		await listen<[number, number]>('download_progress', (event) => {
			const [part, total] = event.payload
			setProgress((part / total) * 100)
		})
	}

	useEffect(() => {
		listenForProgress()
		downloadModel()
	}, [])

	return (
		<div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center">
			<div className="text-3xl m-5 font-bold">Downloading Meta Model...</div>
			{progress && progress > 0 && (
				<>
					<progress className="progress progress-primary w-56 my-2" value={progress ?? 0} max="100"></progress>
					<p>This happens only once! 🎉</p>
				</>
			)}
		</div>
	)
}
