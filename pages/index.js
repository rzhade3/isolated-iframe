// When the button is submitted, send a postMessage to the iframe
// with the content of the textbox
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    const htmlContent = document.getElementById('htmlContent');
    const iframe = document.getElementById('container');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const content = htmlContent.value;
        iframe.contentWindow.postMessage(content, '*');
    });
});
