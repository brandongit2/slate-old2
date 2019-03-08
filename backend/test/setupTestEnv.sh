cd ../
cp ./test/config.test.json ./src/config.json
mysql -e 'CREATE DATABASE slate;'
cat migrations/* | mysql slate
cat ./test/slate.test.sql | mysql slate