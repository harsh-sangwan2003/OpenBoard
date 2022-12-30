let optionsCont = document.querySelector('.options-cont');
let toolsCont = document.querySelector('.tools-cont');
let pencilCont = document.querySelector('.pencil');
let eraserCont = document.querySelector('.eraser');
let pencilToolCont = document.querySelector('.pencil-tool-cont');
let eraserToolCont = document.querySelector('.eraser-tool-cont');
let stickyNoteCont = document.querySelector('.sticky-note');
let uploadCont = document.querySelector('.upload');

let optionFlag = true;
let pencilContFlag = false;
let eraserContFlag = false;

optionsCont.addEventListener("click", e => {

    optionFlag = !optionFlag;

    if (optionFlag)
        openTools();

    else
        closeTools();
})

function openTools() {

    let iconEle = optionsCont.children[0];
    iconEle.classList.remove('fa-times');
    iconEle.classList.add('fa-bars');
    toolsCont.style.display = "flex";
}

function closeTools() {

    let iconEle = optionsCont.children[0];
    iconEle.classList.remove('fa-bars');
    iconEle.classList.add('fa-times');

    toolsCont.style.display = "none";
    pencilToolCont.style.display = "none";
    eraserToolCont.style.display = "none";
}

pencilCont.addEventListener("click", e => {

    pencilContFlag = !pencilContFlag;

    if (pencilContFlag)
        pencilToolCont.style.display = "block";

    else
        pencilToolCont.style.display = "none";
})

eraserCont.addEventListener("click", e => {

    eraserContFlag = !eraserContFlag;

    if (eraserContFlag)
        eraserToolCont.style.display = "flex";

    else
        eraserToolCont.style.display = "none";
})

uploadCont.addEventListener("click", e => {

    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", e => {

        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickyTemplateHTML = `
        <div class="header-cont">
           <div class="minimize"></div>
           <div class="remove"></div>
        </div>

        <div class="note-cont">
           <img src="${url}">
        </div>
        `;

        createSticky(stickyTemplateHTML);
    })
})

function createSticky(stickyTemplateHTML){

    let stickyCont = document.createElement("div");

    stickyCont.setAttribute("class", "sticky-cont");
    stickyCont.innerHTML = stickyTemplateHTML;

    let minimize = stickyCont.querySelector('.minimize');
    let remove = stickyCont.querySelector('.remove');

    document.body.appendChild(stickyCont);

    stickyCont.onmousedown = function (event) {

        dragAndDrop(stickyCont, event);
    };

    stickyCont.ondragstart = function () {

        return false;
    }

    noteActions(minimize, remove, stickyCont);
}

stickyNoteCont.addEventListener("click", e => {

    let stickyTemplateHTML = `
        <div class="header-cont">
           <div class="minimize"></div>
           <div class="remove"></div>
        </div>

        <div class="note-cont">
           <textarea spellcheck="false"></textarea>
        </div>
    `;

    createSticky(stickyTemplateHTML);
})

function noteActions(minimize, remove, stickyCont) {

    remove.addEventListener("click", e => {

        stickyCont.remove();
    })

    minimize.addEventListener("click", e => {

        let noteCont = stickyCont.querySelector(".note-cont");
        let display = getComputedStyle(noteCont).getPropertyValue("display");

        if (display === "none")
            noteCont.style.display = "block";

        else
            noteCont.style.display = "none";
    })
}

function dragAndDrop(element, event) {

    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {

        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {

        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    element.onmouseup = function () {

        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    }

}