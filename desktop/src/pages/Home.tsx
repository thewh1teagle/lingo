import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageInput from '../components/LanguageInput'
import { usePreferenceProvider } from '../providers/PreferenceProvider'
import AlignedTextArea from '../components/AlignedTextArea'

type TranslateResponse = [string, number][] // line, score

export default function Home() {
	const [srcText, setSrcText] = useState('')
	const [dstText, setDstText] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const {dstLanguage, srcDir, setSrcDir, dstDir, setDstDir} = usePreferenceProvider()
	const navigate = useNavigate()
	const {t, i18n} = useTranslation()
	
	document.body.dir = i18n.dir()

	async function translate() {
		if (isLoading) {
			return
		}
		setIsLoading(true)
		const resp = await invoke<TranslateResponse>('translate', {
			language: dstLanguage,
			text: srcText,
		})
		console.log('resp => ', resp)
		setIsLoading(false)
		setDstText(
			resp
				.map(([line, _score]) => {
					line = line.replace(/<unk>/g, '')
					line = line.replace(/<s>/g, '')
					line = line.replace(/<\/s>/g, '')
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
								<a>{t('common.settings')}</a>
							</li>
						</ul>
					</details>
				</div>
			</div>
			<div className="flex flex-col gap-1 m-auto w-56">
				<LanguageInput />
				<div>
					<button onClick={translate} className="btn btn-primary w-full">
						{isLoading && <span className="loading loading-spinner loading-xs"></span>}
						{t('common.translate')}
					</button>
				</div>
			</div>
			<div className="flex gap-3 p-5">
				<AlignedTextArea dir={srcDir} onChange={(newValue) => setSrcText(newValue)} value={srcText} placeholder={t('common.paste-your-text-here')} onDirToggle={() => setSrcDir(srcDir === 'ltr' ? 'rtl' : 'ltr')} />
				<AlignedTextArea dir={dstDir} onChange={(newValue) => setDstText(newValue)} value={dstText} placeholder={t('common.translation-will-be-here')} onDirToggle={() => setDstDir(dstDir === 'ltr' ? 'rtl' : 'ltr')} />
			</div>
		</div>
	)
}
