<template>
<div class="container about-container">
    <div class="row">
        <div class="col-md-4">
            <h2>{{ $t("message.OurStory") }}</h2>
            <p>{{ $t("message.OurStoryStub") }}</p>
            <p><b-button @click="scroll('story')">{{ $t("message.ViewDetails") }} &raquo;</b-button></p>
        </div>

        <div class="col-md-4">
            <h2>{{ $t("message.ContactUs") }}</h2>
            <p>{{ $t("message.ContactUsStub") }}</p>
            <p><b-button @click="scroll('contactus')">{{ $t("message.ViewDetails") }} &raquo;</b-button></p>
        </div>

        <div class="col-md-4">
            <h2>{{ $t("message.FAQ") }}</h2>
            <p>{{ $t("message.FAQStub") }}</p>
            <p><b-button @click="scroll('faq')">{{ $t("message.ViewDetails") }} &raquo;</b-button></p>
        </div>
    </div>

    <hr>
    <div id="story">
        <h2>{{ $t("message.StoryHeading") }}</h2>
        <img class="fluid-image" src="img/about/justin_and_adrian.jpg" alt="Justin and Adrian"/>
        <p>{{ $t("message.StoryText1") }}</p>
        <p>{{ $t("message.StoryText2") }}</p>

    </div>

    <hr>
    <div id="contactus">
        <h2>{{ $t("message.ContactHeading") }}</h2>
        <p v-html="$t('message.ContactEmail')"></p>
        <p v-html="$t('message.ContactText1')"></p>
        <p v-html="$t('message.ContactText2')"></p>
        <p v-html="$t('message.ContactText3')"></p>
    </div>

    <hr>
    <div id="faq">
        <h2>{{ $t("message.FAQHeading") }}</h2>

        <h3>{{ $t("message.Question1") }}</h3>
        <p v-html="$t('message.Answer1')"></p>

        <h3>{{ $t("message.Question2") }}</h3>
        <p v-html="$t('message.Answer2')"></p>
        <p v-html="$t('message.Answer2a')"></p>
        <p v-html="$t('message.Answer2b')"></p>

        <h3>{{ $t("message.Question3") }}</h3>
        <p v-html="$t('message.Answer3')"></p>
        <p v-html="$t('message.Answer3a')"></p>
        <p v-html="$t('message.Answer3b')"></p>

        <h3>{{ $t("message.Question4") }}</h3>
        <p v-html="$t('message.Answer4')"></p>

        <h3>{{ $t("message.Question5") }}</h3>
        <p v-html="$t('message.Answer5')"></p>

        <h3>{{ $t("message.Question6") }}</h3>
        <p v-html="$t('message.Answer6')"></p>

        <h3>{{ $t("message.Question7") }}</h3>
        <p v-html="$t('message.Answer7')"></p>

        <h3>{{ $t("message.Question8") }}</h3>
        <p v-html="$t('message.Answer8')"></p>

        <h3>{{ $t("message.Question9") }}</h3>
        <p v-html="$t('message.Answer9')"></p>

        <h3>{{ $t("message.Question10") }}</h3>
        <p v-html="$t('message.Answer10')"></p>
        <p v-html="$t('message.Answer10a')"></p>

        <h3>{{ $t("message.Question11") }}</h3>
        <p v-html="$t('message.Answer11')"></p>
    </div>

    <hr>

    <footer class="about-footer">
        <p>
            {{ $t("message.AboutFooter") }}
        </p>

        <div class="privacy-policy">
            <router-link to="/privacy_policy/">{{ $t("message.PrivacyPolicy") }}</router-link>
        </div>
    </footer>

</div> <!-- /container -->
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class AboutComponent extends Vue {


    public scroll(divId: string) {

        // window.console.log(`AboutComponent.scroll(divID: ${divId}) called`);

        const divTop = (document.getElementById(divId) as HTMLElement)
                            .getBoundingClientRect().top;

        const navHeight = (document.getElementById('navbar')as HTMLElement)
                                .clientHeight;

        // window.console.log(`divTop: ${divTop}`);
        window.scroll({
            top: divTop + window.scrollY - navHeight,
            left: 0,
            behavior: 'smooth',
        });
    }
}
</script>

<style>
    html {
        scroll-behavior: smooth;
    }

    .about-footer {
        margin-top: 30px;
        margin-bottom: 50px;
    }

    .about-container {
        margin-top: 2.5em;
    }

    .fluid-image {
        max-width: 100%;
        height: auto;
    }

    .privacy-policy {
        text-align: center;
        font-size: small;
    }
</style>
