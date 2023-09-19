import { instanceAxios } from "./axios.js";
import { LIMIT } from "./const.js";


let heroRow = document.querySelector( ".hero-row" );
let searchInput = document.querySelector( ".search-input" );
let teachersTotal = document.querySelector( ".teachers-total p" );
let pagination = document.querySelector( ".pagination" );
let teacherForm = document.querySelector( ".teacher-form" );
let teacherModall = document.querySelector( "#teacherModal" );
let mainAddTeacher = document.querySelector( ".main-add-teacher" );
let theSubmitBtn = document.querySelector( ".add-teacher-submit-btn" );
let isMarriedSelect = document.querySelector( ".teacher-ismarried-select" );
let lastNameSelect = document.querySelector( ".lastNameselect-ascdesc" );

let search = "";
let activePage = 1;
let selected = null;

// the HTML of teacher

function teacherHTML( el ) {
  return `
  <div class="hero-card border border-secondary rounded">
  <div class="hero-card-image-box">
    <img src="${el.avatar}" alt="">
    <p class="teacher-firstname">${el.firstName}</p>
    <p class="teacher-lastname">${el.lastName}</p>
  </div>
  <div class="hero-card-body">
    <p class="techer-groups-groups">Groups</p>
    <p class="teacher-groups">No groups</p>
    <p class="teacher-ismarried border border-secondary rounded">${el.isMarried ? "Married" : "Not Married"}</p>
    <p class="teacher-phone-number border border-secondary rounded">${el.phoneNumber}</p>
    <a href="#" class="teacher-email border border-secondary rounded">${el.email}</a>
    <div class="teacher-buttons-wrapper">
      <a href="students.html?teachersId=${el.id}" class="teacher-see-students bg-primary border rounded">See students</a>
      <div class="teacher-edit-delete-btns">
        <button editId="${el.id}" class="teacher-edit btn btn-success" data-bs-toggle="modal" data-bs-target="#teacherModal">Edit</button>
        <button deleteId="${el.id}" class="teacher-delete btn btn-danger">Delete</button>
      </div>
    </div>
  </div>
</div>
  `
}

// mapping and pagination of teachers
// all good except for the two asc and ismarried 1 2 3 4 5  6 7 8 9 5481254854 754 23547354 37543 4343 4753 2

async function getTeacherData() {
  try {

    let params = { firstName: search }
    let { data } = await instanceAxios( "teachers", { params } );
    params = { ...params, page: activePage, limit: LIMIT }
    let { data: dataPagination } = await instanceAxios( "teachers", { params } );
    // console.log(data);

    heroRow.innerHTML = "";
    dataPagination.map( ( el ) => {
      heroRow.innerHTML += teacherHTML( el )
    } )

    let dataLength = data.length;

    teachersTotal.textContent = dataLength;

    let pages = Math.ceil( dataLength / LIMIT );

    pagination.innerHTML = `
    <li class="page-item">
      <button pagesAtt="-" class="page-link  ${activePage == 1 ? "disabled" : ""}">Previous</button>
    </li>
    `

    for ( let page = 1; page <= pages; page++ ) {



      pagination.innerHTML += `<li class="page-item ${activePage == page ? "active" : ""}"><button pagesAtt="${page}" class="page-link">${page}</button></li>`
    }

    pagination.innerHTML += `
    <li class="page-item">
      <button pagesAtt="+" class="page-link  ${activePage == pages ? "disabled" : ""}">Next</button>
    </li>
    `

    if ( dataLength <= LIMIT ) {
      pagination.innerHTML = ""
    }


  } catch ( err ) {
    console.log( err );
  }

}

getTeacherData()

// search of teachers

searchInput.addEventListener( "keyup", function () {
  search = this.value;
  activePage = 1;
  getTeacherData()
} )

// pagination logic of teacher

pagination.addEventListener( "click", ( e ) => {
  let page = e.target.getAttribute( "pagesAtt" );

  if ( page == "-" ) {
    activePage--;
  } else if ( page == "+" ) {
    activePage++
  } else {
    activePage = +page
  }

  getTeacherData()
} )

// teacher for submitting

teacherForm.addEventListener( "submit", async function ( e ) {
  e.preventDefault();

  try {
    if ( this.checkValidity() ) {
      let teacher = {
        firstName: this.firstNameTeacher.value,
        lastName: this.lastNameTeacher.value,
        avatar: this.avatarImageTeacher.value,
        groups: this.teacherGroupsEnter.value,
        isMarried: this.isMarriedCheckTeacher.checked,
        phoneNumber: this.teacherPhoneNumber.value,
        email: this.teacherEmail.value
      }

      if ( selected === null ) {
        await instanceAxios.post( "teachers", teacher );
      } else {
        await instanceAxios.put( `teachers/${selected}`, teacher )
      }

      bootstrap.Modal.getInstance( teacherModall ).hide()
      getTeacherData()
    } else {
      this.classList.add( "was-validated" )
    }
  } catch ( err ) {
    console.log( err );
  }
} )

