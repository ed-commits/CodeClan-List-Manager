const App = require('./app.js');
const Persistence = require('./persistence.js');

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
