import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function DebugAuthPage() {
    const session = await getServerSession(authOptions);
    const cookieStore = await cookies();
    const cookieList = cookieStore.getAll().map(c => c.name);

    const envStatus = {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET_SET: !!process.env.NEXTAUTH_SECRET,
        NEXTAUTH_SECRET_LEN: process.env.NEXTAUTH_SECRET?.length || 0,
    };

    return (
        <div className="p-8 font-mono text-sm">
            <h1 className="text-xl font-bold mb-4">Auth Debugger</h1>

            <section className="mb-8">
                <h2 className="font-bold bg-gray-200 p-2">1. Environment Variables</h2>
                <pre className="bg-gray-100 p-4 rounded mt-2">
                    {JSON.stringify(envStatus, null, 2)}
                </pre>
            </section>

            <section className="mb-8">
                <h2 className="font-bold bg-gray-200 p-2">2. Cookies Present</h2>
                <pre className="bg-gray-100 p-4 rounded mt-2">
                    {JSON.stringify(cookieList, null, 2)}
                </pre>
            </section>

            <section className="mb-8">
                <h2 className="font-bold bg-gray-200 p-2">3. Server Session (getServerSession)</h2>
                <pre className="bg-gray-100 p-4 rounded mt-2">
                    {JSON.stringify(session, null, 2)}
                </pre>
            </section>

            <div className="bg-yellow-50 p-4 border border-yellow-200 text-yellow-800">
                Take a screenshot of this page and send it to me.
            </div>
        </div>
    );
}
