# dablar-whereigo-app

This project was generated with the [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) version 3.0.0-rc3.

Excercise from: [Freecodecamp basejump: Build a Nightlife Coordination App](http://www.freecodecamp.com/challenges/basejump-build-a-nightlife-coordination-app)

[Heroku app running](http://dablar-whereigo-app.herokuapp.com/)


Used Yepl Api for searching locals

Used Mansory library for present panels [using a final callback after ng-repeat](http://www.nodewiz.biz/angular-js-final-callback-after-ng-repeat/) to do it.

Used [imagesLoaded](http://imagesloaded.desandro.com/) to fix a Mansory overlapping issue.


## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and NPM](nodejs.org) >= v0.10.0
- [Bower](bower.io) (`npm install --global bower`)
- [Grunt](http://gruntjs.com/) (`npm install --global grunt-cli`)
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`

### Developing

1. Run `npm install` to install server dependencies.

2. Run `bower install` to install front-end dependencies.

3. Run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running

4. Run `grunt serve` to start the development server. It should automatically open the client in your browser when ready.

## Build & development

Run `grunt build` for building and `grunt serve` for preview.

## Testing

Running `npm test` will run the unit tests with karma.
