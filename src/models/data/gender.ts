import { Vue } from 'vue-property-decorator';

export default class Gender {
    static FEMALE ='F'
    static MALE ='M'
    static OTHER = 'O'

    localisedGendersByKey: { [id: string]: string; }; 
    
    constructor(v :Vue) {
        this.localisedGendersByKey = {};
        this.localisedGendersByKey[Gender.FEMALE] = v.$t('message.Female').toString();
        this.localisedGendersByKey[Gender.MALE] = v.$t('message.Male').toString();
        this.localisedGendersByKey[Gender.OTHER] = v.$t('message.Other').toString();
    }
}