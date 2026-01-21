import Fastify from "fastify"
import cors from "@fastify/cors"
import {healthRoutes} from "./modules/health/health.routes"
import {authRoutes} from "./modules/auth/auth.routes";


export default function buildApp(){
    const app = Fastify({
        logger:true
    })
    app.register(cors,{
        origin: true
    })

    //Routes
    app.register(healthRoutes, {
        prefix: "/api/health"
    })
    app.register(authRoutes, {
        prefix: "/api/auth"
    });


    return app
}