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
		
		deleteElement: sName => {
			delete db.data[sName];
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

				div.id = sName;
				div.classList.add(bIsFolder ? 'data-folder' : 'data-file');

        div.addEventListener('click', this.toggleSelected);
        div.addEventListener('contextmenu', this.showContextMenu);

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
    getContextMenu: function() {
        return $('context-menu');
    },
    showContextMenu: function(evt) {
        evt.preventDefault();

        if (this.classList) {
            ui.toggleSelected.call(this, evt);
        }

        let menu = ui.getContextMenu();
        menu.style.left = evt.pageX + 'px';
        menu.style.top = evt.pageY + 'px';
        menu.style.display = 'block';
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

    deleteSelected: function(evt) {
			ui.getFilesList().childNodes.forEach(el => {
				if (el.classList.contains('selectedItem')) {
					db.deleteElement(el.id);
				}
			});

			this.displayFiles();
    },

    displayFiles: function() {
        // removes all the divs that we had before
        ui.emptyFilesList();
    
        // loading current data and create items
        let data = db.getData();
        ui.populateFilesList(data);
    },

    showContextMenu: function(evt) {
        ui.showContextMenu(evt);
    }
};

document.onclick = function(e){
    ui.getContextMenu().style.display = 'none';
}

db.data.some = 'works';
db.data.folder = {};
db.data.wow = {};
for(let i = 0; i < 20; i++) {
    db.data[`wow${i}`] = i % 2 === 0 ? {} : '';
}
console.log('Hey');
handler.displayFiles();
