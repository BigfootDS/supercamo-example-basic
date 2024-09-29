const { NedbDocument } = require("@bigfootds/supercamo");
const { LocalizedContent } = require("../subdocuments/LocalizedContent");
const { User } = require("./User");



class Article extends NedbDocument {
	constructor(data, databaseName, collectionName){
		super(data, databaseName, collectionName);
		
		this.rules = {
			title: {
				type: [LocalizedContent],
				required: true
			},
			content: {
				type: [LocalizedContent],
				required: true
			},
			authors: {
				type: [User],
				collection: "Users",
				required: true	
			}
		}
		
	}
}

module.exports = {Article}