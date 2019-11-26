<template>
  <div class="container privacy-policy">
    <h1>{{ $t('message.PrivacyPolicy') }}</h1>

    <h2>{{ $t('message.WhoAreWe') }}</h2>
    <p>{{ $t('message.WhoAreWeDescription') }}</p>

    <div class="contact-details">
      <div>Tech Luminaire Ltd</div>
      <div>48 Villiers Street</div>
      <div>Coventry CV2 4HP</div>
      <div>United Kingdom</div>
      <br/>
      <div>{{ $t('message.CompanyContactEmail') }}</div>
      <div>{{ $t('message.CompanyContactTelephone') }}</div>
      <div>{{ $t('message.CompanyNumber') }}</div>
      <div>{{ $t('message.CompanyVATNumber') }}</div>
    </div>

    <h2>{{ $t('message.WhatInformationWeCollect') }}</h2>
    <p>{{ $t('message.WhatInformationWeCollectDescription') }}</p>
    <p>{{ $t('message.WhatInformationWeCollectDescription2') }}</p>

    <h2>{{ $t('message.WhatWeDoWithInformation') }}</h2>
    <p>{{ $t('message.WhatWeDoWithInformationDescription') }}</p>

    <h2>{{ $t('message.HowWeStoreYourInformation') }}</h2>
    <p>{{ $t('message.HowWeStoreYourInformationDescription') }}</p>
    <p>{{ $t('message.HowWeStoreYourInformationDescription2') }}</p>

    <h2>{{ $t('message.YourDataProtectionRights') }}</h2>
    <p>{{ $t('message.YourDataProtectionRightsDescription') }}</p>

    <h2>{{ $t('message.LinksToOtherWebsites') }}</h2>
    <p>{{ $t('message.LinksToOtherWebsitesDescription') }}</p>
    
    <h2>{{ $t('message.HowToComplain') }}</h2>
    <p>{{ $t('message.HowToComplainDescription') }}</p>
    <a href="https://ico.org.uk/">https://ico.org.uk/</a>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class PrivacyPolicy extends Vue {}
</script>
<style scoped>
    .contact-details {
      background-color: #f0f0f0;
      margin-top: 10px;
      margin-bottom: 10px;
      padding-top: 15px;
      padding-left: 15px;
      padding-right: 15px;
      padding-bottom: 15px;

    }

    .privacy-policy {
      margin-bottom: 50px;
    }
</style>

