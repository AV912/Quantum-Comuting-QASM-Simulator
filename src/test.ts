import { AstNode } from './ast';
import {parse, parseString} from './main';

// take in a file name and return the AST
function getAST(file) {
    return parse(file);
}

//ask user for file name
var file = prompt("Enter file name: ");

//get AST
var ast = getAST(file);

//print AST
console.log(ast);

//recursively evaluate AST
function evaluate(ast: AstNode[]) {
    for(let i = 0; i < ast.length; i++) {
       
    }
}

//evaluate AST
//evaluate(ast);

