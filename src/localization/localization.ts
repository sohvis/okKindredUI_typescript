import { english } from './english';
import { polish } from './polish';
import { finnish } from './finnish';
import { french } from './french';
import { traditionalChinese } from './traditional_chinese';
import { simplifiedChinese } from './simplified_chinese';

export const localeStrings: { [id: string]: string; } = {
    en: 'English',
    fr: 'Français',
    pl: 'Polski',
    fi: 'Suomalainen',
    zh_cn: '简体中文',
    zh_tw: '繁體中文',
};

export const messages = {
    en: english,
    fi: finnish,
    fr: french,
    pl: polish,
    zh_tw: traditionalChinese,
    zh_cn: simplifiedChinese,
};


export const localeMatch = {
    match(lang: string): string {

        if (!lang) {
            lang = navigator.language;
        }

        // Language not found use english
        if (!lang) {
            return 'en';
        }

        lang = lang.replace('-', '_').toLowerCase();
        window.console.log(`localeMatch: ${lang}`);

        // Particular exceptions
        // Switch Hong Kong Chinese to Taiwan Chinese
        if (lang === 'zh_hk') {
            return 'zh_tw';
        }

        if (lang === 'zh') {
            return 'zh_cn';
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
