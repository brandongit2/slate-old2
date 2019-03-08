cd ../
cp ./test/config.test.json ./src/config.json
mysql -u root -e 'CREATE DATABASE slate;'
cat migrations/* | mysql slate -u root
cat ./test/slate.test.sql | mysql slate -u root