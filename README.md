# Check gender disparity

## WE DO NOT STORE ANY DATA


This project helps you to detect gender disparities in your company/office.

All you need is to send your employees list that includes any gender type in any of the keys `gender`, `gender_identity` or `genderIdentity`), sex(`sex`) or pronoun(`pronoun`) to the route `/stats`.

Request Example:
```
url: "http://localhost:8080/stats?mode=binary" // (binary | full)
method: "POST"
body: {
  members: [{
    "name": "Jack",          // optional
    "sex": "male",           // optional
    "gender": "non-binary",  // optional
    "pronoun": "his"         // optional
  }]
}
```

Response Example:
```
{
  "total": 124,              // total count of employees
  "count": {
    "male": 14,
    "female": 7,
    "other": 7
  },
  "percentage": {
    "male": 50,
    "female": 25,
    "other": 25
  }
  "majority": "male",
  "minority: "female",
  "hasGenderDisparity": true

  // is true when difference between major and minor more then
  // provided in config.js ALLOWED_GENDER_DIFFERENCE_PERCENT
  // 20 by default
}
```


# How to run the application

The application built on Node.js.

To use it you need to install [Node.js](https://nodejs.org/en/download/) on your machine.

## Steps:

1. Install Node.js
2. In terminal run `node -v` to be sure it works
3. In the project directory run `npm install` to install necessary modules. (Takes a while)
4. Run command `npm start`. It will start the server that you will have access here by default - `http://localhost:8080`;
5. Enjoy!



# Other

You might also wonder what the `demo` folder is.
The folder consists a frontend example that shows all the features of the project (React.js).

It is not required to use the demo folder at all. You can use the Node.js server for any of your projects.

For any questions write me - a.v.leusenko@gmail.com

## Good luck!