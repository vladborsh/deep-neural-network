# Deep neural network

Simple deep neural network.

``` typescript
import { Net } from "./net/net";

const network = new Net(10, 8, 7, 5);
network.learn(inputs, outputs, 0.001);
```

Create exmple data snippet 

``` typescript
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
```

## Installation

Open terminal and run next commands

```sh
npm i
npm run webpack
```

## Scripts

``` bash
# Webpack watch and run browser sync
npm run webpack
# Build final version 
npm run build
# Testing
npm run test
```
