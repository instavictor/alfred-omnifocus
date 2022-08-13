var query = '{"name": "do somethinng "}';


const of = Application('OmniFocus');
query1 = JSON.parse(query);
	const ofDoc = of.defaultDocument;
	
	//query1.primaryTag = of.Tag({ name: 'home' });
	
	// TODO CHECK TO SEE IF TAG EXISTS... otherwise do nothing
	var results = ofDoc.flattenedTags.whose({
		name: {
			_contains: 'supermarket'
		}
	});
	
	if (results.length) {
		//query1.primaryTag = ofDoc.flattenedTags.byName('supermarket');
		query1.tag = [ofDoc.flattenedTags.byName('supermarket')];
		//query1.primaryTag = ofDoc.flattenedTags.byName('home')
	} else {
	
		query1.name = `${query1.name} ${query1.primaryTag}`;
	}
	
	var projectName = "Proj ::Blah";
	
	projectName = projectName.split(' ::');
	
	console.log(JSON.stringify(results1.length));
	
	var results1 = ofDoc.flattenedProjects.whose({
		name: {
			_contains: 'Proj'
		}
	});
	 
	// const task = of.InboxTask(query1);
	console.log(JSON.stringify(results1.length));
	//debugger
	//task.add([ofDoc.flattenedTags.byName('supermarket'), ofDoc.flattenedTags.byName('home')], task.tags);
	
	//task.tags.push(ofDoc.flattenedTags.byName('supermarket'));
	//task.tags.push(ofDoc.flattenedTags.byName('home'));
	 
	//ofDoc.tags.push(query1.primaryTag);

console.log(ofDoc.tags.length); 

 

	// console.log(JSON.parse(query));
	// ofDoc.inboxTasks.push(task);
	
	/* let todayTags = ofDoc.flattenedTags.whose({
		name: { _contains: 'jeff'}
	})
	*/
	//of.add(todayTags, {
	//	to: task.tags
	//})
	
	