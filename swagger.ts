const swaggerAutogen = require('swagger-autogen')();

const doc = {
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

const outputFile = './swagger-output.json';
const routes = ['./src/server.ts'];

swaggerAutogen(outputFile, routes, doc);
