#! /usr/bin/env node
const {Command} = require("commander"); // add this line
const figlet = require("figlet");

const program = new Command();
console.log(figlet.textSync("API Testing"));

program
    .version("1.0.0")
    .description("A CLI for automation API testing")
    .option("-l, --ls  [value]", "List options")
    .option("-i, --input <value>", "api test design (.yaml)")
    .option("-s, --spec <value>", "api spec (.yaml/.json)")
    .option("-o, --output <value>", "generate report (.html)")
    .parse(process.argv);

const options = program.opts();


if (options.ls) {
    console.log("List options");
}

if (options.input) {
    console.log("input: ", options.input);
}

if (options.spec) {
    console.log("spec: ", options.spec);
}

if (options.output) {
    console.log("output: ", options.output);
}
