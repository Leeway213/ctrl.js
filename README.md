<!-- @format -->

# Ctrl.JS

A wrapper of dom events using EventEmitter.

## Usage

```javascript
const target = document.getElementById('ctrl-target');
const input = new CTRLJS.Input(target);
input.on('mousedown', evt => {
  console.log(evt);
});

input.on('mouseup', evt => {
  console.log(evt);
});
```

## Supported event types

mousedown mouseup mousemove touchstart touchend touchmove resize
