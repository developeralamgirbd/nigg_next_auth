// pages/auth/error.js
import Link from 'next/link';

// @ts-ignore
export default function AuthError() {
    return (
        <div>
            <h2>Authentication Error</h2>
            {/*<p>{message}</p>*/}
            <Link href="/">
                <a>Go back to homepage</a>
            </Link>
        </div>
    );
}
