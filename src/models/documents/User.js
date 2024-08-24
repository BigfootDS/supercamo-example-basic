const { NedbDocument } = require("@bigfootds/supercamo");
const { LocalizedContent } = require("../subdocuments/LocalizedContent");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const saltRounds = 10;

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
			required: false,
			unique: false
		}

		this.password = {
			type: String,
			required: false,
			unique: false
		}
	}
}

module.exports = {User}