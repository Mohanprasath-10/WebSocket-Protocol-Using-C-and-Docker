let ws = new WebSocket('ws://localhost:8080');

// Handle connection open event
ws.onopen = () => {
    console.log('Connected to the server');
    const path = window.location.pathname;

    if (path.endsWith('students.html')) {
        fetchStudentData();
    } else if (path.endsWith('teachers.html')) {
        fetchTeacherData();
    } else if (path.endsWith('admins.html')) {
        fetchAdminData();
    }
};

// Handle messages received from the server
ws.onmessage = (event) => {
    const { action, data } = JSON.parse(event.data);

    switch (action) {
        case 'loginSuccess':
            window.location.href = 'dashboard.html'; // Redirect to dashboard after login
            break;

        case 'loginFailed':
            alert('Login failed! Please try again.');
            break;

        case 'studentsData':
            populateStudentTable(data);
            break;

        case 'teachersData':
            populateTeacherTable(data);
            break;

        case 'adminsData':
            populateAdminTable(data);
            break;

        case 'updateSuccess':
            alert('Operation successful!');
            reloadData(); // Reload data based on current page
            break;

        case 'updateFailed':
            alert('Operation failed! Please check the data.');
            break;

        default:
            console.error('Unknown action:', action);
            break;
    }
};

// Handle connection close event
ws.onclose = () => {
    console.log('WebSocket connection closed. Attempting to reconnect...');
    setTimeout(() => {
        ws = new WebSocket('ws://localhost:8080');
    }, 1000); // Retry every 1 second
};

// Handle errors
ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const addForm = document.getElementById('addForm');
    const addTeacherForm = document.getElementById('addTeacherForm');
    const addAdminForm = document.getElementById('addAdminForm');
    const updateForm = document.getElementById('updateForm');
    const editStudentButton = document.getElementById('editStudentButton');
    const saveStudentButton = document.getElementById('saveStudentChangesBtn');
    const editTeacherButton = document.getElementById('editTeacherButton');
    const saveTeacherButton = document.getElementById('saveTeacherChangesBtn');
    const editAdminButton = document.getElementById('editAdminButton');
    const saveAdminButton = document.getElementById('saveAdminChangesBtn');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ action: 'login', payload: { username, password } }));
            } else {
                console.error('WebSocket is not open. Current state:', ws.readyState);
            }
        });
    }

    if (addForm) {
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const item = {
                id: document.getElementById('id').value,
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                city: document.getElementById('city').value,
            };

            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ action: 'addStudent', payload: item }));
            } else {
                console.error('WebSocket is not open. Current state:', ws.readyState);
            }
        });
    }

    if (addTeacherForm) {
        addTeacherForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const item = {
                id: document.getElementById('id').value,
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                city: document.getElementById('city').value,
            };

            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ action: 'addTeacher', payload: item }));
            } else {
                console.error('WebSocket is not open. Current state:', ws.readyState);
            }
        });
    }

    if (addAdminForm) {
        addAdminForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const item = {
                id: document.getElementById('id').value,
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                city: document.getElementById('city').value,
            };

            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ action: 'addAdmin', payload: item }));
            } else {
                console.error('WebSocket is not open. Current state:', ws.readyState);
            }
        });
    }

    if (updateForm) {
        updateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const item = {
                id: document.getElementById('id').value,
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                city: document.getElementById('city').value,
            };

            const path = window.location.pathname;
            let action = '';
            if (path.includes('students.html')) {
                action = 'updateStudent';
            } else if (path.includes('teachers.html')) {
                action = 'updateTeacher';
            } else if (path.includes('admins.html')) {
                action = 'updateAdmin';
            }

            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ action: action, payload: item }));
            } else {
                console.error('WebSocket is not open. Current state:', ws.readyState);
            }
        });
    }

    if (editStudentButton) {
        editStudentButton.addEventListener('click', () => {
            toggleEditTable('studentTable', 'updateStudent');
            saveStudentButton.style.display = 'inline';
        });
    }

    if (saveStudentButton) {
        saveStudentButton.addEventListener('click', () => {
            saveTableChanges('studentTable', 'updateStudent');
        });
    }

    if (editTeacherButton) {
        editTeacherButton.addEventListener('click', () => {
            toggleEditTable('teacherTable', 'updateTeacher');
            saveTeacherButton.style.display = 'inline';
        });
    }

    if (saveTeacherButton) {
        saveTeacherButton.addEventListener('click', () => {
            saveTableChanges('teacherTable', 'updateTeacher');
        });
    }

    if (editAdminButton) {
        editAdminButton.addEventListener('click', () => {
            toggleEditTable('adminTable', 'updateAdmin');
            saveAdminButton.style.display = 'inline';
        });
    }

    if (saveAdminButton) {
        saveAdminButton.addEventListener('click', () => {
            saveTableChanges('adminTable', 'updateAdmin');
        });
    }
});

