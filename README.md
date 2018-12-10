# Deep neural network

Simple deep neural network.

Easy to teach:
``` typescript
const network = new Net(10, 8, 7, 5);
network.train(inputs, outputs, 0.001);
```

View results of training:
``` typescript
const network = new Net(10, 8, 7, 5);

network
    .trainOutput()
    .subscripe((lOutput: LearnOutput) => console.log(lOutput.lost));

network.train(inputs, outputs, 0.001);
```


You can export your model as json file
``` typescript
network.export();
```

Easy to use trained network:
``` typescript
const outputs: number[] = network.run(inputs);
```

Easy to use in genetic algorithms:
``` typescript
network.evolve(0.001);
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
