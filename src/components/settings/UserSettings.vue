<template>
  <div>
    <h2>{{ $t('message.UserSettings') }}</h2>

    <b-form>

        <b-form-group
            :label="$t('message.Language')"
            label-for="language">

            <b-form-select 
                v-model="userProperties.language" 
                :options="languageOptions"
                @change="onLanguageChange">
            </b-form-select>
        </b-form-group>

        <b-form-group>
            <b-form-checkbox 
                v-model="userProperties.receive_update_emails" 
                name="check-button" 
                switch
                @change="onChange">
            {{ $t('message.ReceiveFamilyEmailUpdates') }}
            </b-form-checkbox>
        </b-form-group>

        <b-form-group>
            <b-form-checkbox 
                v-model="userProperties.receive_photo_update_emails" 
                name="check-button" 
                switch
                @change="onChange">
            {{ $t('message.ReceivePhotoEmailUpdates') }}
            </b-form-checkbox>
        </b-form-group>

        <p class="spinner-container">
            <b-spinner v-show="saving"></b-spinner>
            <span v-show="saved" class="saved-message">{{ $t('message.Saved') }}</span>
        </p>
    </b-form>
  </div>
</template>

<script lang="ts">
import * as request from 'request-promise-native';
import { Component, Vue } from 'vue-property-decorator';
import store from '../../store/store';
import { configs } from '../../config';
import UserProperties from '../../models/data/user_properties';
import SelectOption from '../../models/data/select_option';
import LanguageOptionsBuilder from '../../models/data/language_options_builder';

@Component
export default class UserSettings extends Vue {

    public userProperties: UserProperties = {
        language: 'en',
        receive_update_emails: false,
        receive_photo_update_emails: false,
        date_joined: new Date(1900, 1, 1)
    };

    public languageOptions: SelectOption[] = [];

    public saving: boolean = false;

    public saved: boolean = false;

    private timeOutHandle: any;

    protected async mounted() {
        window.console.log(`UserSettings.mounted()`);

        this.languageOptions = LanguageOptionsBuilder.createDropDownOptions();
    }

    public async initialize() {
        window.console.log(`UserSettings.initialize()`);
        this.saving = false;
        this.saved = false;
        await this.loadData();
    }

    public async loadData() {
        window.console.log(`UserSettings.loadData()`);

        store.commit('updateLoading', true);

        try {
            const options = {
                uri: `${configs.BaseApiUrl}${configs.AccountAPI}`,
                headers: store.getters.ajaxHeader,
                json: true,
            };

            this.userProperties = await request.get(options) as UserProperties;

        } catch (ex) {
            store.commit('setErrorMessage', ex);
        }

        store.commit('updateLoading', false);
    }

    public async onLanguageChange() {
        await this.save();

        // Change language in UI
        store.commit('changeLanguage', this.userProperties.language);
    }

    public onChange() {
        window.console.log(`UserSettings.onChange() called`);

        if (this.timeOutHandle) {
            window.clearTimeout(this.timeOutHandle);
        }

        // Checkboxes need a few miliseconds to register change
        this.timeOutHandle = setTimeout(async () => {
            await this.save();
        }, 1000);
    }

    public async save() {

        window.console.log(`UserSettings.dataChanged()`);

        this.saving = true;
        this.saved = false;

        const previousLanguage = this.userProperties.language;

        try {
            const options = {
                uri: `${configs.BaseApiUrl}${configs.AccountAPI}`,
                headers: store.getters.ajaxHeader,
                body: this.userProperties,
                json: true,
            };

            await request.put(options);

            this.saved = true;

        } catch (ex) {
            store.commit('setErrorMessage', ex);
        }

        this.saving = false;

    }
}
</script>

<style scoped>
    
    .saved-message {
        color: darkgreen;
    }

</style>
