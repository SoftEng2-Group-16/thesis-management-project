#!/bin/bash

dockerUsername="atorre98"
# create a multi platform context, to build multi-architecture images
docker buildx create --use > contextName.txt

# build client image and push it to Docker Hub (if you want to have it on yours change the username before the image name in the command)
cd ./client
clear
echo "Building client image..."
docker buildx build --platform linux/amd64,linux/arm64 -t ${dockerUsername}/tms_client:latest --push .

# do the same for the server image
cd ../server
clear
echo "Building server image..."
docker buildx build --platform linux/amd64,linux/arm64 -t ${dockerUsername}/tms_server:latest --push .

#cleanup
cd ..
context=$(cat contextName.txt)
docker buildx rm $context
rm contextName.txt

clear
echo "Images built successfully, exiting.."
sleep 1
