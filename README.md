# Real-Time User Management System with WebSocket Protocol Using C++ and Docker

## Overview
This project is a real-time user management system leveraging the **WebSocket protocol** for seamless communication between the frontend and backend. The system is implemented with a **C++ backend** using the Boost Asio and Beast libraries and Dockerized for easy deployment. It supports management of **Students**, **Teachers**, and **Admins**, with full CRUD functionalities and JSON for lightweight data storage.

---

## Features
1. **Login System**:
   - User authentication with WebSocket communication.
   - Successful login redirects to a dynamic dashboard.

2. **Dashboard**:
   - Navigation options for managing:
     - Students
     - Teachers
     - Admins

3. **CRUD Operations**:
   - **Add**: Add records via user-friendly forms.
   - **View**: Display data in an organized table.
   - **Edit**: Inline updates or via a dedicated update page.
   - **Delete**: Remove records directly from the interface.

4. **WebSocket Communication**:
   - Real-time synchronization of data between the client and server.

5. **Backend in C++**:
   - Uses Boost Asio and Beast for WebSocket handling.
   - JSON files store data for Students, Teachers, and Admins.

6. **Docker Integration**:
   - Fully Dockerized for streamlined deployment and scalability.

---

## System Architecture
### Components:
1. **Frontend**:
   - HTML, CSS, and JavaScript for a responsive, user-friendly interface.
   - WebSocket API for real-time interaction with the server.

2. **Backend**:
   - A C++ WebSocket server implemented using Boost libraries.
   - JSON files for lightweight, portable data storage.

3. **Data Storage**:
   - JSON files (`students.json`, `teachers.json`, `admins.json`) manage data for each user group.

4. **Docker**:
   - Dockerfile for containerizing the application, ensuring consistent deployment across environments.

---

## Workflow
1. **Login**:
   - Users authenticate via WebSocket communication.
   - Credentials are verified against hardcoded values (e.g., `admin/password`).

2. **Dashboard**:
   - Navigation buttons allow selection between managing Students, Teachers, and Admins.

3. **CRUD Operations**:
   - **Add**: Forms submit data via WebSocket.
   - **View**: JSON data is rendered dynamically in tables.
   - **Edit/Delete**: Operations update JSON files, and changes reflect in real-time.

---

## Installation and Usage
### Prerequisites:
- **Docker** installed on your system.

### Steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo.git
   cd your-repo
