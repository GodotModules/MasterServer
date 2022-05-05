// Keeps track of servers (lobbies) created from Godot C# clients

const DROP_SERVER_TIME = 20000
const CHECK_SERVERS_PING_INTERVAL = 5000

let servers = []

exports.handle = (app) => {
    app.post('/api/servers/ping', (req, res) => {
        const serverName = req.body.Name

        const server = servers.find(x => x.Name == serverName)
		
        if (server) {
            server.LastPing = Date.now()
            res.status(200).send('Ok')
        }
    })

    app.get('/api/servers/get', (req, res) => {
        res.send(servers)
    })
	
	app.post('/api/servers/players/add', (req, res) => {
		const ip = req.body.Ip
		var server = servers.find(x => x.Ip == ip)
		if (server != null)
			server.Players++
		
		res.status(200).send('Ok')
	})
	
	app.post('/api/servers/players/remove', (req, res) => {
		const ip = req.body.Ip
		var server = servers.find(x => x.Ip == ip)
		if (server != null)
			server.Players--
		
		res.status(200).send('Ok')
	})

    app.post('/api/servers/add', (req, res) => {
        const server = req.body
		server.Players = 0
        if (servers.some(x => x.Ip == server.Ip)) {
            res.status(200).send('Ok')
            return
        }

        server.LastPing = Date.now()
        servers.push(server)
		console.log(`Added server '${server.Name}' (${servers.length})`)
        res.status(200).send('Ok')
    })
	
	app.post('/api/servers/remove', (req, res) => {
		const ip = req.body.Ip
		var server = servers.find(x => x.Ip == ip)
		
		if (server == null)
		{
			console.log(`Tried to remove non-existent server with ip '${ip}'`)
			res.status(200).send('Ok')
			return;
		}
		
		servers.splice(servers.indexOf(server), 1)
		console.log(`Removed server '${server.Name}' (${servers.length})`)
		res.status(200).send('Ok')
	})

    setInterval(() => {
        // check last time servers were pinged
        for (let i = 0; i < servers.length; i++) {
            const server = servers[i]
            const pingDiff = (Date.now() - server.LastPing)
            if (pingDiff > DROP_SERVER_TIME) {
                // filter: anything true in the predicate will stay in the array, anything false will get yeeted
                servers = servers.filter(x => x.Name !== server.Name)
                console.log(`Removed server '${server.Name}' (${servers.length})`)
            }
        }
    }, CHECK_SERVERS_PING_INTERVAL)
}