# How to Update

Increase the Badger version number in `config/traefik_config.yml`:

```yaml
experimental:
  plugins:
    badger:
      moduleName: github.com/fosrl/badger
      version: v1.2.0 # Update this version number as needed
```

Then, restart the stack to apply the changes:

```bash
docker compose down
docker compose up -d
```
