import languages from '../assets/languages.json'
import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from 'usehooks-ts'

type TranslateResponse = [string, number][] // line, score

export default function Home() {
	const [srcText, setSrcText] = useState('')
	const [dstText, setDstText] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [language, setLanguage] = useLocalStorage('prefs_language', languages['english'])
	const navigate = useNavigate()

	async function translate() {
		if (isLoading) {
			return
		}
		setIsLoading(true)
		const resp = await invoke<TranslateResponse>('translate', {
			language,
			text: srcText,
		})
		console.log('resp => ', resp)
		setIsLoading(false)
		setDstText(
			resp
				.map(([line, _score]) => {
					line = line.replace('<unk>', '')
					line = line.replace('<s>', '')
					line = line.replace('</s>', '')
					return line
				})
				.join('\n')
		)
	}

	async function getModelPath() {
		const modelPathResult = await invoke<string | null>('get_model_path')
		if (!modelPathResult) {
			navigate('/setup')
		}
		await invoke('load_model', { modelPath: modelPathResult })
	}

	useEffect(() => {
		getModelPath()
	}, [])

	return (
		<div className="flex flex-col w-full px-5 pb-5 gap-3 max-w-[1500px] m-auto">
			<div className="navbar bg-base-100">
				<div className="flex-1">
					<a className="btn btn-ghost text-xl">Lingo</a>
				</div>
				<div className="flex-none">
					<details className="dropdown dropdown-end">
						<summary className="btn btn-square btn-ghost">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
							</svg>
						</summary>
						<ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
							<li onClick={() => navigate('/settings')}>
								<a>Settings</a>
							</li>
						</ul>
					</details>
				</div>
			</div>
			<div className="flex flex-col gap-1 m-auto w-56">
				<select onChange={(e) => setLanguage(e.target.value)} value={language} className="select select-primary capitalize" name="" id="">
					{Object.entries(languages).map(([name, code]) => (
						<option value={code}>{name}</option>
					))}
				</select>
				<div>
					<button onClick={translate} className="btn btn-primary w-full">
						{isLoading && <span className="loading loading-spinner loading-xs"></span>}
						Translate
					</button>
				</div>
			</div>
			<div className="flex gap-3 p-5">
				<textarea
					placeholder="Paste your text here..."
					onChange={(e) => setSrcText(e.target.value)}
					value={srcText}
					className="textarea textarea-bordered  flex-1"
					name=""
					id=""></textarea>

				<textarea
					value={dstText}
					placeholder="Translation will be here..."
					className="textarea textarea-bordered min-h-[20vh] flex-1"
					name=""
					id=""></textarea>
			</div>
		</div>
	)
}
