# Real-Time User Management System with WebSocket Protocol Using C++ and Docker

## Overview
This project is a real-time user management system that leverages the **WebSocket protocol** to enable efficient and instant communication between the frontend and backend. The frontend is implemented in **JavaScript**, and the backend uses **C++** (with Boost Asio and Beast libraries). The system supports managing **Students**, **Teachers**, and **Admins**, with full CRUD (Create, Read, Update, Delete) functionalities. Data is stored in lightweight JSON files, and the application is Dockerized for easy deployment.

---

## Features
1. **Login System**:
   - User authentication using WebSocket.
   - Successful login redirects to a dashboard with navigation options.

2. **Dashboard**:
   - Centralized navigation for managing:
     - Students
     - Teachers
     - Admins

3. **CRUD Operations**:
   - **Create**: Add records through forms.
   - **Read**: View data in organized tables.
   - **Update**: Inline updates or via a dedicated update page.
   - **Delete**: Remove records directly from the UI.

4. **Real-Time Communication**:
   - WebSocket ensures data synchronization between the client and server without refreshing the page.

5. **Backend in C++**:
   - Boost Asio and Beast libraries handle WebSocket connections.
   - JSON files store data, acting as a lightweight database.

6. **Dockerized Deployment**:
   - Containerized with Docker for seamless deployment and scalability.

---

## Frontend JavaScript and Backend C++ Connect

### 1. **Establishing the Connection**
   - The frontend uses the WebSocket API to establish a connection with the backend at a specified endpoint.
   - Example in `JavaScript`:
     ```javascript
     const socket = new WebSocket("ws://localhost:8080");
     ```

### 2. **Sending Requests**
   - The frontend sends JSON-encoded requests to the backend over the WebSocket connection.
   - Each request specifies an `action` (e.g., `login`, `getStudents`, `addStudent`).
   - Example Request:
     ```javascript
     socket.send(JSON.stringify({
         action: "getStudents"
     }));
     ```

### 3. **Backend Request Processing**
   - The backend (C++) receives the message, parses the JSON request, and processes it based on the `action`.
   - Example in `C++`:
     ```cpp
     void handle_client_message(std::shared_ptr<websocket::stream<tcp::socket>> ws, const json& message) {
         if (message["action"] == "getStudents") {
             handle_get_data(ws, "data/students.json", "studentsData");
         }
     }
     ```

### 4. **Sending Responses**
   - After processing the request, the backend sends a JSON response back to the frontend over WebSocket.
   - Example Response in `C++`:
     ```cpp
     void send_message(std::shared_ptr<websocket::stream<tcp::socket>> ws, const json& message) {
         ws->async_write(boost::asio::buffer(message.dump()), [ws](boost::system::error_code ec, std::size_t) {
             if (ec) {
                 std::cerr << "Error sending message: " << ec.message() << std::endl;
             }
         });
     }
     ```

### 5. **Handling Responses**
   - The frontend listens for responses and updates the UI dynamically.
   - Example in `JavaScript`:
     ```javascript
     socket.onmessage = (event) => {
         const response = JSON.parse(event.data);
         if (response.action === "studentsData") {
             renderStudentTable(response.data);
         }
     };
     ```

This seamless integration allows real-time updates and dynamic interaction between the client and server.

---

## System Architecture
### Components:
1. **Frontend**:
   - Built with HTML, CSS, and JavaScript.
   - JavaScript handles WebSocket communication and dynamic UI updates.

2. **Backend**:
   - A C++ WebSocket server manages requests and updates JSON files.
   - Uses Boost libraries for WebSocket communication.

3. **Data Storage**:
   - JSON files (`students.json`, `teachers.json`, `admins.json`) store data for each user category.

4. **Docker**:
   - The entire application is containerized using Docker for consistent deployment across environments.

---

## Workflow
1. **Login**:
   - Users log in via `login.html`.
   - Credentials are validated by the backend.
   - Successful login redirects to the dashboard.

2. **Dashboard**:
   - Provides navigation to manage:
     - Students
     - Teachers
     - Admins

3. **CRUD Operations**:
   - **Add**: Submit forms to add records.
   - **View**: Fetch and display data in organized tables.
   - **Edit/Delete**: Update or remove records dynamically.

---

## Installation and Usage
### Prerequisites:
- **Docker** installed on your system.

### Steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo.git
   cd your-repo

2. Build the Docker image:
   ```bash
   docker build -t websocket_user_management .

3. Run the Docker container:
   ```bash
   docker run -d -p 8080:8080 websocket_user_management

4. Open the application in your browser:
   ```bash
   http://localhost:8080

   




