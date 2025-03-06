import xml2js from 'xml2js';
import { promises as fsPromises } from 'fs';
import { DOMParser } from "@xmldom/xmldom";
import mime from "mime-types";
import FileSystem from 'fs';
import { aboutMap } from "./maps/maps-about.js";
import { announcementsMap } from "./maps/maps-announcements.js";
import { blogsMap } from "./maps/maps-blogs.js";
import { coreContentMap } from "./maps/maps-core-content.js";
import { eventsMap } from "./maps/maps-events.js";
import { fileMap } from "./maps/maps-file.js";
import { formsMap } from "./maps/maps-forms.js";
import { holidayEventsMap } from "./maps/maps-holiday-events.js";
import { mediaImagesMap } from "./maps/maps-media-images.js";
import { mediaFilesMap } from "./maps/maps-media-files.js";
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
          mediaImages: [],
          mediaFiles: [],
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
          mediaImages: [],
          mediaFiles: [],
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
 * @param {object} orgMap
 * @param {object} redirectMap
 * @param {object} taxonomyRedirectMap
 * @param {object} spConfig
 * @param {array} currentImages
 * @param {array} currentDocuments
 * @returns {Promise<void>}
 */
  async prepareContent(urlsConverted, users, drupalUsers, taxonomyTags, taxonomyFields, orgMap, redirectMap, taxonomyRedirectMap, spConfig, currentImages, currentDocuments) {
      //TODO Build functions to transform content
      let transformContent = {
          /*convertLink: async function (content) {
              if(content && (content !== '')){
                  return await convertLinks(content, 'a', false, convertLinks); //Object
              }
              return content;
          },*/
          convertTitle: async function (content) {
              return await textConverter(content);
          },
          convertTitleForBody: async function (content) {
              if(content.includes('-DUP')){
                  content = content.substring(0, content.indexOf('-DUP'));
              }
              return '<h1>' + await textConverter(content) + '</h1>';
          },
          convertOrgTitleToAcronym: async function (content) {
              let newOrgTitle = '';
              let orgTitle = content.replaceAll('&','AND');
              newOrgTitle = await getAcrByName(orgMap, orgTitle);
              if(newOrgTitle && newOrgTitle !== ''){
                  return newOrgTitle;
              }
              return await textConverter(content);
          },
          convertToSlug: async function (content) {
              let slug = '';
              if((typeof content === 'string') && (content !== '')){
                  slug = content.split('/').pop().replaceAll(' ','%20');
              }
              return slug;
          },
          convertForMoreInformationLinks: async function (content) {
              if(content && (content !== '')){
                  let transformedContent = await convertLinks(content,'a', false, redirectMap, taxonomyRedirectMap, spConfig);
                  let links = '';
                  if(transformedContent && transformedContent.hasOwnProperty('results')){
                      links = '<h2>For More Information</h2><ul>';
                      for (const link of transformedContent.results) {
                          links += "<li><a href='" + link.URL + "'>" + link.Description + "</a></li>";
                      }
                      links += '</ul>';
                  }
                  return links; //String
              }
              return content;
          },
          convertAddress: async function (content) {
              if(content && (content !== '')) {
                  return content.replace('Room:',' Room:');
              }
              return content;
          },
          convertPrependPhone: async function (content) {
              if(content && (content !== '')) {
                  return '<p><strong>Phone: </strong>' + content + '</p>';
              }
              return content;
          },
          convertLinkPrependEmail: async function (content) {
              if(content && (content !== '')) {
                return '<p><strong>E-Mail: </strong><a href="mailto:' + content + '">' + content + '</a></p>';
              }
              return content;
          },
          convertLinkPrependWebsite: async function (content) {
              if(content && (content !== '')) {
                return '<p><strong>Website Url: </strong><a href="' + content + '">' + content + '</a></p>';
              }
              return content;
          },
          convertTextLink: async function (content) {
              if(content && (content !== '')) {
                  return '<p><a href="' + content + '">' + content + '</a></p>';
              }
              return content;
          },
          convertTextLinkSingleLine: async function (content) {
              if(content && (content !== '')) {
                  return '<br /><a href="' + content + '">' + content + '</a><br />';
              }
              return content;
          },
          convertTextAddEm: async function (content) {
              if(content && (content !== '')) {
                  return '<em>' + content + '</em>';
              }
              return content;
          },
          convertImage: async function (content) {
              if(content && (content !== '')){
                  return await convertLinks(content, 'img', true, redirectMap, taxonomyRedirectMap, spConfig); //object
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
                  return await tagConverter(content,''); //String
              } else {
                  return '';
              }
          },
          convertDepartments: async function (content) {
              if(content && (content !== '')) {
                  return await tagConverter(content,'Office of the Director'); //String
              } else {
                  return '';
              }
          },
          convertRegion: async function (content) {
              if(content && (content !== '')) {
                  return await tagConverter(content,'');
              } else {
                  return await tagConverter('All NCI','');
              }
          },
          convertPerson: async function (content) {
              let personID = await personConverter(content, 0);
              if (personID && (typeof personID === "number")) {
                  return personID;
              } else {
                  return 15;
              }
          },
          convertPersonForContactOne: async function (content) {
              let personID = await personConverter(content, 0);
              if (personID && (typeof personID === "number")) {
                  return personID;
              } else {
                  return '';
              }
          },
          convertPersonForContactTwo: async function (content) {
              let personID = await personConverter(content, 1);
              if (personID && (typeof personID === "number")) {
                  return personID;
              } else {
                  return '';
              }
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
              if(emailList){
                  if(emailList.length>1) {
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
              }
              if(contactText && (contactText !== '')){
                  return contactText;
              }
              return defaultContact;
          },
          convertText: async function (content) {
              content = '<body>' + content + '</body>';
              let htmlDoc = await createHTMLDocument(content);
              htmlDoc = await replaceLinks(htmlDoc,'a', redirectMap, taxonomyRedirectMap, spConfig);
              htmlDoc = await replaceLinks(htmlDoc,'img', redirectMap, taxonomyRedirectMap, spConfig);
              return htmlDoc
                  .toString()
                  .replace('<body xmlns="http://www.w3.org/1999/xhtml">','')
                  .replace('</body>',''); //String
          },

          convertURL: async function (content) {
              let link = changeStringToURL(content);
              let newSlug = await urlsConverted.getNewSlug(link['url']);
              if (newSlug && (newSlug!=='Not Found') && (newSlug !== '')){
                  newSlug = newSlug.replaceAll('--','-');
                  return newSlug;
              } else {
                  let slug = link['pathname'].split('/').pop();
                  slug = slug.replaceAll('--','-');
                  if(slug){
                      return slug;
                  }
              }
              return content; //String
          },
          convertFilePath: async function (content) {
              //We need to convert all instances of public:// to ../files/
              return unescape(content).replaceAll('///','//')
                  .replaceAll('https://','')
                  .replaceAll('mynci-qa.cancer.gov','')
                  .replaceAll('mynci.cancer.gov','')
                  .replaceAll('ocpl-mynci:8890','')
                  .replace('/sites/','')
                  .replaceAll('public://','/files/')
                  .replace('/files/','../files/'); //String
          },
      }

    /**
     *
     * @param {object} object
     * @param {string} value
     * @returns {Promise<string>}
     */
    async function getAcrByName(object, value) {
        // myArray.find(item => item.id === 2);
        value = value.replaceAll('-DUP ','');
         let foundOrg = object.find(item => item.Name === value);
        if (foundOrg && foundOrg.hasOwnProperty('Acronym')) {
            return foundOrg.Acronym;
        }
        return '';
    }

    /**
     *
     * @param {object} object
     * @param {object} value
     * @param {string} staticRedirect
     * @returns {Promise<object>}
     */
    async function getRedirectURL(object, value, staticRedirect = '') {
        try {
            if(!value.url.hostname || (value.url.hostname === '') || (!value.url.hostname.length > 0)
                || (value.url.hostname === 'mynci.cancer.gov')
            ) {
                let found = object.find(item => item.Source === value.pathname);
                if (found) {
                    if (staticRedirect && staticRedirect !== '') {
                        value.pathname = staticRedirect;
                        value.url = staticRedirect;
                    } else if (found.hasOwnProperty('Redirect')) {
                        value.pathname = found.Redirect;
                    }
                }
            }
            return value;
        } catch (err) {
            console.error('Error:', err);
            return value;
        }


    }
    /**
     *
     * @param {string} content
     * @returns {Promise<string>}
     */
    async function textConverter(content){
        return unescape(content)
            .replaceAll('  ',' ')
            .replaceAll('&amp;nbsp;',' ')
            .replaceAll('&nbsp;',' ')
            .replaceAll(':',' - ')
            .replaceAll('|',' - ')
            .replaceAll('/',' and ')
            .replaceAll('  ',' ');
    }

    /**
     *
     * @param {string} content
     * @param {number} contactNumber
     * @returns {Promise<Number>|Promise<string>}
     */
    async function personConverter(content, contactNumber){
        let emailList = content.split('|');
        let personEmail;
        let sharepointUser;
        if(contactNumber === 1){
            if((emailList.length>1) && (emailList[1]!== null) && (emailList[1]!=='')) {
                personEmail = emailList[1].trim();
            }
        } else {
            if((emailList[0]!== null) && (emailList[0]!=='')){
                personEmail = emailList[0].trim();
            }
        }
        sharepointUser = await getSharepointUser(personEmail);
        await drupalUsers.add(personEmail,sharepointUser);
        if(sharepointUser.hasOwnProperty('person_columnID') && sharepointUser.person_columnID !== '') {
            return sharepointUser.person_columnID;
        }
    }
    /**
     *
     * @param {string} content
     * @param {string} baseTag
     * @returns {Promise<String>}
     */
    async function tagConverter(content,baseTag){
        let termList = content.split('|');
        if(baseTag && (baseTag !== '')){
            termList.push(baseTag);
        }
        //let termObject = {results: []};
        let fullTermString = '';
        if (termList && termList.length > 1) {
            for (const term of termList) {
                fullTermString += await convertTermToString(term);
            }
            return fullTermString; //String
        } else {
            return await convertTermToString(content);
        }
    }
    /**
     *
     * @param {string} term
     * @returns {Promise<string>}
     */
    async function convertTermToString(term){
        let taxonomyItem = {Label:'', TermGuid:''};
        let defaultTagItem = {Label:'', TermGuid:''};
        let termString = '';
        let index = 0;
        let trimmedTerm = '';
        trimmedTerm = term.trim();
        taxonomyItem = await getTaxonomyTerm(trimmedTerm);
        if(taxonomyItem && taxonomyItem.hasOwnProperty('TermGuid') && taxonomyItem.TermGuid && (taxonomyItem.TermGuid !== 'Not Found')){
            //termObject.results.push(taxonomyItem);
            termString += 'taxonomyItem.Id;#' + taxonomyItem.Label + '|' +  taxonomyItem.TermGuid + ';#';
            //return termObject; //Object
            return termString; //String
        } else {
            return '';
        }
    }

    /**
     *
     * @param {string} content
     * @returns {Promise<Document>}
     */
    async function createHTMLDocument(content){
        const parser = new DOMParser();
        return parser.parseFromString(content, "text/html");
    }
    /**
     *  @param {string} term
     *  @returns {Promise<object>}
     *  Loops through childnodes of href and returns text
     */
    async function getTaxonomyTerm(term) {
        for (const element of taxonomyTags) {
            if(element.hasOwnProperty('Title') && (element.Title !== null)){
               if(((element.Title.toLowerCase() === term.toLowerCase()) || (element.Title.toLowerCase().includes(term.toLowerCase() + ' ('))) && element.hasOwnProperty('Id') && (element.hasOwnProperty('IdForTerm'))) {
                    let taxonomyItem = {Label:'', TermGuid:'', WssId:''};
                    taxonomyItem.Label = element.Title;
                    taxonomyItem.TermGuid = element.IdForTerm;
                    taxonomyItem.WssId = element.Id;
                    return taxonomyItem;
                }
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
     *  @param {string} content
     *  @returns {string|object}
     *  Converts string to URL object if possible
     */
    function changeStringToURL (content){
        let link = {pathname:''};
        if (urlsConverted.isValidUrl(content)) {
            link.url = new URL(content);
            if (('pathname' in link.url) && (link.url.pathname !== '')){
                link.pathname = link.url.pathname;
            }
        } else {
            link.url = content;
            link.pathname = content;
        }
        return link;
    }

    /**
     *  @param {Element} tag
     *  @param {object} redirectMap
     *  @param {object} taxonomyRedirectMap
     *  @param {object} spConfig
     *  @returns {Promise<Element>}
     *  Loops through childnodes of href and returns text
     */
    async function updateLinkSource(tag, redirectMap, taxonomyRedirectMap, spConfig) {
        let content;
        if (tag.tagName === 'img'){
            content = tag.getAttribute('src');
        } else {
            content = tag.getAttribute('href');
        }
        //content = content.replaceAll('https://cloud-fe-nci.onakumina.com/','/');
        let link = changeStringToURL(content);

        //Check for Node/NID links
        let newHref = {url:'', pathname:''};
        let NID = '';
        //Basically convert aliases/redirects into /node/NID
        link = await getRedirectURL(redirectMap,link);
        //Convert redirects to taxonomy terms into taxonomy term links
        link = await getRedirectURL(taxonomyRedirectMap,link,'/sitepages/orgdirectory.aspx');
        //Check for links to people
        let slug = link.pathname.split('/').pop();
        const mime_type = mime.lookup(slug);
        if(!mime_type){
            if (link.pathname.includes('/users/')) {
                link.pathname = '/sitepages/peoplefinder.aspx';
            }
        }
        newHref.url = link['url'];
        if (!link['pathname'].startsWith('/sitepages/')) {

            if (link['pathname'].startsWith('/node/')){
                let urlParts = link['pathname'].split('/');
                NID = urlParts.pop();
                newHref = await urlsConverted.lookupNID(NID);
            } else {
                newHref = await urlsConverted.lookup(link, spConfig);
            }
        }
        let hash = '';
        let newUrl = '';
     //let preProdAbsoluteDomain = 'https://mynci-preprod.cancer.gov/sites/NCI-OCPL-myNCI-preprod#';
        /*let prodAbsoluteDomain = 'http://cloud-fe-nci.onakumina.com/#';
        let absoluteDomain = preProdAbsoluteDomain;
        let preprodImgEnv = 'https://mynci-appmanager-preprod.cancer.gov/api/sharepoint/spfile?siteurl=https://nih.sharepoint.com/sites/nci-ocpl-mynci-preprod&relativeUrl=';
        let prodImgEnv = 'https://mynci-appmanager.cancer.gov/api/sharepoint/spfile?siteurl=https://nih.sharepoint.com/sites/nci-ocpl-mynci&relativeUrl=';
        let imgEnv = preprodImgEnv;
        let imgSrcPrefix = imgEnv + '/sites';*/
        let absoluteDomain = spConfig.absoluteDomain;
        let imgSrcPrefix = spConfig.imagePrefix + '/sites';
        if (newHref && (newHref.hasOwnProperty('url')) && (newHref.url !== 'Not Found')){
            if(newHref.url.hasOwnProperty('hash') && (newHref.url.hash !== '')){
                    hash = newHref.url.hash;
            }
            newUrl = newHref.url + hash;
        } else {
            //newUrl = urlsConverted.getKeyFromPath(link['url']).key;
            if(link.hasOwnProperty('url')) {
                if(link.url.hasOwnProperty('href') && link.url.href !== ''){
                    newUrl = link.url.href;
                } else {
                    newUrl = link.url;
                }
            }
            absoluteDomain = '';
        }
        let newUrlSlug = '';
        if(typeof newUrl === 'string'){
            newUrlSlug =  newUrl.split('/').pop();
        } else {
            if (typeof newUrl === 'object'){
                newUrlSlug =  newUrl.href.split('/').pop();
            }
        }

        const mime_type_newUrl = mime.lookup(newUrlSlug);
        if(!mime_type_newUrl){
            newUrl = absoluteDomain + newUrl;
        }
        if(typeof newUrl === 'string'){
            if (tag.tagName === 'img'){
                tag.setAttribute('src', imgSrcPrefix + newUrl);
            } else {
                tag.setAttribute('href', newUrl);
            }
        } else {
            if (typeof newUrl === 'object'){
                if (tag.tagName === 'img'){
                    tag.setAttribute('src', imgSrcPrefix + newUrl.href);
                } else {
                    tag.setAttribute('href', newUrl.href);
                }
            }
        }

        return tag;
    }

    /**
     *  @param {string} content
     *  @param {string} tagType
     *  @param {boolean} imageField
     *  @param {object} redirectMap
     *  @param {object} taxonomyRedirectMap
     *  @param {object} spConfig
     *  @returns {Promise<object>}
     *  Loops through set of links and replaces drupal links with
     *  sharepoint links using url-converter
     */
    async function convertLinks(content,tagType, imageField, redirectMap, taxonomyRedirectMap, spConfig) {
        let linkList = {};
        /*let urlPrefix = '';
        if (imageField) {
            urlPrefix = '/sites';
        }*/
        content = '<body>' + content + '</body>';
        let htmlDoc = await createHTMLDocument(content);
        const htmlTags = htmlDoc.getElementsByTagName(tagType);
        let thisURL = '';
        let thisDescription = '';
        if(htmlTags.length>0){
            if (tagType === 'img'){
                let imgSrc = await updateLinkSource(htmlTags[0], redirectMap, taxonomyRedirectMap, spConfig);
                linkList = {
                   //Url: urlPrefix + imgSrc.getAttribute('src'),
                    Url: imgSrc.getAttribute('src'),
                    Description: imgSrc.getAttribute('alt')
                }
            } else {
                linkList = {results:[]};
                let link = {};
                for (let i=0; i< htmlTags.length; i++) {
                    let tag = htmlTags[i];
                    let myTag = await updateLinkSource(tag, redirectMap, taxonomyRedirectMap, spConfig);
                    //thisURL = urlPrefix + myTag.getAttribute('href');
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
     *  @param {object} redirectMap
     *  @param {object} taxonomyRedirectMap
     *  @param {object} spConfig
     *  @returns {Promise<Document>}
     *  Loops through set of links and replaces drupal links with
     *  sharepoint links using url-converter
     */
    async function replaceLinks(htmlDoc, tagType, redirectMap, taxonomyRedirectMap, spConfig) {
        const htmlTags = htmlDoc.getElementsByTagName(tagType);
        for (let i=0; i< htmlTags.length; i++) {
            let tag = htmlTags[i];
            /*if (tagType === 'img'){
                // let imagePrefix = 'https://nih.sharepoint.com/sites';
                let imagePrefix = '/sites';
                let src = tag.getAttribute('src');
                tag.setAttribute('src', imagePrefix + src);
            }*/
            await updateLinkSource(tag, redirectMap, taxonomyRedirectMap, spConfig);
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
        let contactHeader = '';

        //check if has ContactHeader property and Phone, e-mail website-URL, For more information, Twitter, Facebook or Linkedin have content
        if ( (mapElement.hasOwnProperty('ContactHeader') && (mapElement.ContactHeader !== '')) &&
            ( (element.hasOwnProperty('Phone') && element.Phone[0] && (element.Phone[0] !== '')) ||
                (element.hasOwnProperty('E-mail') && element['E-mail'][0] && (element['E-mail'][0] !== '')) ||
                (element.hasOwnProperty('Website-URL') && element['Website-URL'][0] && (element['Website-URL'][0] !== '')) ||
                (element.hasOwnProperty('For-More-Information') && element['For-More-Information'][0] && (element['For-More-Information'][0] !== '')) ||
                (element.hasOwnProperty('Twitter') && element['Twitter'][0] && (element['Twitter'][0] !== '')) ||
                (element.hasOwnProperty('Facebook') && element['Facebook'][0] && (element['Facebook'][0] !== '')) ||
                (element.hasOwnProperty('LinkedIn') && element['LinkedIn'][0] && (element['LinkedIn'][0] !== ''))
            )){
                contactHeader = '<h2>' + mapElement.ContactHeader + '</h2>';
        }
          for (const contentPath of mapElement.ContentPaths) {
                const index = mapElement.ContentPaths.indexOf(contentPath);
                let transform = false;
                let hardCodedPath = false;

                if (contentPath.Transformation) {
                    transform = true;
                }
              if (contentPath.HardCoded) {
                  hardCodedPath = true;
              }
              let elementItem = '';
              let elementPrepend = '';
              if(contentPath.hasOwnProperty('Paths') && contentPath.Paths[0]) {
                  elementItem = contentPath.Paths[0];
                  if (elementItem === 'Twitter'){
                      elementPrepend = '<span class="twitter-icon"><strong>Twitter</strong></span>: '
                  }
                  if (elementItem === 'Facebook'){
                      elementPrepend = '<span class="facebook-icon"><strong>Facebook</strong></span>: '
                  }
                  if (elementItem === 'LinkedIn'){
                      elementPrepend = '<span class="linkedIn-icon"><strong>LinkedIn</strong></span>: ';
                  }
              }
//If element[phone] is empty, but we still want a contact header
              if(elementItem === 'Phone') {
                  newData += contactHeader;
              }
                if ((element[elementItem] !== null) || hardCodedPath || (element[elementItem][0] && element[elementItem][0] !== '')) {
                    let elementData = '';
                    if (hardCodedPath) {
                        elementData = contentPath.HardCoded;
                    } else if (element[elementItem] && (element[elementItem] !== '') ) {
                        elementData = element[elementItem].toString();
                    }
                    if (transform) {
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
                            elementData = elementPrepend + elementData;

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
     * @param {object} spConfig
     *
     * @returns {Promise<object>}
     */
    async function applyContentMap(element, map, spConfig) {
        let convertedItem = {columns: {}, metadata: {}};
        for (const mapElement of map) {
            let newData;
            //Iterate over ContentPaths
            if(mapElement.hasOwnProperty('ContentPaths')){
                newData = await readContentPaths(element, mapElement);
            } else {
                //Import hardcoded data if found
                if(mapElement.hasOwnProperty('HardcodedData')){
                    if(mapElement.hasOwnProperty('SharePointColumn') && (mapElement.SharePointColumn === 'Persona_0') ) {
                        newData = 'taxonomyItem.Id;' + mapElement.HardcodedData.toString() + '|' + spConfig.personaIdAll.toString() + ';#';
                    }
                    else if(mapElement.hasOwnProperty('SharePointColumn') && (mapElement.SharePointColumn === 'ContentTypeId') ) {
                        switch(mapElement.HardcodedData){
                            case 'Blog':
                                newData = spConfig.blogListID.toString();
                                break;
                            case 'InternalPage':
                                newData = spConfig.internalPageListID.toString();
                                break;
                            case 'Calendar':
                                newData = spConfig.calendarListID.toString();
                                break;
                            case 'GenericHTML':
                                newData = spConfig.genericHTMLListID.toString();
                                break;
                            default:
                                newData = mapElement.HardcodedData.toString();
                                break;
                        }
                    }


                    else {
                        newData = mapElement.HardcodedData.toString();
                    }
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
        convertedItem.metadata.isOnAkumina = false;
        return convertedItem;
    }

    /**
     *
     * @param {string} OldPath
     * @returns {Promise<boolean>}
     */
    async function checkIfURLIsActive(OldPath) {
        let url;
        if (urlsConverted.isValidUrl(OldPath)) {
            url = new URL(OldPath);
        } else {
            url = OldPath;
        }
        return await urlsConverted.lookupActive(url);
    }
    /**
     * Checks whether node has been linked
     * to and logs active status
     *
     * @param {object} element
     * @param {string} key
     *
     * @returns {Promise<object>}
     */
    async function logIfContentIsActive(element, key) {
        let isActive;
        let isFile = false;
        if(key === 'file'){
            isFile = true;
        }
        if(element.hasOwnProperty('metadata') && element.metadata.hasOwnProperty('OldPath')){
            isActive = await checkIfURLIsActive(element.metadata["OldPath"]);
        }
        //sets isActive to false by default
        element.metadata.isActive = false;
        if((isActive !== 'Not Found') && (isActive !== null)  && (isActive !== false)) {
            element.metadata.isActive = isActive;
        } else {
            if(isFile && element.hasOwnProperty('columns') && element.columns.hasOwnProperty('StaticUrl')){
                isActive = await checkIfURLIsActive(element.columns["StaticUrl"]);
                if((isActive !== 'Not Found') && (isActive !== null)) {
                    element.metadata.isActive = isActive;
                }
            }
        }
        return element;
    }

    //Cycles through all of the Drupal export objects and builds Akumina variants applying the
    //mapping between Drupal and Akumina fields and any transformations
    for (const [key, value] of Object.entries(this.drupal)) {
        for (const element of this.drupal[key]) {
            this.akumina[key].push(await applyContentMap(element, eval(key + 'Map'), spConfig));
        }
    }

    //Cycles through all of the Akumina objects,logs which are linked to (active),
    //Also checks if staticUrl is unique and modifies if not
    for (const [key, value] of Object.entries(this.akumina)) {
        for (const element of this.akumina[key]) {
            await logIfContentIsActive(element, key);
           // await guaranteeUniqueURL(element);
        }
    }
    //Cycles through mediaImages and files and sets migrate to false for
    // inactive items (items not linked anywhere)
    let fileList = [];
    let mediaFileList = [];
    let imageList = [];
    for (const element of this.akumina.file) {
        element.metadata.migrate = element.metadata.isActive;
        element.metadata.isOnAkumina = currentDocuments.some(e => e.Title === element.columns.Title);
        if (element.hasOwnProperty('metadata')
            && element.metadata.hasOwnProperty('migrate')
            && element.metadata.migrate
            && element.metadata.hasOwnProperty('OldPath')){
                fileList.push(element.metadata.OldPath);
        }

    }
    for (const element of this.akumina.mediaFiles) {
        element.metadata.migrate = element.metadata.isActive;
        element.metadata.isOnAkumina = currentDocuments.some(e => e.Title === element.columns.Title);
        if (element.hasOwnProperty('metadata')
            && element.metadata.hasOwnProperty('migrate')
            && element.metadata.migrate
            && element.metadata.hasOwnProperty('OldPath')){
            mediaFileList.push(element.metadata.OldPath);
        }
    }
    for (const element of this.akumina.mediaImages) {
        element.metadata.migrate = element.metadata.isActive;
        //check if Title already exists on server
        element.metadata.isOnAkumina = currentImages.some(e => e.Title === element.columns.Title);
        if (element.hasOwnProperty('metadata')
            && element.metadata.hasOwnProperty('migrate')
            && element.metadata.migrate
            && element.metadata.hasOwnProperty('OldPath')) {
            imageList.push(element.metadata.OldPath);
        }
    }
    FileSystem.writeFile('../content/fileList.json', JSON.stringify(fileList), (error) => {
        if (error) throw error;
    });
    FileSystem.writeFile('../content/mediaFileList.json', JSON.stringify(mediaFileList), (error) => {
        if (error) throw error;
    });
    FileSystem.writeFile('../content/ImageList.json', JSON.stringify(imageList), (error) => {
        if (error) throw error;
    });
  }

  /**
   * Find all files linked in content.
   *
   * @returns {Array<object>} An array of file objects used in the content
   */
  //async findLinkedFiles() {}

  /**
   * Find all images used in content.
   *
   * @returns {Array<object>} An array of image objects used in the content
   */
  //async findUsedImages() {}
}



export default DrupalContent;
