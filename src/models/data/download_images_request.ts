import store from '../../store/store';

export default class DownloadImagesRequest {
    public token: string = store.state.access_token;
    public zip_filename: string = "okkindred.zip";
    public images: string[] = [];
}