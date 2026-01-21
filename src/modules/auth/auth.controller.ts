import {AuthService} from "./auth.service";
import {FastifyRequest, FastifyReply} from "fastify";
import {LoginInput, RegisterInput} from "./auth.types";

export class AuthController {
    static async register(req: FastifyRequest, res: FastifyReply){
        const {email, password, name} = req.body as RegisterInput

        const token = await AuthService.register(email, password, name);

        res.send({token})
    }

    static async login(req: FastifyRequest, res: FastifyReply){
        const {email, password} = req.body as LoginInput

        const token = await AuthService.register(email, password);

        res.send({token})
    }

    static async google(req: FastifyRequest, reply: FastifyReply) {
        const { idToken } = req.body as any;
        const token = await AuthService.googleLogin(idToken);
        reply.send({ token });
    }

}