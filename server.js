const express = require('express')
const bodyParser = require('body-parser');
const fs = require('fs')

const app = express()
const port = 4000

loadModules()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/api/ping', (req, res) => {
	res.status(200).send('Ok')
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

function loadModules() {
    fs.readdir('./modules', (err, files) => {
        files.forEach(file => {
            require(`./modules/${file}`).handle(app)
        })
    })
}