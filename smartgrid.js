var smartgrid = require('smart-grid');

var settings = {
  columns: 24,
  offset: '30px',
  filename: '_smartgrid',
  outputStyle: 'scss',
  oldSizeStyle: false,
  mobileFirst: false,
  container: {
    maxWidth: '1170px',
    fields: '30px',
  },
  breakPoints: {
    lg: {
      width: '1100px',
      fields: '20px',
    },
    md: {
      width: '960px',
      fields: '20px',
    },
    sm: {
      width: '780px',
      fields: '15px',
    },
    xs: {
      width: '560px',
      fields: '15px',
    },
    xxs: {
      width: '380px',
      fields: '10px',
    },
    /* 
        We can create any quantity of break points.

        some_name: {
            width: 'Npx',
            fields: 'N(px|%|rem)',
            offset: 'N(px|%|rem)'
        }
        */
  },
};

smartgrid('./app/scss', settings);
