const http = require('http');

const app = http.createServer((req, res) =>{
    //el encabezado le dice al exporador con que tipo de recurso va a trabajar
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end('servidor nodew iniciado')
});

const PORT = 3000;

app.listen(PORT);

console.log('SERVIDOR LEVANTADO EN EL PUERTO', PORT);