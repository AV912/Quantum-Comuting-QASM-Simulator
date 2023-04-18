import complex from './complex';

function Create2DArray(rows, cols) {
    let f = new Array();

    for (let i = 0; i < rows; i++) {
        f[i] = new Array();
        for (let j = 0; j < cols; j++) {
            f[i][j] = 0;
        }
    }
    return f;
  }


function multiplyMatrices(m1: complex[][], m2: complex[][]): complex[][] {
    if (m1[0].length !== m2.length) {
        throw new Error('Invalid matrix dimensions');
    }

    let result: complex[][] = Create2DArray(m1.length, m2[0].length);
    
    for (let i = 0; i < m1.length; i++) {
        for (let j = 0; j < m2[0].length; j++) {
            let sum = new complex(0, 0);
            for (let k = 0; k < m1[0].length; k++) {
                sum = sum.add(m1[i][k].mult(m2[k][j]));
            }
            result[i][j] = sum;
        }
    }
    //console.log("result " + result);
    return result;
}

function transposeMatrix(m: complex[][]): complex[][] {
    let result: complex[][] = Create2DArray(m.length, m[0].length);
    for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m[0].length; j++) {
            result[i][j] = m[j][i];
        }
    }
    return result;
}

function conjugateTransposeMatrix(m: complex[][]): complex[][] {
    let result: complex[][] = Create2DArray(m.length, m[0].length);
    for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m[0].length; j++) {
            result[i][j] = complexConjugate(m[j][i]);
        }
    }
    return result;
}

function applyGate(gate: Gate, qubit: Qubit): void {
    let matrix = gate.getMatrix();
    let vector = qubit.getVector();
    let result = multiplyMatrices(matrix, vector);
    qubit.changeVector(result);
}


export class Qubit {
    private vector: complex[][];

    constructor() {
        this.vector = [[new complex(1, 0)], [new complex(0, 0)]];
    }

    public getVector(): complex[][] {
        return this.vector;
    }


    public changeVector(vector: complex[][]): void {
        this.vector = vector;
    }

    public toString(): string {
        //print each vector element and append it with a |0> or |1> depending on the value
        let result = '';
        for (let i = 0; i < this.vector.length; i++) {
            result += this.vector[i][0].toString() + ' |' + i.toString(2) + '>';
        }
        return result;

    }


}

//create a lookup table for the gates
export class Gate {
    private matrix: complex[][];
    private name: string;
    private numQubits: number;
    //private isCN: boolean;

    constructor(name: string, matrix: complex[][]) {
        this.name = name;
        this.matrix = matrix;
    }

    public getMatrix(): complex[][] {
        return this.matrix;
    }

    public setMatrix(matrix: complex[][]): void {
        this.matrix = matrix;
    }

    public initializeFullMatrix(numQubits: number, actingQubits: number[]): void {
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
    }

    // public isControlled(): boolean {
    //     return this.isCN;
    // }

    // public switchIsControlled(): void {
    //     this.isCN = !this.isCN;
    // }

    public toString(): string {
        //print the gate matrix 
        let result = '';
        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix[0].length; j++) {
                result += this.matrix[i][j].toString() + ' ';
            }
            result += ' |' + i + '>' + (i === this.matrix.length - 1 ? '' : ' + '); 
        }
        return result;
    }
       
}

function complexConjugate(c: complex): complex {
    return new complex(c.real, -c.img);
}


export class HadamardGate extends Gate {
    constructor() {
        super('H', [[new complex(1 / Math.sqrt(2), 0), new complex(1 / Math.sqrt(2), 0)], [new complex(1 / Math.sqrt(2), 0), new complex(-1 / Math.sqrt(2), 0)]]);
    }
}

export class PauliXGate extends Gate {
    constructor() {
        super('X', [[new complex(0, 0), new complex(1, 0)], [new complex(1, 0), new complex(0, 0)]]);
    }
}

export class PauliYGate extends Gate {
    constructor() {
        super('Y', [[new complex(0, 0), new complex(0, -1)], [new complex(0, 1), new complex(0, 0)]]);
    }
}

export class PauliZGate extends Gate {
    constructor() {
        super('Z', [[new complex(1, 0), new complex(0, 0)], [new complex(0, 0), new complex(-1, 0)]]);
    }
}

