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

module.exports = App;
