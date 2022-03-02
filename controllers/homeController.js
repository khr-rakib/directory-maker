const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const appDir = path.dirname(require.main.filename);
const uploadDir = appDir + '/public/';

exports.getHomePage = (req, res) => {
    res.render('index');
}

exports.generateZip = (req, res) => {
    const { data } = req.body;
    const zip = new AdmZip();

    // delete previous direcotries
    if (fs.existsSync(appDir + '/public')) {
        const files = fs.readdirSync(appDir + '/public/');
        for (let d = 0; d < files.length; d++) {
            fs.rmdir(`${appDir}/public/${files[d]}`, (err) => {
                if (err) {
                    res.json({
                        status: 'fail',
                        msg: 'Error occur when deleting direcotry'
                    });
                }
                console.log('Previous directory deleted successfully!')
            });
        }
    }

    // if public dir not exists -> make public dir
    if (!fs.existsSync(appDir + '/public')) {
        fs.mkdir(path.join(appDir, 'public'), (err) => {
            if (err) return console.error(err);
            console.log('Public Directory created successfully!');
        });
    }

    // if user not enter dir name
    if (!!data && data.length < 1) {
        return res.status(404).json({
            status: 'fail',
            msg: 'Please input directory name first.'
        });
    }

    !!data && data?.map(d => {
        fs.mkdir(path.join(`${appDir}/public/`, d.name), (err) => {
            if (err) return console.error(err);
            console.log('Directory created successfully!');
        });
    });

    setTimeout(async () => {
        for(let x = 0; x < data.length; x++) {
            zip.addLocalFolder(appDir + "/public/",  data[x]['name']);
        }
        
        const downloadName = `directories-${Date.now()}.zip`;
        const datas = zip.toBuffer();

        zip.writeZip(appDir + '/download/' + downloadName);

        res.set('Content-Type', 'application/octet-stream');
        res.set('Content-Disposition', `attachment; filename=${downloadName}`);
        res.set('Content-Length',datas.length);
        const dFile = `${downloadName}`;

        res.status(200).json({
            status: 'success',
            msg: 'Zip file created successfully. Now click download button to download.',
            zipFile: dFile
        });
    }, 3000);
}

exports.removeZipFile = (req, res) => {
    if(fs.existsSync('download')) {
        fs.unlink(appDir + '/download/' + req.params.name, (err) => {
            err &&  console.log('error occur when rmeove folder.');
            console.log('successfully clear');
        });
        res.status(200).json({
            status: 'success',
            msg: 'Zip file deleted successfully!'
        });
    } else {
        res.status(404).json({
            status: 'fail',
            msg: 'No zip file found!'
        });
    }
}