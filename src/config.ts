export const configs = {
    // BaseApiUrl: 'https://www.okkindred.com',
    BaseApiUrl: 'https://justinhui.pythonanywhere.com',

    ObtainTokenAPI: '/api/auth/obtain_token/',
    RefreshTokenAPI: '/api/auth/refresh_token/',
    VerifyTokenAPI: '/api/auth/verify_token/',

    PersonAPI: '/api/person/',
    RelationAPI: '/api/relation/',
    InviteEmailAPI: '/api/invite_email/',
    ImageAPI: '/api/image/',
    PasswordResetAPI: '/api/reset-password/',
    UserSettingsAPI: '/api/user_settings/',
    UsersAPI: '/api/users/',
    PasswordChangeAPI: '/api/password_change/',
    LeaveSiteAPI: '/api/delete_account/',

    MapboxToken: 'pk.eyJ1Ijoib2traW5kcmVkIiwiYSI6Ild2MnY5dDQifQ.EHr6blIYPYeg4bWmSStT-g',
    TinyMceApiToken: 'enx50wn3zw6ekck6y0dsoz784z5mo5c936go697ncer7lpzb',
    PwnedPasswordsAPI: 'https://api.pwnedpasswords.com/range/',

    MinPasswordLength: 8,
    MaxLoginAttempts: 4,
};

export default configs;

// tslint:disable-next-line:max-line-length
// node node_modules/s3-deploy/bin/s3-deploy './dist/**' --cwd './dist/' --region us-east-1 --bucket beta.okkindredui --profile default

