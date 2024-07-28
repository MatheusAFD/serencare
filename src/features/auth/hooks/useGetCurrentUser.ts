import { signOut, useSession } from "next-auth/react"

export function useGetCurrentUser() {
	const { ...data } = useSession()

	const handleSignOut = () => {
		signOut()
	}

	return {
		...data,

		handleSignOut,
	}
}
