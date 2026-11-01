# Az. EV-2026/001

Kleine interaktive Seite (statisch, GitHub Pages).

## Ablauf
1. **Ladung** zum Verhandlungstermin (Ehevertrag, Gerichtsstand: Ort des Kennenlernens)
2. **Stil** – Low Effort (gesperrt), Princess Treatment, Strong Independent Woman
3. **Ort** – Mannheim, Pforzheim, Middleground (Karlsruhe/Stuttgart), eigener Vorschlag
4. **Programmpunkte** – mindestens zwei (aktuell Platzhalter, siehe `PROGRAM` in `app.js`)
5. **Termin & Unterschrift** → Absenden per Mail

## Einrichtung
- **Mail:** In `app.js` oben `CONFIG.formsubmitTarget` setzen (FormSubmit, kein Account).
  Erste Einsendung selbst testen → Aktivierungsmail bestätigen. Danach kann man die
  Adresse durch den zufälligen Alias aus der FormSubmit-Mail ersetzen.
- **Hosting:** Repo → Settings → Pages → Branch wählen, Ordner `/ (root)`.
- **Datespots:** `PROGRAM` in `app.js` bearbeiten.
