let context = {};

document.addEventListener('DOMContentLoaded', () => {
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

    persistence_setup_array();
    build_out_array();

    context['submit-button'].addEventListener('click', click);
    context['clear-button'].addEventListener('click', clear);
    context['export-button'].addEventListener('click', export_it);
    context['open-all-button'].addEventListener('click', open_all);
    context['close-all-button'].addEventListener('click', close_all);
    context['upload-button'].addEventListener('click', handle_upload);
});

function build_out_array() {
    for (let obj of context['persistent_array']) {
        context['the-list'].prepend(objectToHTMLElement(obj));
    }
}

/////// Button code

function click(event) {
    event.preventDefault();

    const title = context['input-title'].value;
    const details = context['input-details'].value;
    context['the-form'].reset();

    const obj = {
        id: context['persistent_array'].length,
        title: title,
        details: details,
        date: new Date()
    };
    //console.dir(obj);

    context['persistent_array'].push(obj);
    persistence_save();

    const elt = objectToHTMLElement(obj);
    context['the-list'].prepend(elt);
}

function clear(event) {
    context['the-list'].innerHTML = null;
    persistence_clear();
}

function export_it(event) {
    downloadObjectAsJson(context['persistent_array'], "my-list");
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
    persistence_load(context['upload-box'].value);
    persistence_save();
    context['the-list'].innerHTML = null;
    build_out_array();
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

function makeElt(tag, clss, text, parent) {
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

function objectToHTMLElement(obj) {
    const li_elt = makeElt('li');
    li_elt.setAttribute('id', "li_" + obj.id);
    
    const div_elt = makeElt('div', 'item', null, li_elt);
    const button_elt = makeElt('button', 'collapsible', obj.title, div_elt);
    const content_elt = makeElt('div', 'content', null, div_elt);
    const details_elt = makeElt('textarea', 'details', obj.details, content_elt);
    details_elt.setAttribute('rows', 15);
    details_elt.setAttribute('cols', 35);

    button_elt.classList.add('inactive');
    button_elt.addEventListener('click', toggle_collapse);

    const update_button_elt = makeUpdateButton(obj.id, details_elt);
    content_elt.appendChild(update_button_elt);

    const delete_button_elt = makeDeleteButton(obj.id, context['the-list'], li_elt);
    content_elt.appendChild(delete_button_elt);

    return li_elt;
}

function makeUpdateButton(id, textbox) {
    const button_elt = makeElt("input", "button");
    button_elt.setAttribute('type', 'button');
    button_elt.setAttribute('value', 'Update');

    function update_item(event) {
        persistence_update_by_id(id, textbox.value);
    }

    button_elt.addEventListener('click', update_item);
    return button_elt;
}

function makeDeleteButton(id, parent, child) {
    // <input class="button" type="button" id="export" value="Export">
    const button_elt = makeElt("input", "button");
    button_elt.setAttribute('type', 'button');
    button_elt.setAttribute('value', 'Delete');

    function delete_item(event) {
        // delete by id from the array
        persistence_delete_by_id(id);

        // delete the HTML element too
        parent.removeChild(child);
    }

    button_elt.addEventListener('click', delete_item);
    return button_elt;
}


// persistence of the list

function persistence_setup_array() {
    context['persistent_array'] = [];
    if (localStorage.persistent_array !== null) {
        persistence_load(localStorage.persistent_array);
    }
}

function persistence_save() {
    localStorage.persistent_array = JSON.stringify(context['persistent_array']);
}

function persistence_load(text) {
//    console.log(text);
    try {
        context['persistent_array'] = JSON.parse(text);
    }
    catch (error) { }
}

function persistence_clear() {
    context['persistent_array'] = [];
    localStorage.removeItem('persistent_array');
}

function persistence_delete_by_id(id) {
    context['persistent_array'] = context['persistent_array'].filter(obj => obj.id !== id);
    persistence_save();
}

function persistence_update_by_id(id, text) {
    const index = context['persistent_array'].findIndex(obj => obj.id == id);
    context['persistent_array'][index].details = text;
    persistence_save();
}
