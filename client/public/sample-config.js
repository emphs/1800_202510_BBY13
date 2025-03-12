/*
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */

const firebaseConfig = {
  apiKey: "AIzaSyAMd6uOBKNaq7VjK5rAM5VDBiD3gh6kgR8",
  authDomain: "aa-5607f.firebaseapp.com",
  databaseURL: "https://aa-5607f.firebaseio.com",
  projectId: "aa-5607f",
  storageBucket: "aa-5607f.firebasestorage.app",
  messagingSenderId: "87623476991",
  appId: "1:87623476991:web:bbfaf8e049cdadd0e7ceca",
  measurementId: "G-784Z8S5HZ2"
};
firebase.initializeApp(firebaseConfig);


// Google OAuth Client ID, needed to support One-tap sign-up.
// Set to null if One-tap sign-up is not supported.
var CLIENT_ID =
    'YOUR_OAUTH_CLIENT_ID';
