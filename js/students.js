import { instanceAxios } from "./axios.js";

let mainRow = document.querySelector( ".student-row" );
let studentsTotal = document.querySelector( ".students-total p" );
let studentForm = document.querySelector( ".student-form" );
let studentModal = document.querySelector( "#studentModal" );
let mainAddStudent = document.querySelector( ".main-add-student" );
let theSubmitBtn = document.querySelector( ".add-student-submit-btn" );
let studentsTeachers = document.querySelector(".students-teacher-select");
let birthdayAD = document.querySelector(".birthday-ascdesc")

let selected = null;

// getting data from teachers
let query = new URLSearchParams( location.search )

let teachersId = query.get( "teachersId" );

console.log( teachersId );

// students HTML

function studentsHTMl( el ) {
  let birthdaynew =  el.birthday.split("T")[0];
  return `
  <div class="student-card border rounded border-info">
    <div class="card-left">
      <div class="student-card-image border rounded border-info">
        <img src="${el.avatar}" alt="" />
        <p class="student-firstname">${el.firstName}</p>
        <p class="student-lastName">${el.lastName}</p>
        <p class="student-birthday">${birthdaynew}</p>
      </div>
    </div>
    <div class="card-right">
      <p
        class="w-100 p-2 border rounded student-iswork"
      >
        ${el.isWork}
      </p>
      <p
        class="w-100 p-2 border rounded student-field"
      >
        ${el.field}
      </p>
      <p
        class="w-100 p-2 border rounded student-phoneNumber"
      >
        ${el.phoneNumber}
      </p>
      <p
        class="w-100 p-2 border rounded student-email"
      >
        ${el.email}
      </p>
      <div
        class="student-card-btn-wrapper d-flex justify-content-center gap-1"
      >
        <button
         data-bs-toggle="modal"
         data-bs-target="#studentModal"
          studentEditId="${el.id}"
          class="student-edit btn btn-success w-100"
        >
          Edit
        </button>
        <button
          studentDeleteId="${el.id}"
          class="student-delete btn btn-danger w-100"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
  `
}


async function getStudentData() {
  try {

    
    let { data } = await instanceAxios( `teachers/${teachersId}/students` );

    mainRow.innerHTML = "";
    data.map( ( el ) => {
      mainRow.innerHTML += studentsHTMl( el )
    } )

    studentsTotal.textContent = data.length;


  } catch ( err ) {
    console.log( err );
  }

}

getStudentData()


// pagination logic of teacher

// teacher for submitting

studentForm.addEventListener( "submit", async function ( e ) {
  e.preventDefault();

  try {
    if ( this.checkValidity() ) {
      let student = {
        firstName: this.firstNameStudent.value,
        lastName: this.lastNameStudent.value,
        avatar: this.avatarImageStudent.value,
        birthday: this.birthdayStudent.value,
        field: this.studentFieldname.value,
        isWork: this.isWorkStudentCheck.checked,
        phoneNumber: this.studentPhoneNumber.value,
        email: this.studentEmail.value
      }

      if ( selected === null ) {
        await instanceAxios.post( `teachers/${teachersId}/students`, student );
      } else {
        await instanceAxios.put( `teachers/${selected}/students/${teachersId}`, student )
      }

      bootstrap.Modal.getInstance( studentModal ).hide()
      getStudentData()
    } else {
      this.classList.add( "was-validated" )
    }
  } catch ( err ) {
    console.log( err );
  }
} )

/// clearning the add btn when clicked so that the previous values does not stay

mainAddStudent.addEventListener( "click", () => {
  studentForm.firstNameStudent.value = "",
      studentForm.lastNameStudent.value = "",
      studentForm.avatarImageStudent.value = "",
      studentForm.birthdayStudent.value = "",
      studentForm.studentFieldname.value = "",
      studentForm.isWorkStudentCheck.checked = false,
      studentForm.studentPhoneNumber.value = "",
      studentForm.studentEmail.value = ""

  theSubmitBtn.textContent = "Add teacher";
  selected = null;
} )

// edit and delete

mainRow.addEventListener( "click", async function ( e ) {
  let editID = e.target.getAttribute( "studentEditId" );
  let deleteID = e.target.getAttribute( "studentDeleteId" );

  try {
    if ( editID ) {
      selected = editID;
      theSubmitBtn.textContent = "Change Teacher"
      let { data } = await instanceAxios.get( `teachers/${teachersId}/students${editID}` )
      console.log( data )
      studentForm.firstNameStudent.value = data.firstName,
      studentForm.lastNameStudent.value = data.lastName,
      studentForm.avatarImageStudent.value = data.avatar,
      studentForm.birthdayStudent.value = data.birthday,
      studentForm.studentFieldname.value = data.field,
      studentForm.isWorkStudentCheck.checked = data.isWork,
      studentForm.studentPhoneNumber.value = data.phoneNumber,
      studentForm.studentEmail.value = data.email

      theSubmitBtn.addEventListener( "click", () => {
        bootstrap.Modal.getInstance( studentModal ).hide()
      } )
    }

    if ( deleteID ) {
      let deleteConfirm = confirm( "Do you want do delete this teachers data?" )
      if ( deleteConfirm ) {
        await instanceAxios.delete( `teachers/${teachersId}/students/${deleteID}` );
        getStudentData()
      }
    }
  } catch ( err ) {
    console.log( err );
  }
} )

////// working good 1 2 3 4  5  6 7  6 5 4  3 2  1 

async function getteacherinstudents(){
  let {data} = await instanceAxios("teachers");
  data.map((el) => {
    studentsTeachers.innerHTML += `
    <option teacherId="${el.id}" value="${el.firstName}" selected>${el.firstName}</option>
    `
  })
}
getteacherinstudents()

studentsTeachers.addEventListener("change", async function(){
  console.log(this.value);

  let {data} = await instanceAxios("teachers")
  let filtered = data.filter((el) => el.firstName == this.value);
  console.log(filtered);
  
  mainRow.innerHTML = ""
  filtered.map(async (el) => {
    let { data } = await instanceAxios( `teachers/${el.id}/students` );
    data.map((el) => {
      mainRow.innerHTML += studentsHTMl(el)
    })
  })
  
})

// teachers done


birthdayAD.addEventListener( "change", async function () {
  let { data } = await instanceAxios( `teachers/${teachersId}/students` );

  if ( this.value === "birthday-asc" ) {
    let ascData = data.sort( ( a, b ) => ( new Date( a.birthday ) > new Date( b.birthday ) ? 1 : -1 ) )
    // console.log( ascData );
    // console.log( "asc" );
    studentsTotal.textContent = ascData.length

    mainRow.innerHTML = ""
    ascData.map( ( el ) => {
      mainRow.innerHTML += studentsHTMl( el )
    } )
    // console.log( "asc" );
  }
  if ( this.value === "birthday-desc" ) {
    let descData = data.sort( ( a, b ) => ( new Date( a.birthday ) > new Date( b.birthday ) ? -1 : 1 ) );
    // console.log( descData );
    // console.log( "desc" );
    studentsTotal.textContent = descData.length

    mainRow.innerHTML = ""
    descData.map( ( el ) => {
      mainRow.innerHTML += studentsHTMl( el )
    } )
    // console.log( "desc" );
  }
  if ( this.value === "allbirthday" ) {
    console.log( "all" );
    getStudentData()
  }
} )
