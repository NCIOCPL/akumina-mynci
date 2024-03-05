import xml2js from 'xml2js';
import { promises as fsPromises } from 'fs';
import { DOMParser } from "@xmldom/xmldom";
import { aboutMap } from "./maps/maps-about.js";
import { announcementsMap } from "./maps/maps-announcements.js";
import { blogsMap } from "./maps/maps-blogs.js";
import { coreContentMap } from "./maps/maps-core-content.js";
import { eventsMap } from "./maps/maps-events.js";
import { fileMap } from "./maps/maps-file.js";
import { formsMap } from "./maps/maps-forms.js";
import { holidayEventsMap } from "./maps/maps-holiday-events.js";
import { organizationDetailsMap } from "./maps/maps-organization-details.js";
import { policyMap } from "./maps/maps-policy.js";



/**
 * Represents an extraction of content from the Drupal 7 site
 *
 */

class DrupalContent {
  /**
   * Creates a new instance of a Drupal Content client.
   */
  constructor() {
      this.drupal = {
          images: [],
          files: [],
          about: [],
          announcements: [],
          blogs: [],
          coreContent: [],
          events: [],
          file: [],
          forms: [],
          holidayEvents: [],
          organizationDetails: [],
          policy: []
      };

      this.akumina = {
          images: [],
          files: [],
          about: [],
          announcements: [],
          blogs: [],
          coreContent: [],
          events: [],
          file: [],
          forms: [],
          holidayEvents: [],
          organizationDetails: [],
          policy: []
      };
  }

