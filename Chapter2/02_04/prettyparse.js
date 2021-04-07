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

class Lexer {
    constructor(source) {
        this.source = source;
        this.file_pointer = 0;
    }

    read() {
        if (this.file_pointer < 0 || this.file_pointer >= this.source.length) {
            return undefined;
        }

        return this.source[this.file_pointer++];
    }

    rewind() {
        this.file_pointer = 0;
    }

    match(token) {
        return this.remainder.search(token) === 0;
    }

    consumeMatch(token) {
        const match = this.remainder.match(token);

        if (match && match.length && match.index == 0) {
            this.file_pointer += match[0].length;

            return true;
        }

        return false;
    }

    readUntil(condition) {
        const start_pointer = this.file_pointer;

        while (!this.eof && !condition(this)) {
            this.file_pointer++;
        }

        return this.source.substring(start_pointer, this.file_pointer);
    }

    readIdentifier() {
        return this.readUntil((lexer) => !lexer.match(/\w/));
    }

    skipWhitespace() {
        return this.readUntil((lexer) => !lexer.match(/\s/));
    }

    get eof() {
        return this.file_pointer >= this.source.length;
    }

    get remainder() {
        return this.source.substring(this.file_pointer);
    }
}

function prettyParse(html) {
    const lexer = new Lexer(html);

    function parseContent() {
        let text = '';
        const fragment = document.createDocumentFragment();

        function flushText() {
            if (text.length) {
                fragment.appendChild(document.createTextNode(text));
                text = '';
            }
        }

        while (!lexer.eof) {
            text += lexer.read();
        }

        flushText();

        return fragment;
    }

    return parseContent();
}