export class SGate extends Gate {
    constructor() {
        super('S', [[new complex(1, 0), new complex(0, 0)], [new complex(0, 0), new complex(0, 1)]]);
    }
}

export class TGate extends Gate {
    constructor() {
        super('T', [[new complex(1, 0), new complex(0, 0)], [new complex(0,0), new complex(0,Math.PI/4).exp()]]);
    }
}

export class IdGate extends Gate {
    constructor() {
        super('I', [[new complex(1, 0), new complex(0, 0)], [new complex(0, 0), new complex(1, 0)]]);
    }
}

export class SDaggerGate extends Gate {
    constructor() {
        super('S^', [[new complex(1, 0), new complex(0, 0)], [new complex(0, 0), new complex(0, -1)]]);
    }
}

export class TDaggerGate extends Gate {
    constructor() {
        super('T^', [[new complex(1, 0), new complex(0, 0)], [new complex(0, 0), new complex(0, -Math.PI/4).exp()]]);
    }
}

function KroneckerProduct(m1: complex[][], m2: complex[][]): complex[][] {
    let result: complex[][] = Create2DArray(m1.length * m2.length, m1[0].length * m2[0].length);
    for (let i = 0; i < m1.length; i++) {
        for (let j = 0; j < m1[0].length; j++) {
            for (let k = 0; k < m2.length; k++) {
                for (let l = 0; l < m2[0].length; l++) {
                    result[i * m2.length + k][j * m2[0].length + l] = m1[i][j].mult(m2[k][l]);
                }
            }
        }
    }

    return result;
}

function selectQubit(multiState: complex[][], qubit: number): complex[][] {
    let startIndex = qubit * 2;
    let result: complex[][] = Create2DArray(2, 1);
    result[0][0] = multiState[startIndex][0];
    result[1][0] = multiState[startIndex + 1][0];
    return result;
}
// figure out how to do this
export class CNotGate extends Gate {
    constructor() {
        super('CNOT', [[new complex(1, 0), new complex(0, 0), new complex(0, 0), new complex(0, 0)], [new complex(0, 0), new complex(1, 0), new complex(0, 0), new complex(0, 0)], [new complex(0, 0), new complex(0, 0), new complex(0, 0), new complex(1, 0)], [new complex(0, 0), new complex(0, 0), new complex(1, 0), new complex(0, 0)]]);
        //this.switchIsControlled();
    }
    
}





//create a lookup table for certain gates
// create recursive function to go through the tree
// add other functionality as needed



export class Circuit {
    private qreg: Qubit;
    private qName: string;
    private creg: boolean[];
    private cName: string;
    private gates: Gate[];
    //private gatesInUse: Gate[];
    private numQubits: number;
    private finalState: Qubit;
    private toBeMeasured: boolean[];
    private measurementMap: Map<number, number>;
    private probabilities: Map<string, complex>;
    private static measurements: Map<String, number> = new Map<String, number>();
    private numShots: number;
    private calledMeasure: boolean;




    constructor(numShots: number) {
        this.qreg = null;
        this.creg = [];
        this.numShots = numShots;
    }

    public getNumQubits(): number {
        return this.numQubits;
    }

    public getQreg(): Qubit {
        return this.qreg;
    }

    public printQreg(): void {
        for (let i = 0; i < this.qreg.getVector().length; i++) {
            console.log(this.qreg[i].getVector());
        }
    }

    public printCreg(): void {
        console.log(this.creg);
    }

    public getCreg(): boolean[] {
        return this.creg;
    }

    public getNumShots(): number {
        return this.numShots;
    }

    public getMeasurements(): Map<String, number> {
        return Circuit.measurements;
    }

    public getProbabilities(): Map<string, complex> {
        return this.probabilities;
    }

    public gettoBeMeasured(): boolean[] {
        return this.toBeMeasured;
    }

    public getMeasurementMap(): Map<number, number> {
        return this.measurementMap;
    }

    public createEntry(): void {
        //create bit string in little endian
        let bits = '';
        for (let i = this.creg.length - 1; i >= 0; i--) {
            bits += this.creg[i] ? '1' : '0';
        }
        if (!Circuit.measurements.has(bits)) {
            Circuit.measurements.set(bits, 0);
        }
        let count = Circuit.measurements.get(bits);
        if (count != null) {
            Circuit.measurements.set(bits, count + 1);
        }

    }

