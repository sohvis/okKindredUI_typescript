<template>
  <div>
    <h2>{{ $t('message.UserSettings') }}</h2>

    <b-form>

        <b-form-group
            :label="$t('message.LanguageLabel')"
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
            {{ $t('message.ReceivePhotoTaggingEmailUpdates') }}
            </b-form-checkbox>
        </b-form-group>

        <p class="spinner-container">
            <b-spinner v-show="saving"></b-spinner>

            <span v-show="saved" class="saved-message">
                <span class="oi oi-check" aria-hidden="true"></span>
                {{ $t('message.UserSettingsSaved') }}
            </span>
        </p>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import APIException from '@/models/data/api_exception';
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
        date_joined: new Date(1900, 1, 1),
    };

    public languageOptions: SelectOption[] = [];

    public saving: boolean = false;

    public saved: boolean = false;

    private timeOutHandle: any;

    public async initialize() {
        // window.console.log(`UserSettings.initialize()`);
        this.saving = false;
        this.saved = false;
        await this.loadData();
    }

    public async loadData() {
        // window.console.log(`UserSettings.loadData()`);

        store.commit('updateLoading', true);

        try {
            const options: AxiosRequestConfig = {
                url: `${configs.BaseApiUrl}${configs.UserSettingsAPI}`,
                headers: store.getters.ajaxHeader,
                method: 'GET',
                responseType: 'json',
            };

            const response = await axios.request(options) as AxiosResponse<UserProperties>;
            this.userProperties = response.data;

        } catch (ex) {
            const axiosError = ex as AxiosError<APIException>;
            store.commit('setErrorMessage', axiosError?.response?.data?.detail || ex.toString());
        }

        store.commit('updateLoading', false);
    }

    public async onLanguageChange() {

        store.commit('updateLoading', true);
        await this.save();

        // Change language in UI
        store.dispatch('changeLanguage', this.userProperties.language);
        store.commit('updateLoading', false);

    }

    public onChange() {
        // window.console.log(`UserSettings.onChange() called`);

        if (this.timeOutHandle) {
            window.clearTimeout(this.timeOutHandle);
        }

        // Checkboxes need a few miliseconds to register change
        this.timeOutHandle = setTimeout(async () => {
            await this.save();
        }, 1000);
    }

    public async save() {

        // window.console.log(`UserSettings.dataChanged()`);

        this.saving = true;
        this.saved = false;

        const previousLanguage = this.userProperties.language;

        try {
            const options: AxiosRequestConfig = {
                url: `${configs.BaseApiUrl}${configs.UserSettingsAPI}`,
                headers: store.getters.ajaxHeader,
                data: this.userProperties,
                method: 'PATCH',
                responseType: 'json',
            };

            await axios.request(options);

            this.saved = true;

        } catch (ex) {
            const axiosError = ex as AxiosError<APIException>;
            store.commit('setErrorMessage', axiosError?.response?.data?.detail || ex.toString());
        }

        this.saving = false;

    }

    protected async mounted() {
        // window.console.log(`UserSettings.mounted()`);

        this.languageOptions = LanguageOptionsBuilder.createDropDownOptions();
    }
}
</script>

<style scoped>
    
    .saved-message {
        color: darkgreen;
    }

</style>
