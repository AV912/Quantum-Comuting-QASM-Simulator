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
    console.log("result " + result);
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

function applyGate(qubit: Qubit, gate: Gate, control?: Qubit, index?: number): void {
    let qubitVector = qubit.getVector();
    let gateMatrix = gate.getMatrix();
    if (typeof control !== 'undefined' && typeof index !== 'undefined') {
        let result = control.getVector();
        result = KroneckerProduct(result, qubitVector);
       // console.log("kronecker " + result);
        result = multiplyMatrices(gateMatrix, result);
        //console.log("multiply " + result);
        result = selectQubit(result, 0);
        //console.log("select " + result);
        qubit.changeVector(result);
        return;
    }
    let result = multiplyMatrices(gateMatrix, qubitVector);
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
        let result = '(';
        for (let i = 0; i < this.vector.length; i++) {
            result += this.vector[i][0].toString() + (i === 0 ? ' |0>' : ' |1>');
            result += i === this.vector.length - 1 ? '' : ' + ';
        }
        result += ')';
        return result;

    }


}

//create a lookup table for the gates
export class Gate {
    private matrix: complex[][];
    private name: string;
    private isCN: boolean;

    constructor(name: string, matrix: complex[][]) {
        this.name = name;
        this.matrix = matrix;
    }

    public getMatrix(): complex[][] {
        return this.matrix;
    }

    public isControlled(): boolean {
        return this.isCN;
    }

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
    private qreg: Qubit[];
    private qName: string;
    private creg: boolean[];
    private cName: string;
    private static measurements: Map<String, number> = new Map<String, number>();
    private numShots: number;




    constructor(numShots: number) {
        this.qreg = [];
        this.creg = [];
        this.numShots = numShots;
    }


    public getQreg(): Qubit[] {
        return this.qreg;
    }

    public printQreg(): void {
        for (let i = 0; i < this.qreg.length; i++) {
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

    public addQubit(): void {
        this.qreg.push(new Qubit());
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

    public addGate(gate: Gate, qubit: number, control?: number): void {
        applyGate(this.qreg[qubit], gate, this.qreg[control], qubit);
    }

    public measure(src_index: number, dest_index: number): void {
        let qubitVector = this.qreg[src_index].getVector();
        let random = Math.random();
        let prob0 = qubitVector[0][0].mult(complexConjugate(qubitVector[0][0]));
        //let prob1 = qubitVector[1][0].mult(complexConjugate(qubitVector[1][0]));
        if (random < prob0.real) {
            this.creg[dest_index] = false;
        } else {
            this.creg[dest_index] = true;
        }
    
    }

    public reset(): void {
        this.qreg = [];
        this.creg = [];
    }

    public toString(): string {
        //print out each qubit in brackets with a comma in between using the qubit toString method and parentheses around each qubit
        let qubits = "[";
        for (let i = 0; i < this.qreg.length; i++) {
            qubits += this.qreg[i].toString();
            if (i != this.qreg.length - 1) {
                qubits += ", ";
            }
            qubits += "\n";
        }
        qubits += "]";
        // print out each classical bit as a binary number in little endian
        let classicalBits = "";
        for (let i = 0; i < this.creg.length; i++) {
            classicalBits += this.creg[i] ? "1" : "0";
        }
        return "Qubits:\n" + qubits + "\nClassical Bits: " + classicalBits;
    }


}

export default { Circuit, Qubit, Gate, HadamardGate, PauliXGate, PauliYGate, PauliZGate, SGate, TGate, CNotGate, complex, complexConjugate, KroneckerProduct, selectQubit};


