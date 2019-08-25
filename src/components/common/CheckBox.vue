<template>
    <div class="box">
        <span v-show="checked"
            class="oi oi-check tick">
        </span>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class CheckBox extends Vue {

    public checked: boolean = false;

    public toggle(): void {
        this.checked = !this.checked;
        this.$emit('checkboxChanged', this.checked);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.box {
    width: 30px;
    height: 30px;
    border-width: 1px;
    border-style: solid;
    border-radius: 3px;
    border-color: white;
    background-color:rgba(0, 0, 0, 0.7);
}

.box:hover {
    opacity: 1;
}

.tick {
    color: greenyellow;
    font-size: 28px;
    margin-top: -2px;
}
</style>