function fetchStudentData() {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ action: 'getStudents' }));
    } else {
        console.error('WebSocket is not open. Current state:', ws.readyState);
        setTimeout(fetchStudentData, 1000); // Retry after 1 second
    }
}

function fetchTeacherData() {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ action: 'getTeachers' }));
    } else {
        console.error('WebSocket is not open. Current state:', ws.readyState);
        setTimeout(fetchTeacherData, 1000); // Retry after 1 second
    }
}

function fetchAdminData() {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ action: 'getAdmins' }));
    } else {
        console.error('WebSocket is not open. Current state:', ws.readyState);
        setTimeout(fetchAdminData, 1000); // Retry after 1 second
    }
}

function populateStudentTable(students) {
    const tableBody = document.querySelector('#studentTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows
    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>${student.city}</td>
            <td><button onclick="deleteStudent('${student.id}')">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });
}

function populateTeacherTable(teachers) {
    const tableBody = document.querySelector('#teacherTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows
    teachers.forEach(teacher => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${teacher.id}</td>
            <td>${teacher.name}</td>
            <td>${teacher.email}</td>
            <td>${teacher.phone}</td>
            <td>${teacher.city}</td>
            <td><button onclick="deleteTeacher('${teacher.id}')">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });
}

function populateAdminTable(admins) {
    const tableBody = document.querySelector('#adminTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows
    admins.forEach(admin => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${admin.id}</td>
            <td>${admin.name}</td>
            <td>${admin.email}</td>
            <td>${admin.phone}</td>
            <td>${admin.city}</td>
            <td><button onclick="deleteAdmin('${admin.id}')">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });
}

function toggleEditTable(tableId, updateAction) {
    const table = document.getElementById(tableId);
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        row.querySelectorAll('td').forEach((cell, index) => {
            if (index < 5) { // Editable cells, assuming first 5 cells are editable
                cell.contentEditable = true;
            }
        });
    });
}

function saveTableChanges(tableId, updateAction) {
    const table = document.getElementById(tableId);
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const item = {
            id: row.cells[0].innerText, // Assuming ID is in the first cell
            name: row.cells[1].innerText,
            email: row.cells[2].innerText,
            phone: row.cells[3].innerText,
            city: row.cells[4].innerText
        };
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ action: updateAction, payload: item }));
        } else {
            console.error('WebSocket is not open. Current state:', ws.readyState);
        }
    });
}

function deleteStudent(id) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ action: 'deleteStudent', payload: { id } }));
    } else {
        console.error('WebSocket is not open. Current state:', ws.readyState);
    }
}

function deleteTeacher(id) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ action: 'deleteTeacher', payload: { id } }));
    } else {
        console.error('WebSocket is not open. Current state:', ws.readyState);
    }
}

function deleteAdmin(id) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ action: 'deleteAdmin', payload: { id } }));
    } else {
        console.error('WebSocket is not open. Current state:', ws.readyState);
    }
}

function reloadData() {
    const path = window.location.pathname;
    if (path.includes('students.html')) {
        fetchStudentData();
    } else if (path.includes('teachers.html')) {
        fetchTeacherData();
    } else if (path.includes('admins.html')) {
        fetchAdminData();
    }
}
