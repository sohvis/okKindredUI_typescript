export default class AndroidImage {
    public base64Image: string = '';
    public path: string = '';
    public fileName: string = '';
    public mimeType: string = '';
    public file: File | null = null;

    public async createFile(base64Image: string): Promise<File> {
        const res = await fetch(base64Image);
        const blob = await res.arrayBuffer();

        const file = new File([blob], this.fileName, {type: this.mimeType});
        this.file = file;
        return file;
    }
}
