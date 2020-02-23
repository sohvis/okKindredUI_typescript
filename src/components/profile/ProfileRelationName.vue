<template>
    <tr>
        <td>{{ relationName }}</td>
        <td>
            {{ cantonese }}
        </td>
        <td>
            {{ jyutping }}
        </td>
        <td>
            {{ mandarin }}
        </td>
        <td>
            {{ pinyin }}
        </td>
    </tr>
</template>

<script lang="ts">

import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import store from '../../store/store';
import ChineseRelationName from '../../models/data/chinese_relation_name';

@Component
export default class ProfileRelationName extends Vue {

    @Prop({default: null})
    public relation?: ChineseRelationName;


    // Do not translate for english or chinese
    public get relationName(): string {
        if (this.relation) {
            return this.$t(`message["${this.relation.name}"]`).toString();
        } else {
            return '';
        }
    }

    public get cantonese(): string {

        if (this.relation) {
            return this.relation.cantonese.join(' / ');
        } else {
            return '';
        }
    }

    public get jyutping(): string {

        if (this.relation) {
            return this.relation.cantonese_pronounciation.join(' / ');
        } else {
            return '';
        }
    }

    public get mandarin(): string {

        if (this.relation) {
            return this.relation.mandarin.join(' / ');
        } else {
            return '';
        }
    }

    public get pinyin(): string {

        if (this.relation) {
            return this.relation.mandarin_pronounciation.join(' / ');
        } else {
            return '';
        }
    }
}
</script>

<!-- "scoped" attribute removed to fill screen -->
<style scoped>
</style>
