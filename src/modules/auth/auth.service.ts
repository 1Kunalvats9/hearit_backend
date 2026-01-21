import {OAuth2Client} from "google-auth-library";
import {env} from "../../config/env";
import {prisma} from "../../common/db/prisma";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const SALT_ROUNDS = 10
const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID)

export class AuthService{

    //register function
    static async register(email: string, password: string, name?: string){
        const existing = await prisma.user.findUnique({where:{email}})
        if(existing){
            throw new Error("User already exists")
        }

        const passwordHash = await bcrypt.hash(password,SALT_ROUNDS)

        const user = await prisma.user.create({
            data:{
                email,
                name,
                authProviders:{
                    create:{
                        provider:"password",
                        providerId:email,
                        password:passwordHash
                    }
                }
            }
        })

        await this.grantSignupCredits(user.id)

        return this.issueJwt(user.id);

    }

    static async login(email: string, password: string){
        const authProvider = await prisma.authProvider.findUnique({
            where:{
                provider_providerId:{
                    provider: "password",
                    providerId: email
                }
            },
            include: { user: true }
        })

        if (!authProvider || !authProvider.password) {
            throw new Error("Invalid credentials");
        }

        const valid = await bcrypt.compare(password, authProvider.password);
        if (!valid) throw new Error("Invalid credentials");

        return this.issueJwt(authProvider.user.id);
    }

    static async googleLogin(idToken: string) {
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.sub || !payload.email) {
            throw new Error("Invalid Google token");
        }

        const { sub, email, name, picture } = payload;

        let authProvider = await prisma.authProvider.findUnique({
            where: {
                provider_providerId: {
                    provider: "google",
                    providerId: sub
                }
            },
            include: { user: true }
        });

        if (!authProvider) {
            const user = await prisma.user.create({
                data: {
                    email,
                    name,
                    profilePicture: picture,
                    authProviders: {
                        create: {
                            provider: "google",
                            providerId: sub
                        }
                    }
                }
            });

            await this.grantSignupCredits(user.id);
            return this.issueJwt(user.id);
        }

        return this.issueJwt(authProvider.user.id);
    }

    private static issueJwt(userId: string) {
        return jwt.sign({ userId }, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN as any
        });
    }

    private static async grantSignupCredits(userId: string) {
        await prisma.creditTransaction.create({
            data: {
                userId,
                type: "grant",
                action: "signup_bonus",
                credits: 5
            }
        });
    }
}