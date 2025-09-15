# Násobilkový tréner – v2 (overená verzia)

Balík obsahuje:
- index.html (verzia s pásmami, týždenným resetom, streakom, triednym cieľom)
- manifest.webmanifest, sw.js (PWA offline)
- icons/icon-192.png, icons/icon-512.png
- Rebríček je DEFAULTNE vypnutý (API_URL = '').

## Pred nasadením
1) Ak chceš rebríček, priprav Google Apps Script podľa README v staršom ZIPe alebo podľa pokynov v konverzácii, nasadíš ako Web app („Anyone with the link“).
2) Do index.html doplň `API_URL` (Web app URL) a prípadne uprav `CLASS_CODE`, `CLASS_TOKEN`, `CLASS_PIN`.
3) Všetky súbory musia byť v root-e repozitára (nie v podpriečinku).

## GitHub Pages
- Repo (public) → upload všetkých súborov do rootu → Settings → Pages → Deploy from a branch → main / / → Save.
- Po nasadení obnov stránku (Hard reload), aby sa načítal nový service worker.
