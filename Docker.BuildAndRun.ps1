# Build the image (called blog, version 'latest')
docker build . -t blog:latest 

# Run an instance of the image in the background, opening port 4000 as well
docker run -d -p 4000:4000 -t blog:latest

# Launch the browser so that we can check our work
start 'http://localhost:4000/'