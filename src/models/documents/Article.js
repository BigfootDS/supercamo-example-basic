const SuperCamo = require("@bigfootds/supercamo");
const { LocalizedContent } = require("../subdocuments/LocalizedContent");
const { User } = require("./User");

class Article extends SuperCamo.NedbDocument {
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