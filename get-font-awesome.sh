#!/bin/sh

curl http://fontawesome.io/assets/font-awesome-4.7.0.zip -o font-awesome.zip
unzip font-awesome.zip -d ./lib/
rm font-awesome.zip
