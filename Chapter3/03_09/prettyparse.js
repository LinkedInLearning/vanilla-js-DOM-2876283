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
    output.appendChild(prettyPrint(prettyParse(html)));
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

    function parseComment() {
        const commentText = lexer.readUntil((lexer) => lexer.match('-->'));
        lexer.consumeMatch('-->');

        return document.createComment(commentText);
    }

    function parseAttribute() {
        const attributeName = lexer.readIdentifier();
        const attribute = document.createAttribute(attributeName);

        if (lexer.consumeMatch(/\s*=\s*/)) {
            let value;

            if (lexer.match(/['"]/)) {
                const closingChar = lexer.read();

                value = lexer.readUntil((lexer) => lexer.match(closingChar));
                lexer.consumeMatch(closingChar);
            } else {
                value = lexer.readUntil((lexer) => lexer.match(/[\s\/>]/));
            }

            attribute.value = value;
        }

        return attribute;
    }

    function parseElement() {
        const voidElements = ['area', 'base', 'br', 'col', 'command', 'embed',
                'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param',
                'source', 'track', 'wbr'
        ];
        const tagName = lexer.readIdentifier();
        const element = document.createElement(tagName);

        lexer.skipWhitespace();
        while (!lexer.eof && !lexer.match(/\/?>/)) {
            element.setAttributeNode(parseAttribute());
            lexer.skipWhitespace();
        }

        if (lexer.consumeMatch('>')) {
            if (!voidElements.includes(tagName)) {
                element.appendChild(parseContent());

                lexer.consumeMatch('</');
                lexer.readUntil((lexer) => lexer.consumeMatch('>'));
            }
        } else {
            lexer.consumeMatch('/>');
        }

        return element;
    }

    function parseContent() {
        let text = '';
        const fragment = document.createDocumentFragment();

        function flushText() {
            if (text.length) {
                fragment.appendChild(document.createTextNode(text));
                text = '';
            }
        }

        while (!lexer.eof && !lexer.match('</')) {
            if (lexer.consumeMatch('<!--')) {
                flushText();
                fragment.appendChild(parseComment());
            } else if (lexer.consumeMatch('<')) {
                flushText();
                fragment.appendChild(parseElement());
            } else {
                text += lexer.read();
            }
        }

        flushText();

        return fragment;
    }

    return parseContent();
}

function prettyPrint(node) {
    function printChildNodes(node) {
        const fragment = document.createDocumentFragment();

        node.childNodes.forEach((child) => {
            fragment.appendChild(prettyPrint(child));
        });

        return fragment;
    }

    switch (node.nodeType) {
        case Node.COMMENT_NODE: {
            const comment = document.createElement('pp-comment');
            comment.innerText = node.nodeValue;

            return comment;
        }

        case Node.DOCUMENT_FRAGMENT_NODE: {
            return printChildNodes(node);
        }

        case Node.ELEMENT_NODE: {
            const element = document.createElement('pp-element');

            const openTag = document.createElement('pp-opentag');

            const tagName = document.createElement('pp-tagname');
            tagName.innerText = node.nodeName.toLowerCase();
            openTag.appendChild(tagName);

            Array.from(node.attributes).forEach((attr) => {
                openTag.appendChild(prettyPrint(attr));
            });

            element.appendChild(openTag);

            if (node.hasChildNodes()) {
                element.appendChild(printChildNodes(node));

                const closeTag = document.createElement('pp-closetag');
                closeTag.appendChild(tagName.cloneNode(true));
                element.appendChild(closeTag);
            } else {
                openTag.classList.add('empty');
            }


            return element;
        }

        case Node.ATTRIBUTE_NODE: {
            const attribute = document.createElement('pp-attribute');

            const attrName = document.createElement('pp-attrname');
            attrName.innerText = node.nodeName.toLowerCase();
            attribute.appendChild(attrName);

            if (node.nodeValue !== '') {
                const attrValue = document.createElement('pp-attrvalue');
                attrValue.innerText = node.nodeValue;
                attribute.appendChild(attrValue);
            }

            return attribute;
        }

        case Node.TEXT_NODE: {
            const text = document.createElement('pp-text');
            text.innerText = node.nodeValue;

            return text;
        }
    }

    return node.cloneNode(true);
}
