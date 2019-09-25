export default class EmailHelper {

    public static validateEmail(email: string): boolean {
        // tslint:disable-next-line:max-line-length
        const emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
        const re = new RegExp(emailRegex);
        return re.test(email);
    }
}
