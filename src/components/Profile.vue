<template>
  <div class="container profile-container">
    <div class="row">
      <!--Left column-->
      <div v-if="person" class="col-md-4 photo-column">
        <img :src="profileImage" :alt="person.name"/>
        <ProfileGalleryButton
            v-bind:personId="person.id"/>
        <ProfileInviteToJoinButton 
            v-bind:personId="person.id"
            v-bind:yearOfDeath="person.year_of_death"
            v-bind:personUserId="person.user_id"/>
      </div>

      <!-- Right info column -->
      <div class="col-md-8">

        <table v-if="person" class="table table-striped">
          <tbody>
            <tr>
              <th>{{ $t('message.Name') }}</th>
              <td>{{ person.name }}</td>
            </tr>

            <tr>
              <th>{{ $t('message.Gender') }}</th>
              <td>{{ gender }}</td>
            </tr>

            <tr>
              <th>{{ $t('message.BirthYear') }}</th>
              <td>{{ person.birth_year }}</td>
            </tr>

            <tr v-if="person.year_of_death">
              <th>{{ $t('message.DeathYear') }}</th>
              <td>{{ person.year_of_death }}</td>
            </tr>


            <tr v-if="person.spoken_languages">
              <th>{{ $t('message.SpokenLanguages') }}</th>
              <td>{{ person.spoken_languages }}</td>
            </tr>

            <tr v-if="person.email">
              <th>{{ $t('message.Email') }}</th>
              <td><a :href="'mailto:'+ person.email">{{ person.email }}</a></td>
            </tr>

            <tr v-if="person.occupation">
              <th>{{ $t('message.Occupation') }}</th>
              <td>{{ person.occupation }}</td>
            </tr>

            <tr v-if="person.telephone_number">
              <th>{{ $t('message.TelephoneNumber') }}</th>
              <td>{{ person.telephone_number }}</td>
            </tr>

            <tr v-if="person.address">
              <th>{{ $t('message.Location') }}</th>
              <td>{{ person.address }}</td>
            </tr>

            <tr v-if="person.website">
              <th>{{ $t('message.Website') }}</th>
              <td><a :href="person.website">{{ person.website }}</a></td>
            </tr>

            <tr v-if="person.skype_name">
              <th>{{ $t('message.SkypeName') }}</th>
              <td>{{ person.skype_name }}</td>
            </tr>

            <tr v-if="person.facebook">
              <th>{{ $t('message.Facebook') }}</th>
              <td>{{ person.facebook }}</td>
            </tr>

            <tr v-if="person.twitter">
                <th>{{ $t('message.Twitter') }}</th>
                <td>
                    {{ person.twitter }}
                </td>
            </tr>

            <tr v-if="person.linkedin">
              <th>{{ $t('message.LinkedIn') }}</th>
              <td>{{ person.linkedin }}</td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>

    <hr/>

    <div v-if="person" class="row">
      <!-- Biography -->
      <Biography 
        v-bind:biography="person.biography" 
        v-bind:locked="person.locked"/>
    </div>
    
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Promise } from 'q';
import Person from './../models/data/person';
import Gender from './../models/data/gender';
import * as request from 'request-promise-native';
import store from '../store/store';
import { configs } from '../config';
import Biography from './Biography.vue';
import ProfileInviteToJoinButton from './ProfileInviteToJoinButton.vue';
import ProfileGalleryButton from './ProfileGalleryButton.vue'

@Component({
  components: {
      Biography,
      ProfileInviteToJoinButton,
      ProfileGalleryButton,
  },
})
export default class Profile extends Vue {

  public person: Person | null = null;

  public profileImage?: string;

  public gender: string = '';

  get profileIsCurrentUser(): boolean {
    if (this.person) {
      return store.state.users_person_id === this.person.id;
    } else {
      return false;
    }
  }

  public async initialize() {
      window.console.log('Profile.vue initialize() called');

      await this.LoadPersonData();

      window.console.log(this.person);
  }

  protected mounted() {
    window.console.log('Profile.vue mounted() called');
  }

  private async LoadPersonData() {

    window.console.log('LoadPersonData() call');

    this.person = null;

    store.commit('updateLoading', true);
    const selectedPerson = store.state.person_id;

    const options = {
        uri: `${configs.BaseApiUrl}${configs.PersonAPI}/${selectedPerson}`,
        headers: store.getters.ajaxHeader,
        json: true,
    };

    this.person = await request.get(options);

    if (this.person) {
      const gender = new Gender(this);
      this.gender = gender.localisedGendersByKey[this.person.gender];

      if (this.person.large_thumbnail) {
        this.profileImage = this.person.large_thumbnail;
      } else {
        this.profileImage = 'img/portrait_200.png';
      }
    }

    store.commit('updateLoading', false);
  }
}
</script>

<!-- "scoped" attribute removed to fill screen -->
<style scoped>
  .photo-column {
    max-width:300px;
  }

  .btn-profile {
      width: 200px;
      margin: 5px 0px 5px 0px;
  }

  .profile-container {
    margin-top: 20px;
  }
</style>
