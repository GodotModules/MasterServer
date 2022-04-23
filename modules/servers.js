// Keeps track of servers (lobbies) created from Godot C# clients

const DROP_SERVER_TIME = 20000
const CHECK_SERVERS_PING_INTERVAL = 10000

let servers = []

exports.handle = (app) => {
    app.post('/api/ping', (req, res) => {
        const serverName = req.body.Name

        const server = servers.find(x => x.Name == serverName)
        if (server) {
            server.LastPing = Date.now()
            res.status(200).send('Pong')
        }
    })

    app.get('/api/servers/get', (req, res) => {
        res.send(servers)
    })

    app.post('/api/servers/post', (req, res) => {
        const server = req.body
        if (servers.some(x => x.Ip == server.Ip)) {
            res.status(200).send('Server on list already')
            return
        }

        server.LastPing = Date.now()
        servers.push(server)
        res.status(200).send('Server added to list')
    })

    setInterval(() => {
        // check last time servers were pinged
        for (let i = 0; i < servers.length; i++) {
            const server = servers[i]
            const pingDiff = (Date.now() - server.LastPing)
            if (pingDiff > DROP_SERVER_TIME) {
                // filter: anything true in the predicate will stay in the array, anything false will get yeeted
                servers = servers.filter(x => x.Name !== server.Name)
                console.log(`Server '${server.Name}' was dropped`)
            }
            console.log(servers.length)
        }
    }, CHECK_SERVERS_PING_INTERVAL)
}