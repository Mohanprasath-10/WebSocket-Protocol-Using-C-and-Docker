# Use an official Ubuntu as a parent image
FROM ubuntu:latest

# Install necessary libraries and dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libboost-all-dev \
    wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Download and install nlohmann/json
RUN wget https://github.com/nlohmann/json/releases/download/v3.10.5/json.hpp -P /usr/local/include/nlohmann

# Set the working directory
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Create a data directory, initialize JSON files with valid structure, and set permissions
RUN mkdir -p /usr/src/app/data && \
    echo '[]' > /usr/src/app/data/students.json && \
    echo '[]' > /usr/src/app/data/teachers.json && \
    echo '[]' > /usr/src/app/data/admins.json && \
    chmod -R 777 /usr/src/app/data

# Compile the C++ server code
RUN g++ -o websocket_server server.cpp -lboost_system -lboost_thread -lpthread

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run the server program
CMD ["./websocket_server"]
