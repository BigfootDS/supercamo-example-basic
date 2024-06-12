const SuperCamo = require("@bigfootds/supercamo");


const data = [
	{
		title: [
			{
				language: "en",
				content: "Hello world!"
			},
			{
				language: "fr",
				content: "Bonjour tout le monde!"
			}
		],
		content: [
			{
				language: "en",
				content: "Example article content as string goes here."
			},
			{
				language: "fr",
				content: "Pretend this is a French article. Cheers."
			}
		]
	}
]

async function seed(){

	console.log("Getting client reference to database BasicExampleDatabase now.");
	const databaseInstance = SuperCamo.getClientByName("BasicExampleDatabase");
	

	console.log("Beginning Article seeding.");

	console.log("Retrieving seeded users.");
	let availableUsers = await databaseInstance.findManyObjects("Users", {});
	console.log("Article seeding found these users:");
	console.log(JSON.stringify(availableUsers, null, 4));

	console.log("Adding user IDs to Article seed data.");

	let updatedData = data.map((entry) => {
		entry.authors = [availableUsers[Math.floor(Math.random() * availableUsers.length)]._id]
		return entry;
	})

	console.log("Seeding Article via insertMany.");
	let insertManyResult = await databaseInstance.insertMany("Articles", updatedData);
	console.log("Result of the Article insertMany:");
	console.log(insertManyResult);

	console.log("Seeding Article via insertOne.");
	let insertOneResult = await databaseInstance.insertOne("Articles", {
		title: [
			{
				language: "en",
				content: "Some Extra Article"
			}
		],
		content: [
			{
				language: "en",
				content: "Extra article content goes here."
			}
		],
		authors: [
			availableUsers[Math.floor(Math.random() * availableUsers.length)]._id
		]
	});
	console.log("Result of the Article insertOne:");
	console.log(insertOneResult);

	console.log("Article seeding complete.");


	console.log("-----------------------");
	console.log("Finding one Article and populating it so that it shows User data too.");
	let populatedArticle = await databaseInstance.findOneObject("Articles", { "title.content":"Some Extra Article"}, true);
	console.log("Populated article content:");
	console.log(JSON.stringify(populatedArticle, null, 4));
	console.log("-----------------------");

	
	console.log("-----------------------");
	console.log("Finding and populating all Articles!")
	let populatedArticles = await databaseInstance.findManyObjects("Articles", {}, true);
	console.log("Populated articles content:");
	console.log(JSON.stringify(populatedArticles, null, 4));
	console.log("-----------------------");
}

module.exports = seed;