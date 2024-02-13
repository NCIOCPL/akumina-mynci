/**
 * Drupal Userlist
 *
 */
class DrupalUserlist {
  /**
   * Creates a new instance of a Drupal Userlist
   *
   */

  constructor() {
    this.userList = new Map();
  }
  /**
   *  @param {string} email
   *  @param {object} sharepointUser
   *  adds nih email to list of emails
   */
  async add(email,sharepointUser) {
    if(!this.userList.has(email)) {
      let hasID = false;
      if(sharepointUser.person_columnID !== ''){
        hasID = true;
      }
      this.userList.set(email, {title: sharepointUser.Title, sharepointID: sharepointUser.person_columnID, hasID: hasID});
    }
  }
  /**
   * Retrieves a URL to be converted
   *
   * @param {string} email The email to lookup
   * @returns {Promise<string>} The sharepoint ID
   */
  async lookup(email) {
    if(this.userList.has(email)){
      return this.userList.get(email);
    } else {
      return 'Not Found';
    }
  }
}

export default DrupalUserlist;
