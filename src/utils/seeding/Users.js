const {SuperCamo} = require("@bigfootds/supercamo");


const data = [
	{
		username: "Bigfoot",
		biography: {
			language: "en",
			content: "The man, the myth - the cryptid."
		}
	},
	{
		username: "Alex",
		biography: {
			language: "en",
			content: "The man, the dude - the guy."
		}
	}
]

async function seed(){

	console.log("Getting client reference to database BasicExampleDatabase now.");
	const databaseInstance = SuperCamo.clientGet("BasicExampleDatabase");

	console.log("Beginning User seeding.");

	console.log("Seeding User via insertMany.");
	let insertManyResult = await databaseInstance.insertMany("Users", data);
	console.log("Result of the User insertMany:");
	console.log(insertManyResult);

	console.log("Seeding User via insertOne.");
	let insertOneResult = await databaseInstance.insertOne("Users", {
		username: "L'homme de francais",
		biography: {
			language: "fr",
			content: "Je ne sais pas des mots pour cette tâche."
		}
	});
	console.log("Result of the User insertOne:");
	console.log(insertOneResult);

	console.log("User seeding complete.");
}

module.exports = seed;