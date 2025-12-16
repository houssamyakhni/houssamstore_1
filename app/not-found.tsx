import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <h1 className="text-6xl font-black text-gray-200">404</h1>
            <h2 className="text-2xl font-bold text-gray-900 mt-4">Page Not Found</h2>
            <p className="text-gray-500 mt-2">The page you are looking for doesn't exist or has been moved.</p>
            <Link href="/" className="mt-8 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
                Go Back Home
            </Link>
        </div>
    );
}
