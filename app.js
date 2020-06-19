document.addEventListener('DOMContentLoaded', () => {
    const the_form = document.querySelector('#the-form');
    const input_title = document.querySelector('#title');
    const input_details = document.querySelector('#details');
    const button = document.querySelector('#submit');

    if(the_form == null) { console.error("Error: the_form is null!"); }
    if(input_title == null) { console.error("Error: input_title is null!"); }
    if(input_details == null) { console.error("Error: input_details is null!"); }
    if(button == null) { console.error("Error: button is null!"); }

    const context = {
        the_form: the_form,
        input_title: input_title,
        input_details: input_details,
        button: button
    };

    button.addEventListener('click', click(context));
});

function click(context) {
    return function(event) {
        event.preventDefault();
        const title = context.input_title.value;
        const details = context.input_details.value;
        context.the_form.reset();

        console.log(title);
        console.log(details);
    }
}
