<template>
    <table class="table table-striped">
        <tr v-for="r in relations" :key="r.name">
            <td>{{ $t(`message["${r.name}"]`)}}</td>
            <td>
                <div v-for="m in r.mandarin" :key="m">{{ m }}</div>
            </td>
            <td>
                <div v-for="m in r.mandarin_pronounciation" :key="m">{{ m }}</div>
            </td>
        </tr>
    </table>
</template>

<script lang="ts">

import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import store from '../../../store/store';
import ChineseRelationName from '../../../models/data/chinese_relation_name';

@Component
export default class MandarinRelationName extends Vue {

    @Prop({default: []})
    public relations?: ChineseRelationName[];
}
</script>

<!-- "scoped" attribute removed to fill screen -->
<style scoped>
</style>
