const mainInputForm = document.getElementById('input-form');
const enrollStudentBtn = document.getElementById('enroll-button');
const clearFieldsBtn = document.getElementById('clear-button');
const tableBody = document.getElementById('table-body');

class Student {
  constructor({ name, email, website, link, gender, skills }) {
    this.name = name;
    this.email = email;
    this.website = website;
    this.link = link;
    this.gender = gender;
    this.skills = skills;
  }
}

class UI {
  populateTable(records) {
    if (records.length < 1) {
      alert('No records available: Create one to get started!');
    } else {
      records.forEach((record) => {
        const newTableRow = document.createElement('tr');

        let studentSkills = '';

        record.skills.forEach((skill, index) => {
          if (index === record.skills.length - 1) {
            studentSkills += skill;
          } else {
            studentSkills += skill + ', ';
          }
        });

        let websiteLink = record.website;

        if (!websiteLink.includes('http')) {
          websiteLink = 'https://' + websiteLink;
        }

        if (studentSkills === '') {
          studentSkills = '<span>Student has no skills!</span>';
        }

        newTableRow.innerHTML = `
        <td>
          <p>${record.name}</p>
          <p>${record.gender}</p>
          <p>${record.email}</p>
          <a href="${websiteLink}">${record.website}</a>
          <p>${studentSkills}</p>
        </td>
        <td>
          <img alt="${record.name}" class="img-thumbnail" src="${record.link}">
        </td>`;

        tableBody.appendChild(newTableRow);
      });
    }
  }
}

class Store {
  static getData() {
    let students;

    if (!localStorage.getItem('students')) {
      students = [];
    } else {
      students = JSON.parse(localStorage.getItem('students'));
    }

    return students;
  }

  static display() {
    const students = Store.getData();

    const ui = new UI();

    ui.populateTable(students);
  }

  static create(record) {
    const students = Store.getData();
    let flag = 1;

    students.forEach((student) => {
      if (student.email === record.email) {
        flag = 0;
      }
    });

    if (flag) {
      students.push(record);
      localStorage.setItem('students', JSON.stringify(students));
      alert('Student record added!');
    } else {
      alert('A student with that email is already enrolled!');
    }
  }
}

// Event Listeners
window.addEventListener('DOMContentLoaded', Store.display);
mainInputForm.addEventListener('submit', (e) => submitForm(e));
clearFieldsBtn.addEventListener('click', (e) => clearFields(e));

// Callback Functions to Event Listeners & other utils
const clearFields = (e) => {
  mainInputForm.reset();
  e.preventDefault();
};

const submitForm = (e) => {
  let target = e.target;
  const neededElements = [
    'name',
    'email',
    'website',
    'link',
    'gender',
    'skills',
    'css',
    'java',
    'html',
  ];

  const skills = [];
  const formObj = {};

  for (let i of neededElements) {
    const targetElement = target.elements[i];

    if (i === 'java' || i === 'html' || i === 'css') {
      if (targetElement.checked) {
        skills.push(targetElement.value);
      }
    } else {
      formObj[i] = targetElement.value;
    }
  }

  formObj['skills'] = skills;

  const student = new Student(formObj);

  const ui = new UI();
  ui.populateTable([student]);

  Store.create(student);

  clearFields(e);

  e.preventDefault();
};
