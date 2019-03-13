#!/bin/bash

cd ../
mysql -u root -e 'CREATE DATABASE slate;'
cat migrations/* | mysql slate -u root
cat ./test/slate.test.sql | mysql slate -u root