/// clearning the add btn when clicked so that the previous values does not stay

mainAddTeacher.addEventListener( "click", () => {
  teacherForm.firstNameTeacher.value = "",
    teacherForm.lastNameTeacher.value = "",
    teacherForm.avatarImageTeacher.value = "",
    teacherForm.teacherGroupsEnter.value = "",
    teacherForm.isMarriedCheckTeacher.checked,
    teacherForm.teacherPhoneNumber.value = "",
    teacherForm.teacherEmail.value = ""

  theSubmitBtn.textContent = "Add teacher";
  selected = null;
} )

// edit and delete

heroRow.addEventListener( "click", async function ( e ) {
  let editID = e.target.getAttribute( "editId" );
  let deleteID = e.target.getAttribute( "deleteId" );

  try {
    if ( editID ) {
      selected = editID;
      theSubmitBtn.textContent = "Change Teacher"
      let { data } = await instanceAxios.get( `teachers/${editID}` )
      console.log( data )
      teacherForm.firstNameTeacher.value = data.firstName,
        teacherForm.lastNameTeacher.value = data.lastName,
        teacherForm.avatarImageTeacher.value = data.avatar,
        teacherForm.teacherGroupsEnter.value = data.groups,
        teacherForm.isMarriedCheckTeacher.checked = data.isMarried,
        teacherForm.teacherPhoneNumber.value = data.phoneNumber,
        teacherForm.teacherEmail.value = data.email

      theSubmitBtn.addEventListener( "click", () => {
        bootstrap.Modal.getInstance( teacherModall ).hide()
      } )
    }

    if ( deleteID ) {
      let deleteConfirm = confirm( "Do you want do delete this teachers data?" )
      if ( deleteConfirm ) {
        await instanceAxios.delete( `teachers/${deleteID}` );
        getTeacherData()
      }
    }
  } catch ( err ) {
    console.log( err );
  }
} )

// teacher married filter

isMarriedSelect.addEventListener( "change", async function () {

  let { data } = await instanceAxios( "teachers" );
  //  console.log(data);
  if ( this.value === "isMarried" ) {
    let isMarrieddata = data.filter( ( el ) => el.isMarried == true )
    console.log( isMarrieddata );
    console.log( "is married" );
    teachersTotal.textContent = isMarrieddata.length

    heroRow.innerHTML = ""
    isMarrieddata.map( ( el ) => {
      heroRow.innerHTML += teacherHTML( el )
    } )
  }

  if ( this.value === "notMarried" ) {
    let notMarrieddata = data.filter( ( el ) => el.isMarried == false );
    console.log( notMarrieddata );
    heroRow.innerHTML = ""
    teachersTotal.textContent = notMarrieddata.length
    notMarrieddata.map( ( el ) => {
      heroRow.innerHTML += teacherHTML( el )
    } )
  }

  if ( this.value === "all" ) {
    getTeacherData()
    console.log( "alllll" );
  }
} )


///all good 1 2 3 4 5 6
///is married sort done
//////u43r4 4 t 9r e9r edd dgede  ey3eee e eg yeg7te 3ete wwwgvdvw d

lastNameSelect.addEventListener( "click", async function () {
  let { data } = await instanceAxios( "teachers" );


  if ( this.value === "asc" ) {
    let ascData = data.sort( ( a, b ) => ( a.lastName > b.lastName ? 1 : -1 ) )
    // console.log( ascData );
    // console.log( "asc" );
    teachersTotal.textContent = ascData.length

    heroRow.innerHTML = ""
    ascData.map( ( el ) => {
      heroRow.innerHTML += teacherHTML( el )
    } )
    // console.log( "asc" );
  }
  if ( this.value === "desc" ) {
    let descData = data.sort( ( a, b ) => ( a.lastName > b.lastName ? -1 : 1 ) );
    // console.log( descData );
    // console.log( "desc" );
    teachersTotal.textContent = descData.length

    heroRow.innerHTML = ""
    descData.map( ( el ) => {
      heroRow.innerHTML += teacherHTML( el )
    } )
    // console.log( "desc" );
  }
  if ( this.value === "allascdesc" ) {
    console.log( "all" );
    getTeacherData()
  }
} )

/////teacher all done except for the phone regex
// so i am counting to 20 so that when i screw the code up, I am restoring back it
/// start  1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20