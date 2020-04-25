import store from './store/store';
import AndroidImage from './models/data/android_image';

interface ViewModelApi {
  navigateTo(route: string): void;
  uploadSharedFiles(androidImages: AndroidImage[]): Promise<void>;
  uploadFileFromExternalPicker(androidImages: AndroidImage[]): Promise<void>;
  setUserAgent(userAgent: string): void;
  uploadSharedFilesNoData(androidImages: AndroidImage[]): void;
  uploadFileDetailsFromExternalPicker(androidImages: AndroidImage[]): Promise<void>;
  injectBase64ImageData(androidImage: AndroidImage): void;
}

/// Defines external API to web app.  Allows native aps to interact with it
export default class MainApi implements ViewModelApi {

  public static Setup(viewModel: ViewModelApi) {

    const funcs = new MainApi();
    viewModel.navigateTo = funcs.navigateTo;
    viewModel.uploadSharedFiles = funcs.uploadSharedFiles;
    viewModel.setUserAgent = funcs.setUserAgent;
    viewModel.uploadFileFromExternalPicker = funcs.uploadFileFromExternalPicker;
    viewModel.uploadSharedFilesNoData = funcs.uploadSharedFilesNoData;

    viewModel.uploadFileDetailsFromExternalPicker = funcs.uploadFileDetailsFromExternalPicker;
    viewModel.injectBase64ImageData = funcs.injectBase64ImageData;

  }

  // Sets user agent, used by native apps
  public setUserAgent(userAgent: string): void {
    store.dispatch('setUserAgent', userAgent);
  }

  // Navigate to
  public navigateTo(route: string): void {
    store.dispatch('setInitialRoute', route);
  }

  // Uploading files via android share, need to select gallery
  public async uploadSharedFiles(androidImages: AndroidImage[]): Promise<void> {
    try {
      store.commit('updateLoading', true);

      this.navigateTo('/select_gallery/');

      const files = new Array<File>();
      for (const androidImage of androidImages) {

        const file = await androidImage.createFile(androidImage.base64Image);
        files.push(file);
      }

      store.dispatch('setFilesToUpload', files);

    } finally {
      store.commit('updateLoading', false);
    }
  }

  // Uploading files via android share, need to select gallery
  public async uploadSharedFilesNoData(androidImages: AndroidImage[]): Promise<void> {
    try {
      store.commit('updateLoading', true);

      this.navigateTo('/select_gallery/');

      store.dispatch('setAndroidImagesToUpload', androidImages);

    } finally {
      store.commit('updateLoading', false);
    }
  }

  public async injectBase64ImageData(androidImage: AndroidImage) {
    store.dispatch('setAndroidImagesToUpload', androidImage);
  }

  // Upload files, we should know the route already
  public async uploadFileFromExternalPicker(androidImages: AndroidImage[]): Promise<void> {
    try {
      store.commit('updateLoading', true);

      const files = new Array<File>();
      for (const androidImage of androidImages) {

        const file = await androidImage.createFile(androidImage.base64Image);
        files.push(file);
      }

      store.dispatch('setFilesToUpload', files);

    } finally {
      store.commit('updateLoading', false);
    }
  }


  public async uploadFileDetailsFromExternalPicker(androidImages: AndroidImage[]): Promise<void> {
    window.console.log(`mainApi.uploadFileDetailsFromExternalPicker`);
    window.console.log(androidImages);
    try {
      store.commit('updateLoading', true);

      store.dispatch('setAndroidImagesToUpload', androidImages);

    } finally {
      store.commit('updateLoading', false);
    }
  }
}
