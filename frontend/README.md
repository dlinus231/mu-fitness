# Setup

Before attempting to run the development server, install the Expo Go app on your phone.

## Running Development Server
Navigate to frontend directory and run
```
npm install
```
Then start the server
```
npx expo start
```
After running this command, you can type `w` in the terminal to open in a web browser, `i` to open an iOS simluator, and `a` for android. There are several other commands as well that will display in the terminal.
Note that you will need an Android SDK installed to open an Android simulator, and you will need to be on MacOS with XCode installed for the iOS simulator.
You can also scan the QR code to open the development server on your phone. You can use the camera if you are on an iPhone, or use the Expo Go App if you are on Android. MAKE SURE that your phone and computer are connected to the same network. I've had success with wustl-encrypted-2.0 but haven't tried eduroam yet. 
Use CTRL+C to stop the development server.

## Other important commands to be aware of
- You can choose to only run on one type of emulator
    - `npx expo start --ios`
    - `npx expo start --android`
    - `npx expo start --web`
- `npx expo upgrade` upgrades the Expo SDK, could be useful to run from time to time
- `expo eject` is what we will run if we decide that we don't want to use expo anymore
    - this is NONREVERSIBLE and will transform our expo project into a vanilla React Native project