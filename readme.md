### Drag-Drop/Sortable

> Helper using HTML Drag and Drop API
> for more info, check [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)

#### Usage
Import the `drag-drop.js`

Create your blocks
```html
<ul class="drag-sortable" 
    data-name="simple-one"
    data-from="simple-two"
>
    <li draggable="true">
        Item 2
        <input type="hidden" value="1">
    </li>
</ul>

<ul class="drag-sortable" 
    data-name="simple-two"
    data-from="simple-one"
>
    <li draggable="true">
        Item 2
        <input type="hidden" value="2">
    </li>
</ul>
```

Then add the draggable polyfill style

```css
[draggable] {
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    /* Required to make elements draggable in old WebKit */
    -khtml-user-drag: element;
    -webkit-user-drag: element;
}
```

> There's a drag-drop-touch polyfill to touch/mobile events, just add the `drag-drop-touch.js` before.

#### Options
| Option  | Desc |
| ------------- | ------------- |
| data-name  | Define the name of the block - data-name="simple-two"  |
| data-from | Define which block can add data-from="simple-one" |
| data-type | Type of block item: 'clone', Default: null |
| data-limit | Count of items per block |
| can-remove | Add remove action and template for item, Default: true |

#### Events
| Items  | Blocks |
| ------------- | ------------- |
| drag.start | drag.allowDrop  |
| drag.enter | drag.handleDrop |
| drag.leave |  |
| drag.allowDrop |  |
| drag.handleDrop |  |
| drag.end |  |
