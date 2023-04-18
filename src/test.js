"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var main_1 = require("./qasm-ts-master/src/main");
// take in a file name and return the AST
function getAST(file) {
    return (0, main_1.parse)(file);
}
//ask user for file name
var file = prompt("Enter file name: ");
//get AST
var ast = getAST(file);
//print AST
console.log(ast);
//recursively evaluate AST
function evaluate(ast) {
}
//evaluate AST
//evaluate(ast);
