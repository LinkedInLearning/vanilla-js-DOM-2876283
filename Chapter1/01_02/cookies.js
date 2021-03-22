document.addEventListener('DOMContentLoaded', () => {
    const ingredients = document.getElementById('ingredients');

    let total = 0;

    Array.prototype.forEach.call(ingredients.children, (tr) => {
        const td = tr.children[1];

        if (tr.id == 'totals') {
            td.innerText = total;
        } else {
            const weight = parseFloat(td.innerText);

            total += weight;
        }
    });
});
