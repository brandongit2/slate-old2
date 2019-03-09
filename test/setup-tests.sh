#!/bin/bash
sudo apt-get update
sudo apt-get install nginx
sudo mv slate.nginx.test.conf /etc/nginx/sites-available/default
sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
sudo nginx


