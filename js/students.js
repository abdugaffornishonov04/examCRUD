import { instanceAxios } from "./axios.js";

let query = new URLSearchParams(location.search)

let teachersId = query.get("teachersId")

console.log(teachersId);

async function getStudentData (){
  try{
    let {data} = await instanceAxios.get(
      `teachers/${teachersId}/students`
    )
    console.log(data);
  } catch (err){
    console.log(err);
  }
}

getStudentData()