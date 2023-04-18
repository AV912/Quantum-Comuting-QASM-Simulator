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
exports.Circuit = exports.CNotGate = exports.TGate = exports.SGate = exports.PauliZGate = exports.PauliYGate = exports.PauliXGate = exports.HadamardGate = exports.Gate = exports.Qubit = void 0;
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
    console.log("result " + result);
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
function applyGate(qubit, gate, control, index) {
    var qubitVector = qubit.getVector();
    var gateMatrix = gate.getMatrix();
    if (typeof control !== 'undefined' && typeof index !== 'undefined') {
        var result_1 = control.getVector();
        result_1 = KroneckerProduct(result_1, qubitVector);
        // console.log("kronecker " + result);
        result_1 = multiplyMatrices(gateMatrix, result_1);
        //console.log("multiply " + result);
        result_1 = selectQubit(result_1, 0);
        //console.log("select " + result);
        qubit.changeVector(result_1);
        return;
    }
    var result = multiplyMatrices(gateMatrix, qubitVector);
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
        var result = '(';
        for (var i = 0; i < this.vector.length; i++) {
            result += this.vector[i][0].toString() + (i === 0 ? ' |0>' : ' |1>');
            result += i === this.vector.length - 1 ? '' : ' + ';
        }
        result += ')';
        return result;
    };
    return Qubit;
}());
exports.Qubit = Qubit;
//create a lookup table for the gates
var Gate = /** @class */ (function () {
    function Gate(name, matrix) {
        this.name = name;
        this.matrix = matrix;
    }
    Gate.prototype.getMatrix = function () {
        return this.matrix;
    };
    Gate.prototype.isControlled = function () {
        return this.isCN;
    };
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
        this.qreg = [];
        this.creg = [];
        this.numShots = numShots;
    }
    Circuit.prototype.getQreg = function () {
        return this.qreg;
    };
    Circuit.prototype.printQreg = function () {
        for (var i = 0; i < this.qreg.length; i++) {
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
    Circuit.prototype.addQubit = function () {
        this.qreg.push(new Qubit());
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
    Circuit.prototype.addGate = function (gate, qubit, control) {
        applyGate(this.qreg[qubit], gate, this.qreg[control], qubit);
    };
    Circuit.prototype.measure = function (src_index, dest_index) {
        var qubitVector = this.qreg[src_index].getVector();
        var random = Math.random();
        var prob0 = qubitVector[0][0].mult(complexConjugate(qubitVector[0][0]));
        //let prob1 = qubitVector[1][0].mult(complexConjugate(qubitVector[1][0]));
        if (random < prob0.real) {
            this.creg[dest_index] = false;
        }
        else {
            this.creg[dest_index] = true;
        }
    };
    Circuit.prototype.reset = function () {
        this.qreg = [];
        this.creg = [];
    };
    Circuit.prototype.toString = function () {
        //print out each qubit in brackets with a comma in between using the qubit toString method and parentheses around each qubit
        var qubits = "[";
        for (var i = 0; i < this.qreg.length; i++) {
            qubits += this.qreg[i].toString();
            if (i != this.qreg.length - 1) {
                qubits += ", ";
            }
            qubits += "\n";
        }
        qubits += "]";
        // print out each classical bit as a binary number in little endian
        var classicalBits = "";
        for (var i = 0; i < this.creg.length; i++) {
            classicalBits += this.creg[i] ? "1" : "0";
        }
        return "Qubits:\n" + qubits + "\nClassical Bits: " + classicalBits;
    };
    Circuit.measurements = new Map();
    return Circuit;
}());
exports.default = { Circuit: Circuit, Qubit: Qubit, Gate: Gate, HadamardGate: HadamardGate, PauliXGate: PauliXGate, PauliYGate: PauliYGate, PauliZGate: PauliZGate, SGate: SGate, TGate: TGate, CNotGate: CNotGate, complex: complex_1.default, complexConjugate: complexConjugate, KroneckerProduct: KroneckerProduct, selectQubit: selectQubit };
