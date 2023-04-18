"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Circuit = exports.CNotGate = exports.TDaggerGate = exports.SDaggerGate = exports.IdGate = exports.TGate = exports.SGate = exports.PauliZGate = exports.PauliYGate = exports.PauliXGate = exports.HadamardGate = exports.Gate = exports.Qubit = void 0;
var complex_1 = require("./complex");
function Create2DArray(rows, cols) {
    var f = new Array();
    for (var i = 0; i < rows; i++) {
        f[i] = new Array();
        for (var j = 0; j < cols; j++) {
            f[i][j] = 0;
        }
    }
    return f;
}
function multiplyMatrices(m1, m2) {
    if (m1[0].length !== m2.length) {
        throw new Error('Invalid matrix dimensions');
    }
    var result = Create2DArray(m1.length, m2[0].length);
    for (var i = 0; i < m1.length; i++) {
        for (var j = 0; j < m2[0].length; j++) {
            var sum = new complex_1.default(0, 0);
            for (var k = 0; k < m1[0].length; k++) {
                sum = sum.add(m1[i][k].mult(m2[k][j]));
            }
            result[i][j] = sum;
        }
    }
    //console.log("result " + result);
    return result;
}
function transposeMatrix(m) {
    var result = Create2DArray(m.length, m[0].length);
    for (var i = 0; i < m.length; i++) {
        for (var j = 0; j < m[0].length; j++) {
            result[i][j] = m[j][i];
        }
    }
    return result;
}
function conjugateTransposeMatrix(m) {
    var result = Create2DArray(m.length, m[0].length);
    for (var i = 0; i < m.length; i++) {
        for (var j = 0; j < m[0].length; j++) {
            result[i][j] = complexConjugate(m[j][i]);
        }
    }
    return result;
}
function applyGate(gate, qubit) {
    var matrix = gate.getMatrix();
    var vector = qubit.getVector();
    var result = multiplyMatrices(matrix, vector);
    qubit.changeVector(result);
}
var Qubit = /** @class */ (function () {
    function Qubit() {
        this.vector = [[new complex_1.default(1, 0)], [new complex_1.default(0, 0)]];
    }
    Qubit.prototype.getVector = function () {
        return this.vector;
    };
    Qubit.prototype.changeVector = function (vector) {
        this.vector = vector;
    };
    Qubit.prototype.toString = function () {
        //print each vector element and append it with a |0> or |1> depending on the value
        var result = '';
        for (var i = 0; i < this.vector.length; i++) {
            result += this.vector[i][0].toString() + ' |' + i.toString(2) + '>';
        }
        return result;
    };
    return Qubit;
}());
exports.Qubit = Qubit;
//create a lookup table for the gates
var Gate = /** @class */ (function () {
    //private isCN: boolean;
    function Gate(name, matrix) {
        this.name = name;
        this.matrix = matrix;
    }
    Gate.prototype.getMatrix = function () {
        return this.matrix;
    };
    Gate.prototype.setMatrix = function (matrix) {
        this.matrix = matrix;
    };
    Gate.prototype.initializeFullMatrix = function (numQubits, actingQubits) {
        //create a matrix of size 2^n x 2^n
        // this.numQubits = numQubits;
        // let size = Math.pow(2, numQubits);
        // let oldMatrix = this.matrix;
        // this.matrix = Create2DArray(size, size);
        // for (let i = 0; i < size; i++) {
        //     for (let j = 0; j < size; j++) {
        //         this.matrix[i][j] = new complex(0, 0);
        //     }
        // }
        // //fill in the diagonals with the 2x2 gate matrix
        // if(actingQubits[0] == 1){
        //     this.matrix[0][0] = oldMatrix[0][0];
        //     this.matrix[0][0 + 1] = oldMatrix[0][1];
        //     this.matrix[0 + 1][0] = oldMatrix[1][0];
        //     this.matrix[0 + 1][0 + 1] = oldMatrix[1][1];
        // } else {
        //     this.matrix[0][0] = new complex(1, 0);
        //     this.matrix[0][0 + 1] = new complex(0, 0);
        //     this.matrix[0 + 1][0] = new complex(0, 0);
        //     this.matrix[0 + 1][0 + 1] = new complex(1, 0);
        // }
        // for (let i = 1; i < numQubits; i++) {
        //     let start = Math.pow(2, i);
        //     if (actingQubits[i] == 1) {
        //         this.matrix[start][start] = oldMatrix[0][0];
        //         this.matrix[start][start + 1] = oldMatrix[0][1];
        //         this.matrix[start + 1][start] = oldMatrix[1][0];
        //         this.matrix[start + 1][start + 1] = oldMatrix[1][1];
        //     } else {
        //         this.matrix[start][start] = new complex(1, 0);
        //         this.matrix[start][start + 1] = new complex(0, 0);
        //         this.matrix[start + 1][start] = new complex(0, 0);
        //         this.matrix[start + 1][start + 1] = new complex(1, 0);
        //     }
        // }
        console.log(this.matrix);
    };
    // public isControlled(): boolean {
    //     return this.isCN;
    // }
    // public switchIsControlled(): void {
    //     this.isCN = !this.isCN;
    // }
    Gate.prototype.toString = function () {
        //print the gate matrix 
        var result = '';
        for (var i = 0; i < this.matrix.length; i++) {
            for (var j = 0; j < this.matrix[0].length; j++) {
                result += this.matrix[i][j].toString() + ' ';
            }
            result += ' |' + i + '>' + (i === this.matrix.length - 1 ? '' : ' + ');
        }
        return result;
    };
    return Gate;
}());
exports.Gate = Gate;
function complexConjugate(c) {
    return new complex_1.default(c.real, -c.img);
}
var HadamardGate = /** @class */ (function (_super) {
    __extends(HadamardGate, _super);
    function HadamardGate() {
        return _super.call(this, 'H', [[new complex_1.default(1 / Math.sqrt(2), 0), new complex_1.default(1 / Math.sqrt(2), 0)], [new complex_1.default(1 / Math.sqrt(2), 0), new complex_1.default(-1 / Math.sqrt(2), 0)]]) || this;
    }
    return HadamardGate;
}(Gate));
exports.HadamardGate = HadamardGate;
var PauliXGate = /** @class */ (function (_super) {
    __extends(PauliXGate, _super);
    function PauliXGate() {
        return _super.call(this, 'X', [[new complex_1.default(0, 0), new complex_1.default(1, 0)], [new complex_1.default(1, 0), new complex_1.default(0, 0)]]) || this;
    }
    return PauliXGate;
}(Gate));
exports.PauliXGate = PauliXGate;
var PauliYGate = /** @class */ (function (_super) {
    __extends(PauliYGate, _super);
    function PauliYGate() {
        return _super.call(this, 'Y', [[new complex_1.default(0, 0), new complex_1.default(0, -1)], [new complex_1.default(0, 1), new complex_1.default(0, 0)]]) || this;
    }
    return PauliYGate;
}(Gate));
exports.PauliYGate = PauliYGate;
var PauliZGate = /** @class */ (function (_super) {
    __extends(PauliZGate, _super);
    function PauliZGate() {
        return _super.call(this, 'Z', [[new complex_1.default(1, 0), new complex_1.default(0, 0)], [new complex_1.default(0, 0), new complex_1.default(-1, 0)]]) || this;
    }
    return PauliZGate;
}(Gate));
exports.PauliZGate = PauliZGate;
var SGate = /** @class */ (function (_super) {
    __extends(SGate, _super);
    function SGate() {
        return _super.call(this, 'S', [[new complex_1.default(1, 0), new complex_1.default(0, 0)], [new complex_1.default(0, 0), new complex_1.default(0, 1)]]) || this;
    }
    return SGate;
}(Gate));
exports.SGate = SGate;
var TGate = /** @class */ (function (_super) {
    __extends(TGate, _super);
    function TGate() {
        return _super.call(this, 'T', [[new complex_1.default(1, 0), new complex_1.default(0, 0)], [new complex_1.default(0, 0), new complex_1.default(0, Math.PI / 4).exp()]]) || this;
    }
    return TGate;
}(Gate));
exports.TGate = TGate;
var IdGate = /** @class */ (function (_super) {
    __extends(IdGate, _super);
    function IdGate() {
        return _super.call(this, 'I', [[new complex_1.default(1, 0), new complex_1.default(0, 0)], [new complex_1.default(0, 0), new complex_1.default(1, 0)]]) || this;
    }
    return IdGate;
}(Gate));
exports.IdGate = IdGate;
var SDaggerGate = /** @class */ (function (_super) {
    __extends(SDaggerGate, _super);
    function SDaggerGate() {
        return _super.call(this, 'S^', [[new complex_1.default(1, 0), new complex_1.default(0, 0)], [new complex_1.default(0, 0), new complex_1.default(0, -1)]]) || this;
    }
    return SDaggerGate;
}(Gate));
exports.SDaggerGate = SDaggerGate;
var TDaggerGate = /** @class */ (function (_super) {
    __extends(TDaggerGate, _super);
    function TDaggerGate() {
        return _super.call(this, 'T^', [[new complex_1.default(1, 0), new complex_1.default(0, 0)], [new complex_1.default(0, 0), new complex_1.default(0, -Math.PI / 4).exp()]]) || this;
    }
    return TDaggerGate;
}(Gate));
exports.TDaggerGate = TDaggerGate;
function KroneckerProduct(m1, m2) {
    var result = Create2DArray(m1.length * m2.length, m1[0].length * m2[0].length);
    for (var i = 0; i < m1.length; i++) {
        for (var j = 0; j < m1[0].length; j++) {
            for (var k = 0; k < m2.length; k++) {
                for (var l = 0; l < m2[0].length; l++) {
                    result[i * m2.length + k][j * m2[0].length + l] = m1[i][j].mult(m2[k][l]);
                }
            }
        }
    }
    return result;
}
function selectQubit(multiState, qubit) {
    var startIndex = qubit * 2;
    var result = Create2DArray(2, 1);
    result[0][0] = multiState[startIndex][0];
    result[1][0] = multiState[startIndex + 1][0];
    return result;
}
// figure out how to do this
var CNotGate = /** @class */ (function (_super) {
    __extends(CNotGate, _super);
    function CNotGate() {
        return _super.call(this, 'CNOT', [[new complex_1.default(1, 0), new complex_1.default(0, 0), new complex_1.default(0, 0), new complex_1.default(0, 0)], [new complex_1.default(0, 0), new complex_1.default(1, 0), new complex_1.default(0, 0), new complex_1.default(0, 0)], [new complex_1.default(0, 0), new complex_1.default(0, 0), new complex_1.default(0, 0), new complex_1.default(1, 0)], [new complex_1.default(0, 0), new complex_1.default(0, 0), new complex_1.default(1, 0), new complex_1.default(0, 0)]]) || this;
        //this.switchIsControlled();
    }
    return CNotGate;
}(Gate));
exports.CNotGate = CNotGate;
//create a lookup table for certain gates
// create recursive function to go through the tree
// add other functionality as needed
var Circuit = exports.Circuit = /** @class */ (function () {
    function Circuit(numShots) {
        this.qreg = null;
        this.creg = [];
        this.numShots = numShots;
    }
    Circuit.prototype.getNumQubits = function () {
        return this.numQubits;
    };
    Circuit.prototype.getQreg = function () {
        return this.qreg;
    };
    Circuit.prototype.printQreg = function () {
        for (var i = 0; i < this.qreg.getVector().length; i++) {
            console.log(this.qreg[i].getVector());
        }
    };
    Circuit.prototype.printCreg = function () {
        console.log(this.creg);
    };
    Circuit.prototype.getCreg = function () {
        return this.creg;
    };
    Circuit.prototype.getNumShots = function () {
        return this.numShots;
    };
    Circuit.prototype.getMeasurements = function () {
        return Circuit.measurements;
    };
    Circuit.prototype.getProbabilities = function () {
        return this.probabilities;
    };
    Circuit.prototype.gettoBeMeasured = function () {
        return this.toBeMeasured;
    };
    Circuit.prototype.getMeasurementMap = function () {
        return this.measurementMap;
    };
    Circuit.prototype.createEntry = function () {
        //create bit string in little endian
        var bits = '';
        for (var i = this.creg.length - 1; i >= 0; i--) {
            bits += this.creg[i] ? '1' : '0';
        }
        if (!Circuit.measurements.has(bits)) {
            Circuit.measurements.set(bits, 0);
        }
        var count = Circuit.measurements.get(bits);
        if (count != null) {
            Circuit.measurements.set(bits, count + 1);
        }
    };
    Circuit.prototype.initializeQreg = function (numBits) {
        this.numQubits = numBits;
        var qreg = Create2DArray(1 << numBits, 1);
        for (var i = 0; i < qreg.length; i++) {
            qreg[i][0] = new complex_1.default(0, 0);
        }
        qreg[0][0] = new complex_1.default(1, 0);
        this.qreg = new Qubit();
        this.qreg.changeVector(qreg);
        this.gates = [];
        for (var i = 0; i < this.numQubits; i++) {
            this.gates.push(null);
        }
    };
    Circuit.prototype.addQName = function (name) {
        this.qName = name;
    };
    Circuit.prototype.addClassicalBit = function () {
        this.creg.push(false);
    };
    Circuit.prototype.addCName = function (name) {
        this.cName = name;
    };
    Circuit.prototype.addGate = function (gate, qubit) {
        if (this.gates[qubit] != null) {
            //new set of gates
            //need tensor product of all the gates for this wave of gates
            //then multiply the qreg by the tensor product
            //then add the new gate to the list of gates
            var finalGate = null;
            for (var i = 0; i < this.gates.length; i++) {
                var gateToAdd = null;
                if (this.gates[i] == null) {
                    gateToAdd = new IdGate();
                }
                else {
                    gateToAdd = this.gates[i];
                }
                if (finalGate == null) {
                    finalGate = gateToAdd;
                }
                else {
                    var matrix = KroneckerProduct(finalGate.getMatrix(), gateToAdd);
                    finalGate.setMatrix(matrix);
                }
            }
            console.log("Final Gate " + finalGate.getMatrix());
            //multiply the qreg by the final gate
            applyGate(finalGate, this.qreg);
            //reset the gates
            this.gates = [];
            for (var i = 0; i < this.numQubits; i++) {
                this.gates.push(null);
            }
            this.gates[qubit] = gate;
        }
        else {
            this.gates[qubit] = gate;
        }
    };
    Circuit.prototype.measure = function (src_index, dest_index) {
        //if not called before, create the final state
        if (!this.calledMeasure) {
            //if gates are still in use, need to apply them
            if (this.gates != null) {
                var finalGate = null;
                for (var i = 0; i < this.gates.length; i++) {
                    var gateToAdd = null;
                    if (this.gates[i] == null) {
                        gateToAdd = new IdGate();
                    }
                    else {
                        gateToAdd = this.gates[i];
                    }
                    if (finalGate == null) {
                        finalGate = gateToAdd;
                    }
                    else {
                        var matrix = KroneckerProduct(finalGate.getMatrix(), gateToAdd.getMatrix());
                        finalGate.setMatrix(matrix);
                    }
                }
                applyGate(finalGate, this.qreg);
            }
            //create a tensor product vector to represent the state of all the qubits in the register
            //select the qubit we want to measure
            this.finalState = this.qreg;
            console.log("Final State " + this.finalState.getVector());
            this.toBeMeasured = [];
            for (var i = 0; i < this.qreg.getVector().length; i++) {
                this.toBeMeasured.push(false);
            }
            this.measurementMap = new Map();
            //calculate the probability of each state and store it in the  array
            this.probabilities = new Map();
            for (var i = 0; i < this.finalState.getVector().length; i++) {
                var possibleString = i.toString(2);
                //pad the string with 0s
                while (possibleString.length < this.finalState.getVector().length) {
                    possibleString = '0' + possibleString;
                }
                this.probabilities.set(possibleString, this.finalState.getVector()[i][0].mult(complexConjugate(this.finalState.getVector()[i][0])));
            }
            this.calledMeasure = true;
        }
        //fill in tobeMeasured array with qubits that need to be measured
        this.toBeMeasured[src_index] = true;
        //map the qubit to the classical bit
        this.measurementMap.set(src_index, dest_index);
    };
    Circuit.prototype.reset = function () {
        this.initializeQreg(this.qreg.getVector().length);
        for (var i = 0; i < this.creg.length; i++) {
            this.creg[i] = false;
        }
    };
    Circuit.prototype.toString = function () {
        //print out each qubit in brackets with a comma in between using the qubit toString method and parentheses around each qubit
        var qregString = this.qreg.getVector().toString();
        //print out each classical bit in brackets with a comma in between
        var cregString = '';
        for (var i = 0; i < this.creg.length; i++) {
            cregString += this.creg[i] + ', ';
        }
        cregString = '(' + cregString + ')';
        return 'Qreg: ' + qregString + ' Creg: ' + cregString;
    };
    Circuit.measurements = new Map();
    return Circuit;
}());
exports.default = { Circuit: Circuit, Qubit: Qubit, Gate: Gate, HadamardGate: HadamardGate, PauliXGate: PauliXGate, PauliYGate: PauliYGate, PauliZGate: PauliZGate, SGate: SGate, TGate: TGate, CNotGate: CNotGate, complex: complex_1.default, complexConjugate: complexConjugate, KroneckerProduct: KroneckerProduct, selectQubit: selectQubit };
