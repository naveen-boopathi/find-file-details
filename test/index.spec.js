const chai = require('chai');
const Promise = require('bluebird');
const should = chai.should();
const app = require('../index');
const utils = require('./utils');
const path = require('path');
const ROOT = path.resolve('.');

describe('fs_intermediate', () => {
    let mockFs;
    before((done) => {
        utils.generateTempDirectory()
            .then(s => {
                mockFs = s;
                done();
            })
    });

    after((done) => {
        utils.cleanUp()
            .then(() => {
                done();
            })
    });

    it('Should reject with a Invalid Path Error if the file/folder does not exist', done => {
        app(ROOT + '/logs')
            .catch(err => {
                err.message.should.eql('Invalid Path');
                done()
            })
    });


    it('Should have return the listing data for a file', done => {
        app(ROOT + '/tmp/file.txt')
            .then(result => {
                Array.isArray(result).should.eql(true);
                result.length.should.eql(1);
                result[0].fileName.should.eql('file.txt');
                result[0].filePath.should.eql('/tmp/file.txt');
                result[0].size.should.eql(94953);
                done();
            })
    });

    it('Should have return the details for a zipped file', done => {
        app(ROOT + '/tmp/file.gz')
            .then(result => {
                Array.isArray(result).should.eql(true);
                result.length.should.eql(1);
                result[0].fileName.should.eql('file.gz');
                result[0].filePath.should.eql('/tmp/file.gz');
                result[0].size.should.eql(9945);
                done();
            })
    })

    it('Should return the correct details for a directory', done => {
        app(ROOT + '/tmp/test_dir')
            .then(result => {
                Array.isArray(result).should.eql(true);
                result.length.should.eql(3);
                utils.result.forEach((fileDetails, i) => {
                    result[i].fileName.should.be.eql(fileDetails.fileName);
                    result[i].filePath.should.be.eql(fileDetails.filePath);
                    result[i].size.should.be.eql(fileDetails.size);
                    result[i].isDirectory.should.be.eql(fileDetails.isDirectory);
                });
                done();
            })
    });


    it('Should return the correct details for tmp generated directory', done => {

        app(ROOT + '/tmp1')
            .then(result => {
                Array.isArray(result).should.eql(true);
                result.length.should.eql(4);
                const expected = [...mockFs];
                const temp = expected[2];
                expected[2] = expected[3];
                expected[3] = temp;
                expected.forEach((fileDetails, i) => {
                    result[i].fileName.should.be.eql(fileDetails.fileName);
                    result[i].filePath.should.be.eql(fileDetails.path);
                    result[i].createdAt.should.be.eql(fileDetails.createdAt);
                    result[i].isDirectory.should.be.eql(fileDetails.isDirectory);
                });
                done()
            })

    })
});
