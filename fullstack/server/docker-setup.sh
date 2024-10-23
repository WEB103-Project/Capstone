

#!/bin/bash

# Build the Docker image
docker build -t my_postgres .

# Run the Docker container
docker run --name my_postgres_container -p 5432:5432 -d my_postgres

# Output container status
echo "PostgreSQL container is running."

# TODO: Merge these two scripts together and have some kind of wizard option thing

#!/bin/bash

# Check if the container is running
CONTAINER_STATUS=$(docker inspect -f '{{.State.Running}}' my_postgres_container)

if [ "$CONTAINER_STATUS" == "true" ]; then
  # Reset the tables inside the running container
  docker exec -it my_postgres_container psql -U admin -d mydb -f /docker-entrypoint-initdb.d/reset_tables.sql
  echo "Tables have been reset."
else
  echo "Container is not running. Please start the container first."
fi

