#!/bin/bash

mysql -u root -e 'DROP DATABASE slate;'
./setupTestEnv.sh
npm test