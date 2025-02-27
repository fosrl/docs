# Developer Guide for the Gerbil Project

This guide provides essential information for developers working on the Gerbil project, which is a Go application for managing WireGuard tunnels. It includes setup instructions, an overview of the project structure, development workflow, testing approach, and common troubleshooting steps.

## 1. Setup Instructions

To get started with the Gerbil project, follow these setup instructions:

### Prerequisites
- **Go**: Ensure that you have Go installed on your system. The project uses Go version 1.23.1 or later. You can download it from [golang.org](https://golang.org/dl/).
- **Docker**: Install Docker to build and run the application in a containerized environment.
- **Git**: Make sure Git is installed to clone the repository.

### Installation Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/fosrl/gerbil.git
   cd gerbil
   ```

2. **Install Dependencies**:
   Run the following command to download all required Go dependencies:
   ```bash
   go mod download
   ```

3. **Build the Application**:
   You can build the application using Docker or directly using Go:
   - **Using Docker**:
     ```bash
     docker build -t gerbil .
     ```
   - **Using Go**:
     ```bash
     go build -o gerbil main.go
     ```

4. **Run the Application**:
   To run the application, execute:
    ```bash
    ./gerbil \
    --reachableAt=http://gerbil:3003 \
    --generateAndSaveKeyTo=/var/config/key \
    --remoteConfig=http://pangolin:3001/api/v1/gerbil/get-config \
    --reportBandwidthTo=http://pangolin:3001/api/v1/gerbil/receive-bandwidth
    ```

## 2. Project Structure Overview

The project structure of Gerbil is organized as follows:

```
gerbil/
├── logger/
│   ├── level.go
│   └── logger.go
├── config_example.json
├── Dockerfile
├── entrypoint.sh
├── go.mod
├── main.go
├── Makefile
```

### Key Components

- **`logger/`**: Contains logging functionality for the application.
- **`main.go`**: The entry point of the application.
- **`Dockerfile`**: Instructions for building a Docker image of the application.
- **`config_example.json`**: Example configuration file for setting up WireGuard tunnels.
- **`Makefile`**: Contains commands for building and managing the project.

## 3. Development Workflow

The development workflow for contributing to Gerbil involves several key steps:

1. **Branching**: Create a new branch for your feature or bug fix.
   ```bash
   git checkout -b feature/my-feature-name
   ```

2. **Coding**: Implement your changes in the codebase.

3. **Testing Locally**: Run tests locally to ensure your changes do not break existing functionality.

4. **Committing Changes**: Commit your changes with a descriptive message.
   ```bash
   git commit -m "Add feature X"
   ```

5. **Pushing Changes**: Push your branch to the remote repository.
   ```bash
   git push origin feature/my-feature-name
   ```

6. **Creating a Pull Request**: Open a pull request against the main branch of the repository.

7. **Code Review**: Participate in code reviews and address any feedback received.