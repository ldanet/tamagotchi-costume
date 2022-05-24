# Tamagotchi costume

https://tamagotchi.lydie.nz

This is a tamagotchi app made to run in Firefox on my inkBook e-reader, to be put inside a Tamagotchi cardboard costume with functioning buttons.
I don't own a tamagotchi so the behaviour and animations are based off descriptions and videos I could find, and some of them are made up.

Sprite code copied and adapted from https://github.com/jcreighton/tamagotchi

## Features
- Quick egg hatching
- Gets more and more hungry and unhappy over time
- Poops
- Gets sick when left with no hunger or happy hearts left or poop for too long
- Dies when left sick for too long
- Feeding meal/snack with a selection menu
- Turning light on/off without the selection menu
- Guessing left or right game like the original Gen 1 Tamagotchi but only 3 rounds
- Medicine heals the tamagotchi when it's sick
- Cleaning washes the poop away
- Status menu with all the screens present in Gen 1 Tamagotchi
- Attention indicator when there are no hearts of hunger or happiness left

## Operation
- A button changes the selection / guesses left in the guessing game
- B button confirms the selection / guesses right in the guessing game
- C button cancels / restarts a new egg when the tamagotchi is dead

## Limitations
- The e-reader can only animate 2 frames per second
- The animations are not interruptible, so you have to wait until the tamagotci has finished before pressing buttons
- The tamagotchi doesn't age, evolve or get fat
- Discipline was not implemented


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

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

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
