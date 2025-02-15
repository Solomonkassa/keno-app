import Link from "next/link"
import { UserNav } from "./user-nav"

export function MainNav() {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold">
            Keno Web App
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/history" className="text-gray-600 hover:text-gray-900">
              History
            </Link>
            <Link href="/faq" className="text-gray-600 hover:text-gray-900">
              FAQ
            </Link>
            <UserNav />
          </div>
        </div>
      </div>
    </nav>
  )
}

