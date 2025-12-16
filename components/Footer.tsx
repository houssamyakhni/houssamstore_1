import Link from 'next/link';
import Image from "next/image";
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

export default function Footer() {
    return (
        <footer className="bg-black text-white pt-16 pb-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div>
                        <Link href="/" className="mb-6 flex items-center gap-3">
                            <div className="relative w-12 h-12 bg-white rounded-lg p-1.5 shadow-sm overflow-hidden flex-shrink-0">
                                <Image
                                    src="/HoussamStoreLogo.png"
                                    alt="Houssam Store"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">Houssam Store</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Curating essential, timeless products for modern living. Quality and design are at the heart of everything we do.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FiInstagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FiTwitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FiFacebook size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Shop</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
                            <li><Link href="/products?category=clothing" className="hover:text-white transition-colors">Clothing</Link></li>
                            <li><Link href="/products?category=electronics" className="hover:text-white transition-colors">Electronics</Link></li>
                            <li><Link href="/products?category=accessories" className="hover:text-white transition-colors">Accessories</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Contact</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start">
                                <FiMapPin className="mt-1 mr-3 flex-shrink-0" />
                                <span>123 Fashion Ave, Design District, NY 10012</span>
                            </li>
                            <li className="flex items-center">
                                <FiMail className="mr-3 flex-shrink-0" />
                                <a href="mailto:hello@houssam.store" className="hover:text-white transition-colors">hello@houssam.store</a>
                            </li>
                            <li className="flex items-center">
                                <FiPhone className="mr-3 flex-shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Houssam Store. All rights reserved.</p>
                    <p className="mt-4 md:mt-0">Designed with precision.</p>
                </div>
            </div>
        </footer>
    );
}
