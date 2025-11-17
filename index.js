// IMPORTANT: Set EXPO_OS BEFORE any imports that might use Expo packages
import { Platform } from 'react-native';
console.log('[index.js] Setting EXPO_OS to:', Platform.OS);
process.env.EXPO_OS = Platform.OS;

import 'react-native-reanimated'
import { AppRegistry } from 'react-native';
import { STORYBOOK_ENABLED } from '/config';
import './shim';
console.log('[index.js] Imports completed');
import App from './src/App';
console.log('[index.js] App imported');

if (__DEV__ && STORYBOOK_ENABLED === 'true') {
  console.log('[index.js] Registering Storybook');
  AppRegistry.registerComponent('SuperWallet', () => require('./.storybook').default);
} else {
  console.log('[index.js] Registering App');
  AppRegistry.registerComponent('SuperWallet', () => App);
}
console.log('[index.js] App registration complete');

