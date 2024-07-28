"use client"

import { useGetCurrentUser } from "@/features/auth/hooks"

export default function DashboardPage() {
	const { data, handleSignOut } = useGetCurrentUser()

	return (
		<>
			{" "}
			<p>Olá {data?.user.id}</p>{" "}
			<button type="button" onClick={handleSignOut}>
				sign out
			</button>
		</>
	)
}
