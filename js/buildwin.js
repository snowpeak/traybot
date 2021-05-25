const builder = require('electron-builder');

builder.build({
    config: {
        'appId': 'net.osscat.traybot',
        productName: 'TrayBot',
        files: ['**/*', '!*.sqlite3'],
        'win':{
            'target': {
                'target': 'nsis',
                'arch': [
                    'x64'
                    //'ia32',
                ]
            },
            'icon': 'image/icon-large.ico'
        },
        "nsis": {
            "allowElevation": false,
            "allowToChangeInstallationDirectory": true,
            "oneClick": false,
            "perMachine": true
          }
    }
});