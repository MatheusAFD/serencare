import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { UserRoles } from "./features/user/enum"
import { AppRoutesEnum } from "./features/@shared/enums"

export default withAuth(
	async function middleware(request) {
		const response = NextResponse.next()

		const session = request.nextauth?.token
		const tokenExpirationDate = session?.user?.JWTExpirationDate as number
		const userRoles = session?.user.roles

		const currentPath = request.nextUrl.pathname

		if (!session || tokenExpirationDate < Math.floor(Date.now() / 1000)) {
			const response = NextResponse.redirect(
				new URL(AppRoutesEnum.SIGNIN, request.url),
			)

			response.cookies.set("next-auth.session-token", "", {
				expires: new Date(0),
			})
			response.cookies.set("next-auth.csrf-token", "", {
				expires: new Date(0),
			})
			response.cookies.set("next-auth.callback-url", "", {
				expires: new Date(0),
			})

			return response
		}

		if (currentPath.startsWith(AppRoutesEnum.DASHBOARD)) {
			if (userRoles !== UserRoles.SUPER_ADMIN) {
				return NextResponse.redirect(new URL("/inicio", request.url))
			}
		}

		return response
	},
	{
		callbacks: {
			authorized: ({ token }) => !!token,
		},
	},
)

export const config = {
	matcher: ["/dashboard/:path*"],
}
