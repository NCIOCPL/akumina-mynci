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
 * @param {object} taxonomyList
 * @returns {Promise<void>}
 */
  async prepareContent(urlsConverted, users, drupalUsers, taxonomyList) {
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
          convertTags: async function (content) {
              if(content && (content !== '')) {
                  let termList = content.split('|');
                  let termObject = {terms: []};
                  let termGuid = '';
                  if (termList && termList.length > 1) {
                      for (const term of termList) {
                          termGuid = await taxonomyList.lookup('topics', term);
                          termObject.terms.push({'Label': term, 'TermGuid': termGuid});
                      }
                  } else {
                      termGuid = await taxonomyList.lookup('topics', content);
                      termObject.terms.push({'Label': content, 'TermGuid': termGuid});
                  }
                  return termObject; //Object
              }
              return content; //String
          },
          convertDepartments: async function (content) {
              return content; //String
          },
          convertPerson: async function (content) {
              let emailList = content.split('|');
              let sharepointUsers = {sharepointList:[]};
              let sharepointUser = {};
              if(emailList && emailList.length>1) {
                  for(const email of emailList) {
                      sharepointUser = await getSharepointUser(email);
                      await drupalUsers.add(email,sharepointUser);
                      if(sharepointUser.hasOwnProperty('person_columnID') && sharepointUser.person_columnID !== ''){
                          sharepointUsers.sharepointList.push(sharepointUser);
                      }
                  }
              } else {
                  sharepointUser = await getSharepointUser(content);
                  await drupalUsers.add(content,sharepointUser);
                  if(sharepointUser.hasOwnProperty('person_columnID') && sharepointUser.person_columnID !== '') {
                      sharepointUsers.sharepointList.push(sharepointUser);
                  }
              }
              if((sharepointUsers.sharepointList.length>0)){
                  return sharepointUsers; //Object
              }
              return content; //String
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
              let slug = content.split('/').pop();
              if(slug){
                  return slug;
              }
              return content; //String
          },
      }

    /**
     *  @param {string} email
     *  @returns {Promise<object>}
     *  Loops through childnodes of href and returns text
     */
    async function getSharepointUser(email) {
        let sharepointUser = {Title:'',person_columnID:''}
        for (const element of users) {
            if(element.hasOwnProperty('EMail') && (element.EMail === email)) {
                if(element.hasOwnProperty('Id')) {
                   sharepointUser.person_columnID = element.Id;
                }
                if(element.hasOwnProperty('Title')) {
                    sharepointUser.Title = element.Title;
                }
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
        let linkList = {links:[]};
        let link = {};
        content = '<body>' + content + '</body>';
        const parser = new DOMParser();
        let htmlDoc = parser.parseFromString(content, "text/html");
        const htmlTags = htmlDoc.getElementsByTagName(tagType);
        let thisURL = '';
        let thisDescription = '';
        for (let i=0; i< htmlTags.length; i++) {
            let tag = htmlTags[i];
            let myTag = await updateLinkSource(tag);
            if (tagType === 'img') {
                thisURL = myTag.getAttribute('src');
                thisDescription = myTag.getAttribute('alt');
            } else {
                thisURL = myTag.getAttribute('href');
                thisDescription = await getLinkText(myTag);
            }
            link = {
                URL: thisURL,
                Description: thisDescription
            }
            linkList.links.push(link);
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
     *  Loops through contentPaths in map and applies any tranformations before copying data
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
                for (const path of contentPath.Paths) {
                    if (element[path]) {
                        let elementData = element[path].toString();
                        if (transform && elementData && (elementData !== '')) {
                            elementData = await transformContent[contentPath.Transformation](elementData);
                        }
                        if (elementData) {
                            if ((typeof elementData) === 'string') {
                                if (mapElement.Separator && (index > 0)) {
                                    newData += mapElement.Separator + elementData;
                                } else {
                                    newData = elementData;
                                }
                            } else { //elementData is object
                                if (Object.keys(newObjectData).length === 0) {
                                    newObjectData = elementData;
                                } else {
                                    //We will always be looking for the first key here
                                    let newObjectDataKey = Object.keys(newObjectData)[0];
                                    let elementDataKey = Object.keys(elementData)[0];
                                    newObjectData[newObjectDataKey].push(...elementData[elementDataKey]);
                                }
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

            if(mapElement.hasOwnProperty('Metadata')){
                convertedItem.metadata[mapElement.Metadata] = newData;
            }
            if(mapElement.hasOwnProperty('SharePointColumn')){
                convertedItem.columns[mapElement.SharePointColumn] = newData;
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

    //Cycles through all of the Akumina objects,logs which are linked to (active)
    for (const [key, value] of Object.entries(this.akumina)) {
        for (const element of this.akumina[key]) {
            await logIfContentIsActive(element);
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
