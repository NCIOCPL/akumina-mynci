// our imports come from the -commonjs libs
import { SPFetchClient } from '@pnp/nodejs-commonjs';
import { sp } from '@pnp/sp-commonjs';
import dotenv from 'dotenv';

dotenv.config();

// we call setup to use the node client
sp.setup({
  sp: {
    fetchClientFactory: () => {
      return new SPFetchClient(
        process.env.SITE_URL,
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET
      );
    },
  },
});

async function makeRequest() {
  // make a request to get the web's details
  const w = await sp.web();
  console.log(JSON.stringify(w, null, 2));
}

// get past no await at root of app
makeRequest();
