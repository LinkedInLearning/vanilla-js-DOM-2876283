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

    document.forms.queryall.addEventListener('click', (e) => {
        if (e.target.tagName != 'BUTTON') {
            return;
        }

        switch (e.target.innerText) {
            case 'delete': {
                deleteMatches();
            } break;

            case 'textify': {
                textifyMatches();
            } break;
        }
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

    document.querySelectorAll('.match').forEach((el) => {
        el.classList.remove('match');
    });

    matches.innerHTML = '';

    output.querySelectorAll(selector).forEach((el) => {
        const li = document.createElement('li');
        li.innerText = el.outerHTML;

        matches.appendChild(li);

        el.classList.add('match');
    });
}

function deleteMatches() {
    const output = document.querySelector('#output');

    const selector = document.forms.queryall.selector.value;

    output.querySelectorAll(selector).forEach((el) => {
        el.parentElement.removeChild(el);
    });

    refreshQuery(selector);
}

function textifyMatches() {
    const output = document.querySelector('#output');

    const selector = document.forms.queryall.selector.value;

    output.querySelectorAll(selector).forEach((el) => {
        const text = document.createTextNode(el.innerText);
        el.parentElement.replaceChild(text, el);
    });

    refreshQuery(selector);
}
