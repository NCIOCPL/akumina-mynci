import mime from "mime-types";

/**
 * URL Converter
 *
 */
class URLConverter {
  /**
   * Creates a new instance of a URL Converter
   *
   */

  constructor() {
    //super(); // Call the constructor of the parent class
    this.urls = new Map();
  }

  /**
   * Checks if url is active
   *
   * @param {object} urlObject The urlObject to check
   * @returns {boolean} Whether or not string can be made URL
   */
  isActiveUrl(urlObject) {
    try {
      return urlObject.isActive === true;
    }
    catch(e){
      return false;
    }
  }



  /**
   * Checks if string can be made into URL object
   *
   * @param {string} urlString The string to check
   * @returns {boolean} Whether or not string can be made URL
   */
   isValidUrl(urlString) {
    try {
      return Boolean(new URL(urlString));
    }
    catch(e){
      return false;
    }
  }
  /**
   * Adds a URL to be converted
   *
   * @param {URL|string} oldURL The old URL to use for reference
   * @param {string} oldNID The drupal NID to use for reference
   * @param {URL|string} newURL The new URL to replace the old URL
   * @param {string} slug The slug of the old URL
   */
  async add(oldURL, oldNID, newURL, slug) {
    let pathname;
    let newSlug = slug;
    let duplicateUrl = false;
    let numberOfDuplicates = 0;
    if(typeof oldURL === 'string'){
      pathname = oldURL;
    } else {
      if (((typeof oldURL) === 'object')
          && (('pathname' in oldURL) && (oldURL.pathname !== ''))) {
        pathname = oldURL.pathname;
      }
    }

  for (let url of this.urls.keys()){
    if(this.urls.get(url).slug === slug) {
      duplicateUrl = true;
      numberOfDuplicates ++;
    }
  }
    /*for (const url of Object.entries(this.urls)) {
      if(url.slug === slug) {
        duplicateUrl = true;
        numberOfDuplicates ++;
      }
    }*/
    if(duplicateUrl) {
      let brokenSlug = newSlug.split('.');
      brokenSlug[0]+= numberOfDuplicates;
      newSlug = brokenSlug.join('.');
      newSlug += numberOfDuplicates;
    }
    if(!this.urls.has(pathname)) {
      this.urls.set(pathname, {url: newURL, nid: oldNID, slug: slug, newSlug: newSlug, isActive: false, isUnique: true});
    }
  }

  /**
   * Gets the key for the urls object from a path string
   *
   * @param {string|object} oldURL The string to check
   * @returns {object} urlData
   */
  getKeyFromPath (oldURL){
    let urlData ={slug:''}
    if(((typeof oldURL) === 'object')
        && (('pathname' in oldURL) && (oldURL.pathname !== '')))
    {
      urlData.pathname = oldURL.pathname;
    } else {
      urlData.pathname = oldURL;
    }
    if(typeof urlData.pathname === 'string'){
      urlData.slug = urlData.pathname.split('/').pop();
    }
    urlData.mime_type = mime.lookup(urlData.slug);
    urlData.key = urlData.pathname;
    if(urlData.mime_type){
      urlData.slug = urlData.slug
          .replaceAll('%28','(')
          .replaceAll('%29',')')
          .replaceAll('%2C',',');
      if((urlData.mime_type.includes('image') || (urlData.mime_type.includes('application')))){
        urlData.key = urlData.slug.replaceAll(' ','%20');
      }
    }
    return urlData;
  }
  /**
   * Retrieves a URL to be converted
   *
   * @param {object} oldURL The old URL to use for reference
   * @param {object} spConfig
   * @returns {Promise<object>|Promise<string>} The new URL object
   */
  async lookup(oldURL, spConfig) {
    let urlData = this.getKeyFromPath(oldURL.pathname);
    if(urlData.hasOwnProperty('key') && this.urls.has(urlData['key'])){
      this.urls.get(urlData['key']).isActive = true;
      return this.urls.get(urlData['key']);
    } else {
      //Check if absolute link
      let newPath;
      /*const prodPath = 'myNCI';
      const devPath = 'NCI-OCPL-myNCI-preprod';
      const importPath = devPath;*/
      //const importPath = prodPath;
      if(urlData.hasOwnProperty('mime_type') && (typeof urlData["mime_type"] === 'string')){
        if(urlData["mime_type"].includes('image')) {
          newPath = '/' + spConfig.sitePath +  '/Images1/';
        } else {
          newPath = '/sites/' + spConfig.sitePath + '/Shared%20Documents/';
        }
      }
      let newURL;
      let slug = '';
      if(urlData.hasOwnProperty['slug']){
        slug = urlData['slug'];
      }
      if(this.isValidUrl(newPath + slug)){
        newURL = new URL(newPath + slug);
      } else {
        newURL = newPath + slug;
      }
      if(urlData.hasOwnProperty('key') && urlData.hasOwnProperty('pathname')){
        if (oldURL.url.hostname){
          if(((oldURL.url.hostname==='mynci.cancer.gov')
                  || (oldURL.url.hostname==='mynci-qa.cancer.gov')
                  || (oldURL.url.hostname==='ocpl-mynci'))
              &&
              ((typeof urlData['pathname'] === 'string') && ((urlData['pathname'].includes('files/') || (urlData['pathname'].includes('file/')))))
          ){
            this.urls.set(urlData['key'], {url: newURL, nid: '', slug: slug, newSlug: slug, isActive: true, isUnique: true});
            return this.urls.get(urlData['key']);
          }
          //if relative link
        } else {
          if((typeof urlData['pathname'] === 'string') && (urlData['pathname'].includes('files/'))) {
            this.urls.set(urlData['key'], {url: newURL, nid: '', slug: slug, newSlug: slug, isActive: true, isUnique: true});
            return this.urls.get(urlData['key']);
          }
        }
      }
    }
    let notFound = { url:'' };
    notFound.url = 'Not Found';
    return notFound;
  }
  /**
   * Retrieves a URL to be converted from drupal NID
   *
   * @param {string} NID The old NID to use for reference
   * @returns {Promise<object>|Promise<string>} The new URL
   */
  async lookupNID(NID) {
    for (let [key, value] of this.urls.entries()) {
      if (value.nid === NID){
        this.urls.get(key).isActive = true;
        return this.urls.get(key);
      }
    }
    let notFound = { url:'' };
    notFound.url = 'Not Found';
    return notFound;
  }

