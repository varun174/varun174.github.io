var employeeData;

function hello(flag){
var result="";
var StrEmployeeTable = '';

StrEmployeeTable = '<table class="table table-hover  table-bordered">';
StrEmployeeTable = StrEmployeeTable +  '<thead class="thead-dark">';
StrEmployeeTable = StrEmployeeTable + '<tr><th scope="col">EmployeeId</th><th scope="col">Name</th><th scope="col">Last</th><th scope="col">Place</th><th scope="col">State</th></tr>';
StrEmployeeTable = StrEmployeeTable +  '</thead>';

StrEmployeeTable = StrEmployeeTable + ' <tbody>';
for(var i=0;i<9;i++) {
if(flag ==0){

 StrEmployeeTable = StrEmployeeTable + ' <tr><th scope="row">'+(i+101)+'</th><td>'+employeeData[i].First+'</td><td>'+employeeData[i].Last+'<td>'+employeeData[i].Place+'</td><td>'+employeeData[i].State+'</td></tr>'; 
}

else if(flag ==1){
	if(i%2 !=0 ) {
 StrEmployeeTable = StrEmployeeTable + ' <tr><th scope="row">'+(i+101)+'</th><td>'+employeeData[i].First+'</td><td>'+employeeData[i].Last+'<td>'+employeeData[i].Place+'</td><td>'+employeeData[i].State+'</td></tr>'; 
}
}
else if(flag ==2){
	if(i%2 ==0 ) {
 StrEmployeeTable = StrEmployeeTable + ' <tr><th scope="row">'+(i+101)+'</th><td>'+employeeData[i].First+'</td><td>'+employeeData[i].Last+'<td>'+employeeData[i].Place+'</td><td>'+employeeData[i].State+'</td></tr>'; 
}
}
}
StrEmployeeTable = StrEmployeeTable + '</tbody>';
StrEmployeeTable = StrEmployeeTable + '</table>';

	
for (var i=0; i<9;i++) {
	result = result +(i+101)+"." +""+employeeData[i].First+",&nbsp;"+employeeData[i].Last+""+employeeData[i].Place+""+employeeData[i].State+"<br><br>";
    
   } 
console.log(result);   
document.getElementById("result").innerHTML=StrEmployeeTable;
}





function even(){
var result="";
var StrEmployeeTable = '';

StrEmployeeTable = '<table class="table table-hover  table-bordered">';
StrEmployeeTable = StrEmployeeTable +  '<thead>';
StrEmployeeTable = StrEmployeeTable + '<tr><th scope="col">#</th><th scope="col">Name</th><th scope="col">Last</th><th scope="col">Place</th></tr>';
StrEmployeeTable = StrEmployeeTable +  '</thead>';

StrEmployeeTable = StrEmployeeTable + ' <tbody>';
for(var i=0;i<9;i++) {
	if(i%2 !=0 ) {
 StrEmployeeTable = StrEmployeeTable + ' <tr><th scope="row">'+(i+101)+'</th><td>'+employeeData[i].First+'</td><td>'+employeeData[i].Last+'<td>'+employeeData[i].Place+'</td></tr>'; 
}
}
StrEmployeeTable = StrEmployeeTable + '</tbody>';
StrEmployeeTable = StrEmployeeTable + '</table>';
for (var i=0; i<9;i++) {
	result = result +(i+101)+"." +""+employeeData[i].First+",&nbsp;"+employeeData[i].Last+""+employeeData[i].Place+"<br><br>";
    
   } 
console.log(result);   
document.getElementById("result").innerHTML=StrEmployeeTable;
}

function odd(){
var result="";
var StrEmployeeTable = '';

StrEmployeeTable = '<table class="table table-hover  table-bordered">';
StrEmployeeTable = StrEmployeeTable +  '<thead>';
StrEmployeeTable = StrEmployeeTable + '<tr><th scope="col">#</th><th scope="col">Name</th><th scope="col">Last</th><th scope="col">Place</th></tr>';
StrEmployeeTable = StrEmployeeTable +  '</thead>';

StrEmployeeTable = StrEmployeeTable + ' <tbody>';
for(var i=0;i<9;i++) {
	if(i%2 ==0 ) {
 StrEmployeeTable = StrEmployeeTable + ' <tr><th scope="row">'+(i+101)+'</th><td>'+employeeData[i].First+'</td><td>'+employeeData[i].Last+'<td>'+employeeData[i].Place+'</td></tr>'; 
}
}
StrEmployeeTable = StrEmployeeTable + '</tbody>';
StrEmployeeTable = StrEmployeeTable + '</table>';
for (var i=0; i<9;i++) {
	result = result +(i+101)+"." +""+employeeData[i].First+",&nbsp;"+employeeData[i].Last+""+employeeData[i].Place+"<br><br>";
    
   } 
console.log(result);   
document.getElementById("result").innerHTML=StrEmployeeTable;
}

function eraseText() {
	 document.getElementById("result").innerHTML="";
}
employeeData=
 [{
  "First":"Varun",
  "Last": "Reddy",
  "Place": "Kadapa",
  "State": "AP"
},
{
  "First":"naveen",
  "Last": "T",
  "Place": "Proddatur",
  "State": "AP"
},
{
  "First":"Ria",
  "Last":"Kunchala",
  "Place":"Miryalguda",
  "State":"Telengana"
},
{
  "First":"Saiteja",
  "Last":"Mubarakpur",
  "Place":"Sangareddy",
  "State":"Telengana"
},
{
  "First":"Danisha",
  "Last":"Shaik",
  "Place":"Palamanir",
  "State":"AP"
},
{
  "First":"Sreenidhi",
  "Last":"Chapadi",
  "Place":"Rajamundry",
  "State":"AP"
},
{
  "First":"Pujitha",
  "Last":"Duppala",
  "Place":"Vizag",
  "State":"Ap"
},
{
  "First":"Udhay ",
  "Last":"Kumar",
  "Place":"Banglore",
  "State":"Karnataka"
},
{
  "First":"Ghansgyam",
  "Last":"Bhatt",
  "Place":"Lucknow",
  "State":"UP"
}]

	
  