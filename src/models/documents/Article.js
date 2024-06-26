const NedbDocument = require("@bigfootds/supercamo/NedbDocument");
const { LocalizedContent } = require("../subdocuments/LocalizedContent");
const { User } = require("./User");



class Article extends NedbDocument {
	constructor(data, databaseName, collectionName){
		super(data, databaseName, collectionName);
		
		this.title = {
			type: [LocalizedContent],
			required: true
		}

		this.content = {
			type: [LocalizedContent],
			required: true
		}

		this.authors = {
			type: [User],
			collection: "Users",
			required: true
		}
	}
}

module.exports = {Article}