const app = require('./index');
const path = require('path');
const ROOT = path.resolve('.');

app(ROOT + '/logs')
.then(result => console.log(JSON.stringify(result, null, 2)))
.catch(err => {
    console.log(ROOT + '/logs');
    console.log(JSON.stringify(err, null, 2));
});

app(ROOT + '/tmp/file.txt')
.then(result => {
    console.log(ROOT + '/tmp/file.txt');
    console.log(JSON.stringify(result, null, 2));
});

app(ROOT + '/tmp/file.gz')
.then(result => {
    console.log(ROOT + '/tmp/file.gz');
    console.log(JSON.stringify(result, null, 2));
});


app(ROOT + '/tmp/test_dir')
.then(result => {
    console.log(ROOT + '/tmp/test_dir');
    console.log(JSON.stringify(result, null, 2));
});

app(ROOT + '/tmp1')
.then(result => {
    console.log(ROOT + '/tmp1');
    console.log(JSON.stringify(result, null, 2));
});