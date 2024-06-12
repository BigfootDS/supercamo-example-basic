const SuperCamo = require("@bigfootds/supercamo");
const { Article } = require("./models/documents/Article.js");
const { LocalizedContent } = require("./models/subdocuments/LocalizedContent.js");
const path = require("node:path");
const { User } = require("./models/documents/User.js");


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
	databaseInstance = await SuperCamo.connect(
		"BasicExampleDatabase", 
		path.join(process.cwd(), ".sandbox" , "databases"),
		[
			{name:"Users", model:User},
			{name: "Articles", model: Article}
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
	let dropResult = await databaseInstance.dropDatabase();
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
		let dumpResult = await databaseInstance.dumpDatabase();
		console.log("Dumped database data:");
		console.log(JSON.stringify(dumpResult, null, 4));
}






async function app(){
	await connect();
	await drop();
	await create();
	await dump();

	
	await dump();
}

app();