import Link from "next/link"
import Image from "next/image"

export const Footer = () => {
  return (
    <footer className="border-t border-foreground/5 bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.svg" height={32} width={32} alt="Mono" className="dark:invert" />
              <span className="text-xl font-semibold tracking-tight">Mono</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground leading-6">
              Build a bench of AI agents that remember the work. The minimalist workspace for focused operations.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Product</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li><Link href="#product" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="#workflow" className="hover:text-primary transition-colors">Workflow</Link></li>
              <li><Link href="/dashboard/upgrade" className="hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Social</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Twitter</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">GitHub</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Discord</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-foreground/5 pt-8 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Mono. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
             <span className="text-xs text-muted-foreground">Crafted with precision.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
