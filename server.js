const express = require('express');

const app = express();

app.use(express.static('dist'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/dist/index.html')
})

app.listen(3000, function () {
    console.log("App server is running on port 3000");
});