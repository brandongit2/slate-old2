#!/bin/bash

mysql -u root -e 'DROP DATABASE slate_test;'
./setupTestEnv.sh
npm test
