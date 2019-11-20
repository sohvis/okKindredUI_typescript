<template>
    <div class="core-family-members-container">
        <h4>
          {{ $t('message.CoreFamilyMembers') }}
        </h4>


        <h5 v-if="showParents" class="member-separator">
          {{ $t('message.Parents') }}
        </h5>
        <div class="row">
          <CoreFamilyMember
            v-for="parent of parents"
            :key="parent.id"
            :person="parent" />
        </div>

        <h5 v-if="showSiblings" class="member-separator">
          {{ $t('message.Siblings') }}
        </h5>
        <div class="row">
          <CoreFamilyMember
            v-for="sibling of siblings"
            :key="sibling.id"
            :person="sibling" />
        </div>

        <h5 v-if="showPartners" class="member-separator">
          {{ $t('message.Partners') }}
        </h5>
        <div class="row">
          <CoreFamilyMember
            v-for="partner of partners"
            :key="partner.id"
            :person="partner" />
        </div>

        <h5 v-if="showChildren" class="member-separator">
          {{ $t('message.Children') }}
        </h5>
        <div class="row">
          <CoreFamilyMember
            v-for="child of children"
            :key="child.id"
            :person="child" />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import store from '../../store/store';
import Person from '../../models/data/person';
import Relation from '../../models/data/relation';
import configs from '../../config';
import * as request from 'request-promise-native';
import RelationTypes from '../../models/data/relation_types';
import CoreFamilyMember from './CoreFamilyMember.vue';

@Component({
  components: {
    CoreFamilyMember,
  },
})
export default class CoreFamilyMembers extends Vue {

  public parents: Person[] = [];
  public siblings: Person[] = [];
  public partners: Person[] = [];
  public children: Person[] = [];

  public personId: string = '';

  public get showParents(): boolean {
    return this.parents.length > 0;
  }

  public get showSiblings(): boolean {
    return this.siblings.length > 0;
  }

  public get showPartners(): boolean {
    return this.partners.length > 0;
  }

  public get showChildren(): boolean {
    return this.children.length > 0;
  }

  public async initialise(personId: string) {

    this.personId = personId;
    this.parents = [];
    this.siblings = [];
    this.partners = [];
    this.children = [];

    if (this.personId) {
      if (!store.state.people || store.state.people.length === 0) {
        await store.dispatch('loadTreeData');
      }

      const relations = store.state.relations;
      const people = store.state.people;

      const currentPersonId = Number(this.personId);

      this.buildArrays(people, relations, currentPersonId);
    }
  }

  private createPersonLookup(people: Person[]): { [id: string]: Person; } {
    const peopleById: { [id: string]: Person; } = {};
    for (const person of people) {
      peopleById[person.id] = person;
    }

    return peopleById;
  }

  private buildArrays(people: Person[] , relations: Relation[], currentPersonId: number) {
    const peopleById = this.createPersonLookup(people);

    for (const relation of relations) {
      if (relation.from_person_id === currentPersonId) {

        const toPerson = peopleById[relation.to_person_id.toString()];

        switch (relation.relation_type) {
          case RelationTypes.RAISED:
            this.children.push(toPerson);
            break;

          case RelationTypes.PARTNERED:
            this.partners.push(toPerson);
            break;
        }

      } else if (relation.to_person_id === currentPersonId) {
        const fromPerson = peopleById[relation.from_person_id.toString()];

        switch (relation.relation_type) {
          case RelationTypes.RAISED:
            this.parents.push(fromPerson);
            break;

          case RelationTypes.PARTNERED:
            this.partners.push(fromPerson);
            break;
        }
      }
    }

    if (this.parents.length > 0) {
      this.buildSiblings(relations, currentPersonId, peopleById);
    }
  }

  private buildSiblings(relations: Relation[], currentPersonId: number, peopleById: { [id: string]: Person; }) {

    const parentIds: number[] = [];
    for (const parent of this.parents) {
      parentIds.push(Number(parent.id));
    }

    for (const relation of relations) {
      if (relation.relation_type === RelationTypes.RAISED
        && parentIds.includes(relation.from_person_id)
        && currentPersonId !== relation.to_person_id) {
          const sibling = peopleById[relation.to_person_id.toString()];

          if (!this.siblings.includes(sibling)) {
            this.siblings.push(sibling);
          }
      }
    }
  }
}
</script>

<style scoped>
 .core-family-members-container {
   margin-bottom: 50px;
 }

 .member-separator{
   margin-top: 25px;
 }
</style>
