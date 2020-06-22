const App = require('./app.js');
const Persistence = require('./persistence.js');

document.addEventListener('DOMContentLoaded', () => {
    let context = {};
    const element_names = [
        'the_form', 'input_title', 'input_details',
        'submit_button', 'clear_button', 'export_button',
        'open_all_button', 'close_all_button',
        'upload_button', 'upload_box', 'the_list'
    ];
    element_names.forEach(function (name) {
        result = document.querySelector('#' + name)
        if (result == null) { console.error(`Error: ${name} is null!`); }
        context[name] = result;
    });

    context.persist = new Persistence();
    context.app = new App(context);
    context.app.build_out_array();

    context.submit_button.addEventListener('click', click.bind(context));
    context.clear_button.addEventListener('click', clear.bind(context));
    context.export_button.addEventListener('click', export_it.bind(context));
    context.open_all_button.addEventListener('click', open_all.bind(context));
    context.close_all_button.addEventListener('click', close_all.bind(context));
    context.upload_button.addEventListener('click', handle_upload.bind(context));
});

/////// Button code

function click(event) {
    event.preventDefault();

    const title = this.input_title.value;
    const details = this.input_details.value;
    this.the_form.reset();

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
    this.the_list.prepend(elt);
}

function clear(event) {
    this.the_list.innerHTML = null;
    this.persist.clear();
}

function export_it(event) {
    downloadObjectAsJson(this.persist.array, "my_list");
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
    this.persist.load(this.upload_box.value);
    this.persist.save();
    this.the_list.innerHTML = null;
    this.app.build_out_array();
}


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
