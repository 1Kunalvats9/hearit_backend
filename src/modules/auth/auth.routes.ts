import {FastifyInstance} from "fastify";
import {AuthController} from "./auth.controller";


export async function authRoutes(app: FastifyInstance){
    app.post("/register", AuthController.register)
    app.post("/login", AuthController.login)
    app.post("/google", AuthController.google)
}