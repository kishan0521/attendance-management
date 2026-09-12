// ========================================
// VTU ATTENDANCE MANAGEMENT SYSTEM
// ========================================


// Get HTML elements

const usnInput = document.getElementById("usn");
const nameInput = document.getElementById("studentName");
const semesterInput = document.getElementById("semester");

const addStudentBtn =
    document.getElementById("addStudentBtn");

const tableBody =
    document.getElementById("studentTableBody");

const searchInput =
    document.getElementById("searchInput");

const attendanceUSN =
    document.getElementById("attendanceUSN");

const attendanceStatus =
    document.getElementById("attendanceStatus");

const markAttendanceBtn =
    document.getElementById("markAttendanceBtn");

const attendanceMessage =
    document.getElementById("attendanceMessage");


// Load students from browser storage

let students =
    JSON.parse(localStorage.getItem("vtuStudents")) || [];


// ========================================
// ADD STUDENT
// ========================================

addStudentBtn.addEventListener("click", function () {

    const usn = usnInput.value.trim().toUpperCase();

    const name = nameInput.value.trim();

    const semester = semesterInput.value;


    // Validation

    if (usn === "" || name === "" || semester === "") {

        alert("Please enter all student details.");

        return;
    }


    // Check duplicate USN

    const existingStudent =
        students.find(student => student.usn === usn);

    if (existingStudent) {

        alert("This USN already exists.");

        return;
    }


    // Create student

    const newStudent = {

        usn: usn,

        name: name,

        semester: semester,

        held: 0,

        present: 0,

        absent: 0

    };


    students.push(newStudent);


    saveStudents();

    displayStudents();

    clearForm();

    alert("Student added successfully!");

});


// ========================================
// DISPLAY STUDENTS
// ========================================

function displayStudents(studentList = students) {

    tableBody.innerHTML = "";


    studentList.forEach(function (student) {

        let attendance = 0;

        if (student.held > 0) {

            attendance =
                (student.present / student.held) * 100;

        }


        attendance = attendance.toFixed(2);


        // Attendance status

        let status = "";
        let statusClass = "";

        if (attendance >= 85) {

            status = "Good";
            statusClass = "good";

        } else if (attendance >= 75) {

            status = "Warning";
            statusClass = "warning";

        } else {

            status = "Low";
            statusClass = "danger";

        }


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${student.usn}</td>

            <td>${student.name}</td>

            <td>${student.semester}</td>

            <td>${student.held}</td>

            <td>${student.present}</td>

            <td>${student.absent}</td>

            <td>${attendance}%</td>

            <td class="${statusClass}">
                ${status}
            </td>

            <td>
                <button
                    class="delete-btn"
                    onclick="deleteStudent('${student.usn}')">

                    Delete

                </button>
            </td>

        `;


        tableBody.appendChild(row);

    });


    updateDashboard();

}


// ========================================
// MARK ATTENDANCE
// ========================================

markAttendanceBtn.addEventListener(
    "click",
    function () {

        const usn =
            attendanceUSN.value.trim().toUpperCase();

        const status =
            attendanceStatus.value;


        if (usn === "") {

            attendanceMessage.textContent =
                "Please enter a USN.";

            attendanceMessage.style.color = "red";

            return;
        }


        const student =
            students.find(
                student => student.usn === usn
            );


        if (!student) {

            attendanceMessage.textContent =
                "Student not found.";

            attendanceMessage.style.color = "red";

            return;
        }


        // Increase classes held

        student.held++;


        if (status === "present") {

            student.present++;

        } else {

            student.absent++;

        }


        saveStudents();

        displayStudents();


        attendanceMessage.textContent =
            `Attendance marked as ${status.toUpperCase()} for ${student.name}.`;

        attendanceMessage.style.color = "green";


        attendanceUSN.value = "";

    }
);


// ========================================
// DELETE STUDENT
// ========================================

function deleteStudent(usn) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmDelete) {

        return;

    }


    students =
        students.filter(
            student => student.usn !== usn
        );


    saveStudents();

    displayStudents();

}


// ========================================
// SEARCH STUDENT
// ========================================

searchInput.addEventListener(
    "input",
    function () {

        const searchText =
            searchInput.value
                .trim()
                .toLowerCase();


        const filteredStudents =
            students.filter(function (student) {

                return (

                    student.usn
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    student.name
                        .toLowerCase()
                        .includes(searchText)

                );

            });


        displayStudents(filteredStudents);

    }
);


// ========================================
// DASHBOARD
// ========================================

function updateDashboard() {

    const totalStudents =
        students.length;


    document.getElementById(
        "totalStudents"
    ).textContent = totalStudents;


    let totalAttendance = 0;

    let studentsWithAttendance = 0;

    let lowAttendanceCount = 0;


    students.forEach(function (student) {

        if (student.held > 0) {

            const percentage =
                (student.present / student.held) * 100;


            totalAttendance += percentage;

            studentsWithAttendance++;


            if (percentage < 75) {

                lowAttendanceCount++;

            }

        }

    });


    let average = 0;


    if (studentsWithAttendance > 0) {

        average =
            totalAttendance /
            studentsWithAttendance;

    }


    document.getElementById(
        "averageAttendance"
    ).textContent =
        average.toFixed(2) + "%";


    document.getElementById(
        "lowAttendance"
    ).textContent =
        lowAttendanceCount;

}


// ========================================
// SAVE DATA
// ========================================

function saveStudents() {

    localStorage.setItem(
        "vtuStudents",
        JSON.stringify(students)
    );

}


// ========================================
// CLEAR FORM
// ========================================

function clearForm() {

    usnInput.value = "";

    nameInput.value = "";

    semesterInput.value = "";

}


// ========================================
// LOGOUT
// ========================================

document.getElementById("logoutBtn")
    .addEventListener("click", function () {

        alert("You have been logged out.");

    });


// ========================================
// INITIAL LOAD
// ========================================

displayStudents();