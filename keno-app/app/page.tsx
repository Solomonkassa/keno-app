import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { LoginButton } from "@/components/auth/login-button"
import { KenoGame } from "@/components/keno-game"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to Keno Web App</h1>
      {session ? (
        <KenoGame />
      ) : (
        <div className="text-center">
          <p className="mb-4">Please log in to play Keno.</p>
          <LoginButton />
        </div>
      )}
    </div>
  )
}

