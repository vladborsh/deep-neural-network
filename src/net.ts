interface NetOutputs {
    activations: number[][][],
    outputs: number[][][],
}

export class Net {
	private net: number[][][];

	constructor(inputLayer: number, ...layers: number[]) {
		this.net = Net.initNet(inputLayer, layers)
    }

    public learn(inputs: number[][], outputs: number[][], learningRate: number) {
        const ALLOWED_ERROR = 0.01;
        let error = 9999;
        let step = 0;

        while (error > ALLOWED_ERROR || step < 10000) {
            error = 0;
            
            inputs.forEach((input: number[], i: number) => {
                const { dW, lost } = this.learnStep(input, outputs[i]);
                this.updateNet(dW, learningRate);
                error += lost;
            });
            
            error /= inputs.length;
            step++;
        }
    }

    public learnStep(input: number[], output: number[]): { dW: number[][][], lost: number } {
        const netOutputs = this.forwardPropagate(input);

        return {
            lost: Net.totalLost(netOutputs.activations[netOutputs.activations.length-1][0], output),
            dW: this.backPropagate(netOutputs, output),
        };
    }

	public forwardPropagate(input: number[]): NetOutputs {
		return this.net.reduce(
            ({outputs, activations}: NetOutputs, currentLayer: number[][], i: number, net: number[][][]) => {
                const dot: number[][] = Net.dot(activations[i], currentLayer);

                return {
                    outputs:  [ ...outputs, dot ],
                    activations: [
                        ...activations,
                        Net.applyFunction(
                            dot,
                            (i < net.length-1 ? Net.relu : Net.sigmoid)
                        ),
                    ],
                };
            },
			{ outputs: [], activations: [[input]] },
		);
    }

    public backPropagate({outputs, activations}: NetOutputs, expectedOutputs: number[]): number[][][] {
        const dW: number[][][] = new Array(this.net.length);

        let delta = Net.product(
            [ Net.calculateCost(activations[activations.length-1][0], expectedOutputs) ],
            Net.applyFunction(outputs[outputs.length-1], Net.sigmoid_),
        );

        dW[this.net.length-1] = Net.dot(Net.transpose(activations[activations.length-2]), delta)

        for (let i = this.net.length-2; i > -1; i--) {
            delta = Net.product(
                Net.transpose(Net.dot(this.net[i+1], Net.transpose(delta))),
                Net.applyFunction(outputs[i], Net.relu_),
            );
            
            dW[i] = Net.dot(Net.transpose(activations[i]), delta)
        }

        return dW;
    }

    public updateNet(dW: number[][][], learningRate: number): void {
        dW.forEach((layer: number[][], i: number) =>
            layer.forEach((neuron: number[], j: number) =>
                neuron.forEach((w: number, k: number) =>
                    this.net[i][j][k] += learningRate * w
                ),
            ),
        );
    }

	private static initNet(inputLayer: number, layers: number[]): number[][][] {
        const result: number[][][] = new Array(layers.length);

		layers.forEach((layer, i) => 
			result[i] = i === 0 ? Net.initLayer(inputLayer, layer) : Net.initLayer(layers[i-1], layer),
		);

		return result;
	}

	private static initLayer(inputLayer: number, neurons: number): number[][] {
		return Net.initMatrix(neurons, inputLayer);
	}

	private static initMatrix(width: number, height: number): number[][] {
        const result: number[][] = new Array(height);

		for (let i = 0; i < result.length; i++) {
			result[i] = new Array(width);
			for (let j = 0; j < result[i].length; j++) {
				result[i][j] = (Math.random()-0.5);
			}
		}
	
		return result;
	}

	private static dot(matrix1: number[][], matrix2: number[][]): number[][] {
        const result: number[][] = new Array(matrix1.length);

		for (let i = 0; i < matrix1.length; i++) {
			result[i] = new Array(matrix2[0].length);
			for (let j = 0; j < matrix2[0].length; j++) {
				result[i][j] = 0;
				for (let k = 0; k < matrix1[0].length; k++) {
					result[i][j] += matrix1[i][k] * matrix2[k][j];
				}
			}
		}

		return result;
    }

    private static product(matrix1: number[][], matrix2: number[][]): number[][] {
        if (matrix1.length != matrix2.length || matrix1[0].length != matrix2[0].length) {
            console.error(`Matrixes has different size: [${matrix1.length}, ${matrix1[0].length}], [${matrix2.length}, ${matrix2[0].length}]`)
        }

        const result: number[][] = new Array(matrix1.length);
    
		for (let i = 0; i < matrix1.length; i++) {
			result[i] = new Array(matrix1[0].length);
			for (let j = 0; j < matrix1[i].length; j++) {
				result[i][j] = matrix1[i][j] * matrix2[i][j];
			}
		}
    
		return result;
    }

    private static applyFunction(matrix: number[][], func: (x: number) => number): number[][] {
        const result: number[][] = new Array(matrix.length);

        for (let i = 0; i < result.length; i++) {
            result[i] = new Array(matrix[i].length);
			for (let j = 0; j < result[i].length; j++) {
                result[i][j] = func(matrix[i][j]);
            }
        }

        return result;
    }

    private static transpose(matrix: number[][]): number[][] {
        return matrix[0].map((_, i: number) => matrix.map((row: number[]) => row[i]));
    }
    
    private static relu(x: number): number {
        return x > 0 ? x : 0;
    }

    private static relu_(x: number): number {
        return x > 0 ? x : 0;
    }

    private static sigmoid(x: number): number {
        return 1 / (1 + Math.exp(-x));
    }

    private static sigmoid_(x: number): number {
        return Net.sigmoid(x) * (1 - Net.sigmoid(x));
    }

    private static mse(yExpected: number, y: number): number {
        return Math.pow(yExpected - y, 2);
    }

    private static mse_(yExpected: number, y: number): number {
        return -2 * (yExpected - y);
    }

    private static calculateCost(outputs: number[], expectedOutputs: number[]): number[] {
        return outputs.map((y, i) => Net.mse_(expectedOutputs[i], y))
    }

    private static totalLost(outputs: number[], expectedOutputs: number[]): number {
        return outputs.reduce(
            (result, y, i) => result += Net.mse(expectedOutputs[i], y),
            0
        ) / outputs.length;
    }

}
