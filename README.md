# WePod Photo Web Application
The WePod Photo Web Application enables you to get back control over your photos that are stored in your very own [Solid pod](https://signup.pod.inrupt.com/). The project is the result of a partnership between [IDLab](https://idlab.technology/) and [Open Summer of Code](https://osoc.be/) (OSOC21), an initiative of [Open Knowledge Belgium](https://openknowledge.be/). 
<!-- More explanation of our own project -->

# Functionalities
## Login
A user can log in with their Inrupt.com account. When the user is logged in, the application logic is handled in the `Home.js` file.

## Photos
When the user is logged in, they see an overview (grid view) of all the pictures that are stored in the root folder of their Solid pod.  The implementation of the grid view itself can be found in `GridView.js`.

## Albums
For now, the "Albums" button leads to a page with some dummy text. In the future the app could be expanded so that a Solid pod "collection" (or folder if you will) corresponds to an album. Each collection would then have a `metadata.json` file (read more on this in the Metadata section).

# Tech Stack
The project was made in [ReactJs](https://reactjs.org/) with the [Inrupt JavaScript client libraries](https://docs.inrupt.com/developer-tools/javascript/client-libraries/). However, you might also want to check out Inrupt's [Solid React SDK](https://docs.inrupt.com/developer-tools/javascript/react-sdk/).


## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
