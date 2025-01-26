# Development & Contributor Guide

This guide describes how to get running in local development.

## Tools

- Text Editor (VSCode, Neovim, etc)
- NodeJS
- NPM
- Go
- Git
- Docker

For managing multiple versions of Go, you may want to use [gvm](https://github.com/moovweb/gvm).
For managing multiple versions of NodeJS, you may want to use [nvm](https://github.com/nvm-sh/nvm).

## Setup Your Repo(s)

Below is an example if you're working on the Pangolin repo.

1. [Fork](https://help.github.com/articles/fork-a-repo/) the repository(ies) to your own GitHub account and [clone](https://help.github.com/articles/cloning-a-repository/) to your local device:

   ```bash
   git clone https://github.com/YOUR_USERNAME/pangolin.git
   cd pangolin/
   ```

2. Add the remote `upstream`:

   ```bash
   git remote add upstream https://github.com/fosrl/pangolin.git
   ```

3. Create a new branch:

   ```bash
   git checkout -b BRANCH_NAME main
   ```

   - It is recommended to give your branch a meaningful name, relevant to the feature or fix you are working on.
     - Good examples:
       - `docs-docker`
       - `feature-new-system`
       - `fix-title-cards`
     - Bad examples:
       - `bug`
       - `docs`
       - `feature`
       - `fix`
       - `patch`

4. If you open a pull request, open it against the `main` branch of the original repository.

## Pangolin

- NodeJS v20.10.0
- NPM v10.2.3 (or similar)

1. Install package dependencies

```
npm install
```

2. Ensure you have a config file

Make sure you have a `config/` directory at the root with a `config.yml` inside. Refer to the Pangolin Configuration docs or the `config.example.yml` in the repo for sample of what to include in that file. You may need to tweak this to run in dev, such as setting the `dashboard_url` to `http://localhost` and `base_domain` to `localhost` and making sure `secure_cookies` is `false`.

3. Generate the database schema and push it

```
npm run db:generate
```

```
npm run db:push
```

4. Start the dev server

```
npm run dev
```

:::note

When running Pangolin for the first time there will be no exit nodes. This means that there have been no Gerbil "exit nodes" registered in the database. When Gerbil first starts up and requests its config from Pangolin for the first time it gets registered as an exit node.

The easiest way to resolve this is to run Gerbil and have it register in your dev environment. Download the Gerbil binary and run it with localhost:

```
./gerbil \
--remoteConfig http://localhost:3001/api/v1/gerbil/get-config \
--reportBandwidthTo http://localhost:3001/api/v1/gerbil/receive-bandwidth \
--generateAndSaveKeyTo=/var/key \
--reachableAt=http://localhost:3003
```

:::

## Gerbil

- Go v1.23.1

```bash
make local
```

## Newt

- Go v1.23.1

```bash
make local
```
