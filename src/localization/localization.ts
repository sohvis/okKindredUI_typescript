import { english } from './english';
import { polish } from './polish';
import { finnish } from './finnish';
import { french } from './french';
import { traditionalChinese } from './traditional_chinese';
import { simplifiedChinese } from './simplified_chinese';

export const localeStrings: { [id: string]: string; } = {
    'en': 'English',
    'fr': 'Français',
    'pl': 'Polski',
    'fi': 'Suomalainen',
    'zh-cn': '简体中文',
    'zh-tw': '繁體中文',
};

export const messages = {
    'en': english,
    'fi': finnish,
    'fr': french,
    'pl': polish,
    'zh-cn': simplifiedChinese,
    'zh-tw': traditionalChinese,
};


export const localeMatch = {
    match(lang: string): string {

        window.console.log(`match(lang: ${lang})`);
        if (!lang) {
            lang = navigator.language;
        }

        // Language not found use english
        if (!lang) {
            return 'en';
        }

        // Particular exceptions
        // Switch Hong Kong Chinese to Taiwan Chinese
        if (lang === 'zh-hk') {
            return 'zh-tw';
        }

        if (lang === 'zh') {
            return 'zh-cn';
        }

        // general locale matching
        for (const supportedLang of Object.keys(localeStrings)) {
            if (lang.startsWith(supportedLang, 0)) {
                return supportedLang;
            }

            if (supportedLang.startsWith(lang, 0)) {
                return supportedLang;
            }
        }

        // default return English
        return 'en';
    },
};
