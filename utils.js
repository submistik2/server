// utils.js
import { translations } from './translations.js';
import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let currentLang = 'ru';
let currentTheme = 'dark';

export function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('language', lang);
  applyTranslations();
  // Обновляем в Firestore
  const user = auth.currentUser;
  if (user) {
    updateDoc(doc(db, "profiles", user.uid), { language: lang });
  }
}

export function setTheme(theme) {
  currentTheme = theme;
  document.body.className = `theme-${theme}`;
  localStorage.setItem('theme', theme);
  const user = auth.currentUser;
  if (user) {
    updateDoc(doc(db, "profiles", user.uid), { theme });
  }
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang] && translations[currentLang][key]) {
      el.textContent = translations[currentLang][key];
    }
  });
}

export function logoutUser() {
  import("./firebase.js").then(({ auth }) => {
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js").then(({ signOut }) => {
      signOut(auth).then(() => {
        window.location.href = "index.html";
      });
    });
  });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('language') || 'ru';
  const savedTheme = localStorage.getItem('theme') || 'dark';
  currentLang = savedLang;
  currentTheme = savedTheme;
  setTheme(savedTheme);
  applyTranslations();
});
