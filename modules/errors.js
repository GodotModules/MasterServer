// Stores error reports from Godot C# clients
const fs = require('fs')

exports.handle = (app) => {
    app.post('/api/errors/post', (req, res) => {
        const report = req.body
        console.log(report)
        saveReport(report)

        res.status(200).send('Report received')
    })
}

async function saveReport(report) {
    report.received = dateYYYYMMDDHMS()

    if (!fs.existsSync('./errors'))
        fs.mkdirSync('./errors')

    const dir = await fs.promises.readdir('./errors')

    fs.writeFile(`./errors/Error Report - ${dir.length + 1} ${dateYYYYMMDD()}.json`, JSON.stringify(report, null, 4), (err) => {
        if (err) console.log(err)
    })
}

function dateYYYYMMDDHMS() {
    const date = new Date()
    let year = date.getFullYear()
    let month = ("0" + (date.getMonth() + 1)).slice(-2)
    let day = date.getDay()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()
    return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
}

function dateYYYYMMDD() {
    const date = new Date()
    let year = date.getFullYear()
    let month = ("0" + (date.getMonth() + 1)).slice(-2)
    let day = date.getDay()
    return year + "-" + month + "-" + day
}