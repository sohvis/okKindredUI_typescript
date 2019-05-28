import { english } from './english';
import { polish } from './polish';
import { finnish } from './finnish';
import { french } from './french';
import { traditionalChinese } from './traditional_chinese';
import { simplifiedChinese } from './simplified_chinese';

export const localeStrings = {
    en: 'English',
    zh_tw: '繁體中文',
    zh_cn: '简体中文',
    pl: 'Polski',
    fi: 'Suomalainen',
    fr: 'Français',
};

export const messages = {
    en: english,
    zh_tw: traditionalChinese,
    zh_cn: simplifiedChinese,
    pl: polish,
    fi: finnish,
    fr: french,
};
