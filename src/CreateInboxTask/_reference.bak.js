/* eslint-disable */
// Usage: todo lots of notes #tag ::project @time

// https://www.alfredapp.com/help/workflows/inputs/script-filter/json/

const tagDelimiter = ' #';
const projectDelimiter = ' ::';
const dateTimeDelimiter = ' @';

const regex = new RegExp(`${tagDelimiter}|${projectDelimiter}|${dateTimeDelimiter}`);

const of = Application('OmniFocus');

/**
 * @typedef OFTask
 * @type { object }
 * @property {string} name - the name of the task
 * @property {string} [primaryTag] - the tag to set
 * @property {Date} [dueDate] - the date this task is due
 * @property {string} arg - the string to passthru to next Alfred task
 */

/**
 * Displays hints back to Alfred, so that it shows in the second line
 * 
 * @param obj {OFTask}
 * @returns 
 */
const displayAlfredHints = (obj) => {
	let hints = '';

	if (obj?.name) {
		hints = `Text: ${obj.name}`;
	}

	const ret = {
		items: [{
			title: 'New Task OmniFocus',
			subtitle: hints,
			// arg: JSON.stringify(obj)
            arg: obj.arg
		}, {
			title: 'New Task in OmniFocus Reference',
			subtitle: 'todo <text> @time ::project #tag'
		}]
	};

	return ret;
};

/**
 * 
 * @param inputStr {string} - the original input string
 */
const parseResults = (inputStr) => {
    const outputStr = [];
	const results = inputStr.split(regex);

    /**
     * @type OFTask
     */
    const payload = {
        name: 'missing name',
        arg: ''
    };

    results.forEach(str => {
        const index = inputStr.lastIndexOf(str);
        const prefixChar = inputStr.charAt(index - 1);
        console.log('prefixChar:', prefixChar);

        switch(prefixChar) {
            case '@':
                // payload.dueDate = new Date();
                // TODO: import 'SugarDate' library
                // TODO: do a lot of date parsing here

                outputStr.push(`#${str}`);
                break;
            case '#':
                // TODO: parse for the existence.  If it doesn't exist, append it back to text with #
                // let todayTags = ofDoc.flattenedTags.whose({
                //     _or: [
                //         { name: { _contains: 'home'}},
                //         { name: { _contains: 'supermarket'}}
                //     ]
                // })()

                // TODO: if tags do exist, add it to an array
                // in follow up script, need to query all in the array
                // of.add(todayTags, {
                //     to: task.tags
                // })

                // TODO: (SUPER nice to have) allow single colons to separate nested depth
                payload.primaryTag = str;

                outputStr.push(`@${str}`);
                break;
            case '::':
                // TODO: do project assignment
                outputStr.push(`::${str}`);
                break;

            default:
                payload.name = str;
                outputStr.push(str);
        }
    });

    payload.arg = outputStr.join(' ');

    // return outputStr.join(' ');

    return payload;
};

/**
 * Main entry point
 * 
 * @param argv {String[]} - input string array that Alfred sends in from cmd+space
 * @returns 
 */
function run(argv) {

	//console.log(argv);
	// argv.forEach((x, index) => {
		//console.log(`${index} ${x}`);
	// })
	console.log(`length: ${argv.length}`);
	if (argv.length > 0) {
		

		// TODO: check if it's running

        const ofTaskInput = parseResults(argv[0]);

		const ofDoc = of.defaultDocument;
		task = of.InboxTask({
			// name: 'title',
			note: 'test',
			// dueDate: 'tomorrow'
		});

		// ofDoc.inboxTasks.push(task);

		const blah = {"items": [{
		"valid": false,
		"uid": "alfredapp",
		"title": "Alfred Website",
		"subtitle": "https://www.alfredapp.com/",
		"arg": "alfredapp.com",
		"autocomplete": "Alfred Website",
		"quicklookurl": "https://www.alfredapp.com/",
		"mods": {
			"alt": {
				"valid": true,
				"arg": "alfredapp.com/powerpack",
				"subtitle": "https://www.alfredapp.com/powerpack/"
			},
			"cmd": {
				"valid": true,
				"arg": "alfredapp.com/powerpack/buy/",
				"subtitle": "https://www.alfredapp.com/powerpack/buy/"
			},
		},
		"text": {
			"copy": "https://www.alfredapp.com/ (text here to copy)",
			"largetype": "https://www.alfredapp.com/ (text here for large type)"
		}
	}
]};


		//console.log(JSON.stringify(blah));
		return JSON.stringify(displayAlfredHints(ofTaskInput));
	} else {
		// TODO: auto suggestion
//return JSON.stringify(results, null, 2);
	}

}