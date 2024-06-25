import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import ModelLanguages from '../assets/languages.json'
import { getI18nLanguageName } from '../lib/i18n'
import { usePreferenceProvider } from '../providers/PreferenceProvider'

export default function LanguageInput() {
	const { t } = useTranslation()
	const {dstLanguage, setDstLanguage} = usePreferenceProvider()

	// create entries with translated labels
	const entries = Object.entries(ModelLanguages).map(([name, code]) => {
		return { label: t(`language.${name}`), name, code }
	})
	// sort alphabet
	entries.sort((a, b) => {
		return a.label.localeCompare(b.label)
	})

	function onChange(event: ChangeEvent<HTMLSelectElement>) {
        setDstLanguage(event.target.value)
	}

	const popularLanguages = [getI18nLanguageName(), 'english']
	const popularEntries: { label: string; code: string }[] = []
	const otherEntries: { label: string; code: string }[] = []

	entries.forEach(({ label, name, code }) => {
		if (popularLanguages.includes(name)) {
			popularEntries.push({ label, code })
		} else {
			otherEntries.push({ label, code })
		}
	})

	// Group names
	const groupNames = {
		popular: t('common.popular'),
		others: t('common.others'),
	}

	return (
		<label className="form-control w-full">
			<div className="label">
				<span className="label-text">{t('common.language')}</span>
			</div>
			<select value={dstLanguage} onChange={onChange} className="select select-bordered">
				<optgroup label={groupNames.popular}>
					{popularEntries.map(({ label, code }) => (
						<option key={code} value={code}>
							{label}
						</option>
					))}
				</optgroup>
				<optgroup label={groupNames.others}>
					{otherEntries.map(({ label, code }) => (
						<option key={code} value={code}>
							{label}
						</option>
					))}
				</optgroup>
			</select>
		</label>
	)
}