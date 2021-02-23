#! /usr/bin/env node

const { spawn } = require("child_process");

const dirName = process.argv[2];
if (!dirName || dirName.match(/[<>:"\/\\|?*\x00-\x1F]/)) {
	return console.log(`
  Invalid command.
  Command: start-express-api name-of-app
`);
}

const repository = "https://github.com/quilltech57/start-express.git";

const createDirectory = (command, args, options = undefined) => {
	const spawned = spawn(command, args, options);

	return new Promise((resolve) => {
		spawnData(spawned);
		spawned.on("close", () => {
			resolve();
		});
	});
};

createDirectory("git", ["clone", repository, dirName])
	.then(() => {
		/* Remove .git folder */
		return createDirectory("rm", ["-rf", `${dirName}/.git`]);
	})
	.then(() => {
		console.log("###### Installing dependencies ... ######");
		return createDirectory("yarn", ["install"], {
			cwd: process.cwd() + "/" + dirName,
		});
	})
	.then(() => {
		console.log("Installation Complete!");
		console.log("");
		console.log("To get started: cd into ", dirName);
		console.log("");
	});

function spawnData(spawned) {
	spawned.stdout.on("data", (data) => {
		console.log(data.toString());
	});

	spawned.stderr.on("data", (data) => {
		console.error(data.toString());
	});
}
