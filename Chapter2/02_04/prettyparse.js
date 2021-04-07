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
    testLexer(html);
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

function testLexer(html) {
    const lexer = new Lexer(html);

    let output = '';

    while (!lexer.eof) {
        output += lexer.read();
    }

    console.assert(html == output);

    lexer.rewind();

    console.assert(lexer.match('<!--'));
    console.assert(!lexer.match('random text'));

    console.assert(lexer.consumeMatch('<!--'));
    const comment = lexer.readUntil((lexer) => lexer.match('-->'));
    lexer.consumeMatch('-->');
    console.log('comment: ', comment);

    lexer.skipWhitespace();
    console.assert(lexer.consumeMatch('<'));
    const tag = lexer.readIdentifier();
    console.log(tag);
}
