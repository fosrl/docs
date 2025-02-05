import UpdatingVersionsYaml from "@site/src/components/UpdatingVersionsYaml";

# Updating Versions

:::warning

1. To be safe, we recommend that you back up your data before updating Pangolin so you can roll back. Copy the `config` directory to another location before performing the update.
2. To be safe, we recommend you incrementally update versions. For example, if you are on version 1.0.0, update to 1.1.0, then 1.2.0, and so on, instead of jumping straight from 1.0.0 to 1.2.0.

:::

Keeping the stack updated is easy because the stack is a collection of Docker images. To update the stack, you can simply pull the latest images from Docker Hub and restart the stack.

We include a migration scripts to automatically update the database and/or configuration files when necessary. These scripts are run when the container starts, so you don't need to worry about running them manually.

It's always a good idea to check the release notes for each new version in case there are any breaking changes or new features you need to be aware of. You can find the release notes for each project on their respective GitHub repositories.

Some basic commands to get you started:

1. Stop the stack

```bash
sudo docker compose down
```

2. Update the docker compose file with the new version number

<UpdatingVersionsYaml />

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
