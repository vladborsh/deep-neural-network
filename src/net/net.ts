import { Activations } from "./activations";
import { NetOutputs } from "./types/net-outputs.interface";
import { ActivationType } from "./types/activation-type.enum";
import { LearnOutput } from "./types/learn-output.interface";
import { DEFAULT_ALLOWED_ERROR, DEFAULT_ERROR, DEFAULT_EPOCH } from "./constatnts";
import { BehaviorSubject } from 'rxjs';

export class Net {
    public static readonly DEFAULT_LAYER_ACTIVATION = ActivationType.RELU;
    public static readonly DEFAULT_OUTPUT_ACTIVATION = ActivationType.SIGMOID;
    
    public readonly trainOutput: BehaviorSubject<LearnOutput> = new BehaviorSubject<LearnOutput>({ dW: null, lost: null });
    
    private net: number[][][];

	constructor(inputLayer: number, ...layers: number[]) {
		this.net = Net.initNet(inputLayer, layers)
    }

    public export() {
        var dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(this.net))}`;
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', dataStr);
        downloadAnchorNode.setAttribute('download', 'model.json');
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    public train(inputs: number[][], outputs: number[][], learningRate: number): void {
        let error = DEFAULT_ERROR;
        let step = 0;

        while (error > DEFAULT_ALLOWED_ERROR && step < DEFAULT_EPOCH) {
            error = 0;
            
            inputs.forEach((input: number[], i: number) => {
                const { dW, lost }: LearnOutput = this.trainStep(input, outputs[i]);
                error += lost;

                this.trainOutput.next({ dW, lost });
                this.updateNet(dW, learningRate);
            });
            
            error /= outputs.length;
            step++;
        }
    }

    public evolve(rate: number): void {
        this.net.forEach((layer: number[][], i: number) =>
            layer.forEach((neuron: number[], j: number) =>
                neuron.forEach((_: number, k: number) =>
                    this.net[i][j][k] += (0.5 - Math.random()) * rate
                ),
            ),
        ); 
    }

    public run(input: number[]): number[] {
        return this.forwardPropagate(input).activations.pop().pop();
    }

    private trainStep(input: number[], output: number[]): LearnOutput {
        const netOutputs = this.forwardPropagate(input);

        return {
            lost: Net.totalLostSSE(netOutputs.activations[netOutputs.activations.length-1][0], output),
            dW: this.backPropagate(netOutputs, output),
        };
    }

	private forwardPropagate(input: number[]): NetOutputs {
		return this.net.reduce(
            ({sum, activations}: NetOutputs, currentLayer: number[][], i: number, net: number[][][]) => {
                const dot: number[][] = Net.dot(activations[i], currentLayer);

                return {
                    sum:  [ ...sum, dot ],
                    activations: [
                        ...activations,
                        Net.applyFunction(
                            dot,
                            (i < net.length-1 
                                ? Activations.FUNCTION[Net.DEFAULT_LAYER_ACTIVATION]
                                : Activations.FUNCTION[Net.DEFAULT_OUTPUT_ACTIVATION])
                        ),
                    ],
                };
            },
			{ sum: [], activations: [[input]] },
		);
    }

    private backPropagate({sum, activations}: NetOutputs, expectedOutputs: number[]): number[][][] {
        const dW: number[][][] = new Array(this.net.length);

        let delta = Net.product(
            [ Net.calculateCost(activations[activations.length-1][0], expectedOutputs) ],
            Net.applyFunction(sum[sum.length-1], Activations.PRIME[Net.DEFAULT_OUTPUT_ACTIVATION]),
        );

        dW[this.net.length-1] = Net.dot(Net.transpose(activations[activations.length-2]), delta)

        for (let i = this.net.length-2; i > -1; i--) {
            delta = Net.product(
                Net.transpose(Net.dot(this.net[i+1], Net.transpose(delta))),
                Net.applyFunction(sum[i], Activations.PRIME[Net.DEFAULT_LAYER_ACTIVATION]),
            );
            
            dW[i] = Net.dot(Net.transpose(activations[i]), delta)
        }

        return dW;
    }

    private updateNet(dW: number[][][], learningRate: number): void {
        dW.forEach((layer: number[][], i: number) =>
            layer.forEach((neuron: number[], j: number) =>
                neuron.forEach((dW: number, k: number) =>
                    this.net[i][j][k] += learningRate * dW
                ),
            ),
        );
    }

	private static initNet(inputLayer: number, layers: number[]): number[][][] {
        const result: number[][][] = new Array(layers.length);

		layers.forEach((layer, i) => 
            result[i] = i === 0 
                ? Net.initLayer(inputLayer, layer) 
                : Net.initLayer(layers[i-1], layer),
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
				result[i][j] = (0.5 - Math.random());
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

    private static calculateCost(outputs: number[], expectedOutputs: number[]): number[] {
        return outputs.map((y, i) => expectedOutputs[i] - y)
    }

    private static totalLostSSE(outputs: number[], expectedOutputs: number[]): number {
        return outputs.reduce(
            (result: number, y: number, i: number) => result += Math.pow(expectedOutputs[i] - y, 2),
            0
        ) / outputs.length;
    }

}
