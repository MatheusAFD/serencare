import "next-auth"
import "next-auth/jwt"

import { TUserRole } from "@/types"

declare module "next-auth" {
	interface Session {
		user: User
		expires: string
	}

	interface User {
		id: string
		companyId: string
		roles: string
		JWTExpirationDate: number
		accessToken: string
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string
		status: number
		token: string
		user: User
		JWTExpirationDate?: number
	}
}
