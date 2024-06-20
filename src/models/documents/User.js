const NedbDocument = require("@bigfootds/supercamo/NedbDocument");
const { LocalizedContent } = require("../subdocuments/LocalizedContent");

class User extends NedbDocument {
	constructor(data, databaseName, collectionName){
		super(data, databaseName, collectionName);
		
		this.username = {
			type: String,
			required: true,
			unique: true
		}

		this.biography = {
			type: LocalizedContent,
			required: false
		}
	}
}

module.exports = {User}