function serializeByEl(el, type) {
    console.log(el)
    var result = [];
    [].forEach.call(el.children, function(item) {
        result.push(item[type])
    });

    return result;
}

function dragAllowDrop(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
    }

    // e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

    return false;
}

var dragSrcEl = null,
    dragEl = null;

function dragStart(e) {
    // this.style.opacity = '0.4'; 
    console.log('dragStart');

    dragEl = e.target.parentElement;
    dragSrcEl = e.target;

    e.dataTransfer.effectAllowed = 'move'; // 'copy';
    e.dataTransfer.setData('text/plain', e.target.innerHTML);
    e.dataTransfer.setData('text/html', e.target.outerHTML);
}       

function dragEnter(e) {
    console.log('dragEnter')

    e.target.classList.add('over');
}

function dragLeave(e) {
    console.log('dragLeave');
    e.target.classList.remove('over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
    }

    // same div
    if (dragEl == e.target.parentElement) {
        // Change positions
        if (dragSrcEl != e.target) {
            // Set the source column's HTML to the HTML of the columnwe dropped on.
            dragSrcEl.innerHTML = e.target.innerHTML;
            e.target.innerHTML = e.dataTransfer.getData('text/plain');
        }
        return false;
    } 

    // Copy
    if (dragSrcEl.parentElement.getAttribute('data-type') !== 'clone') {
        dragSrcEl.remove();
    }

    // other div
    e.target.parentElement.insertAdjacentHTML('beforeend', e.dataTransfer.getData('text/html'));
    loadEvents(e.target.parentElement.lastElementChild);
    return true;

    // Don't do anything if dropping the same column we're dragging.
    return false;
}

function dragEnd(e) {
    console.log('dragEnd', e.target);

    [].forEach.call(items, function (item) {
        item.classList.remove('over');
    });
}

function loadEvents(item) {
    item.addEventListener('dragstart', dragStart, false);
    item.addEventListener('dragenter', dragEnter, false);
    item.addEventListener('dragover', dragAllowDrop, false);
    item.addEventListener('dragleave', dragLeave, false);
    item.addEventListener('drop', handleDrop, false);
    item.addEventListener('dragend', dragEnd, false);
}

var items = document.querySelectorAll('.drag-sortable li');
[].forEach.call(items, function(item) {
    loadEvents(item);
});


// ============
function printSerialize(elId, type) {
    var el = document.getElementById(elId),
        parentEl = el.parentElement;

    parentEl.querySelector('.serialize-result').innerHTML = serializeByEl(el, type);
}