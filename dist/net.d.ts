interface NetOutputs {
    activations: number[][][];
    outputs: number[][][];
}
export declare class Net {
    private net;
    constructor(inputLayer: number, ...layers: number[]);
    static printLayer(layer: number[][]): void;
    exportNet(): number[][][];
    printNet(): void;
    learn(inputs: number[][], outputs: number[][], learningRate: number): void;
    learnStep(input: number[], output: number[]): {
        dW: number[][][];
        lost: number;
    };
    forwardPropagate(input: number[]): NetOutputs;
    backPropagate({ outputs, activations }: NetOutputs, expectedOutputs: number[]): number[][][];
    updateNet(dW: number[][][], learningRate: number): void;
    private static initNet;
    private static initLayer;
    private static initMatrix;
    private static dot;
    private static product;
    private static applyFunction;
    private static transpose;
    private static relu;
    private static relu_;
    private static sigmoid;
    private static sigmoid_;
    private static mse;
    private static mse_;
    private static calculateCost;
    private static totalLost;
}
export {};
