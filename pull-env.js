import fetch from 'node-fetch';
import { outputFile } from 'fs-extra';

const fetchEnvs = async () => {
	let apiEndPt = 'https://tools.holdex.io/api/env/pull?project=holdex-venture-studio';

	let result = await fetch(apiEndPt, {
		method: 'GET',
		headers: {
			'x-holdex-authorization': 'Bearer XtKojAp1',
		},
	});

	return await result.json();
};

const updateEnvs = async () => {
	let data = await fetchEnvs();
	let envVars = data.data.env;
	let envContent = '';

	envContent +=
		Object.keys(envVars)
			.sort()
			.map((key) => `${key}="${escapeValue(envVars[key])}"`)
			.join('\n') + '\n';
	const filename = '.env';
	try {
		await outputFile(filename, envContent, 'utf8');
		console.log(`${filename} file updated successfully.`);
	} catch (error) {
		console.error('Error updating .env file:', error);
	}
};

const escapeValue = (value) =>
	value
		? value
				.replace(new RegExp('\\n', 'g'), '\\n') // combine newlines (unix) into one line
				.replace(new RegExp('\\r', 'g'), '\\r') // combine newlines (windows) into one line
		: '';

updateEnvs();
