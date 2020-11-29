<template>
  <div>
    <h2>{{ $t('message.LeaveSite') }}</h2>

    <div v-if="showOptions">
        <LeaveSiteSingleUser v-if="!otherUsers"/>
        <LeaveSiteMultipleUsers v-if="otherUsers" v-bind:users="users"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import APIException from '@/models/data/api_exception';
import store from '../../store/store';
import { configs } from '../../config';
import User from '../../models/data/user';
import LeaveSiteSingleUser from './LeaveSiteSingleUser.vue';
import LeaveSiteMultipleUsers from './LeaveSiteMultipleUsers.vue';

@Component({
  components: {
    LeaveSiteSingleUser,
    LeaveSiteMultipleUsers,
  },
})
export default class LeaveSite extends Vue {

    public email: string = '';

    public showOptions: boolean = false;

    public users: User[] = [];

    public get otherUsers(): boolean {
        return this.users.length > 1;
    }

    public async initialize() {
        // window.console.log(`UserSettings.initialize()`);
        await this.loadData();
    }

    public async loadData() {
        // window.console.log(`LeaveSite.loadData()`);

        this.showOptions = false;
        store.commit('updateLoading', true);

        try {
            const options: AxiosRequestConfig = {
                url: `${configs.BaseApiUrl}${configs.UsersAPI}`,
                headers: store.getters.ajaxHeader,
                method: 'GET',
                responseType: 'json',
            };

            const response = await axios.request(options) as AxiosResponse<User[]>;
            this.users = response.data;
            this.showOptions = true;

        } catch (ex) {
            const axiosError = ex as AxiosError<APIException>;
            store.commit('setErrorMessage', axiosError?.response?.data?.detail || ex.toString());
        }

        store.commit('updateLoading', false);
    }
}
</script>

<style scoped>

</style>
