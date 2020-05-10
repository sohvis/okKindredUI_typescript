ok!Kindred Frontend
===================

This is a frontend for https://www.okkindred.com

It is written using Vue and Typescript.  It uses Vuex for state management and also vue-router.

For more information on the architecture of ok!Kindred please checkout the readme for the backend:
https://github.com/JustinWingChungHui/okKindred/blob/master/README.rst

# Deployment
- Make sure you have nodejs and npm installed
 - Install the vue cli (https://cli.vuejs.org/)
 - Clone this repository
 - Edit the `BaseApiUrl` property in `src/config.ts` so that it points to the Django site
 - From the command line run: `npm run-script build`
 - It should have created a 'dist' folder.
 - Copy the contents of the dist folder to somewhere to host the static website. 
We use Amazon s3. https://medium.com/@channaly/how-to-host-static-website-with-https-using-amazon-s3-251434490c59



