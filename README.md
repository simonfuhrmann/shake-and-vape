# Shake and Vape

Shake and Vape is a DIY e-juice mixing web application.
The website can be found at https://www.shake-and-vape.it.

Beta Notice: This is not a production site. All data stored on this site can
change or get deleted at any time.

## Development

The website can be served locally for development:

* Install NPM dependencies: `npm install`
* Serve the website: `npm run start`

The website uses the lit-element JS library for rendering, and Firebase as
authentication and database backend.

## Deployment

The website is deployed by building and minifying the HTML, JS and CSS, and
uploading it to Firebase Hosting.

* Build and minify: `npm run build`
* Deploy to Firebase: `firebase deploy`
