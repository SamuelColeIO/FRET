import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

import './vendors/gapi.min.js';

platformBrowserDynamic().bootstrapModule(AppModule);
