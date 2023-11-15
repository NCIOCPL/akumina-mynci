import dotenv from 'dotenv';
import SharePointClient from './lib/index.js';

dotenv.config();
const spConfig = {
  siteURL: process.env.SITE_URL,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
};

var SPClient = new SharePointClient(spConfig);

await SPClient.list.deleteItem('TEST_data_migration', '499182be-7793-49b5-a2e4-dd8cf81eea4d')
const itemsList = await SPClient.list.listItems('TEST_data_migration');
console.log(JSON.stringify(itemsList));

//await SPClient.list.addItem();
//await SPClient.list.addItems();
