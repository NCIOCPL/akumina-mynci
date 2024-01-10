import xml2js from 'xml2js';
import { promises as fsPromises } from 'fs';
import { blogMap } from "./maps.js";


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
 * @returns {Promise<void>}
 */
  async prepareContent() {
      //TODO Build functions to transform content
      let transformContent = {
          convertLink: function (content) {
              let transformedContent = content;
              return transformedContent;
          },
          convertImage: function (content) {
              let transformedContent = content;
              return transformedContent;
          },
          convertTags: function (content) {
              //Intended to illustrate that transformations are being applied
           let transformedContent = content.toUpperCase();
              return transformedContent;
          },
          convertDepartments: function (content) {
              let transformedContent = content;
              return transformedContent;
          },
          convertPerson: function (content) {
              let transformedContent = content;
              return transformedContent;
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
     * @returns {object}
     */
    function applyContentMap(element, map) {
        let convertedItem = {};
        map.forEach((mapElement) => {
            let newData = '';
            mapElement.ContentPaths.forEach((contentPath, index)=>{
                let transform = false;
                if(contentPath.Transformation){
                    transform = true;
                }
                contentPath.Paths.forEach((path)=> {
                   let elementData = element[path];
                    if (transform) {
                        let transformedElement = '';
                        element[path].forEach((elementPath) => {
                            transformedElement += transformContent[contentPath.Transformation](elementPath)
                        })
                      elementData = transformedElement;
                   }
                    if(mapElement.Separator) {
                        if(index === 0) {
                            newData += elementData;
                        } else {
                            newData +=  mapElement.Separator + elementData;
                        }
                    } else {
                        newData += elementData;
                    }
                })
            })
            convertedItem[mapElement.SharePointColumn] = newData;
        });
        return convertedItem;
    }

    this.blogs.forEach((element) => {
        this.akumina_blogs.push(applyContentMap(element, blogMap));
      })
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
