import { Net } from "src";

const network: Net = new Net(10, 8, 7, 5);

const inputs = [];
const outputs = [];
for (let i = 0; i < 100; i++) {
	const input = [];
	for (let j = 0; j < 10; j++) {
		input.push(Math.random() > 0.5 ? 1 : 0);
	}
	inputs.push(input);
	outputs.push([ 
		1 / (input[0] || 1),
		1 / ((input[1] + input[2]) || 1),
		1 / ((input[5]) || 1),
		1 / ((input[6] + input[9] + input[3]) || 1),
		1 / ((input[8]|input[1]) || 1),
	]);
}

network.learn(inputs, outputs, 0.001);