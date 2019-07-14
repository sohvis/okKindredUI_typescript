import { Vue } from 'vue-property-decorator';
import GenderOption from './gender_option';

export default class GenderOptionsBuilder {
    public static FEMALE = 'F';
    public static MALE = 'M';
    public static OTHER = 'O';

    public localisedGendersByKey: { [id: string]: string; };

    constructor(v: Vue) {
        this.localisedGendersByKey = {};
        this.localisedGendersByKey[GenderOptionsBuilder.FEMALE] = v.$t('message.Female').toString();
        this.localisedGendersByKey[GenderOptionsBuilder.MALE] = v.$t('message.Male').toString();
        this.localisedGendersByKey[GenderOptionsBuilder.OTHER] = v.$t('message.Other').toString();
    }

    public createDropDownOptions(): GenderOption[] {
        const options = new Array<GenderOption>();

        Object.keys(this.localisedGendersByKey).forEach((key) => {
            options.push(new GenderOption(key, this.localisedGendersByKey[key]));
        });

        return options;
    }
}

