export const configs = {
    // BaseApiUrl: 'https://www.okkindred.com',
    BaseApiUrl: 'https://justinhui.pythonanywhere.com',

    // Auth
    ObtainTokenAPI: '/api/auth/obtain_token/',
    RefreshTokenAPI: '/api/auth/refresh_token/',
    VerifyTokenAPI: '/api/auth/verify_token/',


    // API endpoints
    GalleryAPI: '/api/gallery/',
    InviteEmailAPI: '/api/invite_email/',
    InviteEmailConfirmationAPI: '/api/invite_email_confirmation/',
    ImageAPI: '/api/image/',
    ImageTaggingAPI: '/api/image_tagging/?image_id=',
    LeaveSiteAPI: '/api/delete_account/',
    LocationApi: '/api/location/',
    PasswordChangeAPI: '/api/password_change/',
    PasswordResetAPI: '/api/reset-password/',
    PersonAPI: '/api/person/',
    ProfileImageAPI: '/api/profile_image/',
    RelationAPI: '/api/relation/',
    SignUpAPI: '/api/sign_up/',
    UserSettingsAPI: '/api/user_settings/',
    UsersAPI: '/api/users/',

    // External APIs
    PwnedPasswordsAPI: 'https://api.pwnedpasswords.com/range/',

    // JS tokens
    MapboxToken: 'pk.eyJ1Ijoib2traW5kcmVkIiwiYSI6Ild2MnY5dDQifQ.EHr6blIYPYeg4bWmSStT-g',
    TinyMceApiToken: 'enx50wn3zw6ekck6y0dsoz784z5mo5c936go697ncer7lpzb',

    // App config
    MinPasswordLength: 8,
    MaxLoginAttempts: 4,
    PaginationPageSize: 20,
};

export default configs;

// tslint:disable-next-line:max-line-length
// node node_modules/s3-deploy/bin/s3-deploy './dist/**' --cwd './dist/' --region us-east-1 --bucket beta.okkindredui --profile default
// cf-invalidate -- EEKS6U7D2UAPF *.*

