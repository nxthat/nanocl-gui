import Image from "next/image"
import Link from "next/link"
import React from "react"

const Header = () => {
  return (
    <header className="relative h-[60px] flex-auto">
      <div className="fixed flex h-[60px] w-full items-center bg-[var(--ifm-navbar-background-color)] pb-[8px] pl-[16px] pr-[16px] pt-[8px]">
        <Image
          className="mr-2"
          src="/logo.webp"
          alt="Logo"
          width={32}
          height={32}
        />
        <h1 className="text-[95%] font-bold">
          <Link href="/">Nanocl Dashboard</Link>
        </h1>
      </div>
    </header>
  )
}

export default Header
