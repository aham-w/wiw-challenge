# WIW Challenge

Program that parses a dataset of shifts and provides information about hours worked, overtime, and any invalid shifts.

## Getting Started

1. Install node.js by heading [to this link](https://nodejs.org/en/download). This will also install npm for you.
2. From the project root run the below command to install all node modules for this project
    ### `npm i`
3. To run the program use the following command
    ### `npm run parse [FILE_PATH]`
    e.g. `npm run parse ./__test__/data/dataset.json` will parse the example dataset and the results will be outputted to a file named result.json
4. To run the test suite use the following command
    ### `npm run test`

## Further improvements
1. More strict validation of input json and add validation messages 
2. More test cases for certain areas
3. Address bonus requirement for handling transitions between CST and CDT