  /**
   * Load content from XML export.
   *
   * @param {object} exports Export file paths by key.
   */
  async loadContent(exports) {
      try {
          const exportMap = new Map(Object.entries(exports));
          for await (const key of exportMap.keys()){
              let filePath = '';
              if(exportMap.has(key)){
                  filePath = exportMap.get(key);
              }
              const xmlData = await fsPromises.readFile(filePath);
              const parser = new xml2js.Parser();
              const results = await parser.parseStringPromise(xmlData);
              this.drupal[key] = results.nodes.node;
          }
    } catch (err) {
      console.error('Error:', err);
    }
  }

/**
 *
 * @param {object} urlsConverted
 * @param {array} users
 * @param {object} drupalUsers
 * @param {array} taxonomyTags
 * @param {object} taxonomyFields
 * @returns {Promise<void>}
 */
  async prepareContent(urlsConverted, users, drupalUsers, taxonomyTags, taxonomyFields) {
      //TODO Build functions to transform content
      let transformContent = {
          convertLink: async function (content) {
              if(content && (content !== '')){
                  return await convertLinks(content, 'a'); //Object
              }
              return content;
          },
          convertLinksForBody: async function (content) {
              if(content && (content !== '')){
                  let transformedContent = await convertLinks(content,'a');
                  let links = '';
                  if(transformedContent && transformedContent.hasOwnProperty('links')){
                      links = '<ul>';
                      for (const link of transformedContent.links) {
                          links += "<li><a href='" + link.URL + "'>" + link.Description + "</a></li>";
                      }
                      links += '</ul>';
                  }
                  return links; //String
              }
              return content;
          },
          convertImage: async function (content) {
              if(content && (content !== '')){
                  return await convertLinks(content, 'img'); //object
              }
              return content;
          },
          convertDate: async function (content) {
              if(content && (content !== '')){
                  let myDate = new Date(Date.parse(content));
                  if(myDate.getTime()>0) {
                      return myDate.toISOString();
                  }
                  return content; //dateTime
              }
              return content;
          },
          convertTags: async function (content) {
              if(content && (content !== '')) {
                  let termList = content.split('|');
                  let termObject = {results: []};
                  let taxonomyItem = {Label:'', TermGuid:''};
                  let termString = '';
                  let termStringSuffix = ';#';
                  let index = 0;
                  let trimmedTerm = '';
                  if (termList && termList.length > 1) {
                      for (const term of termList) {
                          trimmedTerm = term.trim();
                          index++;
                          taxonomyItem = await getTaxonomyTerm(trimmedTerm);
                          if(taxonomyItem && taxonomyItem.hasOwnProperty('TermGuid') && taxonomyItem.TermGuid && (taxonomyItem.TermGuid !== 'Not Found')){
                              if((index) === termList.length){
                                  termStringSuffix = '';
                              }
                              // termObject.results.push(taxonomyItem);
                             termString += 'taxonomyItem.Id;#' + taxonomyItem.Label + '|' +  taxonomyItem.TermGuid + termStringSuffix;
                          }
                      }
                      //  return termObject; //Object
                      return termString; //String
                  } else {
                      trimmedTerm = content.trim();
                      taxonomyItem = await getTaxonomyTerm(trimmedTerm);
                      if(taxonomyItem && taxonomyItem.hasOwnProperty('TermGuid') && taxonomyItem.TermGuid && (taxonomyItem.TermGuid !== 'Not Found')){
                          //termObject.results.push(taxonomyItem);
                          termString += 'taxonomyItem.Id;#' + taxonomyItem.Label + '|' +  taxonomyItem.TermGuid;
                        //return termObject; //Object
                         return termString; //String
                      }
                  }
              }
              return ''; //String
          },
          convertDepartments: async function (content) {
              return content; //String
          },
          convertPerson: async function (content) {
              let emailList = content.split('|');
              let personEmail;
             // let sharepointUsers = {results:[]};
              let sharepointUser;
          //    if(emailList && emailList.length>1) {
           //      personEmail =  emailList[0].trim();
                  /*for(const email of emailList) {
                      sharepointUser = await getSharepointUser(email);
                      await drupalUsers.add(email,sharepointUser);
                      if(sharepointUser.hasOwnProperty('person_columnID') && sharepointUser.person_columnID !== ''){
                          sharepointUsers.results.push(sharepointUser);
                      }
                  }*/
         //     } else {
              //    personEmail = emailList[0].trim();
            //  }
              personEmail = emailList[0].trim();
              sharepointUser = await getSharepointUser(personEmail);
              await drupalUsers.add(personEmail,sharepointUser);
              if(sharepointUser.hasOwnProperty('person_columnID') && sharepointUser.person_columnID !== '') {
                  //sharepointUsers.results.push(sharepointUser);
                  return sharepointUser.person_columnID;
              }
              /*if((sharepointUsers.results.length>0)){
                  return sharepointUsers; //Object
              }*/
              //Otherwise return a default user 13;
              return 13;
              /*{
                  Title: 'Frank, James (NIH/NCI) [C]',
                  person_columnID: 13
              };*///Object
          },
          convertPersonForBody: async function (content) {
              let emailList = content.split('|');
              let personEmail;
              let sharepointUser;
             // let sharepointUsers = {results:[]};
              let contactText = '';
              let listIndex = 0;
              let contactTextSuffix = ', ';
              let defaultContact ="<a href='mailto:james.frank@nih.gov'>Frank, James (NIH/NCI) [C]</a>";
              if(emailList && emailList.length>1) {
                  for(const email of emailList) {
                      listIndex++;
                      sharepointUser = await getSharepointUser(email.trim());

                      if(sharepointUser.hasOwnProperty('EMail') && sharepointUser.EMail !== '' &&
                          sharepointUser.hasOwnProperty('Title') && sharepointUser.Title !== ''){
                          await drupalUsers.add(email.trim(),sharepointUser);
                          if(listIndex === emailList.length){
                              contactTextSuffix = '';
                          }
                         // sharepointUsers.results.push(sharepointUser);
                          contactText+= '<a href=mailto:"' + sharepointUser.EMail + '">' +  sharepointUser.Title + '</a>' + contactTextSuffix;
                      }
                  }
              } else {
                  personEmail = emailList[0].trim();
                  sharepointUser = await getSharepointUser(personEmail);
                  if(sharepointUser.hasOwnProperty('EMail') && sharepointUser.EMail !== '' &&
                      sharepointUser.hasOwnProperty('Title') && sharepointUser.Title !== '') {
                      contactText = '<a href="' + sharepointUser.EMail + '">' + sharepointUser.Title + '</a>';
                      await drupalUsers.add(personEmail,sharepointUser);
                  }

              }
              if(contactText && (contactText !== '')){
                  return contactText;
              }
              return defaultContact;
          },
          convertText: async function (content) {
              content = '<body>' + content + '</body>';
              const parser = new DOMParser();
              let htmlDoc = parser.parseFromString(content, "text/html");
              htmlDoc = await replaceLinks(htmlDoc,'a');
              htmlDoc = await replaceLinks(htmlDoc,'img');
              return htmlDoc
                  .toString()
                  .replace('<body xmlns="http://www.w3.org/1999/xhtml">','')
                  .replace('</body>',''); //String
          },
          convertURL: async function (content) {
              let newSlug = urlsConverted.getNewSlug(content);
              if (newSlug && (newSlug!=='Not Found')){
                  return newSlug;
              } else {
                  let slug = content.split('/').pop();
                  if(slug){
                      return slug;
                  }
              }
              return content; //String
          },
      }

    /**
     *  @param {string} term
     *  @returns {Promise<object>}
     *  Loops through childnodes of href and returns text
     */
    async function getTaxonomyTerm(term) {
        for (const element of taxonomyTags) {
            if(element.hasOwnProperty('Title') && (element.Title === term) && element.hasOwnProperty('Id') && (element.hasOwnProperty('IdForTerm'))) {
                let taxonomyItem = {Label:'', TermGuid:'', WssId:''};
               // taxonomyItem.Label = element.Id.toString();
                taxonomyItem.Label = element.Title;
                taxonomyItem.TermGuid = element.IdForTerm;
                taxonomyItem.WssId = element.Id;
                return taxonomyItem;
            }
        }
        return 'Not Found';
    }

    /**
     *  @param {string} email
     *  @returns {Promise<object>}
     *  Loops through childnodes of href and returns text
     */
    async function getSharepointUser(email) {
        let sharepointUser = {Title:'',person_columnID:'', EMail:''}
        for (const element of users) {
            if(element.hasOwnProperty('EMail') && (element.EMail === email)) {
                if(element.hasOwnProperty('Title')) {
                    sharepointUser.Title = element.Title;
                }
                if(element.hasOwnProperty('Id')) {
                   sharepointUser.person_columnID = element.Id;
                }
                sharepointUser.EMail = element.EMail;
            }
        }
        return sharepointUser;
    }

    /**
     *  @param {Element} link
     *  @returns {Promise<string>}
     *  Loops through childnodes of href and returns text
     */
    async function getLinkText(link) {
        let text = "";
        for (let i = 0; i < link.childNodes.length; i++){
            const n = link.childNodes[i];
            if (n && n.nodeValue){
                text += n.nodeValue;
            }
        }
        return text;
    }

    /**
     *  @param {Element} tag
     *  @returns {Promise<Element>}
     *  Loops through childnodes of href and returns text
     */
    async function updateLinkSource(tag) {
        let tagHref;
        if (tag.tagName === 'img'){
            tagHref = tag.getAttribute('src');
        } else {
            tagHref = tag.getAttribute('href');
        }
        //Remove domain
        if (tagHref.startsWith('https://mynci.cancer.gov')){
            tagHref = tagHref.replace('https://mynci.cancer.gov','');
        }
        if (tagHref.startsWith('http://mynci.cancer.gov')){
            tagHref = tagHref.replace('http://mynci.cancer.gov','');
        }
        if (tagHref.startsWith('https://ocpl-mynci:8890')){
            tagHref = tagHref.replace('https://ocpl-mynci:8890','');
        }
        //Check for anchors
        let hash = '';
        if(tagHref.includes('#')){
            let tagHrefHashParts = tagHref.split('#');
            hash = '#' + tagHrefHashParts.pop();
            tagHref = tagHrefHashParts.join('');
        }
        //Check for Node/NID links
        let newHref;
        let NID = '';
        if (tagHref.startsWith('/node/')){
            let tagHrefParts = tagHref.split('/');
            NID = tagHrefParts.pop();
            newHref = await urlsConverted.lookupNID(NID);
        } else {
            newHref = await urlsConverted.lookup(tagHref);
        }
        if ((newHref !== '') && (newHref !== 'Not Found')){
            if (tag.tagName === 'img'){
                tag.setAttribute('src', newHref + hash);
            } else {
                tag.setAttribute('href', newHref + hash);
            }
        }
        return tag;
    }

    /**
     *  @param {string} content
     *  @param {string} tagType
     *  @returns {Promise<object>}
     *  Loops through set of links and replaces drupal links with
     *  sharepoint links using url-converter
     */
    async function convertLinks(content,tagType) {
        let linkList = {};
        content = '<body>' + content + '</body>';
        const parser = new DOMParser();
        let htmlDoc = parser.parseFromString(content, "text/html");
        const htmlTags = htmlDoc.getElementsByTagName(tagType);
        let thisURL = '';
        let thisDescription = '';
        if(htmlTags.length>0){
            if (tagType === 'img'){
                let imgSrc = await updateLinkSource(htmlTags[0]);
                linkList = {
                    Url: imgSrc.getAttribute('src'),
                    Description: imgSrc.getAttribute('alt')
                }
            } else {
                linkList = {results:[]};
                let link = {};
                for (let i=0; i< htmlTags.length; i++) {
                    let tag = htmlTags[i];
                    let myTag = await updateLinkSource(tag);
                    thisURL = myTag.getAttribute('href');
                    thisDescription = await getLinkText(myTag);
                    link = {
                        URL: thisURL,
                        Description: thisDescription
                    }
                    linkList.results.push(link);
                }
            }
        }
        return linkList;
    }
    /**
     *  @param {Document} htmlDoc
     *  @param {string} tagType
     *  @returns {Promise<Document>}
     *  Loops through set of links and replaces drupal links with
     *  sharepoint links using url-converter
     */
    async function replaceLinks(htmlDoc, tagType) {
        const htmlTags = htmlDoc.getElementsByTagName(tagType);
        for (let i=0; i< htmlTags.length; i++) {
            let tag = htmlTags[i];
            await updateLinkSource(tag);
        }
        return htmlDoc;
    }

    /**
     *  @param {object} element
     *  @param {object} mapElement
     *  @returns {Promise<object>|Promise<string>}
     *  Loops through contentPaths in map and applies any transformations before copying data
     */
    async function readContentPaths(element, mapElement) {
        let newData = '';
        let newObjectData = {};
          for (const contentPath of mapElement.ContentPaths) {
                const index = mapElement.ContentPaths.indexOf(contentPath);
                let transform = false;
                if (contentPath.Transformation) {
                    transform = true;
                }
                let elementItem = contentPath.Paths[0];
                if (element[elementItem]) {
                    let elementData = element[elementItem].toString();
                    if (transform && elementData && (elementData !== '')) {
                        elementData = await transformContent[contentPath.Transformation](elementData);
                    }
                    if (elementData) {
                        if ((typeof elementData) === 'object') {
                            if (Object.keys(newObjectData).length === 0) {
                                newObjectData = elementData;
                            } else {
                                //We will always be looking for the first key here
                                let elementDataKey = Object.keys(elementData)[0];
                                let newObjectDataKey = Object.keys(newObjectData)[0];
                                newObjectData[newObjectDataKey].push(...elementData[elementDataKey]);
                            }
                        } else {
                            //Checks if Author to be Displayed in Byline is present if Contact and removes any duplicate
                            if((elementItem === 'Contact-for-this-Content')
                                && (element.hasOwnProperty('Author-to-Be-Displayed-in-Byline'))
                                && transform
                            && (typeof elementData === 'string' )) {
                                if(contentPath.Transformation === 'convertPersonForBody'){
                                    let authorData = element['Author-to-Be-Displayed-in-Byline'].toString();
                                    authorData = await transformContent[contentPath.Transformation](authorData);
                                    if(elementData.includes(authorData)){
                                        elementData = elementData.replace(authorData,'');
                                    }
                                }
                            }
                            //picks first item for publisher field
                            if((elementItem === 'Contact-for-this-Content')
                                && transform
                            && (contentPath.Transformation === 'convertPerson')
                                && (newData!=='')) {
                                elementData = '';
                            }
                            if (mapElement.Separator && (index > 0)) {
                                newData += mapElement.Separator + elementData;
                            } else {
                                newData += elementData;
                            }
                        }
                    }
                }
            }
        if (Object.keys(newObjectData).length !== 0) {
           return newObjectData; //Data is object
        } else {
            return newData; //Data is string
        }
    }
    /**
     * Loops through a content map such as blogMap and copies data from export JSON
     * into corresponding JSON formatted for import into sharepoint, applying any
     * transformations to that data
     *
     * @param {object} element
     * @param {array} map
     *
     * @returns {Promise<object>}
     */
    async function applyContentMap(element, map) {
        let convertedItem = {columns: {}, metadata: {}};
        for (const mapElement of map) {
            let newData;
            //Iterate over ContentPaths
            if(mapElement.hasOwnProperty('ContentPaths')){
                newData = await readContentPaths(element, mapElement);
            } else {
                //Import hardcoded data if found
                if(mapElement.hasOwnProperty('HardcodedData')){
                    newData = mapElement.HardcodedData.toString();
                }
            }

            if(mapElement.hasOwnProperty('Metadata') && newData && (newData !== '')){
                convertedItem.metadata[mapElement.Metadata] = newData;
            }
            if(mapElement.hasOwnProperty('SharePointColumn') && newData && (newData !== '')){
                if(mapElement.hasOwnProperty('CharacterLimit') && (typeof newData === 'string')){
                    if(mapElement.SharePointColumn !== 'Location'){
                        newData = newData.substring(0,mapElement.CharacterLimit);
                    }
                }
                if((mapElement.SharePointColumn === 'Location')
                    && (typeof newData === 'string')
                    && (newData.length>255)){
                        newData = '';
                }
                let sharePointColumnName = mapElement.SharePointColumn;
                if(mapElement.hasOwnProperty('SharePointType') && (mapElement.SharePointType === 'TaxMulti')){
                    sharePointColumnName = taxonomyFields[sharePointColumnName];
                }
                convertedItem.columns[sharePointColumnName] = newData;
            }
        }
        convertedItem.metadata.migrate = true;
        return convertedItem;
    }

    /**
     * Checks whether node has been linked
     * to and logs active status
     *
     * @param {object} element
     *
     * @returns {Promise<object>}
     */
    async function logIfContentIsActive(element) {
        let isActive;
        if(element.hasOwnProperty('metadata') && element.metadata.hasOwnProperty('OldPath')){
            if(element.metadata.OldPath.charAt(0)!=='/'){
                isActive = await urlsConverted.lookupActive('/' + element.metadata.OldPath);
            } else {
                isActive = await urlsConverted.lookupActive(element.metadata.OldPath);
            }
        }
        //sets isActive to true by default
        element.metadata.isActive = true;
        if((isActive !== 'Not Found') && (isActive!==null)) {
            element.metadata.isActive = isActive;
        }
        return element;
    }

    //Cycles through all of the Drupal export objects and builds Akumina variants applying the
    //mapping between Drupal and Akumina fields and any transformations
    for (const [key, value] of Object.entries(this.drupal)) {
        for (const element of this.drupal[key]) {
            this.akumina[key].push(await applyContentMap(element, eval(key + 'Map')));
        }
    }

    //Cycles through all of the Akumina objects,logs which are linked to (active),
    //Also checks if staticUrl is unique and modifies if not
    for (const [key, value] of Object.entries(this.akumina)) {
        for (const element of this.akumina[key]) {
            await logIfContentIsActive(element);
           // await guaranteeUniqueURL(element);
        }
    }
    //Cycles through images and files and sets migrate to false for
    // inactive items (items not linked anywhere)
    for (const element of this.akumina.file) {
        element.metadata.migrate = element.metadata.isActive;
    }
    for (const element of this.akumina.images) {
        element.metadata.migrate = element.metadata.isActive;
    }
  }

  /**
   * Find all files linked in content.
   *
   * @returns {Array<object>} An array of file objects used in the content
   */
  async findLinkedFiles() {}

  /**
   * Find all images used in content.
   *
   * @returns {Array<object>} An array of image objects used in the content
   */
  async findUsedImages() {}
}



export default DrupalContent;
