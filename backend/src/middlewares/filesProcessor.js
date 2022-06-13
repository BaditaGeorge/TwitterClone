const Nanoid = require('nanoid');
const fs = require('fs');
const sharp = require('sharp');

const extractData = (url) => {
    const regex = /^data:.+\/(.+);base64,(.*)$/;
    const matches = url.match(regex);
    return matches;
};

const extractVideoData = (url) => {
    const regex = /^data:.+\/(.+);base64,(.*)$/;
    const matches = url.match(regex);
    return matches;
};

const fileProcessor = (req, res, next) => {
    const base_url = 'http://localhost:5050';
    const images = req.body.images;
    req.body.images = [];

    for(let i=0;i<images.length;i++) {
        const nanoID = Nanoid.nanoid();
        const [_, ext, buffer, ...rest] = extractData(images[i]['data_url']);
        const path = `${nanoID}.${ext}`;
        req.body.images.push(`${base_url}/images/${path}`);

        fs.writeFile(`./files/images/${path}`, Buffer.from(buffer, 'base64'), (err) => {
            if(err) {
                console.log(err.message);
            }
        });
    }

    if(req.body.video) {
        const [ , ,buffer, ] = extractVideoData(req.body.video);
        const nanoID = Nanoid.nanoid();
        req.body.video = `${base_url}/videos/${nanoID}.mp4`;

        fs.writeFile(`./files/videos/${nanoID}.mp4`, Buffer.from(buffer, 'base64'), (err) => {
            if(err) {
                console.log(err.message);
            }
        });
    }

    next();
};

module.exports = fileProcessor;