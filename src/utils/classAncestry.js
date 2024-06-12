const SuperCamo = require("@bigfootds/supercamo");

function getClassInheritanceList(targetClass) {
	let classList = [];
	let localTargetClass = targetClass;

	let targetClassParent = Object.getPrototypeOf(localTargetClass);
	let constructorName = localTargetClass.constructor?.name;

	let activeModelList = SuperCamo.getRegisteredModels();
	console.log("Active models list:");
	console.log(activeModelList);
	// console.log(JSON.stringify(activeModelList, null, 4));
	let localClassRefArray = activeModelList.filter((model) => {
		console.log(model.name);
		if (model.name === localTargetClass || model.name === constructorName){
			console.log("Found matching model in filter:", model.name, localTargetClass, constructorName);
			return model
		}
	});
	let localClassRef = localClassRefArray;
	console.log("Found matching model:");
	console.log(localClassRef[0]);


	console.log(`Object prototype of ${localTargetClass} is ${targetClassParent}`);
	console.log(`Constructor name of ${localTargetClass} is ${constructorName}`);

	if (localClassRef[0]){
		console.log(typeof(localClassRef[0]));
		console.log(localClassRef[0].name);	
		classList.push(localClassRef[0].name);
		if (Object.getPrototypeOf(localClassRef[0]).name){
			// Recursive function, hell yeah
			let nestedParentName = getClassInheritanceList(localClassRef[0]);
			classList = [...classList, ...nestedParentName];
		}
		
	}

	return classList;
}

function getInstanceClassInheritanceList(instance){
	let classList = [];

	let targetClassParent = Object.getPrototypeOf(targetClass);
	if (targetClassParent){
		classList.push(targetClassParent.name);
		if (Object.getPrototypeOf(targetClassParent).name){
			// Recursive function, hell yeah
			let nestedParentName = getClassInheritanceList(targetClassParent);
			classList = [...classList, ...nestedParentName];
		}
		
	}

	return classList;
}

module.exports = {
	getClassInheritanceList,
	getInstanceClassInheritanceList
}