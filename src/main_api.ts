import store from './store/store';
import AndroidImage from './models/data/android_image';

interface ViewModelApi {
  navigateTo(route: string): void;
  uploadSharedFiles(androidImages: AndroidImage[]): Promise<void>;
  uploadFileFromExternalPicker(androidImages: AndroidImage[]): Promise<void>;
  setUserAgent(userAgent: string): void;
}

/// Defines external API to web app.  Allows native aps to interact with it
export default class MainApi implements ViewModelApi {

  public static Setup(viewModel: ViewModelApi) {

    const funcs = new MainApi();
    viewModel.navigateTo = funcs.navigateTo;
    viewModel.uploadSharedFiles = funcs.uploadSharedFiles;
    viewModel.setUserAgent = funcs.setUserAgent;
    viewModel.uploadFileFromExternalPicker = funcs.uploadFileFromExternalPicker;
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

        const res = await fetch(androidImage.base64Image);
        const blob = await res.arrayBuffer();

        const file = new File([blob], androidImage.fileName, {type: androidImage.mimeType});

        files.push(file);
      }

      store.dispatch('setFilesToUpload', files);

    } finally {
      store.commit('updateLoading', false);
    }
  }

  // Sets user agent, used by native apps
  public setUserAgent(userAgent: string): void {
    store.dispatch('setUserAgent', userAgent);
  }

  // Upload files, we should know the route already
  public async uploadFileFromExternalPicker(androidImages: AndroidImage[]): Promise<void> {
    try {
      store.commit('updateLoading', true);

      const files = new Array<File>();
      for (const androidImage of androidImages) {

        const res = await fetch(androidImage.base64Image);
        const blob = await res.arrayBuffer();

        const file = new File([blob], androidImage.fileName, {type: androidImage.mimeType});

        files.push(file);
      }

      store.dispatch('setFilesToUpload', files);

    } finally {
      store.commit('updateLoading', false);
    }
  }
}
