/* app.js — loads profile.json, supports localStorage override, optional Firebase sync
   - Reads /profile.json on load
   - If admin has saved a profile in localStorage ('nfc_profile'), it overrides JSON
   - Admin page writes to localStorage and (optionally) posts to Firebase if firebaseConfig is provided
*/
(async function(){
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  // Theme init
  const current = localStorage.getItem('theme') || 'dark';
  document.documentElement.classList.toggle('dark', current === 'dark');
  themeIcon.textContent = current === 'dark' ? '🌙' : '🌞';
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    themeIcon.textContent = isDark ? '🌙' : '🌞';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Fetch profile.json
  async function fetchProfile(){
    try {
      const resp = await fetch('/profile.json', {cache: "no-store"});
      const json = await resp.json();
      // check for admin override in localStorage
      const override = localStorage.getItem('nfc_profile');
      if (override) {
        try { return JSON.parse(override); } catch(e){}
      }
      return json;
    } catch (err) {
      // fallback to localStorage only
      const override = localStorage.getItem('nfc_profile');
      if (override) return JSON.parse(override);
      return null;
    }
  }

  const profile = await fetchProfile();
  if (!profile) {
    document.getElementById('fullname').textContent = 'Profile unavailable';
    return;
  }

  // populate UI
  document.getElementById('fullname').textContent = profile.fullname || '';
  document.getElementById('title').textContent = (profile.title ? profile.title + ' • ' : '') + (profile.company || '');
  document.getElementById('profileImg').src = profile.profileImg || '/assets/profile-placeholder.svg';

  // services
  const servicesEl = document.getElementById('services');
  servicesEl.innerHTML = '';
  (profile.services || []).forEach(s => {
    const div = document.createElement('div');
    div.className = 'p-3 rounded-lg border';
    div.innerHTML = `<h3 class="font-medium">${s.name}</h3><p class="text-sm text-slate-600 dark:text-slate-300">${s.desc}</p>`;
    servicesEl.appendChild(div);
  });

  // gallery
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';
  (profile.portfolio || []).forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'w-full rounded';
    gallery.appendChild(img);
  });

  // contact handlers using profile data
  document.getElementById('callBtn').addEventListener('click', () => {
    if (profile.phone) window.location.href = 'tel:' + profile.phone;
  });
  document.getElementById('waBtn').addEventListener('click', () => {
    if (profile.phone) {
      const num = profile.phone.replace(/[^0-9+]/g,'');
      window.open('https://wa.me/' + num.replace('+',''), '_blank');
    }
  });
  document.getElementById('emailBtn').addEventListener('click', () => {
    if (profile.email) window.location.href = 'mailto:' + profile.email;
  });

  // vCard generator and download
  document.getElementById('downloadVcard').addEventListener('click', () => {
    const v = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${profile.fullname || ''};;;;`,
      `FN:${profile.fullname || ''}`,
      `ORG:${profile.company || ''}`,
      `TITLE:${profile.title || ''}`,
      `TEL;TYPE=WORK,VOICE:${profile.phone || ''}`,
      `EMAIL;TYPE=PREF,INTERNET:${profile.email || ''}`,
      `URL:${profile.website || ''}`,
      'END:VCARD'
    ].join('\n');
    const blob = new Blob([v], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (profile.fullname || 'contact').toLowerCase().replace(/\s+/g,'-') + '.vcf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded';
    toast.textContent = 'vCard downloaded ✅';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  });

  // Share
  document.getElementById('shareBtn').addEventListener('click', async () => {
    const shareData = {
      title: `${profile.fullname} — ${profile.title}`,
      text: profile.bio || '',
      url: location.href
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch(e){}
    } else {
      prompt('Copy link to share:', location.href);
    }
  });

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => console.log('SW registered'))
      .catch(err => console.warn('SW registration failed', err));
  }
})();
