const { Article } = require("./models/documents/Article.js");
const { LocalizedContent } = require("./models/subdocuments/LocalizedContent.js");
const path = require("node:path");
const { User } = require("./models/documents/User.js");
const {SuperCamo, NedbClient, CollectionListEntry} = require("@bigfootds/supercamo");


/**
 * @type {NedbClient }
 * @author BigfootDS
 */
let databaseInstance = null;



/**
 * Connect to (and create if needed) a database.
 * Each collection must specify its used model, 
 * and the database client must specify all used
 * @author BigfootDS
 *
 * @async
 * @returns
 */
async function connect(){
	// Connect to the database
	databaseInstance = SuperCamo.clientConnect(
		"BasicExampleDatabase", 
		path.join(process.cwd(), ".sandbox" , "databases", "BasicExampleDatabase"),
		[
			new CollectionListEntry("Users", User),
			new CollectionListEntry("Articles", Article)
		]
	);
	console.log("Database instance:");
	console.log(databaseInstance);
}


/**
 * Delete any pre-existing data so that the create() function can run smoothly.
 * @author BigfootDS
 *
 * @async
 */
async function drop(){
	// Drop the database to remove any old data
	let dropResult = 0;
	dropResult += await databaseInstance.findAndDeleteMany("Users", {});
	dropResult += await databaseInstance.findAndDeleteMany("Articles", {});
	console.log("Database pre-seed drop step removed this much data:");
	console.log(dropResult);
}


/**
 * Run the seed files for relevant models in this example project.
 * @author BigfootDS
 *
 * @async
 */
async function create(){
	// Require each seeding file, in order of which models depend on what other model
	// 1. Users
	const seedUsers = require("./utils/seeding/Users.js");
	await seedUsers();

	// 2. Articles
	const seedArticles = require("./utils/seeding/Articles.js");
	await seedArticles();


}


/**
 * Show all data in the database client as a JSON string.
 * @author BigfootDS
 *
 * @async
 */
async function dump(){
		console.log("Dumped database data:");
		// NOT IMPLEMENTED:
		// let dumpResult = await databaseInstance.dumpDatabaseAsObjects();
		// console.log(dumpResult);
		// Dump manually instead!
		let manualDump = {};
		manualDump.users = await databaseInstance.findManyObjects("Users", {});
		manualDump.articles = await databaseInstance.findManyObjects("Articles", {});
		console.log(JSON.stringify(manualDump, null, 4));
}



async function readAllObjects(){
	console.log("-----------------------");
	console.log("Finding one Article and populating it so that it shows User data too.");
	let populatedArticle = await databaseInstance.findOneObject("Articles", { "title.content":"Some Extra Article"}, true);
	console.log("Populated article content:");
	console.log(JSON.stringify(populatedArticle, null, 4));
	console.log("-----------------------");

	
	console.log("-----------------------");
	console.log("Finding and populating all Articles!")
	let populatedArticles = await databaseInstance.findManyObjects("Articles", {});
	console.log("Populated articles content:");
	console.log(JSON.stringify(populatedArticles, null, 4));
	console.log("-----------------------");
}

async function readAllArticleDocuments(){
	console.log("-----------------------");
	console.log("Finding one specific Article as a document instance.");
	let foundSpecificArticle = await databaseInstance.findOneDocument("Articles", { "title.content":"Some Extra Article"});
	console.log("Found specific article content:");
	console.log(foundSpecificArticle);
	console.log("-----------------------");

	
	console.log("-----------------------");
	console.log("Finding all Articles as document instances.")
	let foundArticles = await databaseInstance.findManyDocuments("Articles", {});
	console.log("Found articles content:");
	console.log(foundArticles);
	console.log("-----------------------");
}




async function app(){
	await connect();
	await drop();
	await create();
	await readAllObjects();
	await readAllArticleDocuments();
	
	await dump();

}

app();