/* eslint no-undef: "error" */
/* eslint-env browser */

document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.querySelector('textarea[name=source]');
    textarea.addEventListener('input', (e) => {
        refreshOutput(e.target.value);
    });

    refreshOutput(textarea.value);
});

function refreshOutput(html) {
    const output = document.querySelector('pp-output');

    output.innerText = '';
    output.appendChild(prettyParse(html));
}

function prettyParse(html) {
    const fragment = document.createDocumentFragment();
    const div = document.createElement('div');

    div.innerHTML = html;

    div.childNodes.forEach((node) => {
        fragment.appendChild(node);
    });

    return fragment;
}
