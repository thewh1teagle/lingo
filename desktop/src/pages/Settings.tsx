import { invoke } from '@tauri-apps/api/core'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { usePreferenceProvider } from '../providers/PreferenceProvider'
import { supportedLanguages } from '../lib/i18n'
import { useEffect } from 'react'

export default function Settings() {
	const navigate = useNavigate()
	const {t, i18n} = useTranslation()

	const {displayLanguage, setDisplayLanguage} = usePreferenceProvider()

	useEffect(() => {
		i18n.changeLanguage(displayLanguage)
	}, [displayLanguage])

	return (
		<div className='flex flex-col items-center'>
			<div>
			<label className="form-control w-full max-w-xs">
			<div className="label">
    			<span className="label-text">{t('common.language')}</span>
  			</div>
			<select onChange={(e) => setDisplayLanguage(e.target.value)} value={displayLanguage} className="select select-primary capitalize" name="" id="">
				{Object.entries(supportedLanguages).map(([code, name]) => (
					<option value={code}>{t(`language.${name.toLowerCase()}`)}</option>
				))}
				</select>
				</label>
			<button onClick={() => invoke('open_models_folder')} className="btn btn-primary w-full">
				{t('common.open-models-folder')}
			</button>
			<button className="btn w-full" onClick={() => navigate('/')}>
				{t('common.back-to-home')}
			</button>
			</div>
		</div>
	)
}
