let pencilColorCont = document.querySelectorAll('.pencil-color');
let pencilWidth = document.querySelector('.pencil-width');
let eraserWidth = document.querySelector('.eraser-width');
let download = document.querySelector('.download');
let canvas = document.querySelector('canvas');
let undo = document.querySelector('.undo');
let redo = document.querySelector('.redo');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let mouseDown = false;
let penColor = "red";
let eraserColor = "white";
let penWidthValue = pencilWidth.value;
let eraserWidthValue = eraserWidth.value;
let track = 0;
let undoRedoTracker = [];

//Api
let tool = canvas.getContext("2d");
tool.strokeStyle = penColor;
tool.lineWidth = penWidthValue;

canvas.addEventListener("mousedown",e=>{

    mouseDown = true;
    let data = {

        x:e.clientX,
        y:e.clientY
    }

    //Sending data from frontend to server
    socket.emit("beginPath",data);
})
canvas.addEventListener("mousemove",e=>{

    if(mouseDown)
    {
        let data = {

            x:e.clientX,
            y:e.clientY,
            color:eraserContFlag?eraserColor:penColor,
            width:eraserContFlag?eraserWidthValue:penWidthValue
        }
        socket.emit("drawStroke",data);
    }
})
canvas.addEventListener("mouseup",e=>{

    mouseDown = false;

    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length-1;
})

function beginPath(strokeObj){

    tool.beginPath();
    tool.moveTo(strokeObj.x,strokeObj.y);
}
function drawStroke(strokeObj){

    tool.lineWidth = strokeObj.width;
    tool.strokeStyle = strokeObj.color;
    tool.lineTo(strokeObj.x,strokeObj.y);
    tool.stroke();
}

pencilColorCont.forEach(colorEle=>{

    colorEle.addEventListener("click",e=>{

        let color = colorEle.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    })
})

pencilWidth.addEventListener("change",e=>{

    penWidthValue = pencilWidth.value;
    tool.lineWidth = penWidthValue;
})

eraserWidth.addEventListener("change",e=>{

    eraserWidthValue = eraserWidth.value; 
    tool.lineWidth = eraserWidthValue;
})

eraserCont.addEventListener("click",e=>{

    console.log(eraserContFlag);

    if(eraserContFlag){

        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidthValue;
    }

    else{

        tool.strokeStyle = penColor;
        tool.lineWidth = penWidthValue;
    }
})

download.addEventListener("click",e=>{

    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})

undo.addEventListener("click",e=>{

    if(track>0) track--;

    let data = {

        trackValue:track,
        undoRedoTracker
    }

    socket.emit("redoUndo",data);
})

redo.addEventListener("click",e=>{

    if(track<undoRedoTracker.length-1) track++;

    let data = {

        trackValue:track,
        undoRedoTracker
    }

    socket.emit("redoUndo",data);

})

function undoRedoCanvas(trackObj){

    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];

    let img = new Image();
    img.src = url;
    img.onload = (e)=>{

        tool.drawImage(img,0,0,canvas.width,canvas.height);
    }
}

socket.on("beginPath",(data)=>{

    //Data from server received
    beginPath(data);
})

socket.on("drawStroke",(data)=>{

    drawStroke(data);
})

socket.on("redoUndo",(data)=>{

    undoRedoCanvas(data);
})