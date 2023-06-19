const form = document.querySelector('.course-form');
const instructor = document.getElementById('instructor');
const title = document.getElementById('title');
const image = document.getElementById('image');
const courseList = document.getElementById('course-tbody');

class Course {
    constructor(instructor, name, image) {
        this.courseID = Math.floor(Math.random()*10000);
        this.instructor = instructor;
        this.name = name;
        this.image = image;
    }
}

class UI {
    addCourseList(course) {
        let html = `
        <tr>
            <td><img src="./img/${course.image}" class="w-50"></td>
            <td>${course.instructor}</td>
            <td>${course.name}</td>
            <td><a href="#" data-id="${course.courseID}" class="btn btn-danger btn-sm btnDeleteCourse">Kursu Sil</a></td>
        </tr>`;

        courseList.innerHTML += html;
    }

    clearInputs() {
        instructor.value = "";
        title.value = "";
        image.value = "";
    }

    showAlert(message, className) {
        var alert = `
        <div class="alert alert-${className}" role="alert">
            ${message}
        </div>
        `
        const btnCourseAdd = document.getElementById('btnCourseAdd');
        btnCourseAdd.insertAdjacentHTML('afterend', alert);

        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    deleteCourse(deleteCourse) {
        deleteCourse.parentElement.parentElement.remove();
    }
}

class Storage {

    getCoursesStroge() {
        let courses;

        if (localStorage.getItem('courses') === null) {
            courses = [];
            localStorage.setItem('courses', JSON.stringify(courses));
        }
        else {
            courses = JSON.parse(localStorage.getItem('courses'));
        }

        return courses;
    }

    addCourseStroge(course) {
        console.log(course);
        const courses = JSON.parse(localStorage.getItem('courses'));
        courses.push(course);
        console.log(courses);
        localStorage.setItem('courses', JSON.stringify(courses));
    }

    displayStorage() {
        this.getCoursesStroge();

        const ui = new UI();
        const courses = JSON.parse(localStorage.getItem('courses'));

        courses.forEach(course => {
            ui.addCourseList(course);
        });
    }
    
    deleteFromStroge(deleteCourse) {
        const deleteCourseID = deleteCourse.getAttribute('data-id');

        console.log(deleteCourseID);

        const courses = this.getCoursesStroge();

        console.log(courses);

        courses.forEach((course, index) => {
            if (course.courseID == deleteCourseID) {
                courses.splice(courses.indexOf(course), 1);
            }
        });

        localStorage.setItem('courses', JSON.stringify(courses));
    }
}

const storage = new Storage();

storage.displayStorage();

courseList.addEventListener('click', function(e) {

    // Delete course from table
    if (e.target.classList.contains('btnDeleteCourse')) {
        const ui = new UI();
        const storage = new Storage();

        // Delete from UI
        ui.deleteCourse(e.target);

        // Delete from LocalStorage
        storage.deleteFromStroge(e.target);
    }

})

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Create UI object
    const ui = new UI();

    // Create Storage object
    const storage = new Storage();

    if (instructor.value === "" || title.value === "" || image.value === "") {
        // Give warning message
        ui.showAlert("Bilgileri doğru şekilde giriniz.", "warning");
    }
    else {
        const course = new Course(instructor.value, title.value, image.value);

        // Add course List 
        ui.addCourseList(course);

        // Add LocalStroge
        storage.addCourseStroge(course);

        // Clear inputs 
        ui.clearInputs();

        // Give success message
        ui.showAlert("Kurs kayıt işlemi başarılı.", "success");
    }
    
})