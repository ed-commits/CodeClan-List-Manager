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
        the_list: the_list,
        persistent_array: []
    };

    if(!(localStorage.persistent_array == null)) {
        try {
            context.persistent_array = JSON.parse(localStorage.persistent_array);
            build_out_array(context);
        } catch(error) {
            context.persistent_array = [];
        }
    }
    else {
        context.persistent_array = [];
    }

    button.addEventListener('click', click(context));
    clear_button.addEventListener('click', clear(context));
});

function build_out_array(context) {
    for(let obj of context.persistent_array) {
        const elt = objectToHTMLElement(obj);
        context.the_list.prepend(elt);
    }
}

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
        
        context.persistent_array.push(obj);
        localStorage.persistent_array = JSON.stringify(context.persistent_array);

        context.the_list.prepend(elt);
    }
}

function clear(context) {
    return function(event) {
        context.the_list.innerHTML = null;
        localStorage.removeItem('persistent_array');
    }
}

function makeElt(tag, clss, text, parent) {
    const elt = document.createElement(tag);
    if(!(clss == null)) {
        elt.classList.add(clss);
    }
    elt.textContent = text;
    if(!(parent == null)) {
        parent.appendChild(elt);
    }
    return elt;
}

function objectToHTMLElement(obj) {
    const li_elt = makeElt('li');
    const div_elt = makeElt('div', 'item', null, li_elt);
    const button_elt = makeElt('button', 'collapsible', obj.title, div_elt);
    const content_elt = makeElt('div', 'content', null, div_elt);
    const details_elt = makeElt('p', null, obj.details, content_elt);

    const context = {
        content: content_elt
    };
    button_elt.addEventListener('click', toggle_collapse(context));

    return li_elt;
}

// https://www.w3schools.com/howto/howto_js_collapsible.asp
function toggle_collapse(context) {
    return function(event) {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight){
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
        }
    }
}
