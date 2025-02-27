# System Architecture Documentation for the Gerbil Project

This document outlines the system architecture of the Gerbil project, a Go application designed for managing WireGuard tunnels. It includes a high-level overview, component interactions, data flow diagrams, design decisions and rationale, as well as system constraints and limitations.

## 1. High-Level Overview

The Gerbil project is structured around a central application that interacts with the WireGuard VPN service to create, manage, and configure tunnels. The application is built using Go and leverages various libraries for logging, networking, and configuration management.

### Key Features:
- **WireGuard Management**: Create and manage WireGuard interfaces and peers.
- **Logging**: Centralized logging functionality to track application behavior.
- **Configuration**: JSON-based configuration management for easy setup and modification.

## 2. Component Interactions

The main components of the Gerbil project include:

- **Main Application (`main.go`)**: The entry point that initializes the application, sets up logging, and handles command-line arguments.
- **Logger (`logger/`)**: A dedicated package for logging messages at various levels (DEBUG, INFO, WARN, ERROR, FATAL).
- **Configuration (`config_example.json`)**: Provides an example of how to configure the application with necessary parameters for WireGuard.
- **Dockerfile**: Defines how to build and run the application in a containerized environment.

### Interaction Flow:
1. The main application starts and initializes the logger.
2. It reads configuration from `config_example.json` or an equivalent file.
3. Based on the configuration, it interacts with the WireGuard API using the `wgctrl` library to set up tunnels and peers.
4. Logs are generated throughout the process for monitoring and debugging.

## 3. Data Flow Diagrams

### High-Level Data Flow Diagram

```plaintext
+-------------------+
|                   |
|   Configuration   |
|                   |
+---------+---------+
          |
          v
+---------+---------+
|                   |
|   Main Application|
|                   |
+---------+---------+
          |
          v
+---------+---------+
|                   |
|      Logger       |
|                   |
+---------+---------+
          |
          v
+---------+---------+
|                   |
|   WireGuard API   |
|                   |
+-------------------+
```

### Description:
- **Configuration**: The application reads from a configuration file that specifies settings like private keys, listen ports, and peers.
- **Main Application**: Orchestrates the flow by initializing components and executing commands based on user input.
- **Logger**: Captures events during execution for later review.
- **WireGuard API**: Interacts with the underlying WireGuard service to manage VPN tunnels.

## 4. Design Decisions and Rationale

### Key Design Decisions:
- **Use of Go**: Chosen for its performance, concurrency support, and ease of deployment.
- **JSON Configuration**: Provides a human-readable format that is easy to modify without requiring recompilation.
- **Modular Logging**: Encapsulated logging functionality allows for consistent logging practices across different parts of the application.

### Rationale:
These design choices enhance maintainability, readability, and performance while providing flexibility in configuration management.

## 5. System Constraints and Limitations

### Constraints:
- **Platform Dependency**: The application relies on Linux-based systems due to its use of netlink sockets for network management.
- **Privileged Operations**: Requires elevated permissions to create network interfaces and modify routing tables.
  
### Limitations:
- **Single-threaded Execution**: While Go supports concurrency, certain operations (like interface creation) may block other operations if not managed correctly.
- **Error Handling Complexity**: Managing errors from external systems (like WireGuard) can complicate flow control within the application.

### Future Considerations:
To enhance scalability and resilience, consider implementing asynchronous handling of network operations and improving error recovery mechanisms.

This documentation serves as a foundational reference for developers working on or contributing to the Gerbil project. It provides insights into how components interact within the system architecture while highlighting design decisions that shape its functionality.