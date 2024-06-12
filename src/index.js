const SuperCamo = require("@bigfootds/supercamo");
const { Article } = require("./models/documents/Article.js");
const { LocalizedContent } = require("./models/subdocuments/LocalizedContent.js");
const path = require("node:path");
const { User } = require("./models/documents/User.js");

async function app(){
	// Connect to the database
	let databaseInstance = await SuperCamo.connect(
		"BasicExampleDatabase", 
		path.join(process.cwd(), ".sandbox" , "databases"),
		[
			{name:"Users", model:User},
			{name: "Articles", model: Article}
		],
		[
			LocalizedContent
		]
	);
	console.log("Database instance:");
	console.log(databaseInstance);

	// Drop the database to remove any old data
	let dropResult = await databaseInstance.dropDatabase();
	console.log("Database pre-seed drop step removed this much data:");
	console.log(dropResult);

	// Require each seeding file, in order of which models depend on what other model
	// 1. Users
	const seedUsers = require("./utils/seeding/Users.js");
	await seedUsers();

	// 2. Articles
	const seedArticles = require("./utils/seeding/Articles.js");
	await seedArticles();

	// Dump the database
	let dumpResult = await databaseInstance.dumpDatabase();
	console.log("Dumped database data:");
	console.log(JSON.stringify(dumpResult, null, 4));
}

app();