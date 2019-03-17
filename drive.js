let $ = function (element) {
	return document.getElementById(element);
};
let db = {
	getData: function () {
		this.sortData();
		return this.data;
	},
	sortData: function () {
		let onlyFolders = {};
		let onlyFiles = {};

		for (const key in this.data) {
			if (this.data.hasOwnProperty(key)) {
				if (typeof this.data[key] === 'object') {
					onlyFolders[key] = this.data[key];
				} else {
					onlyFiles[key] = this.data[key];
				}
			}
		}

		this.data = { ...onlyFolders, ...onlyFiles };
	},

	addElement: function (bIsFolder, sName) {
		let folder = ui.getCurrentFolder(db.getData());
		folder[sName] = bIsFolder ? {} : '';
	},

	addFolder: function (sName) {
		this.data[sName] = {};
	},
	addFile: function (sName) {
		this.data[sName] = '';
	},

	renameElement: (sOldName, sNewName) => {
		let folder = ui.getCurrentFolder(db.getData());
		folder[sNewName] = folder[sOldName];
		delete folder[sOldName];
	},

	deleteElement: function (sName) {
		let folder = ui.getCurrentFolder(db.getData());
		delete folder[sName];
	},

	data: {}
};

let ui = {
	location: '/',

	openModal: function (sItemId, sType) {
		if (sType) {
			let description = $('descriptionPlaceholder');
			description.innerText = description.innerText.replace(/folder|file/gi, sType);
		}
		$(sItemId).style.display = 'block';
	},
	closeModal: function (sModalId) {
		$(sModalId).style.display = 'none';
	},

	getFilesList: function () {
		return $('files-list');
	},
	getCurrentFolder(files) {
		let aLocation = ui.getLocation();
		for(let i = 0; i < aLocation.length; i++) {
				files = files[aLocation[i]];
		}
		return files;
	},
	getLocation: function () {
		return ui.location.split('/').filter(el => el !== '');
	},
	populateFilesList: function (files) {
		let filesList = this.getFilesList();

		files = ui.getCurrentFolder(files);

		if (ui.getLocation().length > 0) {
			filesList.appendChild(this.createParentFolder());
		}
		for (const name in files) {
			if (files.hasOwnProperty(name)) {
				let bIsFolder = typeof files[name] === 'object';
				filesList.appendChild(this.createItem(bIsFolder, name));
			}
		}
	},
	emptyFilesList: function () {
		let filesList = this.getFilesList();
		while (filesList.firstChild) {
			filesList.removeChild(filesList.firstChild);
		}
	},

	createParentFolder: () => {
		let div = document.createElement('div');
		div.appendChild(ui.createItemImage(true));
		
		let text = document.createTextNode('..');
		div.appendChild(text);

		div.id = 'parentFolder';
		div.classList.add('data-folder');

		div.addEventListener('click', ui.toggleSelected);
		div.addEventListener('dblclick', ui.openParentFolder);

		return div;
	},
	createItem: function (bIsFolder, sName) {
		let div = document.createElement('div');

		let innerDiv = document.createElement('div');
		innerDiv.id = sName;
		innerDiv.appendChild(ui.createItemImage(bIsFolder));

		let text = document.createTextNode(sName);
		innerDiv.appendChild(text);
		div.appendChild(innerDiv);
		
		div.id = sName;
		div.dataText = sName;
		div.classList.add(bIsFolder ? 'data-folder' : 'data-file');

		div.addEventListener('click', this.toggleSelected);
		div.addEventListener('dblclick', this.openItem);
		div.addEventListener('contextmenu', this.showContextMenu);

		return div;
	},
	createItemImage: function (bIsFolder) {
		let img = document.createElement('img');
		img.src = bIsFolder ? 'folder-open-solid.svg' : 'file-solid.svg';
		return img;
	},

	getSelectedItems: () => {
		let selectedItems = [];
		ui.getFilesList().childNodes.forEach(el => {
			if (el.classList.contains('selectedItem'))
				selectedItems.push(el);
		});
		return selectedItems;
	},
	toggleSelected: function (evt) {
		this.classList.toggle("selectedItem");
	},
	getContextMenu: function () {
		return $('context-menu');
	},
	showContextMenu: function (evt) {
		evt.preventDefault();

		if (this.classList && !this.classList.contains("selectedItem")) {
			this.classList.add("selectedItem");
		}

		let menu = ui.getContextMenu();
		menu.style.left = evt.pageX + 'px';
		menu.style.top = evt.pageY + 'px';

		$('renameOption').style.display = ui.getSelectedItems().length === 1 ? 'block' : 'none';
		menu.style.display = 'block';
	},

	openItem: function (evt) {
		let element = evt.target.id ? evt.target.parentNode : evt.target.parentNode.parentNode;
		if (element.classList.contains('data-folder')) {
			ui.location += element.id + '/';
		}
		handler.displayFiles();
	},
	openParentFolder: function (evt) {
		let lastIndex = ui.location.lastIndexOf('/', ui.location.length - 2);
		ui.location = lastIndex === 0 ? '/' : ui.location.substring(0, lastIndex + 1);

		handler.displayFiles();
	},

	getInputValue: function (sId) {
		let inputValue = $(sId).value;
		$(sId).value = '';
		return inputValue;
	},
	getIsFolder: function () {
		return $('descriptionPlaceholder').innerText.match(/folder|file/gi).shift() === 'folder';
	}
};

let handler = {
	openModal: function (sItemId, sType) {
		ui.openModal(sItemId, sType);
	},
	closeModal: function (sModalId) {
		ui.closeModal(sModalId);
	},

	createItem: function (sModalId) {
		db.addElement(ui.getIsFolder(), ui.getInputValue('itemName'));

		this.displayFiles();
		ui.closeModal(sModalId);
	},

	selectAll: evt =>
		ui.getFilesList().childNodes.forEach(el =>
			el.classList.add('selectedItem')
		),
	deleteSelected: function (evt) {
		ui.getFilesList().childNodes.forEach(el => {
			if (el.classList.contains('selectedItem')) {
				db.deleteElement(el.id);
			}
		});

		this.displayFiles();
	},
	openRenameModal: evt => {
		let item = ui.getSelectedItems().shift();
		let sItemType = item.classList.contains('data-folder') ? 'folder' : 'file';

		let description = $('renameDescriptionPlaceholder');
		description.innerText = description.innerText.replace(/folder|file/gi, sItemType);

		$('renameItemName').value = item.id;

		handler.openModal('renameModal');
	},
	renameItem: function (evt, sModalId) {
		let sOldName = ui.getSelectedItems().shift().id;
		let sNewName = ui.getInputValue('renameItemName');
		db.renameElement(sOldName, sNewName);

		this.displayFiles();
		ui.closeModal(sModalId);
	},

	displayFiles: function () {
		// removes all the divs that we had before
		ui.emptyFilesList();

		// loading current data and create items
		let data = db.getData();
		ui.populateFilesList(data);
	},

	showContextMenu: function (evt) {
		ui.showContextMenu(evt);
	}
};

document.onclick = function (e) {
	ui.getContextMenu().style.display = 'none';
}

db.data.some = 'works';
db.data.folder = {};
db.data.wow = {};
for (let i = 0; i < 20; i++) {
	db.data[`wow${i}`] = i % 2 === 0 ? {secondLevel: {
		thirdLevel: {},
		thirdLevelDouble: {}
	},
	secondLevelEmpty: {}} : '';
}
console.log('Hey');
handler.displayFiles();
