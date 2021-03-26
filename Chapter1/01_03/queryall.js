/* eslint no-undef: "error" */
/* eslint-env browser */

document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.querySelector('textarea[name=source]');
    textarea.addEventListener('input', (e) => {
        refreshOutput(e.target.value);
    });

    document.forms.queryall.addEventListener('submit', (e) => {
        e.preventDefault();

        refreshQuery(e.target.selector.value);

        return false;
    });

    refreshOutput(textarea.value);
});

function refreshOutput(html) {
    const output = document.querySelector('#output');

    output.innerHTML = html;
}

function refreshQuery(selector) {
    const output = document.querySelector('#output');
    const matches = document.querySelector('#matches');

    matches.innerHTML = '';

    output.querySelectorAll(selector).forEach((el) => {
        const li = document.createElement('li');
        li.innerText = el.outerHTML;

        matches.appendChild(li);
    });
}
