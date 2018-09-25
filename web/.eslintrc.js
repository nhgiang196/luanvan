module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node":true,
        "jquery": true,
        "commonjs": true
   
    },
   
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "globals": {
        "$event": false,
        "define":false
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
      
    
        'no-console': 'off'
       
    }
};