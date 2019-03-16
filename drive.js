let db = {
    addFolder: function(sName) {
        this.data[sName] = {};
    },
    data: {}
};
let $ = function (element) {
    return document.getElementById(element);
};



console.log('Hey');
db.data.some = 'works';

function createItem(sModalId) {
    let inputValue = $('itemName').value;
    $('itemName').value = '';
    db.addFolder(inputValue);
    closeModal(sModalId);
}



function promptInput(sItemId) {
    $(sItemId).style.display = 'block';
}

function closeModal(sModalId) {
    $(sModalId).style.display = 'none';
}