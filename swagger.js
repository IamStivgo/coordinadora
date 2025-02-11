var swaggerAutogen = require('swagger-autogen')();
var doc = {
    info: {
        title: 'Coordinadora API',
        description: 'API para la gestión de envíos de Coordinadora',
    },
    host: 'localhost:3000',
    schemes: ['http'],
    definitions: {
        User: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com'
        },
        AddUser: {
            $name: 'John Doe',
            $email: 'john@example.com'
        }
    }
};
var outputFile = './swagger-output.json';
var routes = ['./src/server.ts'];
swaggerAutogen(outputFile, routes, doc);
