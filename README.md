# VGS-In-Out

[DEMO](http://4b07dbc7.ngrok.io/)



## Description
Single field form that takes in an object, example:


Data to be redacted:



{

    "card_cvv": "tok_sandbox_mCUqvmtWhFWdUQuCYJ3N2h",
    "card_expirationDate": "tok_sandbox_czUNDSsuao5SNmBxceGbf5",
    "card_number": "tok_sandbox_eAS9GdAnbVWEMUjyDeYuXV"
    
}


Data to be revealed:

{

    "card_cvv": "tok_sandbox_mCUqvmtWhFWdUQuCYJ3N2h",
    "card_expirationDate": "tok_sandbox_czUNDSsuao5SNmBxceGbf5",
    "card_number": "tok_sandbox_eAS9GdAnbVWEMUjyDeYuXV"
    
}

The [VGS platform](https://www.verygoodsecurity.com/) encrypts and reveals the following fields:
- Credit Card number
- Credit Card CVV
- Credit Card Exp. Date

## Technologies Used
- This app was built using Node.js with Express.js.
- ngrok was used for deployment.

## Clone or Download
```
$ git clone https://github.com/daph3105/VGS-In-Out.git
$ npm i
```

## Usage
- have Node and NPM installed
- create .env file to include your VGS credentials:
  - IDENTIFIER = ***
  - USER = **
  - PASS = **
 ```
 $ node app.js 
 -- to run the app
 ```
