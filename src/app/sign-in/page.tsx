"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { type FormEvent, useState } from "react"

export default function SignInPage() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	const router = useRouter()

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault()

		const result = await signIn("credentials", {
			redirect: false,
			email,
			password,
		})

		if (result?.ok) {
			return router.push("/dashboard")
		}

		if (result?.ok === false) {
			console.error("Failed to sign in", result?.error)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-56 p-4">
			{" "}
			<input
				type="email"
				name="email"
				id="email"
				placeholder="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
			/>{" "}
			<input
				type="password"
				name="password"
				id="password"
				placeholder="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
			/>{" "}
			<input type="submit" value="sign-in" />{" "}
		</form>
	)
}
