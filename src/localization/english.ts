// tslint:disable:max-line-length

export const english = {
    message: {

      // Global
      Edit: `Edit`,
      Done: `Done`,

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

      // Login
      PleaseSignIn: 'Please sign in',
      EmailAddress: 'Email Address',
      Password: 'Password',
      SignIn: 'Sign In',
      IForgotMyPassword: 'I forgot my password',
      InvalidLogin: 'Invalid Login',

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
      Other: `Other`,

      Biography: `Biography`,
      BiographyNotExist: `A biography has not yet been written.`,
      InviteToJoin: `Invite to Join`,
      Photos: `Photos`,

      ClickToEdit: `Click to Edit`,
      UploadNewPhoto: `Upload New Photo`,

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
    },
};
