[![MIT License][license-image]][license-url]
[![version][version-image]][version-url]
[![reshell.org][website-image]][website-url]
[![CodeFactor][codefactor-image]][codefactor-url]
[![Style Status][style-image]][style-url]
[![phantom-core-architecture][phantom-core-architecture-image]][phantom-core-architecture-url]
[![buy-me-a-coffee][buy-me-a-coffee-image]][buy-me-a-coffee-url]
[![paypal-me][paypal-me-image]][paypal-me-url]

[license-image]: https://img.shields.io/github/license/zenosmosis/reshell
[license-url]: https://raw.githubusercontent.com/zenOSmosis/reshell/main/LICENSE.txt
[version-image]: https://img.shields.io/github/package-json/v/zenosmosis/reshell
[version-url]: https://github.com/zenOSmosis/reshell/blob/main/package.json#L3
[website-image]: https://img.shields.io/badge/website-reshell.org-blue
[website-url]: https://reshell.org
[codefactor-image]: https://www.codefactor.io/repository/github/zenOSmosis/reshell/badge
[codefactor-url]: https://www.codefactor.io/repository/github/zenOSmosis/reshell
[style-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat
[style-url]: https://prettier.io/
[phantom-core-architecture-image]: https://img.shields.io/badge/architecture-phantom--core-red
[phantom-core-architecture-url]: https://github.com/zenosmosis/phantom-core
[buy-me-a-coffee-image]: https://img.shields.io/badge/sponsor-buymeacoffee-green
[buy-me-a-coffee-url]: https://www.buymeacoffee.com/Kg8VCULYI
[paypal-me-image]: https://img.shields.io/badge/sponsor-paypal.me-blue
[paypal-me-url]: https://www.paypal.com/paypalme/zenOSmosis

# ReShell - Web Desktop and UI Service Engine

**This is a work in progress, subject to many API updates and feature regressions in a short amount of time, as it is used for development and prototyping of several applications at once.**

ReShell is a web-based desktop & mobile user interface featuring individual "portals," or collections of apps, based on the [PhantomCore](https://github.com/zenOSmosis/phantom-core) library.

ReShell extends [Create React App](https://create-react-app.dev/) with a window management system, multiple portal handling, some core applications and utilities, and utilizes [Google's zx JavaScript Bash replacement utility](https://github.com/google/zx) to do some file system management.

Currently, a demonstration portal is running on [ReShell.org](https://reshell.org/about-reshell), and a portal is being created for a future version of [Speaker.app](https://speaker.app) (more details for Speaker.app are in the DEV article "[A WebRTC server in your browser](https://dev.to/jzombie/a-webrtc-server-in-your-web-browser-for-group-communications-5c6l)").

# Project Goals

- Stable and efficient on desktop and mobile
- Base portal UI should never require a backend to be present (specific portals may require one as necessary); should be easily distributable across multiple channels for a variety of frontend-related needs, from small to large projects
- Try not to break [Create React App](https://create-react-app.dev/) nor get too clever
- React components which provide low DOM abstraction
- Expose all "magic" via documentation; Keep everything understandable; abstract away the hard parts but make it easy to know about the inner-workings of those parts (and **_why certain decisions were made_**)

# Additional Resources

Additional open-source repositories for ReShell can be found on GitHub: https://github.com/zenosmosis

# License

[MIT License](https://github.com/zenOSmosis/reshell/blob/main/LICENSE). Copyright (c) 2010 - 2022 [zenOSmosis](https://zenosmosis.com). Included works are bound by their own copyrights and licensing and are not necessarily affiliated with zenOSmosis.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

**Note: [Notes for DEV Hackathon Competition](#notes-for-dev-hackathon-competition)** are found above.

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm eject`

**Note: This is a one-way operation. Once you `eject`, you can???t go back!**

**Note: This option has been disabled from the ReShell npm scripts due to a custom craco configuration. While the project could still be ejected, there is no support for ejected configurations.**

If you aren???t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you???re on your own.

You don???t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn???t feel obligated to use this feature. However we understand that this tool wouldn???t be useful if you couldn???t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
