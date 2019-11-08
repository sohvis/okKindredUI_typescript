import AndroidImage from './models/data/android_image';

/// Defines external API to web app.  Allows native aps to interact with it
export default class MainApi {

  public static Setup(viewModel: any) {

    // Navigate to
    viewModel.navigateTo = (route: string) => {
      viewModel.$store.dispatch('setInitialRoute', route);
    };

    // Upload Files
    viewModel.uploadFiles = async (androidImages: AndroidImage[]) => {

      try {
        viewModel.$store.commit('updateLoading', true);

        viewModel.navigateTo('/select_gallery/');

        const files = new Array<File>();
        for (const androidImage of androidImages) {

          const res = await fetch(androidImage.base64Image);
          const blob = await res.arrayBuffer();

          const file = new File([blob], androidImage.fileName, {type: androidImage.mimeType});

          files.push(file);
        }

        viewModel.$store.dispatch('setFilesToUpload', files);

      } finally {
        viewModel.$store.commit('updateLoading', false);
      }
    };

    // Set User Agent
    viewModel.setUserAgent = (userAgent: string) => {
      viewModel.$store.dispatch('setUserAgent', userAgent);
    };
  }
}
