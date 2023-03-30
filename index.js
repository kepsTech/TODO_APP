"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pg_1 = require("pg");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
const port = 3001;
app.get('/', (req, res) => {
    const pool = openDb();
    pool.query("select * from task", (error, result) => {
        if (error) {
            res.status(500).json({ error: error.message });
        }
        res.status(200).json(result.rows);
    });
});
app.post('/new', (req, res) => {
    const pool = openDb();
    pool.query('insert into task (description) values ($1) returning *', [req.body.description], (error, result) => {
        if (error) {
            res.status(500).json({ error: error.message });
        }
        res.status(200).json({ id: result.rows[0].id });
    });
});
app.delete('/delete/:id', (req, res) => {
    const pool = openDb();
    const id = parseInt(req.params.id);
    pool.query('delete from task where id = $1', [id], (error, result) => {
        if (error) {
            res.status(500).json({ error: error.message });
        }
        res.status(200).json({ id: id });
    });
});
const openDb = () => {
    const pool = new pg_1.Pool({
        user: "root",
        host: "dpg-cgivff8rjeniukbjqhvg-a.oregon-postgres.render.com",
        database: "todo_shtw",
        password: "YrUS11l0n7PEhIrBcBavz8v6oaXzCzRr",
        port: 5432,
        ssl: true
    });
    return pool;
};
app.listen(port);
