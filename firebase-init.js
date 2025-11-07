// firebase-init.js — optional. If you have Firebase, include this file and set window.firebaseConfig.
// Example usage in admin.html will call window.syncToFirebase() if firebaseConfig is present.
window.syncToFirebase = async function(profileObj){
  if (!window.firebaseConfig) {
    console.warn('No firebaseConfig found. Skipping Firebase sync.');
    return;
  }
  // Lazy load Firebase SDK
  if (!window.firebase) {
    const s = document.createElement('script');
    s.src = 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js';
    document.head.appendChild(s);
    const s2 = document.createElement('script');
    s2.src = 'https://www.gstatic.com/firebasejs/9.22.1/firebase-database-compat.js';
    document.head.appendChild(s2);
    await new Promise(r => s2.onload = r);
  }
  try {
    const app = firebase.initializeApp(window.firebaseConfig);
    const db = firebase.database();
    await db.ref('nfc_profiles/default').set(profileObj);
    console.log('Synced to Firebase Realtime DB at nfc_profiles/default');
  } catch (e) {
    console.warn('Firebase sync failed', e);
  }
};
