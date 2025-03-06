import {promises as fsPromises} from "fs";

/**
 * Akumina Taxonomy List
 *
 */
class AkuminaTaxonomyList {
  /**
   * Stores and accesses list of taxonomy terms from sharepoint
   *
   */

  constructor() {
    this.taxonomyList = new Map();
  }


  /**
   * Load content from JSON export file(s).
   *
   * @param {object} taxonomyJSON List of metadata terms.
   */
  async loadContent(taxonomyJSON) {
    try {
      const taxonomyMap = new Map(Object.entries(taxonomyJSON));
      for await (const key of taxonomyMap.keys()){
        let filePath = '';
        if(taxonomyMap.has(key)){
          filePath = taxonomyMap.get(key);
        }
        const jsonData = await fsPromises.readFile(filePath, {encoding: 'utf-8'});
        this.taxonomyList[key] = await JSON.parse(jsonData);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  }
  /**
   * Retrieves a Term to be converted
   *
   * @param {string} vocabulary The vocabulary of the term being looked up ex Topics
   * @param {string} term The term to lookup
   * @returns {Promise<string>} The sharepoint guid
   */
  async lookup(vocabulary, term) {
    let terms = this.taxonomyList[vocabulary]['metadata_column'];
    let akumina_term = terms.filter(function(value){
      if(value.hasOwnProperty('Label')){
        return value.Label === term;
      }
      return '';
    })
    if (akumina_term && akumina_term.length>0) {
      if(akumina_term[0].hasOwnProperty('TermGuid')){
        return akumina_term[0].TermGuid;
      }
      return 'Not Found';
    }
    return 'Not Found';
  }
}

export default AkuminaTaxonomyList;
