#!/bin/bash

#NOTE: this script is intended to be used locally, so there is no need for the multi-arch build context

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

#make user choose if starting the containers or not
echo "NOTE: this next phase will use the local images just built"
echo "Make sure to edit properly the compose file! (remove username from image names)"

read -p "Do you want to create and start the containers? (y/n)  " answer
if [[ "$answer" == "y" ]]
then
    echo "Using docker-compose.yml file and starting containers in detached mode..."
    docker compose -p tms up -d
fi


