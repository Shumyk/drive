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
            const element = data[key];
            
            let isFolder = typeof element === 'object';
            let div = document.createElement('div');
            let text = document.createTextNode(key);
            div.classList.add(isFolder ? 'data-folder' : 'data-file');

            let img = document.createElement('img');
            img.src = isFolder ? 'folder.png' : 'file.png';
            div.appendChild(img);
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