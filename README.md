# auto-api

[![Build Status](https://travis-ci.org/kevgo/auto-api.svg?branch=master)](https://travis-ci.org/kevgo/auto-api)

This tool will automatically test based on the API of your application.
How it works
- Input processing
    - Parse API test design: yaml file
    - Validate API test design: yaml file
    - Parse API specification: json/yaml file
    - Validate API specification: json/yaml file
- Test suites forming
    - Create, send request and get response
    - Structure test cases and test suites
    - Hooks
- Execution and report
    - Run test suites
    - Generate report

*** built-in function:
- random -> faker
- comparison -> chai



