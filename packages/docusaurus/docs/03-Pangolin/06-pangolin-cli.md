# Pangolin CLI (pangctl)

The Pangolin container comes with a CLI tool baked in called `pangctl`. This tool exposes a few commands to help you manage your Pangolin instance from the command line.

## How to Access

You can access the CLI tool by running the following command on the host where the Pangolin container is running:

```bash
docker exec -it pangolin pangctl <command>
```

## Available Commands

To see the available commands, you can run:

```bash
docker exec -it pangolin pangctl --help
```

## Set Admin Credentials

If you need to set or reset the admin credentials for your Pangolin instance, you can use the following command:

```
docker exec -it pangolin pangctl set-admin-credentials --email "admin@example.com"  --password "Password123!"
```
