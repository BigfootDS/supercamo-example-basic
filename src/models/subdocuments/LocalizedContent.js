const SuperCamo = require("@bigfootds/supercamo");
const ISO6391 = require('iso-639-1');
let allowedLanguageCodes = ISO6391.getAllCodes();


/**
 * A string associated with a language code for localization purposes.
 * For example, a magic sword would have a LocalizedContent that details the name of the sword in a specific language.
 * Entities can have multiple LocalizedContent subdocuments, and should be used to represent translations or localizations of content across multiple languages.
 * @author BigfootDS
 *
 * @class
 * @property {String} language Required. The language of this content. Should be an ISO-639-1-compliant two-letter code.
 * @property {String} content Required. The content written in the specified language.
 * @extends {SuperCamo.NedbEmbeddedDocument}
 
Example data:
 ```js
 {
 	language: "en",
	content: "Butter"
 }
 {
 	language: "fr",
	content: "Beurré"
 }
 ```
 */
 class LocalizedContent extends SuperCamo.NedbEmbeddedDocument {
	constructor(data, databaseName, collectionName){
		super(data, databaseName, collectionName);
		/**
		 * A two-letter language code that matches the language of this subdocument's name and content.
		 * Examples: "EN", "FR", "DE"
		 * Refer to the ISO-639-1 standard online for the full list of usable codes.
		 */
		this.language = {
			type: String,
			choices: allowedLanguageCodes,
			unique: false,
			required: true
		}
		/**
		 * A document uses LocalizedContent as a subdocument. The content here is the brief blurb or description of the entity represented by that document.
		 */
		this.content = {
			type: String,
			required: true,
			unique: false
		}
	}

}


module.exports = { LocalizedContent };