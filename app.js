let context = {};

document.addEventListener('DOMContentLoaded', () => {
    const the_form = document.querySelector('#the-form');
    const input_title = document.querySelector('#title');
    const input_details = document.querySelector('#details');
    const button = document.querySelector('#submit');
    const clear_button = document.querySelector('#clear');
    const export_button = document.querySelector('#export');
    const openall_button = document.querySelector('#open-all');
    const closeall_button = document.querySelector('#close-all');
    const the_list = document.querySelector('#the-list');

    if (the_form == null) { console.error("Error: the_form is null!"); }
    if (input_title == null) { console.error("Error: input_title is null!"); }
    if (input_details == null) { console.error("Error: input_details is null!"); }
    if (button == null) { console.error("Error: button is null!"); }
    if (clear_button == null) { console.error("Error: clear_button is null!"); }
    if (export_button == null) { console.error("Error: clear_button is null!"); }
    if (the_list == null) { console.error("Error: the_list is null!"); }

    context = {
        the_form: the_form,
        input_title: input_title,
        input_details: input_details,
        the_list: the_list,
        persistent_array: []
    };

    persistence_setup_array();
    build_out_array();

    button.addEventListener('click', click);
    clear_button.addEventListener('click', clear);
    export_button.addEventListener('click', export_it);
    openall_button.addEventListener('click', open_all);
    closeall_button.addEventListener('click', close_all);
});

function build_out_array() {
    for (let obj of context.persistent_array) {
        context.the_list.prepend(objectToHTMLElement(obj));
    }
}

/////// Button code

function click(event) {
    event.preventDefault();

    const title = context.input_title.value;
    const details = context.input_details.value;
    context.the_form.reset();

    const obj = {
        id: context.persistent_array.length,
        title: title,
        details: details,
        date: new Date()
    };
    //console.dir(obj);

    context.persistent_array.push(obj);
    persistence_save();

    const elt = objectToHTMLElement(obj);
    context.the_list.prepend(elt);
}

function clear(event) {
    context.the_list.innerHTML = null;
    persistence_clear();
}

function export_it(event) {
    downloadObjectAsJson(context.persistent_array, "my-list");
}

function open_all(event) {
    const buttons = document.querySelectorAll('button.collapsible.inactive');
    buttons.forEach(button => button.click());
}

function close_all(event) {
    const buttons = document.querySelectorAll('button.collapsible.active');
    buttons.forEach(button => button.click());
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
    button_elt.classList.add('inactive');
    const content_elt = makeElt('div', 'content', null, div_elt);
    const details_elt = makeElt('p', null, obj.details, content_elt);

    const toggle_context = {
        content: content_elt
    };
    button_elt.addEventListener('click', toggle_collapse(toggle_context));

    const delete_button_elt = makeDeleteButton(obj.id, context.the_list, li_elt);
    content_elt.appendChild(delete_button_elt);

    return li_elt;
}

function makeDeleteButton(id, parent, child) {
    // <input class="button" type="button" id="export" value="Export">
    const button_elt = makeElt("input", "button");
    button_elt.setAttribute('type', 'button');
    button_elt.setAttribute('value', 'Delete');
    const context = {
        id: id,
        parent: parent,
        child: child
    };
    button_elt.addEventListener('click', delete_item(context));
    return button_elt;
}

function delete_item(context) {
    return function () {
        // delete by id from the array
        persistence_delete_by_id(context.id);

        // delete the HTML element too
        context.parent.removeChild(context.child);
    }
}

// https://www.w3schools.com/howto/howto_js_collapsible.asp
function toggle_collapse(context) {
    return function (event) {
        this.classList.toggle("active");
        this.classList.toggle("inactive");
        var content = this.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    }
}


// persistence of the list

function persistence_setup_array() {
    context.persistent_array = [];
    if (localStorage.persistent_array !== null) {
        try {
            context.persistent_array = JSON.parse(localStorage.persistent_array);
        }
        catch (error) { }
    }
}

function persistence_save() {
    localStorage.persistent_array = JSON.stringify(context.persistent_array);
}

function persistence_clear() {
    context.persistent_array = [];
    localStorage.removeItem('persistent_array');
}

function persistence_delete_by_id(id) {
    context.persistent_array = context.persistent_array.filter(obj => obj.id !== id);
    persistence_save();
}

