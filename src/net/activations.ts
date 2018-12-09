import { ActivationType } from "./types/activation-type.enum";

export class Activations {

    public static get FUNCTION(): Record<ActivationType, (x: number) => number> {
        return {
            [ActivationType.RELU]: (x: number) => x > 0 ? x : 0,
            [ActivationType.SIGMOID]: (x: number) => 1 / (1 + Math.exp(-x)),
        };
    }

    public static get PRIME(): Record<ActivationType, (x: number) => number> {
        return {
            [ActivationType.RELU]: (x: number) => x > 0 ? 1 : 0,
            [ActivationType.SIGMOID]: (x: number) => (1 / (1 + Math.exp(-x))) * (1 - (1 / (1 + Math.exp(-x)))),
        };
    }
}

