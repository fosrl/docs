# PostgreSQL

You can optionally use a PostgreSQL database with Pangolin.

Use the `fosrl/pangolin:postgresql-<version>` Docker image to run Pangolin with PostgreSQL.

## Configuration

Add the following section to the Pangolin configuration file and replace the placeholders with your PostgreSQL connection details:

```yaml
postgres:
    connection_string: postgresql://<user>:<password>@<host>:<port>/<database>
```

## Example Docker Compose

This shows an example of a Docker Compose file that sets up a PostgreSQL database for use with Pangolin. It sets up a health check to ensure the database is ready before Pangolin starts.

:::warning

This is not necessarily up to date or production-ready. Adjust the configuration according to your needs.

:::

```yaml
name: pangolin
services:
  pangolin:
    image: fosrl/pangolin:postgresql-latest # Not advised to use `latest` in production
    container_name: pangolin
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./config:/app/config
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/v1/"]
      interval: "10s"
      timeout: "10s"
      retries: 15

  # ... other services ...

  postgres:
    image: postgres:17
    container_name: postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - ./config/postgres:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
```
