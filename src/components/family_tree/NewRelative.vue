<template>

    <b-form @submit="submit" ref="form">
        <b-form-group
            :label="$t('message.Name') + '*'"
            label-for="name"
            :state="form.nameState">
            <b-form-input
                id="nameInput"
                v-model="form.name"
                :state="form.nameState"
                required>
            </b-form-input>
        </b-form-group>

        <b-form-group
            :label="$t('message.Gender') + '*'">
            <b-form-select 
                v-model="form.gender" 
                :options="options"
                required>
            </b-form-select>
        </b-form-group>
        
        
        <b-form-group
            :label="$t('message.BirthYear')"
            :state="form.birthYearState">
            <b-form-input
                id="birthYear"
                type="number"
                v-model="form.birthYear"
                :state="form.birthYearState">
            </b-form-input>
        </b-form-group>

        <b-form-group
            :label="$t('message.Location')">
            <b-form-input
                v-model="form.location">
            </b-form-input>
        </b-form-group>

        <small class="font-italic">* {{$t('message.Required')}}</small>
    </b-form >

</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import APIException from '@/models/data/api_exception';
import store from '../../store/store';
import { configs } from '../../config';
import GenderOptionsBuilder from '../../models/data/gender_options_builder';
import SelectOption from '../../models/data/select_option';
import NewPersonResponse from '../../models/data/new_person_response';


@Component
export default class NewRelative extends Vue {

    @Prop({default: 1})
    public relationType?: number;

    public options: SelectOption[] = [];

    public form: any = {
        name: '',
        nameState: null,
        gender: 'F',
        birthYear: '',
        birthYearState: null,
        location: '',
    };

    public async submit() {
        // window.console.log(`NewRelative.submit()`);

        const valid = (this.$refs.form as any).checkValidity();
        this.form.nameState = valid ? 'valid' : 'invalid';
        if (!valid) {
            this.$emit('onError');
            return;
        }

        try {
            const selectedPersonId = store.state.person_id;

            const options: AxiosRequestConfig = {
                url: `${configs.BaseApiUrl}${configs.PersonAPI}`,
                headers: store.getters.ajaxHeader,
                data: {
                    from_person_id: selectedPersonId,
                    relation_type: this.relationType,
                    name: this.form.name,
                    gender: this.form.gender,
                    birth_year: this.form.birthYear,
                    address: this.form.location,
                },
                method: 'POST',
                responseType: 'json',
            };

            const response = await axios.request(options) as AxiosResponse<NewPersonResponse>;
            store.dispatch('addPeople', [response.data.person]);
            store.dispatch('addRelations', [response.data.relation]);

            this.$emit('personCreated', response.data.person);

        } catch (ex) {
            const axiosError = ex as AxiosError<APIException>;
            this.$emit('onError', axiosError?.response?.data?.detail);
        }

    }

    protected mounted() {
        const genderBuilder = new GenderOptionsBuilder(this);
        this.options = genderBuilder.createDropDownOptions();

        const textbox = document.getElementById('nameInput') as HTMLInputElement;

        if (textbox) {
            setTimeout(() => {
                textbox.focus();
                textbox.select();
            }, 100);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
