"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseString = exports.parse = void 0;
var parser_1 = require("./parser");
var lexer_1 = require("./lexer");
var fs = require("fs");
var promptSync = require("prompt-sync");
var circuit_1 = require("./circuit");
var circuit_2 = require("./circuit");
var ast_1 = require("./ast");
/**
 * Returns the abstract syntax tree for a given string of QASM code.
 * @param qasm - The code string.
 * @return The corresponding AST.
 */
function parseString(qasm) {
    var lexer = new lexer_1.default(qasm, 0);
    var tokens = lexer.lex();
    var parser = new parser_1.default(tokens);
    var ast = parser.parse();
    return ast;
}
exports.parseString = parseString;
/**
 * Returns the abstract syntax tree for a given QASM file.
 * @param file - The file location.
 * @return The corresponding AST.
 */
function parse(file) {
    return parseString(fs.readFileSync(file, 'utf8'));
}
exports.parse = parse;
// take in a file name and return the AST
function getAST(file) {
    return parse(file);
}
var prompt = promptSync();
//ask user for file name
var file = prompt("Enter file name: ");
var shots = prompt("Enter number of shots: ");
//get AST
var ast = getAST(file);
//print AST
console.log(ast);
var circuit = new circuit_1.Circuit(shots);
//recursively evaluate AST
function evaluate(ast) {
    for (var i = 0; i < ast.length; i++) {
        if (ast[i] instanceof (Array)) {
            evaluate(ast[i]);
        }
        if (ast[i] instanceof ast_1.QReg) {
            var real = ast[i];
            if (real.id == "q") {
                circuit.initializeQreg(real.size);
                circuit.addQName(real.id);
            }
            else if (real.id == "c") {
                for (var i_1 = 0; i_1 < real.size; i_1++) {
                    circuit.addClassicalBit();
                }
                circuit.addCName(real.id);
            }
            else {
                console.log("Error: Invalid register name");
            }
            //print circuit
            console.log(circuit);
        }
        else if (ast[i] instanceof ast_1.CReg) {
            var real = ast[i];
            if (real.id == "c") {
                for (var i_2 = 0; i_2 < real.size; i_2++) {
                    circuit.addClassicalBit();
                }
                circuit.addCName(real.id);
            }
            else {
                console.log("Error: Invalid register name");
            }
        }
        else if (ast[i] instanceof ast_1.Id) {
            var real = ast[i];
            console.log("ID: " + real.id);
        }
        else if (ast[i] instanceof ast_1.Barrier) {
            var real = ast[i];
            console.log("Barrier: " + real.register);
        }
        else if (ast[i] instanceof ast_1.Variable) {
            var real = ast[i];
            console.log("Variable: " + real.value);
        }
        else if (ast[i] instanceof ast_1.Measure) {
            var real = ast[i];
            console.log("Measure: ");
            circuit.measure(real.src_index, real.dest_index);
        }
        if (ast[i] instanceof ast_1.ApplyGate) {
            var real = ast[i];
            console.log("Applying gate: " + real.name);
            var validBits = [];
            // for (let i = 0; i < circuit.getNumQubits(); i++) {
            //     if(real.qubits[0][1] == i) {
            //          validBits.push(1);
            //     } else {
            //         validBits.push(0);
            //     }
            // }
            switch (real.name) {
                case "h":
                    //get qubit number from node
                    var gate = new circuit_2.HadamardGate();
                    //gate.initializeFullMatrix(circuit.getNumQubits(), validBits);
                    // console.log(gate.toString());
                    //print the current state of the circuit
                    console.log(circuit);
                    circuit.addGate(gate, real.qubits[0][1]);
                    //print the current state of the circuit
                    console.log(circuit);
                    break;
                case "x":
                    var gate2 = new circuit_2.PauliXGate();
                    //gate2.initializeFullMatrix(circuit.getNumQubits(), validBits);
                    circuit.addGate(gate2, real.qubits[0][1]);
                    break;
                case "y":
                    var gate3 = new circuit_2.PauliYGate();
                    //gate3.initializeFullMatrix(circuit.getNumQubits(), validBits);
                    circuit.addGate(gate3, real.qubits[0][1]);
                    break;
                case "z":
                    var gate4 = new circuit_2.PauliZGate();
                    //gate4.initializeFullMatrix(circuit.getNumQubits(), validBits);
                    circuit.addGate(gate4, real.qubits[0][1]);
                    break;
                case "s":
                    var gate5 = new circuit_2.SGate();
                    //gate5.initializeFullMatrix(circuit.getNumQubits(), validBits);
                    circuit.addGate(gate5, real.qubits[0][1]);
                    break;
                case "t":
                    var gate6 = new circuit_2.TGate();
                    //gate6.initializeFullMatrix(circuit.getNumQubits(), validBits);
                    circuit.addGate(gate6, real.qubits[0][1]);
                    break;
                case "sdg":
                    var gate8 = new circuit_2.SDaggerGate();
                    //gate8.initializeFullMatrix(circuit.getNumQubits(), validBits);
                    circuit.addGate(gate8, real.qubits[0][1]);
                    break;
                case "tdg":
                    var gate9 = new circuit_2.TDaggerGate();
                    //gate9.initializeFullMatrix(circuit.getNumQubits(), validBits);
                    circuit.addGate(gate9, real.qubits[0][1]);
                    break;
                case "cx":
                    var gate7 = new circuit_2.CNotGate();
                    gate7.initializeFullMatrix(circuit.getNumQubits(), validBits);
                    console.log(gate7.toString());
                    //print the current state of the circuit
                    console.log(circuit.toString());
                    //circuit.addGate(gate7);
                    //print the current state of the circuit
                    console.log(circuit.toString());
                    break;
                default:
                    break;
            }
        }
    }
}
evaluate(ast);
//run circuit
//get probabilities
var probs = circuit.getProbabilities();
console.log(probs);
for (var i = 0; i < circuit.getNumShots(); i++) {
    //get final state using probabilities and random number
    var sum = 0;
    var rand = Math.random();
    //console.log(probs);
    //console.log(rand);
    //pick a state based on the probabilities
    //create an array of the keys of the map
    var keys = Array.from(probs.keys());
    var state = "";
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        sum += probs.get(key).real;
        if (rand < sum) {
            state = key;
            break;
        }
    }
    //console.log("State " +  state);
    //then get the measurement of each qubit and using the map to the classical bits update the classical register and then create entry.
    //traverse the state string from right to left and get the measurement of each qubit
    //then update the classical register based on the measurementMap
    var measureMap = circuit.getMeasurementMap();
    //console.log(measureMap);
    var tobeMeasured = circuit.gettoBeMeasured();
    //console.log(tobeMeasured);
    var classicalRegister = circuit.getCreg();
    //console.log(classicalRegister);
    //iterate through tobeMeasured and get the measurement of each qubit
    for (var i_3 = 0; i_3 < tobeMeasured.length; i_3++) {
        if (tobeMeasured[i_3]) {
            //measurement is mapped to classical bit
            var measurement = state.charAt(state.length - 1 - i_3);
            //console.log("Measurement: " + measurement);
            //get the classical bit that the measurement is mapped to
            var classicalBit = measureMap.get(i_3);
            //console.log("Classical bit: " + classicalBit);
            //update the classical register
            if (measurement == "1") {
                classicalRegister[classicalBit] = true;
            }
        }
    }
    circuit.createEntry();
    circuit.reset();
}
//print results
console.log(circuit.getMeasurements());
/*
//evaluate(ast);
    //get final state using probabilities and random number
    let sum: complex = new complex(0, 0);
    let rand: complex = new complex(Math.random(), 0);
    console.log(probs);
    console.log(rand);
    let state = 0;
    for (let j = 0; j < probs.length; j++) {
        sum = sum.add(probs[j]);
        if (rand < sum) {
            state = j;
            break;
        }
    }
    //create state string from state number
    console.log(state);
    let stateString = state.toString(2);
    console.log(stateString);
    //
    //then get the measurement of each qubit and using the map to the classical bits update the classical register and then create entry.

    circuit.createEntry();
    circuit.reset();
    */
/*
for (let i = 0; i < circuit.getNumShots(); i++) {
    evaluate(ast);
    circuit.createEntry();
    circuit.reset();
}
*/ 
