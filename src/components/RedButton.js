const {Button} = require('tabris');

module.exports = class RedButton extends Button {
  constructor (properties) {
    super(properties);
    this.font = '18px';
    this.textColor = '#fff';
    this.background = '#bb2326';
    //if 'left' and 'right' props are set - width property will be rewritten
    if (!(properties.left !== undefined && properties.right !== undefined))
    {
      this.width = properties.width || 100;
    }
    //if 'top' and 'bottom' props are set - height property will be rewritten
    if (!(properties.top !== undefined && properties.bottom !== undefined))
    {
      this.height = properties.height || 55;
    }
  }
};
