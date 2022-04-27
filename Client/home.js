const button1= document.getElementById("btn1");
const button2=document.getElementById("btn2");
const createID=document.getElementById("createID");
const joinID=document.getElementById("joinID");
var socket = io();

button1.onclick= ()=>{
    if(joinID.value){
        socket.emit('joinID', joinID.value);
        window.location.pathname="/p1";
    } else {
        window.alert("Please Enter A Valid Game #ID");
    };
    
}
console.log(createID.value);

button2.onclick= ()=>{
    if(joinID.value){
        socket.emit('joinID', joinID.value);
        window.location.pathname="/p2";
    } else {
        window.alert("Please Enter A Valid Game #ID");
    };
}


