<template>
  <div class="container profile-container">
    <div class="row">      
      <!--Left column-->
      <div v-if="person" class="col-md-4 photo-column">
        <img :src="profileImage" :alt="person.name"/>

        <ProfileGalleryButton
            v-if="!editMode"
            v-bind:personId="person.id"/>

        <b-button class="btn-edit" variant="outline-primary" v-if="editMode" v-on:click="edit()" >
          <span class="oi oi-data-transfer-upload" aria-hidden="true"></span>
          <small>{{ $t('message.UploadNewPhoto') }}</small>
        </b-button>

        <b-button class="btn-edit" variant="outline-secondary" v-if="!isLocked && !editMode" v-on:click="edit()" >
          <span class="oi oi-pencil" aria-hidden="true"></span>
          {{ $t('message.Edit') }} 
        </b-button>

        <b-button class="btn-edit" variant="outline-success" v-if="editMode" v-on:click="finishEdit()" >
          <span class="oi oi-check" aria-hidden="true"></span>
          {{ $t('message.Done') }} 
        </b-button>

        <ProfileInviteToJoinButton 
            v-if="!editMode"
            v-bind:personId="person.id"
            v-bind:yearOfDeath="person.year_of_death"
            v-bind:personUserId="person.user_id"/>
      </div>

      <!-- Right info column -->
      <div class="col-md-8">

        <table v-if="person" class="table table-striped">
          <tbody>

            <tr v-show="showLockedControl">
              <th>{{ $t('message.LockedForOtherUsers') }}</th>
              <td>
                <BooleanField 
                    v-bind:personId="person.id"
                    v-bind:propertyName="'locked'"
                    v-bind:value="person.locked"
                    @valueUpdated="personUpdated"/>
              </td>
            </tr>

            <tr>
              <th>{{ $t('message.Name') }}</th>
              <td>
                <div v-if="!editMode">{{ person.name }}</div>
                <TextField 
                    v-if="editMode"
                    v-bind:personId="person.id"
                    v-bind:propertyName="'name'"
                    v-bind:value="person.name"
                    v-bind:max="5" 
                    @valueUpdated="personUpdated"/>
              </td>
            </tr>

            <tr>
              <th>{{ $t('message.Gender') }}</th>
              <td>
                <div v-if="!editMode">{{ gender }}</div>
                <GenderDropDown
                    v-if="editMode"
                    v-bind:personId="person.id"
                    v-bind:value="person.gender"
                    @valueUpdated="personUpdated"/>
              </td>
            </tr>

            <tr v-if="person.birth_year || editMode">
              <th>{{ $t('message.BirthYear') }}</th>
              <td>
                <div v-if="!editMode">{{ person.birth_year }}</div>
                <NumberField 
                    v-if="editMode"
                    v-bind:personId="person.id"
                    v-bind:propertyName="'birth_year'"
                    v-bind:value="person.birth_year"
                    v-bind:maxFieldLength="4" 
                    @valueUpdated="personUpdated"/>
              </td>
            </tr>

            <tr v-if="person.year_of_death || editMode">
              <th>{{ $t('message.DeathYear') }}</th>
              <td>
                <div v-if="!editMode">{{ person.year_of_death }}</div>
                <NumberField 
                    v-if="editMode"
                    v-bind:personId="person.id"
                    v-bind:propertyName="'year_of_death'"
                    v-bind:value="person.year_of_death"
                    v-bind:maxFieldLength="4" 
                    @valueUpdated="personUpdated"/>
              </td>
            </tr>

            <tr v-if="person.spoken_languages || editMode">
              <th>{{ $t('message.SpokenLanguages') }}</th>
              <td>
                <div v-if="!editMode">{{ person.spoken_languages }}</div>
                <TextField 
                    v-if="editMode"
                    v-bind:personId="person.id"
                    v-bind:propertyName="'spoken_languages'"
                    v-bind:value="person.spoken_languages"
                    v-bind:maxFieldLength="100" 
                    @valueUpdated="personUpdated"/>
              </td>
            </tr>

            <tr v-if="((person.email && !editMode) || (editMode && !person.user_id))">
              <th>{{ $t('message.Email') }}</th>
              <td>
                <div v-if="!editMode">
                  <a :href="'mailto:'+ person.email">{{ person.email }}</a>
                </div>
                <TextField 
                    v-if="editMode"
                    v-bind:personId="person.id"
                    v-bind:propertyName="'email'"
                    v-bind:value="person.email"
                    v-bind:maxFieldLength="255" 
                    @valueUpdated="personUpdated"/>
              </td>
            </tr>

            <tr v-if="person.occupation || editMode">
              <th>{{ $t('message.Occupation') }}</th>
              <td>
                <div v-if="!editMode">{{ person.occupation }}</div>
                <TextField 
                    v-if="editMode"
                    v-bind:personId="person.id"
                    v-bind:propertyName="'occupation'"
                    v-bind:value="person.occupation"
                    v-bind:maxFieldLength="100" 
                    @valueUpdated="personUpdated"/>
              </td>
            </tr>

            <tr v-if="person.telephone_number || editMode">
              <th>{{ $t('message.TelephoneNumber') }}</th>
              <td>
                <div v-if="!editMode">{{ person.telephone_number }}</div>
                <TextField 
                    v-if="editMode"
                    v-bind:personId="person.id"
                    v-bind:propertyName="'telephone_number'"
                    v-bind:value="person.telephone_number"
                    v-bind:maxFieldLength="30" 
                    @valueUpdated="personUpdated"/>
              </td>
            </tr>

            <tr v-if="person.address || editMode">
              <th>{{ $t('message.Location') }}</th>
              <td>
                <div v-if="!editMode">{{ person.address }}</div>
                <TextField 
                    v-if="editMode"
                    v-bind:personId="person.id"
                    v-bind:propertyName="'address'"
                    v-bind:value="person.address"
                    v-bind:maxFieldLength="255" 
                    @valueUpdated="personUpdated"/>
              </td>
            </tr>

            <tr v-if="person.website || editMode">
              <th>{{ $t('message.Website') }}</th>
              <td>
                <div v-if="!editMode">
                  <a :href="person.website">{{ person.website }}</a>
                </div>
                <TextField 
                    v-if="editMode"
                    v-bind:personId="person.id"
                    v-bind:propertyName="'website'"
                    v-bind:value="person.website"
                    v-bind:maxFieldLength="100" 
                    @valueUpdated="personUpdated"/>
              </td>
            </tr>

            <tr v-if="person.skype_name || editMode">
              <th>{{ $t('message.SkypeName') }}</th>
              <td>
                <div v-if="!editMode">{{ person.skype_name }}</div>
                <TextField 
                    v-if="editMode"
                    v-bind:personId="person.id"
                    v-bind:propertyName="'skype_name'"
                    v-bind:value="person.skype_name"
                    v-bind:maxFieldLength="100" 
                    @valueUpdated="personUpdated"/>
              </td>
            </tr>

            <tr v-if="person.facebook || editMode">
              <th>{{ $t('message.Facebook') }}</th>
              <td>
                <div v-if="!editMode">{{ person.facebook }}</div>
                <TextField 
                    v-if="editMode"
                    v-bind:personId="person.id"
                    v-bind:propertyName="'facebook'"
                    v-bind:value="person.facebook"
                    v-bind:maxFieldLength="100" 
                    @valueUpdated="personUpdated"/>
              </td>
            </tr>

            <tr v-if="person.twitter || editMode">
              <th>{{ $t('message.Twitter') }}</th>
              <td>
                <div v-if="!editMode">{{ person.twitter }}</div>
                <TextField 
                    v-if="editMode"
                    v-bind:personId="person.id"
                    v-bind:propertyName="'twitter'"
                    v-bind:value="person.twitter"
                    v-bind:maxFieldLength="100" 
                    @valueUpdated="personUpdated"/>
              </td>
            </tr>

            <tr v-if="person.linkedin || editMode">
              <th>{{ $t('message.LinkedIn') }}</th>
              <td>
                <div v-if="!editMode">{{ person.linkedin }}</div>
                <TextField 
                    v-if="editMode"
                    v-bind:personId="person.id"
                    v-bind:propertyName="'linkedin'"
                    v-bind:value="person.linkedin"
                    v-bind:maxFieldLength="100" 
                    @valueUpdated="personUpdated"/>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>

    <hr/>

    <div v-if="person" class="row">
      <!-- Biography -->
      <Biography 
        v-bind:personId="person.id"
        v-bind:biography="person.biography" 
        v-bind:locked="isLocked"
        @biographyUpdated="personUpdated"/>
    </div>
    
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Promise } from 'q';
import Person from '../../models/data/person';
import GenderOptionsBuilder from '../../models/data/gender_options_builder';
import * as request from 'request-promise-native';
import store from '../../store/store';
import { configs } from '../../config';
import Biography from './Biography.vue';
import ProfileInviteToJoinButton from './ProfileInviteToJoinButton.vue';
import ProfileGalleryButton from './ProfileGalleryButton.vue';
import TextField from './TextField.vue';
import NumberField from './NumberField.vue';
import BooleanField from './BooleanField.vue';
import GenderDropDown from './GenderDropDown.vue';
import ProfileEmitArgs from '../../models/profile_emit_args';

