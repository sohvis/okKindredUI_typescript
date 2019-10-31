import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/accounts/Login.vue';
import About from './views/About.vue';
import Family from './views/Family.vue';
import PasswordReset from './views/accounts/PasswordReset.vue';
import PasswordResetConfirmation from './views/accounts/PasswordResetConfirmation.vue';
import Settings from './views/accounts/Settings.vue';
import SignUp from './views/accounts/SignUp.vue';
import SignUpConfirmation from './views/accounts/SignUpConfirmation.vue';
import NewProfilePhoto from './views/NewProfilePhoto.vue';
import GalleryList from './views/gallery/GalleryList.vue';
import GalleryView from './views/gallery/GalleryView.vue';
import UploadImages from './views/gallery/UploadImages.vue';
import PersonGalleryView from './views/gallery/PersonGalleryView.vue';
import GalleryMap from './views/gallery/GalleryMap.vue';
import InviteConfirmation from './views/accounts/InviteConfirmation.vue';
import PrivacyPolicy from './views/PrivacyPolicy.vue';
import SelectGallery from './views/gallery/SelectGallery.vue';


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/family/',
      redirect: '/family/tree/',
    },
    {
      path: '/family/:urlState/',
      name: 'FamilyState',
      component: Family,
      props: true,
    },
    {
      path: '/family/:urlState/:personId/',
      name: 'FamilyState',
      component: Family,
      props: true,
    },
    {
      path: '/person_gallery/',
      name: 'PersonGalleryView',
      component: PersonGalleryView,
      props: true,
    },
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about/',
      name: 'about',
      component: About,
    },
    {
      path: '/accounts/login/',
      name: 'Login',
      component: Login,
    },
    {
      path: '/accounts/password_reset/',
      name: 'PasswordReset',
      component: PasswordReset,
    },
    {
      path: '/accounts/password_reset_confirmation/',
      name: 'PasswordResetConfirmation',
      component: PasswordResetConfirmation,
    },
    {
      path: '/accounts/settings/',
      name: 'Settings',
      component: Settings,
    },
    {
      path: '/accounts/sign_up/',
      name: 'SignUp',
      component: SignUp,
    },
    {
      path: '/accounts/sign_up_confirmation=:confirmationToken/',
      name: 'SignUpConfirmationOld',
      component: SignUpConfirmation,
      props: true,
    },
    {
      path: '/accounts/sign_up_confirmation/:confirmationToken/',
      name: 'SignUpConfirmation',
      component: SignUpConfirmation,
      props: true,
    },
    {
      path: '/accounts/invite_confirmation/:confirmationToken/',
      name: 'InviteConfirmation',
      component: InviteConfirmation,
      props: true,
    },
    {
      path: '/new_profile_photo/',
      name: 'NewProfilePhoto',
      component: NewProfilePhoto,
    },
    {
      path: '/gallery/',
      name: 'GalleryList',
      component: GalleryList,
    },
    {
      path: '/gallery/:galleryId/',
      name: 'GalleryView',
      component: GalleryView,
      props: true,
    },
    {
      path: '/gallery/:galleryId/upload/',
      name: 'UploadImages',
      component: UploadImages,
      props: true,
    },
    {
      path: '/gallery/:galleryId/map/',
      name: 'GalleryMap',
      component: GalleryMap,
      props: true,
    },
    {
      path: '/privacy_policy/',
      name: 'PrivacyPolicy',
      component: PrivacyPolicy,
    },
    {
      path: '/select_gallery/',
      name: 'SelectGallery',
      component: SelectGallery,
    },
  ],
});
