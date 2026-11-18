import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dreamlight.companion',
  appName: 'Dreamlight Companion',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
