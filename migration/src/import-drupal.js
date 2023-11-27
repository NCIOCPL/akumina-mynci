import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import AkuminaSite from './lib/akumina-site.js';
import DrupalContent from './lib/drupal-content.js';

// retrieve our secrets
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: `${__dirname}/../.env` });

const spConfig = {
  siteURL: process.env.SITE_URL,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
};

var site = new AkuminaSite(spConfig);