  /**
   * Retrieves the active status of a URL to be converted
   *
   * @param {URL|string} oldURL The old URL to use for reference
   * @returns {Promise<boolean>|Promise<string>} The active status of URL
   */
  async lookupActive(oldURL) {
    let urlData = this.getKeyFromPath(oldURL);
    if(urlData.hasOwnProperty('key') && this.urls.has(urlData['key'])){
      return this.urls.get(urlData['key']).isActive;
    } else {
      return 'Not Found';
    }
  }
  /**
   * Retrieves the new slug for an oldURL
   *
   * @param {URL|string} oldURL The old URL to use for reference
   * @returns {Promise<string>} The new slug
   */
  async getNewSlug(oldURL) {
    let urlData = this.getKeyFromPath(oldURL);
    if(urlData.hasOwnProperty('key') && this.urls.has(urlData['key'])){
      return this.urls.get(urlData['key']).newSlug;
    } else {
      return 'Not Found';
    }
  }
  /**
   * Retrieves the unique status of a slug
   *
   * @param {URL|string} oldURL The old URL to use for reference
   * @returns {Promise<boolean>|Promise<string>} The active status of URL
   */
  async lookupUnique(oldURL) {
    let urlData = this.getKeyFromPath(oldURL);
    if(urlData.hasOwnProperty('key') && this.urls.has(urlData['key'])){
      return this.urls.get(urlData['key']).isUnique;
    } else {
      return 'Not Found';
    }
  }

  /**
   * Retrieves the active status of a URL to be converted converted from drupal NID
   *
   * @param {string} NID The old NID to use for reference
   * @returns {Promise<boolean>|Promise<string>} The active status of URL
   */
  async lookupActiveNID(NID) {
    for (let [key, value] of this.urls.entries()) {
      if (value.nid === NID){
        return this.urls.get(key).isActive;
      }
    }
    return 'Not Found';
  }

  /**
   * Loops through array of objects and adds converts file pretty urls to filename urls
   *
   * @param {array} items
   * @returns {Promise<void>}
   */
  async convertFileURLs(items){
    items.forEach((item) => {
      let path = '';
      let newURLParts = [];
      let newURL = '';
      let slug = '';
      if(item.hasOwnProperty('Path')){
        path = item['Path'][0];
      }
      if (item.hasOwnProperty('Upload-File')){
        slug = unescape(item['Upload-File'][0].split('/').pop());
      }
      //Remove slug and replace it with filename slug
      if(path
          && (path !=='')
          && this.urls.has(path)
          && (slug !== '')){
        newURLParts = (this.urls.get(path).url).split('/');
        newURLParts.pop();
        newURLParts.push(slug);
        newURL = newURLParts.join('/');
        this.urls.get(path).url = newURL;
      }
    })
  }
  /**
   * Loops through array of objects and adds contents to list of urls for conversion
   *
   * @param {array} items
   * @param {string} urlAlias
   * @param {string} newPath
   * @param {boolean} areFiles
   * @returns {Promise<void>}
   */
  async loadURLs(items, urlAlias,newPath, areFiles= false){
    items.forEach((item) => {
      let oldURLstring;
      if (Array.isArray(item[urlAlias])) {
        oldURLstring = item[urlAlias][0];
      } else {
        oldURLstring =item[urlAlias];
      }
      let oldURL;
      let pathname = '';
      if(this.isValidUrl(oldURLstring)){
        oldURL = new URL(oldURLstring);
        if (('href' in oldURL) && (oldURL.href !== '')){
          pathname = oldURL.href;
        }
      } else {
        oldURL = oldURLstring;
        pathname = oldURLstring;
      }
      let NID = pathname;
      if(item['Nid']){
        NID = item['Nid'];
      }
      if (Array.isArray(item['Nid'])) {
        NID = item['Nid'][0];
      }
      let slug = '';
      if(typeof pathname === 'string'){
        slug = pathname.split('/').pop()
            .replaceAll(' ','%20');
        if(!areFiles) {
          slug = slug.replaceAll('(','%28')
                      .replaceAll(')','%29');
        }
      }
      let newURL;
      if(this.isValidUrl(newPath + slug)){
        newURL = new URL(newPath + slug);
      } else {
        newURL = newPath + slug;
      }
      //If file or image and use slug for key
      const mime_type = mime.lookup(slug);
      let key = oldURL;
      let hrefKey;
      if((typeof oldURL === 'object') && (oldURL.hasOwnProperty('href'))) {
        hrefKey = key.href;
      } else {
        if (typeof oldURL === 'string'){
          hrefKey = key;
        }
      }
      if(mime_type && (mime_type.includes('image') || (mime_type.includes('application')))){
        hrefKey = slug;
      }
      this.add(hrefKey,NID,newURL,slug);
    })
  }
}

export default URLConverter;
