<template>
  <b-input-group  class="mt-3">
    <b-form-input 
        v-model="valueInternal"
        @input="handleInput"
        :type="inputType" 
        required>
    </b-form-input>
    <b-input-group-append>
      <b-button 
        variant="outline-secondary" 
        @click="toggle()"
        :pressed="showPassword">
        <span class="oi oi-eye" aria-hidden="true"></span>
      </b-button>
    </b-input-group-append>
  </b-input-group>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class PasswordBox extends Vue {

    private get inputType(): string {
        if (this.showPassword) {
            return 'text';
        } else {
            return 'password';
        }
    }

    public showPassword: boolean = false;

    @Prop({default: ''})
    public value: string = '';

    private valueInternal: string = this.value;

    public handleInput(e: Event) {
      this.$emit('input', this.valueInternal);
    }

    private toggle() {
        this.showPassword = !this.showPassword;
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