    public initializeQreg(numBits: number): void {
        this.numQubits = numBits;
        let qreg: complex[][] = Create2DArray(1 << numBits, 1);
        for (let i = 0; i < qreg.length; i++) {
            qreg[i][0] = new complex(0, 0);
        }
        qreg[0][0] = new complex(1, 0);
        this.qreg = new Qubit();
        this.qreg.changeVector(qreg);
        this.gates = [];
        for (let i = 0; i < this.numQubits; i++) {
            this.gates.push(null);
        }


    }

    public addQName(name: string): void {
        this.qName = name;
    }

    public addClassicalBit(): void {
        this.creg.push(false);
    }


    public addCName(name: string): void {
        this.cName = name;
    }

    public addGate(gate: Gate, qubit: number): void {
        if (this.gates[qubit] != null) {
            //new set of gates
            //need tensor product of all the gates for this wave of gates
            //then multiply the qreg by the tensor product
            //then add the new gate to the list of gates
            let finalGate: Gate = null;
            for (let i = 0; i < this.gates.length; i++) {
                let gateToAdd = null;
                if (this.gates[i] == null) {
                    gateToAdd = new IdGate();
                } else {
                    gateToAdd = this.gates[i];
                    
                }
                if (finalGate == null) {
                    finalGate = gateToAdd;
                } else {
                    let matrix : complex[][] = KroneckerProduct(finalGate.getMatrix(), gateToAdd);
                    finalGate.setMatrix(matrix);
                }
            }

            console.log("Final Gate " + finalGate.getMatrix());
            //multiply the qreg by the final gate
            applyGate(finalGate, this.qreg);
            //reset the gates
            this.gates = [];
            for (let i = 0; i < this.numQubits; i++) {
                this.gates.push(null);
            }
            this.gates[qubit] = gate;
        } else {
            this.gates[qubit] = gate;
        }
    }

    public measure(src_index: number, dest_index: number): void {
        //if not called before, create the final state
        if (!this.calledMeasure) {
            //if gates are still in use, need to apply them
            if (this.gates != null) {
                let finalGate: Gate = null;
                for (let i = 0; i < this.gates.length; i++) {
                    let gateToAdd = null;
                    if (this.gates[i] == null) {
                        gateToAdd = new IdGate();
                    } else {
                        gateToAdd = this.gates[i];
                    }
                    if (finalGate == null) {
                        finalGate = gateToAdd;
                    } else {
                        let matrix : complex[][] = KroneckerProduct(finalGate.getMatrix(), gateToAdd.getMatrix());
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
            for (let i = 0; i < this.qreg.getVector().length; i++) {
                this.toBeMeasured.push(false);
            }

            this.measurementMap = new Map<number, number>();
            
            //calculate the probability of each state and store it in the  array
            this.probabilities = new Map<string, complex>();
            for (let i = 0; i < this.finalState.getVector().length; i++) {
                let possibleString = i.toString(2);
                //pad the string with 0s
                while (possibleString.length < this.finalState.getVector().length) {
                    possibleString = '0' + possibleString;
                }
                this.probabilities.set(possibleString,this.finalState.getVector()[i][0].mult(complexConjugate(this.finalState.getVector()[i][0])));
            }
            this.calledMeasure = true;
        }
        //fill in tobeMeasured array with qubits that need to be measured
        this.toBeMeasured[src_index] = true;
        //map the qubit to the classical bit
        this.measurementMap.set(src_index, dest_index);
        
    }


    public reset(): void {
        this.initializeQreg(this.qreg.getVector().length);
        for (let i = 0; i < this.creg.length; i++) {
            this.creg[i] = false;
        }
    }

    public toString(): string {
        //print out each qubit in brackets with a comma in between using the qubit toString method and parentheses around each qubit
        let qregString = this.qreg.getVector().toString();
        
        //print out each classical bit in brackets with a comma in between
        let cregString = '';
        for (let i = 0; i < this.creg.length; i++) {
            cregString += this.creg[i] + ', ';
        }
        cregString = '(' + cregString + ')';
        return 'Qreg: ' + qregString + ' Creg: ' + cregString;

    
    }


}

export default { Circuit, Qubit, Gate, HadamardGate, PauliXGate, PauliYGate, PauliZGate, SGate, TGate, CNotGate, complex, complexConjugate, KroneckerProduct, selectQubit};


