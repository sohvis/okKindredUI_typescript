<template>
    <div class="col-lg-3 col-md-4 col-sm-6 col-8 core-family-member" @click="onClick">
      <div class="row">
        <div class="col-pixel-width-80">
          <img :src="imageUrl" />
        </div>
        <div class="col member-name">
          {{ name }}
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import store from '../../store/store';
import Person from '../../models/data/person';
import configs from '../../config';
import * as request from 'request-promise-native';
import RelationTypes from '../../models/data/relation_types';

@Component({
  components: {

  },
})
export default class CoreFamilyMember extends Vue {

  @Prop()
  public person?: Person;

  public get imageUrl(): string {
    if (this.person && this.person.small_thumbnail) {
      return this.person.small_thumbnail;

    } else {
      return 'img/portrait_80.png';
    }
  }

  public get name(): string {
    if (this.person && this.person.name) {
      return this.person.name;

    } else {
      return '';
    }
  }

  protected async mounted() {
    // window.console.log('CoreFamilyMembers.vue mounted() called');
  }

  private onClick() {
    if (this.person) {
      store.dispatch('changePerson', this.person.id);
    }
  }
}
</script>

<style scoped>
.col-pixel-width-80 { 
  flex: 0 0 80px;
  margin-left: 15px;
  margin-top: 15px;
  margin-bottom: 15px;
}

.member-name {
  margin-top: 30px;
  margin-bottom: 15px;
  margin-right: 15px;
}

.core-family-member {
  margin-left: 15px;
  border-style: solid;
  border-color: #ddd;
  border-width: 1px;
  border-radius: 20px;
  cursor: pointer;
}

.core-family-member:hover {
  background: #ddd;
}

</style>
