import dotenv from 'dotenv';
import SharePointClient from './lib/index.js';

dotenv.config();
const spConfig = {
  siteURL: process.env.SITE_URL,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
};

var SPClient = new SharePointClient(spConfig);

const itemsList = await SPClient.list.listItems('Blogs_AK');
console.log(JSON.stringify(itemsList));

//await SPClient.list.addItem();
//await SPClient.list.addItems();
