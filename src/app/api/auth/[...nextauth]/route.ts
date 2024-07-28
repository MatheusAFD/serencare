import * as JWT from "jsonwebtoken"
import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {
					label: "Email",
					type: "email",
				},
				password: {
					label: "Password",
					type: "password",
				},
			},
			authorize: async (credentials) => {
				const res = await fetch("http://localhost:4000/auth/signin", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: credentials?.email,
						password: credentials?.password,
					}),
				})
				const user = await res.json()

				if (res.ok && user) {
					return user
				}
				return null
			},
		}),
	],
	pages: {
		signIn: "/sign-in",
	},
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				try {
					const decodedAccessToken = JWT.decode(
						user.accessToken,
					) as JWT.JwtPayload

					token.user = {
						id: decodedAccessToken?.id,
						companyId: decodedAccessToken?.companyId,
						roles: decodedAccessToken.role.type,
						accessToken: user.accessToken,
						JWTExpirationDate: decodedAccessToken?.exp,
					}
				} catch (error) {
					throw new Error("Falha ao tentar decodificar o token de acesso")
				}
			}

			return token
		},
		async session({ session, token }) {
			if (token?.user) {
				session.user = token?.user
			}

			return session
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
