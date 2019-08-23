
import { InjectionToken } from '@angular/core';

export interface AppConfig {
  apiEndpoint: string;
  apiKey: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export const APP_DI_CONFIG: AppConfig = {
  apiEndpoint: 'https://api.themoviedb.org/3',
  apiKey: '821bf039c66774f0612318a20b1bbe11'
};
