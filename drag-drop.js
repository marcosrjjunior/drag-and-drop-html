function serializeByEl(el, type) {
    var result = [];

    [].forEach.call(el.children, function(item) {
        result.push(item.querySelector('input').value);
    });

    return result;
}

var dragSrcEl = null,
    dragEl = null;

var drag = {
    start: function(e) {
        dragEl = e.target.parentElement;
        dragSrcEl = e.target;

        e.dataTransfer.effectAllowed = 'move'; // 'copy';
        e.dataTransfer.setData('text/plain', e.target.innerHTML);
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    },
    enter: function(e) {
    },
    leave: function(e) {
    },
    allowDrop: function(e) {
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }

        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }

        e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

        return false;
    },
    handleDrop: function(e) {
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }

        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }

        var content = e.dataTransfer.getData('text/html');

        // same block
        if (dragEl == e.target.parentElement) {
            // Change positions
            if (dragSrcEl != e.target) {
                // Sortable the html content
                dragSrcEl.innerHTML = e.target.innerHTML;
                e.target.innerHTML = e.dataTransfer.getData('text/plain');
            }

            // no changes, just drag and drop in same place
            return false;
        } 

        // other div -- using drag-sortable when adding item on block
        el = e.target.classList.contains('drag-sortable') ? e.target : e.target.parentElement;

        dataFrom = el.getAttribute('data-from');
        dataType = el.getAttribute('data-type');

        // Drag only from permitted blocks
        if (dragEl == null || (typeof dataType !== 'undefined') && dataType == 'clone' || typeof dataFrom == 'undefined' || !dragEl.getAttribute('data-name') || (dataFrom && dataFrom.indexOf(dragEl.getAttribute('data-name')) == -1)) {
            return false;
        }

        if (el.getAttribute('data-limit') && el.children.length >= el.getAttribute('data-limit')) {
            return false;
        }

        // Check if value exists on new block
        if (drag.valueExists(el)) {
            return false;
        }

        // Copy/Clone
        if (dragSrcEl && dragSrcEl.parentElement.getAttribute('data-type') !== 'clone') {
            dragSrcEl.remove();
        }

        // Adding remove template
        if (!el.getAttribute('can-remove') || el.getAttribute('can-remove') == 'true') {
            content = drag.addingRemoveTemplate(content);
        }

        el.insertAdjacentHTML('beforeend', content);
        loadEvents(el.lastElementChild);

        return true;
    },
    valueExists: function(el) {
        exists = [];
        dragSrcInputValue = dragSrcEl.querySelector('input').value;

        if (!el.classList.contains('drag-sortable')) {
            return true;
        }

        Array.prototype.forEach.call(el.children, function (item) {
            exists.push(item.querySelector('input').value == dragSrcInputValue);
        });

        if (exists.indexOf(true) !== -1) {
            return true;
        }
        
        return false;
    },
    end: function(e) {
        dragSrcEl = null;
        dragEl = null;

        [].forEach.call(items, function (item) {
            // item.classList.remove('over');
        });
    },
    addingRemoveTemplate: function(content) {
        if (content.indexOf('remove') !== -1) {
            return content;
        }

        var canRemoveTemplate = '<span class="remove" onclick="drag.removeItem(event)">x</span>',
            index = content.indexOf('</') - 1;

        return content = content.substring(0, index) + canRemoveTemplate + content.substring(index);
    },
    removeItem: function(e) {
        e.target.parentElement.remove();
    }
};

function loadEvents(item) {
    item.addEventListener('dragstart', drag.start, false);
    item.addEventListener('dragenter', drag.enter, false);
    item.addEventListener('dragleave', drag.leave, false);
    item.addEventListener('dragover', drag.allowDrop, false);
    item.addEventListener('drop', drag.handleDrop, false);
    item.addEventListener('dragend', drag.end, false);
}

function loadBlockEvents(item) {
    item.addEventListener('dragover', drag.allowDrop, false);
    item.addEventListener('drop', drag.handleDrop, false);
}

var items = document.querySelectorAll('.drag-sortable');
Array.prototype.forEach.call(items, function(block) {
    loadBlockEvents(block);
    Array.prototype.forEach.call(block.querySelectorAll('li'), function(item) {
        loadEvents(item);
    });
});

function printSerialize(elName, type) {
    var el = document.querySelector('[data-name="'+elName+'"]'),
        parentEl = el.parentElement;

    parentEl.querySelector('.serialize-result').innerHTML = serializeByEl(el, type);
}
