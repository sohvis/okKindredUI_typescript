import { Vue } from 'vue-property-decorator';
import SelectOption from './select_option';
import { localeStrings } from '../../localization/localization'

export default class LanguageOptionsBuilder {


    public static createDropDownOptions(): SelectOption[] {
        const options = new Array<SelectOption>();

        Object.keys(localeStrings).forEach((key) => {

            const value = key.replace('_', '-');

            options.push(new SelectOption(value, localeStrings[key]));
        });

        return options;
    }
}

