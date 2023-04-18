import Parser from './parser';
import Lexer from './lexer';
import * as fs from "fs";
import * as promptSync from "prompt-sync";
import {Circuit} from "./circuit";
import {Qubit} from "./circuit";
import complex from "./complex";
import {HadamardGate, PauliXGate, PauliYGate, PauliZGate, SGate, TGate, CNotGate, SDaggerGate, TDaggerGate} from "./circuit";
import {AstNode, QReg, CReg, Id, Barrier, Variable, Measure, Gate, ApplyGate} from "./ast";

/**
 * Returns the abstract syntax tree for a given string of QASM code.
 * @param qasm - The code string.
 * @return The corresponding AST.
 */
 function parseString(qasm:string) {
    const lexer = new Lexer(qasm, 0);
    const tokens = lexer.lex();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    return ast; 
}

/**
 * Returns the abstract syntax tree for a given QASM file.
 * @param file - The file location.
 * @return The corresponding AST.
 */
function parse(file:string) {
    return parseString(fs.readFileSync(file, 'utf8'));
}

export {parse , parseString}

// take in a file name and return the AST
function getAST(file) {
    return parse(file);
}

const prompt = promptSync();
//ask user for file name
var file = prompt("Enter file name: ");
const shots = prompt("Enter number of shots: ");

//get AST
var ast = getAST(file);

//print AST
console.log(ast);

var circuit : Circuit = new Circuit(shots);

//recursively evaluate AST
function evaluate(ast: AstNode[]) {
    for(let i = 0; i < ast.length; i++) {
        if(ast[i] instanceof Array<AstNode>) {
            evaluate(ast[i] as AstNode[]);
        }
            if(ast[i] instanceof QReg) {
                let real = ast[i] as QReg;
                if (real.id == "q") {
                    circuit.initializeQreg(real.size);
                    circuit.addQName(real.id);
                } else if (real.id == "c") {
                    for (let i = 0; i < real.size; i++) {
                        circuit.addClassicalBit();
                    }
                    circuit.addCName(real.id);
                } else {
                    console.log("Error: Invalid register name");
                }
                //print circuit
                console.log(circuit);
                
            } else if(ast[i] instanceof CReg) {
                let real = ast[i] as CReg;
                if (real.id == "c") {
                    for (let i = 0; i < real.size; i++) {
                        circuit.addClassicalBit();
                    }
                    circuit.addCName(real.id);
                } else {
                    console.log("Error: Invalid register name");
                }
            } else if(ast[i] instanceof Id) {
                let real = ast[i] as Id;
                console.log("ID: " + real.id);
            } else if(ast[i] instanceof Barrier) {
                let real = ast[i] as Barrier;
                console.log("Barrier: " + real.register);
            } else if(ast[i] instanceof Variable) {
                let real = ast[i] as Variable;
                console.log("Variable: " + real.value);
            } else if(ast[i] instanceof Measure) {
                let real = ast[i] as Measure;
                console.log("Measure: ");
                circuit.measure(real.src_index, real.dest_index);
            }


            
            if(ast[i]instanceof ApplyGate){
                let real = ast[i] as ApplyGate;
                console.log("Applying gate: " + real.name);
                let validBits: number[] = [];
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
                        let gate = new HadamardGate();
                        
                        //gate.initializeFullMatrix(circuit.getNumQubits(), validBits);
                       // console.log(gate.toString());
                        //print the current state of the circuit
                        console.log(circuit);
                        circuit.addGate(gate, real.qubits[0][1]);
                        //print the current state of the circuit
                        console.log(circuit);
                        
                        break;
                    case "x":
                        let gate2 = new PauliXGate();
                        //gate2.initializeFullMatrix(circuit.getNumQubits(), validBits);
                        circuit.addGate(gate2, real.qubits[0][1]);
                        break;
                    case "y":
                        let gate3 = new PauliYGate();
                        //gate3.initializeFullMatrix(circuit.getNumQubits(), validBits);
                        circuit.addGate(gate3, real.qubits[0][1]);
                        break;
                    case "z":
                        let gate4 = new PauliZGate();
                        //gate4.initializeFullMatrix(circuit.getNumQubits(), validBits);
                        circuit.addGate(gate4, real.qubits[0][1]);
                        break;
                    case "s":
                        let gate5 = new SGate();
                        //gate5.initializeFullMatrix(circuit.getNumQubits(), validBits);
                        circuit.addGate(gate5, real.qubits[0][1]);
                        break;
                    case "t":
                        let gate6 = new TGate();
                        //gate6.initializeFullMatrix(circuit.getNumQubits(), validBits);
                        circuit.addGate(gate6, real.qubits[0][1]);
                        break;
                    case "sdg":
                        let gate8 = new SDaggerGate();
                        //gate8.initializeFullMatrix(circuit.getNumQubits(), validBits);
                        circuit.addGate(gate8, real.qubits[0][1]);
                        break;
                    case "tdg":
                        let gate9 = new TDaggerGate();
                        //gate9.initializeFullMatrix(circuit.getNumQubits(), validBits);
                        circuit.addGate(gate9, real.qubits[0][1]);
                        break;
                    case "cx":
                        let gate7 = new CNotGate();
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
let probs: Map<string, complex> = circuit.getProbabilities();
console.log(probs);
for (let i = 0; i < circuit.getNumShots(); i++) {
    //get final state using probabilities and random number
    let sum: number = 0
    let rand: number = Math.random();
    //console.log(probs);
    //console.log(rand);
    
    //pick a state based on the probabilities
    //create an array of the keys of the map
    let keys = Array.from(probs.keys());
    let state = "";
    for (let key of keys) {
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
    let measureMap = circuit.getMeasurementMap();
    //console.log(measureMap);
    let tobeMeasured = circuit.gettoBeMeasured();
    //console.log(tobeMeasured);
    let classicalRegister = circuit.getCreg();
    //console.log(classicalRegister);
    //iterate through tobeMeasured and get the measurement of each qubit
    for (let i = 0; i < tobeMeasured.length; i++) {
        if (tobeMeasured[i]) {
            //measurement is mapped to classical bit
            let measurement = state.charAt(state.length - 1 - i);
            //console.log("Measurement: " + measurement);
            //get the classical bit that the measurement is mapped to
            let classicalBit = measureMap.get(i);
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