#!/bin/bash

# build client image
cd ./client
clear
echo "Building client image..."
docker build -t tms_client:latest .

# build server image
cd ../server
clear
echo "Building server image..."
docker build -t tms_server:latest .

#exit
cd ..
clear
echo "Images built successfully, exiting.."
sleep 1
