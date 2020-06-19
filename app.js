document.addEventListener('DOMContentLoaded', () => {
    const the_form = document.querySelector('#the-form');
    const input_title = document.querySelector('#title');
    const input_details = document.querySelector('#details');
    const button = document.querySelector('#submit');
    const clear_button = document.querySelector('#clear');
    const the_list = document.querySelector('#the-list');

    if(the_form == null) { console.error("Error: the_form is null!"); }
    if(input_title == null) { console.error("Error: input_title is null!"); }
    if(input_details == null) { console.error("Error: input_details is null!"); }
    if(button == null) { console.error("Error: button is null!"); }
    if(clear_button == null) { console.error("Error: clear_button is null!"); }
    if(the_list == null) { console.error("Error: the_list is null!"); }

    const context = {
        the_form: the_form,
        input_title: input_title,
        input_details: input_details,
        the_list: the_list
    };

    if(!(localStorage.persistent_list == null)) {
        the_list.innerHTML = localStorage.persistent_list;
    }

    button.addEventListener('click', click(context));
    clear_button.addEventListener('click', clear(context));
});

function click(context) {
    return function(event) {
        event.preventDefault();
        const title = context.input_title.value;
        const details = context.input_details.value;
        context.the_form.reset();

        const obj = {
            title: title,
            details: details,
            date: new Date()
        };
        //console.dir(obj);
        const elt = objectToHTMLElement(obj);
        
        context.the_list.prepend(elt);
        localStorage.persistent_list = context.the_list.innerHTML;
    }
}

function clear(context) {
    return function(event) {
        context.the_list.innerHTML = null;
        localStorage.persistent_list = context.the_list.innerHTML;
    }
}

function makeElt(tag, text, parent) {
    const elt = document.createElement(tag);
    elt.textContent = text;
    if(!(parent == null)) {
        parent.appendChild(elt);
    }
    return elt;
}

function objectToHTMLElement(obj) {
    const li_elt = makeElt('li');
    const div_elt = makeElt('div', null, li_elt);
    const title_elt = makeElt('h2', obj.title, div_elt);
    const details_elt = makeElt('p', obj.details, div_elt);
    return li_elt;
}
