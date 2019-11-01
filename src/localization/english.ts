// tslint:disable:max-line-length

export const english = {
    message: {

      // Global
      Edit: `Edit`,
      Done: `Done`,
      Delete: `Delete`,
      Ok: `Ok`,
      Cancel: `Cancel`,
      Close: `Close`,
      Yes: `Yes`,
      No: `No`,
      Confirm: `Confirm`,
      Back: `Back`,
      Title: `Title`,
      Description: `Description`,

      // Navbar & Menus
      Family: `Family`,
      Tree: 'Tree',
      Map: 'Map',
      Gallery: 'Gallery',
      Search: 'Search',
      About: 'About',
      Settings: 'Settings',
      Logout: 'Logout',
      Login: 'Log In',
      Profile: 'Profile',
      Toolbar: `Toolbar`,
      Fullscreen: `Fullscreen`,
      Tags: `Tags`,
      Download: `Download`,
      Previous: `Previous`,
      Next: `Next`,
      ShowPassword: `Show Password`,

      // Login
      PleaseSignIn: 'Please sign in',
      EmailAddress: 'Email Address',
      Password: 'Password',
      SignIn: 'Sign In',
      IForgotMyPassword: 'I forgot my password',
      InvalidLogin: 'Invalid Login',
      AccountLocked: 'Your account has been locked for 24 hours after too many failed login attempts',
      NoAccount: `No account and no invite?`,
      SignUp: `Sign Up`,

      // Introduction
      Slide1Header: 'Welcome to ok!Kindred',
      Slide1Desc: 'The free and open source collaborative family tree and photo sharing website',
      Slide2Header: 'Create And Share',
      Slide2Desc: 'Create and share a multilingual family tree with your family and invite your family members to view it and add to it',
      Slide3Header: 'Map your family',
      Slide3Desc: 'Plot the locations of each of your relatives on a map',
      Slide4Header: 'Share Photos',
      Slide4Desc: 'Share photos privately between your family and tag your family members',
      SignUpButton: 'Sign Up',

      // About
      ViewDetails: 'View Details',
      OurStory: 'How It Started',
      OurStoryStub: 'Would you like to know the story of how and why we created this site?',
      ContactUs: 'Contact Us',
      ContactUsStub: 'If you have any questions, want to report a bug, ask for a feature or contribute to the source code.',
      FAQ: 'FAQ',
      FAQStub: 'Frequently Asked Questions',

      StoryHeading: 'How it started',
      StoryText1: `Hello.  I'm Justin on the right.  And I'm Adrian on the left.`,
      StoryText2: `This is a website to record our family tree and act a bit like a social network.
      You can maintain a profile on here and discover how far the tree reaches!
      As a person is added to the family tree, they receive an email so they may become a user and add more people to it.
      The site was inspired by our family gatherings and the difficulties of explaining how we are all related.  Our family is now very diverse with many ethnicities and has spread around the globe.`,

      ContactHeading: 'Contact Us',
      ContactEmail: 'Contact us via email <a href="mailto:info@okkindred.com">info@okkindred.com</a>',
      ContactText1: `If you are in our family we want to hear from you and are welcome to visit and stay round any time.
      If you have a login to this site and are part of my family, you can get my telephone number and address from my profile!`,
      ContactText2: `Alternatively, if you are looking for some help using the site, or even if you want us to help you set up your own similar site please drop us a line!`,
      ContactText3: `We're quite nice people and do like to talk to people interested in the sames things we are: Geek stuff, software, music and crazy pan global Chinese families...`,

      FAQHeading: 'Frequently Asked Questions (FAQ)',
      Question1: 'Can anyone see my family\'s information?',
      Answer1: `No, only people within your family tree that you have invited can see the information you input.  The information is also not searchable by outside users or search engines.`,

      Question2: `Is my information secure?`,
      Answer2: ` We take security and privacy very seriously. We keep the details of our family on this site, and we would never do anything to jeopardise this data!
      Only your own family members that you invite to share your tree are able to see the information that you enter on the site.
      Furthermore, we do not sell, trade, or rent your personal identification information to others.`,
      Answer2a: `The site is hosted with <a href="https://www.pythonanywhere.com/?affiliate_id=00022aed">PythonAnywhere</a> who themselves take privacy very seriously.
      We also use <a href="https://aws.amazon.com/s3/">Amazon S3</a> to store any images that you upload.
      We do use third party <a href="https://en.wikipedia.org/wiki/Geocoding">geocoding</a> services (Google & Microsoft).  This is to convert a location into a longitude and latitude so we can plot it on a map.
      However no other identifying pieces of information (e.g. name) are supplied with this location to these third parties.
      So for example we will send solely the term 'Hong Kong' to Google who will then give us a latitude and longitude so we can plot it on a map.`,
      Answer2b: `If you are concerned, the site is entirely open source, so you can take a copy of the source code (see below), have a look how your information is stored or even host your own version of this website.
      We will be more than happy to help you set it up.`,

      Question3: `Can I see the source code?`,
      Answer3: `The source code is located at <a href="https://github.com/JustinWingChungHui/okKindred">Github.com</a>.  What you see on okKindred.com is taken from the 'production' branch.`,
      Answer3a: `We've issued it with an <a href="https://en.wikipedia.org/wiki/MIT_License">MIT licence</a> which means you are free to use, copy and modify the code for your own purpose.
      The <a href="https://github.com/JustinWingChungHui/okKindred/blob/master/README.rst">README</a> contains a basic overview on how it works and step by step instructions to deploy your own instance.`,
      Answer3b: `We welcome anyone who has any ideas or who wishes to contribute to this project and make it better!  We especially need help with translation into other languages.
      Please <a href="mailto:info@okkindred.com?subject=Development" >get in touch</a> if you would like to contribute, or (even better) make a pull request on Github :)`,

      Question4: `What's in it for you if it's free?`,
      Answer4: `We are software developers, and this is a project created in our spare time to expand our skillset and to add to our portfolio to show off to others.
      This was the best way to organise information on our own family, and we hope that new users will offer suggestions to improve the site or even contribute code.`,

      Question5: `What browsers does this work on?`,
      Answer5: `The site is tested on the latest version of the top browsers on desktop and mobile.
      There may be issues on unsupported browsers, such as older Android browsers, Internet Explorer 9 and below.`,

      Question6: `Is there a limit on images I can upload?`,
      Answer6: `No at the moment there isn't.  The images are stored on <a href="https://aws.amazon.com/s3/">Amazon S3</a> which is very very cheap so we don't mind footing the cost.
      However if a lot of users start to upload thousands and thousands of images, we will have to create a limit.`,

      Question7: `Can I advertise on your site?`,
      Answer7: `We have no plans to raise money via ads on the site mainly as we don't want to subject our Grandmas to any more advertising than they currently get.`,

      Question8: `I found a bug!`,
      Answer8: `Please let us know!  You can <a href="mailto:info@okkindred.com?Subject=I%20found%20a%20bug!">email us</a> or you can add it to the <a href="https://github.com/JustinWingChungHui/okKindred/issues">issues list</a> on Github.
      If it's a security bug need to know ASAP so we can fix it!`,

      Question9: `Can you add a feature so it can do xxxxx please?`,
      Answer9: `Feel free to request new features via <a href="mailto:info@okkindred.com?Subject=Feature%20Request">info@okkindred.com</a>.  We will definitely consider them especially if it will benefit a lot of people (i.e. our family).
      This site is done in our spare time, so feature requests will be done when they're done.`,

      Question10: `Other genealogy websites look up local records to help create the tree, can you do the same?`,
      Answer10: `We have no plans to implement this yet.  The reason being is that most of our family originates from China.
      Because of the civil wars that occured in China in the 20th century and instability during the last decades of the Qing dynasty,
      few usable records exist that would be beneficial to us.`,
      Answer10a: `Given that many genealogy websites do this already, we would try to focus more on the social networking side of this project.
      However that is not to say that if in time a great need became apparent, we would not look at implementing such a feature.`,

      Question11: `For describing relationships you have 'Partnered' but not 'Married', you have 'Raised' but not 'Given Birth to'?`,
      Answer11: `We've tried to keep the site as simple as possible and as inclusive as possible.  The definitions of 'Raised', 'Raised by' and 'Partnered' give enough information to build a tree.
      They are inclusive of cross-cultural relationships which don't have a concept of marriage.
      They can include civil partnerships, common law partners, divorcees, adoptees and any other definitions that may or may not exist in different cultures.`,

      AboutFooter: `Justin Wing Chung Hui & Adrian Chu`,

      // Profile
      LockedForOtherUsers: `Locked for Other Users`,
      Name: `Name`,
      Gender: `Gender`,
      BirthYear: `Birth Year`,
      DeathYear: `Death Year`,
      SpokenLanguages: `Spoken Languages`,
      Email: `Email`,
      Occupation: `Occupation`,
      TelephoneNumber: `Telephone Number`,
      Location: `Location`,
      Website: `Website`,
      SkypeName: `Skype Name`,
      Facebook: `Facebook`,
      Twitter: `Twitter`,
      LinkedIn: `LinkedIn`,

      Female: `Female`,
      Male: `Male`,
      NonBinary: `Non-Binary`,
      Other: `Other`,
      PreferNotToSay: `Prefer not to say`,

      Biography: `Biography`,
      BiographyNotExist: `A biography has not yet been written.`,
      InviteToJoin: `Invite to Join`,
      Photos: `Photos`,

      ClickToEdit: `Click to Edit`,
      UploadNewPhoto: `Upload New Photo`,

      // Map
      LocationForPersonNotSpecified: `Location not specified for person`,

      // Search
      SearchName: `Search Name`,

      // Password reset
      PasswordReset: `Password Reset`,
      PasswordResetDescription: `Please enter your email to start the process to reset your password:`,
      ResetMyPassword: `Reset my Password`,
      PasswordResetRequested: `Password Reset Requested`,
      CheckYourEmailForReset: `Please check your email for further instructions.`,

      // Password Reset Confirmation
      PasswordResetConfirmation: `Password Reset Confirmation`,
      PasswordResetConfirmationDescription: `Please enter your new password.  Your new password should be at least 8 characters long.`,
      PasswordConfirmation: `Confirm your new password`,
      PasswordsNotMatching: `Passwords do not match`,
      UpdateMyPassword: 'Update my Password',

      // Settings
      UserSettings: `User Settings`,
      ChangePassword: `Change Password`,
      LeaveokKindred: `Leave ok!Kindred`,

      // User Settings
      LanguageLabel: `Language:`,
      ReceiveFamilyEmailUpdates: `Receive email notifications when family information gets updated`,
      ReceivePhotoTaggingEmailUpdates: 'Receive email notifications when you are tagged in photos',
      UserSettingsSaved: `User Settings Saved`,

      // Password breach
      PasswordBreach1: `This password is unsafe!`,
      PasswordBreach2: `It has been used in other sites which have had privacy breaches and should be
      changed to keep your ok!Kindred account secure`,
      PasswordBreach3: `Please change your password by going to `,
      ForMoreInformation: `For more information:`,

      // Change Password
      ChangePasswordDescription: `Enter your old password, then create a new password and confirm it.  Your new password should
      be at least 8 characters long`,
      OldPassword: `Old Password`,
      NewPassword: `New Password`,
      PasswordUpdated: `Password Updated`,
      IncorrectOldPassword: `Your old password is incorrect`,

      // Leave Site
      LeaveSite: `Leave ok!Kindred`,
      LeaveSiteSingleUserDescription: `Leaving ok!Kindred will delete all your profile, all the family data and images.`,
      EnterYourPasswordToConfirm: `Enter your password to confirm:`,
      CurrentUsersAccessToFamilyData: `These are all the users who currently curate the family data:`,
      LeaveSiteMultipleUsersDescription: `You can choose to delete your profile or you can preserve it for the other users in your family.`,
      LeaveSiteMultipleUsersDescription2: `If all the above users leave the site, then the entire family data will be deleted.`,
      DeleteMyProfile: `Delete my Profile`,
      LeaveSiteKeepMyProfile: `Profile will be preserved`,
      LeaveSiteDeleteMyProfile: `Profile will be deleted`,

      // Edit Tree
      AddAncestor: `Add Ancestor`,
      AddDescendant: `Add Descendant`,
      AddPartner: `Add Partner`,

      AreYouSureDelete: `Are you sure you want to delete?`,

      NewPerson: `New Person`,
      ExistingPerson: `Existing Person`,
      Required: `Required`,

      // Split relation
      BreakLinks: `Break Links`,
      Raised: `Raised`,
      RaisedBy: `RaisedBy`,
      Partnered: `Partnered`,

      // Suggested relations,
      SuggestedRelations: `Suggested Relations`,
      AreXandYPartners: `Are {fromPersonName} and {toPersonName} partners?`,
      DidXraiseY: `Did {fromPersonName} raise {toPersonName}?`,

      // Sign Up
      JoinSite: `Join ok!Kindred`,
      JoinSiteDescription: `To set up a new family network and join ok!Kindred, please provide the
      following information:`,
      EmailInUse: `Email is already in use`,
      ThankYou: `Thank you!`,
      PleaseCheckEmail: `Please check your email {email} to confirm your account.`,
      InvalidEmail: `Invalid email`,
      AlreadySignedUp: `Already have an account?`,

      // Account Confirmation
      AccountConfirmation: `Account Confirmation`,
      PleaseCreatePassword: `Please create a password for your account:`,

      // Upload New Profile Photo
      NewProfilePhoto: `New Profile Photo`,
      UploadNewProfilePhoto: `Upload a new profile photo for {personName}:`,
      SelectFile: `Select File`,

      PleaseTrimImage: `Please trim the image to suit a profile picture: `,
      UploadingImagePleaseWait: `Uploading new image, please wait...`,

      // Gallery
      AllGalleries: `All Galleries`,
      NoGalleries: `No image galleries found.`,
      AddNewGallery: 'Add a new gallery',
      NoImagesInGallery: `No images found in gallery`,
      AddNewImages: `Add new images`,
      CreateNewGallery: `Create New Gallery`,
      EditGallery: `Edit Gallery`,
      DeleteGalleries: `Delete Galleries`,
      DeleteGalleriesDesc: `Are you sure you want to leave delete the selected galleries?
      It will also delete all the images in them.`,
      DeleteImages: `Delete Images`,
      DeleteImagesDesc: `Are you sure you want to leave delete the selected images?`,

      // Upload Images
      UploadImages: `Upload Images`,
      SelectFiles: `Select Files`,
      Pending: `Pending`,
      Uploading: `Uploading`,
      Processing: `Processing`,
      Failed: `Failed`,
      UploadFinished: `Upload Finished`,
      AllUploadsSuccessful: `All Uploads Successful`,
      XSuccessfulYFailed: `{success} images uploaded successfully, {fail} failed`,

      // Person Gallery
      ImagesOfX: `Images of {name}`,
      NoImagesOfPerson: `No images of {name} have been tagged yet.`,
      GoToGalleries: `Go to galleries`,
      GoToGallery: `Go to Gallery`,

      // Edit Image
      EditImage: 'Edit Image',
      Details: 'Details',
      GalleryThumbnail: `Gallery Thumbnail`,

      AddTags: `Click/Touch image to tag people`,
      WhoIsThis: `Who is this?`,
      DeleteTags: `Delete Tags`,

      // Invite confirmation
      InviteConfirmation: `ok!Kindred Invite Confirmation`,
      HelloName: `Hello {name}!`,
      YouHaveBeenInvited: `Thank you for accepting the invitation from {invitedBy}
      to join ok!kindred, share your family tree and keep in contact with your family members!`,
      CannotFindInvite: `ok!Kindred invite not found`,
      CannotFindInviteDescription: `Please check with whoever sent you the invite and note that invites expire after 2 weeks.`,

      // Privacy Policy
      PrivacyPolicy: `Privacy Policy`,
      WhoAreWe: `Who Are We`,
      WhoAreWeDescription: `ok!Kindred is operated by Tech Luminaire Ltd:`,
      CompanyContactEmail: `Our email for all ok!kindred enquiries is info@okkindred.com`,
      CompanyContactTelephone: `Our telephone number is +44 2476 982000.  Please note that we don't provide technical support over the phone.`,
      CompanyNumber: `We are registered in England and Wales as company 08864499.`,
      CompanyVATNumber: `VAT No: 207242637`,

      WhatInformationWeCollect: `What Information We Collect`,
      WhatInformationWeCollectDescription: `We collect data to create your user account, 
      build up a family tree and profile of people in your family tree.
      To create your user account we require the following information: name, email address and gender.
      To create your family tree and profiles, we require name, gender and how family members are related. 
      Other data you may additionally choose to store on the site includes birth years, locations, email and other contact details, 
      biographical information and images.`,
      WhatInformationWeCollectDescription2: `Automated information such as the internet protocol (IP) address
      used to connect your device to the internet, connection information such as browser type and version,
      information about your device including device-type and device identifier, is also collected.`,

      WhatWeDoWithInformation: `What We Do With Your Information`,
      WhatWeDoWithInformationDescription: `Your data is not shared or sold or used for any marketing purposes.
      The information you share with the site is used to create your family tree/network.
      Automated information is used to help us to monitor and improve the service.
      Your photos are used to train the service to help you tag your own photos.
      Your location that you submit on your profile is sent to Google or Microsoft's geolocation services to place the person on a map.
      No other information is sent with the location.
      No members of the public outside of your family network are able to see the family tree data you share with the service.`,

      HowWeStoreYourInformation: `How We Store Your Information`,
      HowWeStoreYourInformationDescription: `Our service operates off PythonAnywhere (https://www.pythonanywhere.com) and your data is stored on their servers.
      They operate servers in the US managed by Amazon Web Services, which is certified under the EU-US Privacy Shield Framework.
      This provides safeguards in relation to the handling of your personal data.
      Photos are stored directly on to Amazon Web Services without going through PythonAnywhere.
      Your data is not transmitted to any other third parties.`,

      HowWeStoreYourInformationDescription2: `If you are the sole user in your family network, in general your data is deleted as soon as you delete your account.
      If there are many users within your family network, you are treated as joint owners of the data.
      When you delete your account, you may choose to delete your profile.
      The entire family network information is deleted when all users in your family network delete their accounts.
      Data backups may be kept for up to 2 weeks.`,

      YourDataProtectionRights: `Your Data Protection Rights`,
      YourDataProtectionRightsDescription: `You have the right to ask us for copies of your personal information and
      to rectify information you think is inaccurate.
      You also have the right to ask us to complete information you think is incomplete.
      You have the right to ask us to erase your personal information in certain circumstances.
      You have the right to ask us to restrict the processing of your information in certain circumstances.
      You have the the right to object to the processing of your personal data in certain circumstances.
      You have the right to ask that we transfer the information you gave us to another organisation, or to you,
      in certain circumstances.
      You are not required to pay any charge for exercising your rights. If you make a request, we have one month to respond to you.`,

      LinksToOtherWebsites: `Links To Other Websites`,  
      LinksToOtherWebsitesDescription: `This site contains links to other websites. We are not responsible for the content of other websites or how they processes personal information.`,
        
      HowToComplain: `How To Complain`,
      HowToComplainDescription: ` If you have a complaint about how we are dealing with your personal information, please contact us via the email address above.
      If you are not happy with our response or think we are not handling your personal information in accordance with the law,
      you can complain to the Information Commissioner's Office (ICO):`,
    },
};
