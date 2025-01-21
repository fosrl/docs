# Updating Versions

Keeping the stack updated is easy because the stack is a collection of Docker images. To update the stack, you can simply pull the latest images from Docker Hub and restart the stack.

Some basic commands to get you started:

1. Stop the stack

```bash
sudo docker compose down
```

2. Update the docker compose file with the new version number

```yaml
services:
  pangolin:
    image: fosrl/pangolin:1.0.0-beta.8 # increase the tag to the latest version number, or use "latest"
    container_name: pangolin
    restart: unless-stopped
... 
```

Do this for each container you want to update.

3.  Pull the latest images

```bash
sudo docker compose pull
```

4. Start the stack

```bash
sudo docker compose up -d
```

5. Check the logs

```bash
sudo docker compose logs -f
```

We include a migration scripts to automatically update the database and/or configuration files when necessary. These scripts are run when the container starts, so you don't need to worry about running them manually.

It's always a good idea to check the release notes for each new version in case there are any breaking changes or new features you need to be aware of. You can find the release notes for each project on their respective GitHub repositories.
