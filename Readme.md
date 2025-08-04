# Build the image
docker build -t story-weaver .

# Run the container
docker run -p 8000:8000 -p 5173:5173 story-weaver