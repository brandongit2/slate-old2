#!/bin/bash

cd ../
mysql -u root -e 'CREATE DATABASE slate_test;'
cat migrations/* | mysql slate_test -u root
cat ./test/slate.test.sql | mysql slate_test -u root
