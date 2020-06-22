document.addEventListener('DOMContentLoaded', () => {
    let context = {};
    const element_names = [
        'the-form', 'input-title', 'input-details',
        'submit-button', 'clear-button', 'export-button',
        'open-all-button', 'close-all-button',
        'upload-button', 'upload-box', 'the-list'
    ];
    element_names.forEach(function (name) {
        result = document.querySelector('#' + name)
        if (result == null) { console.error(`Error: ${name} is null!`); }
        context[name] = result;
    });

    context.persist = new Persistence();
    context.app = new App(context);
    context.app.build_out_array();

    context['submit-button'].addEventListener('click', click.bind(context));
    context['clear-button'].addEventListener('click', clear.bind(context));
    context['export-button'].addEventListener('click', export_it.bind(context));
    context['open-all-button'].addEventListener('click', open_all.bind(context));
    context['close-all-button'].addEventListener('click', close_all.bind(context));
    context['upload-button'].addEventListener('click', handle_upload.bind(context));
});

/////// Button code

function click(event) {
    event.preventDefault();

    const title = this['input-title'].value;
    const details = this['input-details'].value;
    this['the-form'].reset();

    const obj = {
        id: this.persist.array.length,
        title: title,
        details: details,
        date: new Date()
    };
    //console.dir(obj);

    this.persist.array.push(obj);
    this.persist.save();
    const elt = this.app.objectToHTMLElement(obj);
    this['the-list'].prepend(elt);
}

function clear(event) {
    this['the-list'].innerHTML = null;
    this.persist.clear();
}

function export_it(event) {
    downloadObjectAsJson(this.persist.array, "my-list");
}

function open_all(event) {
    const buttons = document.querySelectorAll('button.collapsible.inactive');
    buttons.forEach(button => button.click());
}

function close_all(event) {
    const buttons = document.querySelectorAll('button.collapsible.active');
    buttons.forEach(button => button.click());
}

function handle_upload(event) {
    this.persist.load(this['upload-box'].value);
    this.persist.save();
    this['the-list'].innerHTML = null;
    this.app.build_out_array();
}

///////////////

// https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
function downloadObjectAsJson(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// https://www.w3schools.com/howto/howto_js_collapsible.asp
function toggle_collapse(event) {
    this.classList.toggle("active");
    this.classList.toggle("inactive");
    var content = this.nextElementSibling;
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
    }
}

//////////////////////

const App = function (context) {
    this.context = context;
}

App.prototype.build_out_array = function() {
    for (let obj of this.context.persist.array) {
        this.context['the-list'].prepend(this.objectToHTMLElement(obj));
    }
}

App.prototype.make_elt = function(tag, clss, text, parent) {
    const elt = document.createElement(tag);
    if (!(clss == null)) {
        elt.classList.add(clss);
    }
    elt.textContent = text;
    if (!(parent == null)) {
        parent.appendChild(elt);
    }
    return elt;
}

App.prototype.objectToHTMLElement = function(obj) {
    const li_elt = this.make_elt('li');
    li_elt.setAttribute('id', "li_" + obj.id);
    
    const div_elt = this.make_elt('div', 'item', null, li_elt);
    const button_elt = this.make_elt('button', 'collapsible', obj.title, div_elt);
    const content_elt = this.make_elt('div', 'content', null, div_elt);
    const details_elt = this.make_elt('textarea', 'details', obj.details, content_elt);
    details_elt.setAttribute('rows', 15);
    details_elt.setAttribute('cols', 35);

    button_elt.classList.add('inactive');
    button_elt.addEventListener('click', toggle_collapse);

    const update_button_elt = this.make_update_button(obj.id, details_elt);
    content_elt.appendChild(update_button_elt);

    const delete_button_elt = this.make_delete_button(obj.id, this.context['the-list'], li_elt);
    content_elt.appendChild(delete_button_elt);

    return li_elt;
}

App.prototype.make_update_button = function(id, textbox) {
    const button_elt = this.make_elt("input", "button");
    button_elt.setAttribute('type', 'button');
    button_elt.setAttribute('value', 'Update');

    function update_item(event) {
        this.context.persist.update_by_id(id, textbox.value);
    }

    button_elt.addEventListener('click', update_item.bind(this));
    return button_elt;
}

App.prototype.make_delete_button = function(id, parent, child) {
    // <input class="button" type="button" id="export" value="Export">
    const button_elt = this.make_elt("input", "button");
    button_elt.setAttribute('type', 'button');
    button_elt.setAttribute('value', 'Delete');

    function delete_item(event) {
        // delete by id from the array
        this.context.persist.delete_by_id(id);

        // delete the HTML element too
        parent.removeChild(child);
    }

    button_elt.addEventListener('click', delete_item.bind(this));
    return button_elt;
}


// persistence of the list

const Persistence = function () {
    this.array = [];
    if (localStorage.array !== null) {
        this.load(localStorage.array);
    }
}

Persistence.prototype.save = function() {
    localStorage.array = JSON.stringify(this.array);
}

Persistence.prototype.load = function(text) {
//    console.log(text);
    try {
        this.array = JSON.parse(text);
    }
    catch (error) { }
}

Persistence.prototype.clear = function() {
    this.array = [];
    localStorage.removeItem('persistent_array');
}

Persistence.prototype.delete_by_id = function(id) {
    this.array = this.array.filter(obj => obj.id !== id);
    this.save();
}

Persistence.prototype.update_by_id = function(id, text) {
    const index = this.array.findIndex(obj => obj.id == id);
    this.array[index].details = text;
    this.save();
}
