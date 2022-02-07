// @ts-check
// Usage: todo lots of notes #tag ::project @time

// https://www.alfredapp.com/help/workflows/inputs/script-filter/json/


const tagDelimiter = ' #';
const projectDelimiter = ' ::';
const dateTimeDelimiter = ' @';

const regex = new RegExp(`${tagDelimiter}|${projectDelimiter}|${dateTimeDelimiter}`);

//@ts-ignore - Application is OS specific
const of = Application('OmniFocus');

/**
 * @typedef OFTask
 * @type { object }
 * @property {string} name - the name of the task
 * @property {string} arg - the string to passthru to next Alfred task
 * @property {string[]} tagNames - array of tag names to include
 * @property {Date} [dueDate] - the date this task is due
 * @property {string} [primaryTag] - the tag to set
 */

/**
 * Displays hints back to Alfred, so that it shows in the second line
 * 
 * @param obj {OFTask}
 */
const displayAlfredHints = (obj) => {
	let hints = '';

	if (obj) {
        if (obj.name) {
            hints = `${obj.name}`;
        }

        if (obj.tagNames.length > 0) {
            const ofDoc = of.defaultDocument;

            obj.tagNames.every((tagName) => {
                const result = ofDoc.flattenedTags.whose({
                    name: {
                        _contains: tagName
                    }
                });

                if (result.length > 0) {
                    return true;
                }

                hints = `Warning: no ${tagName} tag found!`;
                return false;
            });

            // TODO: scan project names and warn if they don't exist
        }
		
	}

	const ret = {
		items: [{
			title: 'New OmniFocus Task',
			subtitle: hints,
            arg: obj.arg
		}, {
			title: 'General Tip',
			subtitle: 'todo <text> @dueDate ::project #tag'
		}, {
			title: 'Advanced Tip',
			subtitle: 'todo <text> @deferDate @dueDate ::project #tag1 #tag2'
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
        arg: '',
        tagNames: []
    };

    results.forEach(str => {
        const index = inputStr.lastIndexOf(str);
        const prefixChar = inputStr.charAt(index - 1);
        console.log('prefixChar:', prefixChar);

        switch(prefixChar) {
            case '@':
                outputStr.push(`#${str}`);
                break;

            case '#':
                if (str) {
                    outputStr.push(`@${str.trim()}`);
                    payload.tagNames.push(str.trim());
                }
                break;
            case '::':
                // TODO: do project assignment
                outputStr.push(`::${str}`);
                break;

            default:
                payload.name = (payload.name) == 'missing name'
                    ? str 
                    : `${payload.name} ${str}`;
                outputStr.push(str);
        }
    });

    if (outputStr.length > 0) {
        payload.arg = outputStr.join(' ');
    }

    return payload;
};

/**
 * Main entry point
 * 
 * @param argv {String[]} - input string array that Alfred sends in from cmd+space
 * @returns 
 */
function run(argv) {
	if (argv.length > 0) {

        const ofTaskInput = parseResults(argv[0]);

        // returning a string here writes to stdout to Alfred for passing to other connected tasks
		return JSON.stringify(displayAlfredHints(ofTaskInput));
	}

    // not explicitly returning lets Alfred know to keep the spotlight bar open
}