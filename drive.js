let $ = function (element) {
    return document.getElementById(element);
};
let db = {
    getData: function() {
        this.sortData();
        return this.data;
    },
    sortData: function() {
        let onlyFolders = {};
        let onlyFiles   = {};

        for (const key in this.data) {
            if (this.data.hasOwnProperty(key)) {
                if (typeof this.data[key] === 'object') {
                    onlyFolders[key] = this.data[key];
                } else {
                    onlyFiles[key] = this.data[key];
                }
            }
        }

        this.data = {...onlyFolders, ...onlyFiles};
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

let ui = {
    openModal: function(sItemId, sType) {
        if (sType) {
            let description = $('descriptionPlaceholder');
            description.innerText = description.innerText.replace(/folder|file/gi, sType);
        }
        $(sItemId).style.display = 'block';
    },
    closeModal: function(sModalId) {
        $(sModalId).style.display = 'none';
    },

    getFilesList: function() {
        return $('files-list');
    },
    populateFilesList: function(files) {
        let filesList = this.getFilesList();
        for (const name in files) {
            if (files.hasOwnProperty(name)) {
                let bIsFolder = typeof files[name] === 'object';
                filesList.appendChild(this.createItem(bIsFolder, name)); 
            }
        }
    },
    emptyFilesList: function() {
        let filesList = this.getFilesList();
        while (filesList.firstChild) {
            filesList.removeChild(filesList.firstChild);
        }
    },

    createItem: function(bIsFolder, sName) {
        let div = document.createElement('div');
        div.appendChild(this.createItemImage(bIsFolder));

        let text = document.createTextNode(sName);
        div.appendChild(text);

        div.classList.add(bIsFolder ? 'data-folder' : 'data-file');

        div.addEventListener('click', this.toggleSelected);

        return div;
    },
    createItemImage: function(bIsFolder) {
        let img = document.createElement('img');
        img.src = bIsFolder ? 'folder-open-solid.svg' : 'file-solid.svg';
        return img;
    },

    toggleSelected: function(evt) {
        this.classList.toggle("selectedItem");
    },

    getInputValue: function(sId) {
        let inputValue = $(sId).value;
        $(sId).value = '';
        return inputValue;
    },
    getFolderOrFile: function() {
        return $('descriptionPlaceholder').innerText.match(/folder|file/gi).shift();
    }
};

let handler = {
    openModal: function(sItemId, sType) {
        ui.openModal(sItemId, sType);
    },
    closeModal: function(sModalId) {
        ui.closeModal(sModalId);
    },

    createItem: function(sModalId) {
        db.addElement(ui.getFolderOrFile(), ui.getInputValue('itemName'));
    
        this.displayFiles();
        ui.closeModal(sModalId);
    },

    displayFiles: function() {
        // removes all the divs that we had before
        ui.emptyFilesList();
    
        // loading current data and create items
        let data = db.getData();
        ui.populateFilesList(data);
    },
};

db.data.some = 'works';
db.data.folder = {};
db.data.wow = {};
for(let i = 0; i < 20; i++) {
    db.data[`wow${i}`] = i % 2 === 0 ? {} : '';
}
console.log('Hey');
handler.displayFiles();
