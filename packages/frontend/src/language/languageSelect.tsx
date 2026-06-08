import { useLanguage, Language } from './LanguageContext.jsx'
import { languages } from './translations.js'
import { inputStyle } from '../components/styling comps/Button.jsx'
export function LanguageSelect() {
    const { t, language, setLanguage } = useLanguage()
    if (languages.length === 0) return null
    return (
        <div className='flex p-7'>
            <label className='px-2'htmlFor='language'>{t('selectLanguage')}: </label>
            <select className={inputStyle} id='language' name='language' value={language} onChange={e => setLanguage(e.target.value as Language)}>
                {languages.map(({code, label}) =>
                    <option key={code} value={code}>{label}</option>
                ) }
            </select>
        </div>
        )
    
}