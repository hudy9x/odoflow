import { CommonCarousel } from "@/components/CommonCarousel"
import { RegisterForm } from "@/features/Register"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/">
            <img src="/logo/logo-with-name2.png" alt="Logo" width={90} />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <div className="flex h-full items-center justify-center overflow-hidden">
          <CommonCarousel />
        </div>
      </div>
    </div>
  )
}
