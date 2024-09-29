const { NedbDocument, SuperCamo } = require("@bigfootds/supercamo");
const { LocalizedContent } = require("../subdocuments/LocalizedContent");
const {scrypt, timingSafeEqual, randomBytes} = require("node:crypto");
const encryptionKeyLength = 64;

class User extends NedbDocument {
	constructor(newData, newParentDatabaseName, newCollectionName){
		super(newData, newParentDatabaseName, newCollectionName);

		this.rules = {
			username: {
				type: String,
				required: true,
				unique: true
			},
			biography: {
				type: [LocalizedContent],
				required: false
			},
			password: {
				type: String,
				required: true,
				minLength: 8,
				invalidateOnMinMaxError: true
			}
		}	

	}

	
	
	
	/**
	 * Zero-dependency password hashing.
	 * 
	 * Code based on comments and article content from this article:
	 * 
	 * [https://dev.to/farnabaz/hash-your-passwords-with-scrypt-using-nodejs-crypto-module-316k#comment-24a9e](https://dev.to/farnabaz/hash-your-passwords-with-scrypt-using-nodejs-crypto-module-316k)
	 * @author BigfootDS
	 *
	 * @static
	 * @async
	 * @param {string} password Raw, unencrypted and vulnerable password. eg. "Password1"
	 * @returns {Promise<string>}
	 */
	static async hashPassword(password) {
		let result = await new Promise((resolve, reject) => {
			const salt = randomBytes(16).toString("hex");
	
			scrypt(password, salt, encryptionKeyLength, (err, derivedKey) => {
				if (err) reject(err);
				resolve(`${salt}:${derivedKey.toString('hex')}`);
			});
		});
		return result;
	}
	
	
	/**
	 * Zero-dependency password verification.
	 * 
	 * Code based on comments and article content from this article:
	 * 
	 * [https://dev.to/farnabaz/hash-your-passwords-with-scrypt-using-nodejs-crypto-module-316k#comment-24a9e](https://dev.to/farnabaz/hash-your-passwords-with-scrypt-using-nodejs-crypto-module-316k)
	 * @author BigfootDS
	 *
	 * @static
	 * @async
	 * @param {string} password Raw, unencrypted and vulnerable password. eg. "Password1"
	 * @param {string} hash Previously-hashed and salted password.
	 * @returns {boolean}
	 */
	static async verifyPassword(password, hash) {
		return new Promise((resolve, reject) => {
			const [salt, key] = hash.split(":");
			const keyAsBuffer = Buffer.from(key, "hex");

			scrypt(password, salt, UserWithPassword.encryptionKeyLength, (err, derivedKey) => {
				if (err) reject(err);
				resolve(timingSafeEqual(keyAsBuffer, derivedKey));
			});
		})
	}

	async preSave(){
		if (this.data._id){
			let existingDbData = await SuperCamo.clientGet(this.parentDatabaseName).findOneObject(this.collectionName, {_id: this.data._id});
			if ((existingDbData == null) || existingDbData?.password != this.data.password){
				// Password was modified, should re-encrypt it!
				this.data.password = await User.hashPassword(this.data.password);
				// console.log("Password encrypted!");
			}
		}
	}
}

module.exports = {User}