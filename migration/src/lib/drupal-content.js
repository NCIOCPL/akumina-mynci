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
    this.images = [];
    this.files = [];
      this.about = [];
      this.announcements = [];
      this.blogs = [];
      this.coreContent = [];
      this.events = [];
      this.file = [];
      this.forms = [];
      this.holidayEvents = [];
      this.organizationDetails = [];
      this.policy = [];

      this.akumina_images = [];
      this.akumina_files = [];
      this.akumina_about = [];
      this.akumina_announcements = [];
      this.akumina_blogs = [];
      this.akumina_coreContent = [];
      this.akumina_events = [];
      this.akumina_file = [];
      this.akumina_forms = [];
      this.akumina_holidayEvents = [];
      this.akumina_organizationDetails = [];
      this.akumina_policy = [];
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
              this[key] = results.nodes.node;
          }
    } catch (err) {
      console.error('Error:', err);
    }
  }

/**
 *
 * @param {object} urlsConverted
 * @returns {Promise<void>}
 */
  async prepareContent(urlsConverted) {
      //TODO Build functions to transform content
      let transformContent = {
          convertLink: async function (content) {
              if(content && (content !== '')){
                  return await convertLinks(content, 'a')
              }
              return content;
          },
          convertLinksForBody: async function (content) {
              if(content && (content !== '')){
                  let transformedContent = await convertLinks(content,'a');
                  let links = '<ul>';
                  for (const link of transformedContent) {
                      links += "<li><a href='" + link.URL + "'>" + link.Description + "</a></li>";
                  }
                  links += '</ul>';
                  return links;
              }
              return content;
          },
          convertImage: async function (content) {
              if(content && (content !== '')){
                  return await convertLinks(content, 'img')
              }
              return content;
          },
          convertTags: async function (content) {
              //Intended to illustrate that transformations are being applied
           let transformedContent = content.toUpperCase();
              return transformedContent;
          },
          convertDepartments: async function (content) {
              let transformedContent = content;
              return transformedContent;
          },
          convertPerson: async function (content) {
              let transformedContent = content;
              return transformedContent;
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
                  .replace('</body>','');
          },
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
     *  @returns {Promise<array>}
     *  Loops through set of links and replaces drupal links with
     *  sharepoint links using url-converter
     */
    async function convertLinks(content,tagType) {
        let links = [];
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
            links.push(link);
        }
        return links;
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
        let convertedItem = {};
        for (const mapElement of map) {
            let newData = [];
            for (const contentPath of mapElement.ContentPaths) {
                const index = mapElement.ContentPaths.indexOf(contentPath);
                let transform = false;
                if(contentPath.Transformation){
                    transform = true;
                }
                for (const path of contentPath.Paths) {
                   let elementData = element[path];
                   if (transform ) {
                       let transformedElement = [];
                        if(element[path] && (element[path].length>1)) {
                            for (const elementPath of element[path]) {
                                transformedElement.push(await transformContent[contentPath.Transformation](elementPath));
                            }
                        } else {
                            transformedElement = await transformContent[contentPath.Transformation](element[path][0]);
                        }
                        elementData = transformedElement;
                   }
                    if(mapElement.Separator) {
                        if(index === 0) {
                            newData.push(elementData);
                        } else {
                            newData.push(mapElement.Separator + elementData);
                        }
                    } else {
                        newData.push(elementData);
                    }
                }
            }
            convertedItem[mapElement.SharePointColumn] = newData;
        }
        return convertedItem;
    }
    //Cycles through all of the Drupal export objects and builds Akumina variants applying the
    //mapping between Drupal and Akumina fields and any transformations
    for (const element of this.about) {
        this.akumina_about.push(await applyContentMap(element, aboutMap));
    }
    for (const element of this.announcements) {
        this.akumina_announcements.push(await applyContentMap(element, announcementsMap));
    }
    for (const element of this.blogs) {
        this.akumina_blogs.push(await applyContentMap(element, blogsMap));
    }
    for (const element of this.coreContent) {
        this.akumina_coreContent.push(await applyContentMap(element, coreContentMap));
    }
    for (const element of this.events) {
        this.akumina_events.push(await applyContentMap(element, eventsMap));
    }
    for (const element of this.file) {
        this.akumina_file.push(await applyContentMap(element, fileMap));
    }
    for (const element of this.forms) {
        this.akumina_forms.push(await applyContentMap(element, formsMap));
    }
    for (const element of this.holidayEvents) {
        this.akumina_holidayEvents.push(await applyContentMap(element, holidayEventsMap));
    }
    for (const element of this.organizationDetails) {
        this.akumina_organizationDetails.push(await applyContentMap(element, organizationDetailsMap));
    }
    for (const element of this.policy) {
        this.akumina_policy.push(await applyContentMap(element, policyMap));
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
