/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-const */

window.onload = function() {
  if (window.CTRLJS) {
    console.log(window.CTRLJS);
    const target = document.getElementById('ctrl-target');
    const input = new CTRLJS.Input(target);
    input.on('mousedown', evt => {
      console.log(evt);
    });

    input.on('mouseup', evt => {
      console.log(evt);
    });
  }
};


