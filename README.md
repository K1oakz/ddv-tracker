# ✨ Disney Dreamlight Valley Companion (Android App)

An Android companion app for **Disney Dreamlight Valley** to track villagers, assigned hangout tasks/roles, relationship levels, daily routines, and quest notes — organized by **Base Game** and **DLC expansions** (A Rift in Time & The Storybook Vale).

---

## 🌟 Features

- **Base Game & DLC Expansion Sections**:
  - 🏰 **Dreamlight Valley** (Base Game - 35+ pre-loaded villagers)
  - ⏳ **A Rift in Time** (Eternity Isle Expansion - EVE, Rapunzel, Gaston, Oswald, Jafar)
  - 📖 **The Storybook Vale** (The Storybook Vale Expansion - Merida, Flynn Rider, Hades, Maleficent)
  - ➕ **Custom Sections & Characters**: Add any future DLCs, seasonal characters, or custom entries.

- **Hangout Task & Role Tracking**:
  - Assign and track companion roles: **Gardening** (🌱), **Fishing** (🎣), **Mining** (⛏️), **Foraging** (🍎), **Digging** (🪴), **Timebending** (⌛), or **Unassigned** (⭐).
  - Visual hangout distribution statistics to optimize your bonus crop and gem multiplier yields (5+ companion recommendation).

- **Relationship & Friendship Status**:
  - Friendship Level tracking from **Level 1 to 10** with visual progress bars and quick `+` / `-` steppers on character cards.
  - Automatic status updates: **Locked**, **Unlocked**, and **Maxed (Lvl 10)**.
  - Quest progress tracking: None, Available (❗), In Progress (⏳), or Completed (✓), with quest note memos.

- **Daily Routine Checklist**:
  - Quick-action modal to complete daily conversations and track 3 daily favorite gifts given.
  - Daily reset button to refresh checkboxes each morning.

- **Fully Enterable & Editable by User**:
  - Edit any villager's name, universe, section, assigned task, level, house location, favorite items, and quest notes.
  - Add new villagers or custom DLC sections anytime with custom emojis and colors.
  - Offline-first local storage persistence.
  - Export and Import JSON backup utility to save or transfer data.

---

## 📱 Android APK Location

The debug APK has been assembled and is ready for installation:

```
C:\Users\k1oak\ddv-tracker\android\app\build\outputs\apk\debug\app-debug.apk
```

### Install directly to an Android phone or emulator:

With USB debugging enabled on your phone:
```powershell
adb install -r C:\Users\k1oak\ddv-tracker\android\app\build\outputs\apk\debug\app-debug.apk
```
Or copy `app-debug.apk` to your phone's storage / Google Drive and tap to install.

---

## 🛠️ Development & Build Commands

Inside `C:\Users\k1oak\ddv-tracker`:

| Command | Description |
|---|---|
| `npm run dev` | Start local Vite development server with hot-reload |
| `npm run build` | Compile TypeScript and bundle web distribution |
| `npm run cap:sync` | Sync web build and assets to native Android project |
| `npm run cap:open` | Open project in Android Studio |
| `npm run cap:build` | Build web assets and sync with Capacitor in one step |

To assemble a fresh APK from Gradle:
```powershell
cd android
.\gradlew assembleDebug
```
