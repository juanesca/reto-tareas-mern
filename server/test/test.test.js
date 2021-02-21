const request = require('supertest');
const faker = require('faker');
const app = require('../index');

var token = '';

const setToken = (tk) => {
    token = tk;
}

describe('Test de servicios', () => {
    it('verificacion de registro de usuario', async () => {
        const res = await request(app)
        .post('/auth/signup')
        .send({
            email: faker.internet.email(),
            name: faker.name.firstName(),
            pass: faker.internet.password()
        })
        expect(res.status).toEqual(200)
        setToken(res.body.jwtToken)
    });

    it('Verificar error por registrar un usuario ya existente', async () => {
        const res = await request(app)
        .post('/auth/signup')
        .send({
            email: 'juanesca2207@gmail.com',
            pass: '1001',
            name: 'Juanes'
        })
        expect(res.status).toEqual(401)
    });

    it('Verificar que el usuario inicia sesion correctamente', async () => {
        const res = await request(app)
        .post('/auth/login')
        .send({
            email: 'juanesca2207@gmail.com',
            pass: '1001'
        })
        expect(res.status).toEqual(200)
    });

    it('Verificacion del token', async() => {
        const res = await request(app)
        .post('/auth/verify')
        .set('jwt_token',token)
        expect(res.body).toHaveProperty('status',true)
    })

    it('verificar que un usuario no puede inciar sesion por correo invalido', async () => {
        const res = await request(app)
        .post('/auth/login')
        .send({
            email: faker.internet.email(),
            pass: faker.internet.password()
        })
        expect(res.status).toEqual(401)
        expect(res.body).toHaveProperty('msg','Invalid Email')
    });

    it('verificar que un usuario no pueda iniciar sesion por contraseña invalida', async () => {
        const res = await request(app)
        .post('/auth/login')
        .send({
            email: 'juanesca2207@gmail.com',
            pass: faker.internet.password()
        })
        expect(res.status).toEqual(401)
        expect(res.body).toHaveProperty('msg','Invalid Password')
    });

    it('verificar que la creacion de tareas funciona', async () => {
        const res = await request(app)
        .post('/task/add')
        .set('jwt_token',token)
        .send({
            name: faker.lorem.word(),
            img: faker.image.imageUrl(),
            priority: faker.random.arrayElement(['Alta','Media','Baja']),
            ven_date: faker.date.future(),
            user_id: '603295244219301d9040cd4b'
        })
        expect(res.status).toEqual(200)
        expect(res.body).toHaveProperty('msg','Task Added')
    });

    it('verificar que se listan las tareas asociadas a un usuario', async() => {
        const res = await request(app)
        .post('/task')
        .set('jwt_token',token)
        .send({
            user_id: '603295244219301d9040cd4b'
        })
        expect(res.status).toEqual(200)
    });

    it('verificar que se borre una tarea segun su id', async() => {
        const res = await request(app)
        .post('/task/delete/603298dea36d9923c0c0f28a')
        .set('jwt_token',token)
        expect(res.body).toHaveProperty('status', 'Task Deleted')
    });

    it('verificar que se edite una tarea segun su id', async () => {
        const res = await request(app)
        .post('/task/edit/6032998366d0330a44329aad')
        .set('jwt_token',token)
        .send({
            name: faker.lorem.word(),
            img: faker.image.imageUrl(),
            priority: faker.random.arrayElement(['Alta','Media','Baja']),
            ven_date: faker.date.future()
        })
        expect(res.body).toHaveProperty('status','Task Saved')
    })
})
