import {Router} from 'express';

const router = Router();

const users = require('./users/users.routes')
const collections = require('./collections/collections.routes');

router.use("/usuarios", users);
router.use("/collections", collections);

router.use(function(_req, res){
    res.status(404).json({message: "Rota inexistente"});
});