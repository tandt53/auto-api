#! /usr/bin/env node
const { Command } = require("commander"); // add this line
const figlet = require("figlet");

const program = new Command();
console.log(figlet.textSync("API Testing"));

program
    .version("1.0.0")
    .description("An example CLI for managing a directory")
    .option("-l, --ls  [value]", "List directory contents")
    .option("-m, --mkdir <value>", "Create a directory")
    .option("-t, --touch <value>", "Create a file")
    .parse(process.argv);

const options = program.opts();
