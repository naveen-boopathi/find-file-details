const BlueBird = require('bluebird');
const ROOT = require('path').resolve('.');
const fs = BlueBird.promisifyAll(require("fs"));

const result = [
    {
        fileName: 'bla.txt',
        filePath: '/tmp/test_dir/bla.txt',
        size: 1850,
        isDirectory: false,
        createdAt: '28-02-2020'
    },
    {
        fileName: 'important-data.json',
        filePath: '/tmp/test_dir/important-data.json',
        size: 11846,
        isDirectory: false,
        createdAt: '28-02-2020'
    },
    {
        fileName: 'test.txt',
        filePath: '/tmp/test_dir/test.txt',
        size: 686,
        isDirectory: false,
        createdAt: '28-02-2020'
    }
];

let tmp1 = [
    {
        fileName: 'file1.txt',
        filePath: ROOT + '/tmp1/file1.txt',
        path: '/tmp1/file1.txt',
        contents: 'FASTEST INTERNET SPEED',
        isDirectory: false
    },
    {
        fileName: 'file2.txt',
        filePath: ROOT + '/tmp1/file2.txt',
        path: '/tmp1/file2.txt',
        contents: 'FASTEST INTERNET SPEED\nFASTEST INTERNET SPEED AGAIN\nFASTEST INTERNET SPEED AGAIN AGAIN',
        isDirectory: false
    },
    {
        isDirectory: true,
        fileName: 'logs',
        filePath: ROOT + '/tmp1/logs',
        path: '/tmp1/logs',
        children: [
            {
                fileName: 'file3.txt',
                filePath: ROOT + '/tmp1/logs/file3.txt',
                contents: 'FASTEST INTERNET SPEED\nFASTEST INTERNET SPEED AGAIN\nFASTEST AGAIN AGAIN',
                isDirectory: false
            },
            {
                fileName: 'file4.txt',
                filePath: ROOT + '/tmp1/logs/file5.txt',
                contents: 'F',
                isDirectory: false
            }
        ]
    },
    {
        fileName: 'file4.txt',
        filePath: ROOT + '/tmp1/file4.txt',
        path: '/tmp1/file4.txt',
        contents: 'FASTE',
        isDirectory: false
    }
];

const removeFile = (pathData) => {
    return new Promise((resolve, reject) => {
        if (pathData.isDirectory) {
            BlueBird.map(pathData.children, p => fs.unlinkAsync(p.filePath))
                .then(() => fs.rmdirAsync(pathData.filePath))
                .then(resolve)
                .catch(reject);
        } else {
            fs.unlinkAsync(pathData.filePath)
                .then(resolve)
                .catch(reject);
        }
    })
};

const cleanUp = () => {
    return new Promise((resolve, reject) => {
        BlueBird
            .map(tmp1, (pathPair) => {
                return removeFile(pathPair);
            })
            .then(() => fs.rmdirAsync(ROOT + '/tmp1'))
            .then(resolve)
            .catch(reject);
    })
};

const createDIR = (FOLDER) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(FOLDER, err => {
            if (err && err.code === 'EEXIST') return resolve();
            if (err) return reject(err);
            resolve();
        })
    })
};

const createFile = (pathData) => {
    return new Promise((resolve, reject) => {
        if (pathData.isDirectory) {
            createDIR(pathData.filePath)
                .then(() => BlueBird.mapSeries(pathData.children, c => createFile(c)))
                .then(m => resolve(m[0]))
                .catch(reject)
        } else {
            fs.writeFileAsync(pathData.filePath, pathData.contents, 'utf8')
                .then(() => fs.statAsync(pathData.filePath))
                .then(resolve)
                .catch(reject)
        }
    })
};

const generateTempDirectory = () => {
    return new Promise((resolve, reject) => {
        createDIR(ROOT + '/tmp1')
            .then(() => BlueBird.mapSeries(tmp1, m => createFile(m)))
            .then(stats => {
                tmp1 = tmp1.map((f, i) => {
                    f.size = stats[i].size;
                    f.createdAt = dateFormat(stats[i].ctimeMs);
                    return f;
                });
                resolve(tmp1);
            })
            .catch(reject);
    })
};

const dateFormat = (timestamp) => {
    var date = new Date(timestamp);
    var dd = date.getUTCDate();

    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }
    return `${dd}-${mm}-${yyyy}`;
};

module.exports = {
    cleanUp,
    result,
    generateTempDirectory
};
