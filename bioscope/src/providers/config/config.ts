
import { InjectionToken } from '@angular/core';

export interface AppConfig {
  apiEndpoint: string;
  apiKey: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export const APP_DI_CONFIG: AppConfig = {
  apiEndpoint: 'https://api.themoviedb.org/3',
  apiKey: '90ea466c728391fa8bfcb1e9fa9bea02'
};
