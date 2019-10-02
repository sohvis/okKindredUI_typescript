export default class BrowserDetection {

    public static isAndroid(): boolean {
        return navigator.userAgent.toLowerCase().indexOf('android') > -1;
    }

    public static isFirefox(): boolean {
        return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    }

    public static is_iOS(): boolean {
        if (!!navigator.platform) {
            while (BrowserDetection.iDevices.length) {
                if (navigator.platform === BrowserDetection.iDevices.pop()) { return true; }
            }
        }

        return false;
    }

    public static isMobileMenuOpen(): boolean {
        const mobileMenu = document.getElementById('nav_collapse') as HTMLDivElement;
        return mobileMenu.clientHeight > 80;
    }

    private static iDevices: string[] = [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod',
    ];
}