@Component({
  components: {
      Biography,
      ProfileInviteToJoinButton,
      ProfileGalleryButton,
      TextField,
      NumberField,
      GenderDropDown,
      BooleanField,
  },
})
export default class Profile extends Vue {

  public person: Person | null = null;

  public profileImage?: string;

  public gender: string = '';

  private editMode: boolean = false;

  get isLocked(): boolean {

    if (!this.person) {
      return true;
    }

    if (this.person.locked) {
      return !this.profileIsCurrentUser;
    } else {
      return false;
    }

  }

  get profileIsCurrentUser(): boolean {
    window.console.log('Profile.vue profileIsCurrentUser() called');

    if (this.person) {
      window.console.log(`store.state.users_person_id: ${store.state.users_person_id}`);
      window.console.log(`this.person.id: ${this.person.id}`);
      return Number(store.state.users_person_id) === Number(this.person.id);
    } else {
      return false;
    }
  }

  get showLockedControl(): boolean {
    return this.editMode && this.profileIsCurrentUser;
  }

  public async initialize() {
      window.console.log('Profile.vue initialize() called');

      try {
        await this.LoadPersonData();
        window.console.log(this.person);

      } catch (ex) {
        store.commit('setErrorMessage', ex);
      }
  }

  protected mounted() {
    window.console.log('Profile.vue mounted() called');
  }

  private edit() {
    this.editMode = true;
  }

  private finishEdit() {
    this.editMode = false;
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
      const genderBuilder = new GenderOptionsBuilder(this);
      this.gender = genderBuilder.localisedGendersByKey[this.person.gender];

      if (this.person.large_thumbnail) {
        this.profileImage = this.person.large_thumbnail;
      } else {
        this.profileImage = 'img/portrait_200.png';
      }
    }

    store.commit('updateLoading', false);

    this.editMode = false;
  }

  private personUpdated(args: ProfileEmitArgs) {
      this.person = args.person;
      this.$emit('personUpdated', args);
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

  .btn-edit {
      width: 200px;
      margin: 5px 0px 5px 0px;
  }
</style>
