export const configs = {
    BaseApiUrl: 'https://api.okkindred.com',
    // BaseApiUrl: 'https://justinhui.pythonanywhere.com',

    // Auth
    ObtainTokenAPI: '/api/auth/obtain_token/',
    RefreshTokenAPI: '/api/auth/refresh_token/',
    VerifyTokenAPI: '/api/auth/verify_token/',


    // API endpoints
    GalleryAPI: '/api/gallery/',
    InviteEmailAPI: '/api/invite_email/',
    InviteEmailConfirmationAPI: '/api/invite_email_confirmation/',
    ImageAPI: '/api/image/',
    ImageTaggingAPI: '/api/image_tagging/',
    LeaveSiteAPI: '/api/delete_account/',
    LocationApi: '/api/location/',
    PasswordChangeAPI: '/api/password_change/',
    PasswordResetAPI: '/api/reset-password/',
    PersonAPI: '/api/person/',
    ProfileImageAPI: '/api/profile_image/',
    RelationAPI: '/api/relation/',
    SignUpAPI: '/api/sign_up/',
    SuggestedTaggingAPI: '/api/suggested_image_tagging/',
    UserSettingsAPI: '/api/user_settings/',
    UsersAPI: '/api/users/',

    // External APIs
    PwnedPasswordsAPI: 'https://api.pwnedpasswords.com/range/',
    MapboxTileAPi: 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/{z}/{x}/{y}?access_token={token}',

    // JS tokens
    MapboxToken: 'pk.eyJ1Ijoib2traW5kcmVkIiwiYSI6Ild2MnY5dDQifQ.EHr6blIYPYeg4bWmSStT-g',
    TinyMceApiToken: 'enx50wn3zw6ekck6y0dsoz784z5mo5c936go697ncer7lpzb',

    // App config
    MinPasswordLength: 8,
    MaxLoginAttempts: 4,
    PaginationPageSize: 20,
    DefaultLocation: [53.421420, -2.561041] as [number, number],
};

export default configs;

