import { Vue } from 'vue-property-decorator';
import SelectOption from './select_option';

export default class GenderOptionsBuilder {
    public static FEMALE = 'F';
    public static MALE = 'M';
    public static NON_BINARY = 'N';
    public static OTHER = 'O';
    public static PREFER_NOT_TO_SAY = 'P';

    public localisedGendersByKey: { [id: string]: string; };

    constructor(v: Vue) {
        this.localisedGendersByKey = {};
        this.localisedGendersByKey[GenderOptionsBuilder.FEMALE] = v.$t('message.Female').toString();
        this.localisedGendersByKey[GenderOptionsBuilder.MALE] = v.$t('message.Male').toString();
        this.localisedGendersByKey[GenderOptionsBuilder.NON_BINARY] = v.$t('message.NonBinary').toString();
        this.localisedGendersByKey[GenderOptionsBuilder.OTHER] = v.$t('message.Other').toString();
        this.localisedGendersByKey[GenderOptionsBuilder.PREFER_NOT_TO_SAY] = v.$t('message.PreferNotToSay').toString();
    }

    public createDropDownOptions(): SelectOption[] {
        const options = new Array<SelectOption>();

        Object.keys(this.localisedGendersByKey).forEach((key) => {
            options.push(new SelectOption(key, this.localisedGendersByKey[key]));
        });

        return options;
    }
}

