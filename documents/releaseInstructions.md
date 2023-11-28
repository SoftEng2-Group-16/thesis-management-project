# General instructions
**What you'll need**:
- Docker
- Docker Compose
- Internet access (if you want to pull the avaliable pre-built images)
- Preferably but not mandatory, a bash shell (Linux and MacOS users will be fine with the terminal, Windows users will need either WSL or a VM)
## How to run the project

### Development

#### Server:
1. Install the dependencies needed by the server by running
    ```sh
    npm install 
    ```
    from the server folder (`code/server`)

2. Start up the server by running either 
    ```sh
    nodemon index.js 
    ```
    if you want the logging functionalities provided by `nodemon`, or
    ```sh
    node index.js
    ```
    to simply start it withoud logging and auto restart.

#### Client:
1. Install the dependecies needed by the client by running
    ```sh
    npm install 
    ```
    from the client folder (`code/client`)
2. Start it up by running
    ```sh
    npm run dev 
    ```
3. Open up a browser and visit the [homepage](http://localhost:5173/)

### Released version
**Important**: the final version (up to the second sprint) is going to be provided by using Docker containers. Make sure to have Docker and Docker Compose installed on you machine (next sections will contain both instructions for building images locally and pulling them from Docker Hub [repositories](https://hub.docker.com/repositories/atorre98))

### (OPTIONAL) Building the images
The build process relies on two Dockerfiles, one for the client (`code/client/Dockerfile`) and one for the server (`code/client/Dockerfile`). If you don't want to use the pre-built images avaliable (more on that later), you can build them locally by using the provided `code/build_local_images.sh` script.

**NOTE**: The other script (`code/build_and_push_images.sh`) is intended to be used by the owner of the Docker Hub repositories; it will create a local multi-architecture build context, build the client and server images for both `amd64` and `arm64` architectures and push them on Docker Hub (so Apple Silicon users won't have performance problems due to Rosetta emulation).

### Running the containers
To create and run the containers, you can use the provided `docker-compose.yml` file.
#### Docker Hub images
Simply run the following command:

```sh 
docker compose -p tms up
```
from the `/code` folder to have Docker automatically pull the pre-built images and create a Compose stack with two containers, one for the server and the other for the client, then open a browser and navigate to the [homepage](http.//localhost:5173). 

*Optional*: add the ```-d``` flag to detach the Compose execution from the terminal window

#### Local images
Edit the provided Docker Compose file by removing the username (`atorre98/`) from the `image` field for both client and server services, to avoid pulling the pre-built images and use the freshly built ones you have just created; then lauch the same command from the previous section to create the Compose stack and have the containers created, linked and started up.