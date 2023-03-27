# Qualification Checking Script

This repository contains a script for checking qualification of each prompt file.

## Installation

To use this script, you must have <a href="https://nodejs.org/en/" target="_new">Node.js</a> and <a href="https://www.npmjs.com/" target="_new">npm</a> installed on your system.

1. Clone this repository to your local machine.
2. Navigate to the repository directory in your terminal.
3. Run `npm install` to install the necessary dependencies.

## Usage

1. Run the script using the command `npm start -s="<SOURCE_FOLDER>"`. For example, `npm start -s="./competition"`.
2. The script will output the copied of original file if passed the qualification in `../<SOURCE_FOLDER>/qualified` folder, which has the same structure as the source folder. The file `qualification_log_<DATE_TIME>.txt` will be created in the `../<SOURCE_FOLDER>/qualified/logs` folder.

Please ensure that the source folder contains only text files.

## Contributing

If you would like to contribute to this project, please fork this repository and submit a pull request. Please ensure that your code is well documented and that you have tested your code before submitting a pull request.

## Bug Reporting

If you find any bugs, please submit an issue on this repository.