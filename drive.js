let db = {
    getData: function() {
        return this.data;
    },
    addFolder: function(sName) {
        this.data[sName] = {};
    },
    data: {}
};
let $ = function (element) {
    return document.getElementById(element);
};



console.log('Hey');
updateFilesList();
db.data.some = 'works';

function createItem(sModalId) {
    let inputValue = $('itemName').value;
    $('itemName').value = '';
    db.addFolder(inputValue);
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
            
            let div = document.createElement('div');
            let text = document.createTextNode(key);
            div.classList.add(typeof element === 'object' ? 'data-folder' : 'data-file');
            div.appendChild(text);
            filesList.appendChild(div); 
        }
    }


}



function promptInput(sItemId) {
    $(sItemId).style.display = 'block';
}

function closeModal(sModalId) {
    $(sModalId).style.display = 'none';
}