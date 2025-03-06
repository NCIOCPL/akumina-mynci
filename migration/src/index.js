import dotenv from 'dotenv';
import { bootstrap } from 'pnp-auth';
import { sp } from '@pnp/sp-commonjs';

// retrieve our secrets
dotenv.config();
let authData = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
};

// set up the site using pnp-auth
bootstrap(sp, authData, process.env.SITE_URL);

// connect to our test list
var list = sp.web.lists.getByTitle('TEST_data_migration');
const entityTypeFullName = await list.getListItemEntityTypeFullName();

// create a batch for adding items
let batch = sp.web.createBatch();
list.items.inBatch(batch).add({ Title: 'Batch 6' }, entityTypeFullName);
list.items.inBatch(batch).add({ Title: 'Batch 7' }, entityTypeFullName);
await batch.execute();
console.log('Done');

console.log(
  '========================================================================'
);

// create a second batch for deleting items
/*
let batch2 = sp.web.createBatch();
list.items.getById(73).inBatch(batch2).delete();
list.items.getById(74).inBatch(batch2).delete();
await batch2.execute();
console.log('Done');
*/

// get all the items from a list
const items = await list.items.getAll();
console.log(items);
