let db = {
    getData: function() {
        return this.data;
    },
    addElement: function(sFileOrFolder, sName) {
        this.data[sName] = sFileOrFolder === 'folder' ? {} : '';
    },
    addFolder: function(sName) {
        this.data[sName] = {};
    },
    addFile: function(sName) {
        this.data[sName] = '';
    },
    data: {}
};
let $ = function (element) {
    return document.getElementById(element);
};


db.data.some = 'works';
db.data.folder = {};
db.data.wow = {};
for(let i = 0; i < 100; i++) {
    db.data[`wow${i}`] = {};
}
console.log('Hey');
updateFilesList();


function createItem(sModalId) {
    let inputValue = $('itemName').value;
    $('itemName').value = '';

    var folderOrFile = $('descriptionPlaceholder').innerText.match(/folder|file/gi).shift();
    db.addElement(folderOrFile, inputValue);

    updateFilesList();
    closeModal(sModalId);
}

function updateFilesList() {
    let filesList = $('files-list');
    while (filesList.firstChild) {
        filesList.removeChild(filesList.firstChild);
    }

    let data = db.getData();
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            let isFolder = typeof data[key] === 'object';
            let div = document.createElement('div');

            let img = document.createElement('img');
            img.src = isFolder ? 'folder-open-solid.svg' : 'file-solid.svg';
            div.appendChild(img);

            let text = document.createTextNode(key);
            div.classList.add(isFolder ? 'data-folder' : 'data-file');
            div.appendChild(text);

            filesList.appendChild(div); 
        }
    }


}



function promptInput(sItemId, sType) {
    let description = $('descriptionPlaceholder');
    description.innerText = description.innerText.replace(/folder|file/gi, sType);
    $(sItemId).style.display = 'block';
}
function closeModal(sModalId) {
    $(sModalId).style.display = 'none';
}