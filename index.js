const fs = require('fs');
const path = require('path');
const ROOT = path.resolve('.');

const main = (filePath) => {
    return new Promise((resolve, reject) => {
        const metadata = [];
        if (fs.existsSync(filePath)) {
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.log(err);
                }
                if (stats.isFile()) {
                    const file = {
                        fileName: path.basename(filePath),
                        filePath: path.join("/", path.relative(__dirname, filePath)),
                        size: stats.size,
                        createdAt: stats.ctime.toLocaleDateString(),
                        isDirectory: false
                    }
                    metadata.push(file);
                    resolve(metadata);
                } else {
                    fs.readdir(filePath, function (err, files) {
                        files.forEach(file => {
                            const dirStats = fs.statSync(path.join(filePath, "/", file));
                            const dirFile = {
                                fileName: file,
                                filePath: path.join("/", path.relative(__dirname, filePath), "/", file),
                                size: dirStats.size,
                                createdAt: dirStats.ctime.getUTCDate() + "-" + (dirStats.ctime.getMonth() + 1) + "-" + dirStats.ctime.getUTCFullYear(),
                                isDirectory: dirStats.isDirectory() ? true : false
                            }
                            metadata.push(dirFile);
                        });
                        resolve(metadata);
                    })
                }
            })
        } else {
            reject({ message: "Invalid Path" })
        }
    })
};



module.exports = main;
