<template>
<div class="container">
    <b-card no-body>
        <b-tabs card justified>
            <b-tab @click="userSettingsInit()" active>
                <template slot="title">
                    <span class="oi oi-wrench" aria-hidden="true"></span>
                    {{ $t('message.UserSettings') }}
                </template>
                <b-card-text>
                    <UserSettings ref="userSettings" />
                </b-card-text>
            </b-tab>
            <b-tab @click="changePasswordInit()">
                <template slot="title">
                    <span class="oi oi-key" aria-hidden="true"></span>
                    {{ $t('message.ChangePassword') }}
                </template>
                <b-card-text>
                    <ChangePassword ref="changePassword"/>
                </b-card-text>
            </b-tab>
            <b-tab @click="leaveInit()">
                <template slot="title">
                    <span class="oi oi-warning" aria-hidden="true"></span>
                    {{ $t('message.LeaveokKindred') }}
                </template>
                <b-card-text>
                    <LeaveSite ref="leaveSite"/>
                </b-card-text>
            </b-tab>
        </b-tabs>
    </b-card>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import UserSettings from '../../components/settings/UserSettings.vue';
import ChangePassword from '../../components/settings/ChangePassword.vue';
import LeaveSite from '../../components/settings/LeaveSite.vue';
import store from '../../store/store';

@Component({
  components: {
    UserSettings,
    ChangePassword,
    LeaveSite,
  },
})
export default class Settings extends Vue {

    public state: string = 'usersettings';

    public userSettingsInit() {
        window.console.log(`Settings.userSettingsInit()`);

        this.state = 'usersettings';
        const userSettings = this.$refs.userSettings as UserSettings;
        if (userSettings) {
            setTimeout(async () => await userSettings.initialize(), 100);
        }
    }

    public changePasswordInit() {
        window.console.log(`Settings.changePasswordInit()`);

        this.state = 'changePassword';
    }

    public leaveInit() {
        window.console.log(`Settings.leaveInit()`);

        this.state = 'leaveSite';
        const leaveSite = this.$refs.leaveSite as UserSettings;
        if (leaveSite) {
            setTimeout(async () => await leaveSite.initialize(), 100);
        }
    }

    protected async mounted() {
        window.console.log(`Settings.mounted()`);

        try {
            await store.dispatch('restoreSession');
            const userSettings = this.$refs.userSettings as UserSettings;
            await userSettings.initialize();

        } catch {
            this.$router.push('/accounts/login/');
        }
    }
}
</script>

<style scoped>

</style>
