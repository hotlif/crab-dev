// Wake selects the React DOM harness from the test entry's imports.
import '@crab-dev/wake/test/react';
import { testPublishedPicker } from './published-picker.js';

testPublishedPicker('macos');
