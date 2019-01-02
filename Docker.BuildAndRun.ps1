# Run an instance of the container in the background
docker-compose up -d

# Get the ID of the container so that we can attach to it
$container = docker-compose ps -q jekyll

# Launch the browser so that we can check our work 
# NOTE: it might not be ready yet, but at least the tab will be open...
Start-Process 'http://localhost:4000/'

# Attach to the running container (for debug purposes)
docker attach $container  