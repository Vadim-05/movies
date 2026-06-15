import { Link, Outlet } from "react-router-dom";

export function Layout() {
    return (
        <div className="min-h-screen w-full dark:bg-black text-white px-6 py-5">
            <header className="mb-6">
                <Link to="/">HEADER</Link>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
}