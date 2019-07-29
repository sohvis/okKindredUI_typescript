<template>

    <b-form @submit="submit" ref="form">
        <b-form-group
            :label="$t('message.Name') + '*'"
            label-for="name"
            :state="form.nameState">
            <b-form-input
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
import GenderOptionsBuilder from '../../models/data/gender_options_builder';
import SelectOption from '../../models/data/select_option';

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

    public show() {
        (this.$refs.modal as any).show();
    }

    public submit() {
        window.console.log(`NewRelative.submit()`);

        const valid = (this.$refs.form as any).checkValidity();
        this.form.nameState = valid ? 'valid' : 'invalid';
        if (!valid) {
            return;
        }

        alert(JSON.stringify(this.form));
    }

    protected mounted() {
        const genderBuilder = new GenderOptionsBuilder(this);
        this.options = genderBuilder.createDropDownOptions();
    }

    private resetModal() {
        window.console.log(`NewRelative.resetModal()`);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
