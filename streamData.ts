const fs = require('fs');
let readerStream = fs.createReadStream('./pgfile/tododb.json');
let writeStream = fs.createWriteStream("formatted.json");

readerStream.on('data', function (chunk) {
    let jsonData = JSON.parse(chunk);
    jsonData.forEach(element => {
        let obj = {
            _index: 'todos',
            _id: element.id,
            _source: {
                id: element.id,
                userEmail: element.userEmail,
                todo: {
                    title: element.title,
                    description: element.description,
                    createdDate: element.createdDate,
                    updatedDate: element.updatedDate
                }
            }
        };

        let newLine = JSON.stringify(obj) + "\n";
        writeStream.write(newLine);
    });
});
