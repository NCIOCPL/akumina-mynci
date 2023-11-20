import dotenv from 'dotenv';
import { bootstrap } from 'pnp-auth';
import { sp } from '@pnp/sp-commonjs';

dotenv.config();
let authData = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
}

bootstrap(sp, authData, process.env.SITE_URL);
// That's it! Now you can use pnp-sp library:

var list = sp.web.lists.getByTitle('TEST_data_migration');

const entityTypeFullName = await list.getListItemEntityTypeFullName();

let batch = sp.web.createBatch();


list.items
  .inBatch(batch)
  .add({ Title: 'Batch 6' }, entityTypeFullName);

list.items
  .inBatch(batch)
  .add({ Title: 'Batch 7' }, entityTypeFullName);

await batch.execute();
console.log('Done');

console.log(
  '========================================================================'
);
console.log(
  '========================================================================'
);
console.log(
  '========================================================================'
);
console.log(
  '========================================================================'
);
console.log(
  '========================================================================'
);
console.log(
  '========================================================================'
);
console.log(
  '========================================================================'
);
console.log(
  '========================================================================'
);


let batch2 = sp.web.createBatch();

list.items.getById(67).inBatch(batch2).delete();
list.items.getById(68).inBatch(batch2).delete();
await batch2.execute();
console.log('Done');
/**/

// get all the items from a list
const items = await list.items.getAll();
console.log(items);

