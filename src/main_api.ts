import store from './store/store';
import AndroidImage from './models/data/android_image';

interface ViewModelApi {
  setUserAgent(userAgent: string): void;
  navigateTo(route: string): void;

  uploadAndroidImageDetails(androidImages: AndroidImage[]): Promise<void>;
  uploadAndroidImageData(androidImage: AndroidImage): void;
  uploadAndroidSharedFiles(androidImages: AndroidImage[]): Promise<void>;
}

/// Defines external API to web app.  Allows native aps to interact with it
export default class MainApi implements ViewModelApi {

  public static Setup(viewModel: ViewModelApi) {

    const funcs = new MainApi();
    viewModel.setUserAgent = funcs.setUserAgent;
    viewModel.navigateTo = funcs.navigateTo;

    viewModel.uploadAndroidImageDetails = funcs.uploadAndroidImageDetails;
    viewModel.uploadAndroidImageData = funcs.uploadAndroidImageData;
    viewModel.uploadAndroidSharedFiles = funcs.uploadAndroidSharedFiles;
  }

  // Sets user agent, used by native apps
  public setUserAgent(userAgent: string): void {
    window.console.log(`mainApi.setUserAgent: ${userAgent}`);

    store.dispatch('setUserAgent', userAgent);
  }

  // Navigate to
  public navigateTo(route: string): void {
    window.console.log(`mainApi.navigateTo: ${route}`);
    store.dispatch('setInitialRoute', route);
  }

  // Uploading files via android share, need to select gallery
  public async uploadAndroidSharedFiles(androidImages: AndroidImage[]): Promise<void> {
    window.console.log(`mainApi.uploadAndroidSharedFiles`);

    try {
      store.commit('updateLoading', true);

      this.navigateTo('/select_gallery/');
      store.dispatch('setAndroidImagesToUpload', androidImages);

    } finally {
      store.commit('updateLoading', false);
    }
  }

  // Uploads a list of filenames of images to be uploaded later one by one
  public async uploadAndroidImageDetails(androidImages: AndroidImage[]): Promise<void> {
    window.console.log(`mainApi.uploadAndroidImageDetails`);

    try {
      store.commit('updateLoading', true);

      store.dispatch('setAndroidImagesToUpload', androidImages);

    } finally {
      store.commit('updateLoading', false);
    }
  }

  // Uploads the image data for requested image
  public async uploadAndroidImageData(androidImage: AndroidImage) {
    window.console.log(`mainApi.uploadAndroidImageData`);

    store.dispatch('injectImageData', androidImage);
  }
}
