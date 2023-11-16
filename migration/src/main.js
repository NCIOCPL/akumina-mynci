import dotenv from 'dotenv';
import SharePointClient from './lib/index.js';

dotenv.config();
const spConfig = {
  siteURL: process.env.SITE_URL,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
};

var SPClient = new SharePointClient(spConfig);

const itemsListBefore = await SPClient.list.listItems('TEST_data_migration');
console.log(JSON.stringify(itemsListBefore));
await SPClient.list.deleteItem('TEST_data_migration', '1');
const itemsListAfter = await SPClient.list.listItems('TEST_data_migration');
console.log(JSON.stringify(itemsListAfter));

//await SPClient.list.addItem();
//await SPClient.list.addItems();
