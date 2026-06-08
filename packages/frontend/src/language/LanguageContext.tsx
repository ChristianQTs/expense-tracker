import React, { createContext, useContext, useState } from 'react'
import { translations } from './translations.js'

export type Language = 'en' | 'it'
type TranslationKeys = keyof typeof translations['en']
interface LanguageContextType  {
    language: Language;
    setLanguage: (language: Language) => void;
    t:(key:TranslationKeys) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        return (localStorage.getItem('app_lang') as Language) || 'en'
    })
    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        localStorage.setItem('app_lang', lang)
    }
    const t = (key: TranslationKeys): any => {
        return translations[language][key] || translations['en'][key]
    };


    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context
}