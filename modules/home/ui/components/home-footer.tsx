import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="border-t border-white/[0.04] bg-[#0D0F12]/80 backdrop-blur-md px-6 py-12 md:py-16 text-[#8892b0]">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="inline-block mb-4">
                            <span className="text-white font-mono font-bold tracking-wider text-lg">MONO WORKSPACE</span>
                        </Link>
                        <p className="text-sm text-[#8892b0]/80 mb-6 max-w-sm">
                            Building the next generation of AI-powered tools for developers and creators.
                        </p>
                        <div className="flex items-center space-x-4">
                            <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[#8892b0]/60 hover:text-white transition-colors">
                                <Github size={20} />
                                <span className="sr-only">GitHub</span>
                            </Link>
                            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#8892b0]/60 hover:text-white transition-colors">
                                <Twitter size={20} />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#8892b0]/60 hover:text-white transition-colors">
                                <Linkedin size={20} />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                            <Link href="mailto:hello@monoworkspace.com" className="text-[#8892b0]/60 hover:text-white transition-colors">
                                <Mail size={20} />
                                <span className="sr-only">Email</span>
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-medium mb-4 text-sm tracking-wide">Resources</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/docs" className="hover:text-[#8892b0] text-[#8892b0]/80 transition-colors">Documentation</Link></li>
                            <li><Link href="/blog" className="hover:text-[#8892b0] text-[#8892b0]/80 transition-colors">Blog</Link></li>
                            <li><Link href="/showcase" className="hover:text-[#8892b0] text-[#8892b0]/80 transition-colors">Showcase</Link></li>
                            <li><Link href="/pricing" className="hover:text-[#8892b0] text-[#8892b0]/80 transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-medium mb-4 text-sm tracking-wide">Company</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/about" className="hover:text-[#8892b0] text-[#8892b0]/80 transition-colors">About Us</Link></li>
                            <li><Link href="/careers" className="hover:text-[#8892b0] text-[#8892b0]/80 transition-colors">Careers</Link></li>
                            <li><Link href="/privacy" className="hover:text-[#8892b0] text-[#8892b0]/80 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-[#8892b0] text-[#8892b0]/80 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[11px] text-[#8892b0]/50 tracking-wider font-mono uppercase">
                        &copy; {new Date().getFullYear()} MONO WORKSPACE. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex space-x-6 text-[11px] text-[#8892b0]/50 tracking-wider font-mono uppercase">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer