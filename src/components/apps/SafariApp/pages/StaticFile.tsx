export function StaticPage({ url }: { url: string }) {
    return (
        <div className="mx-auto mt-16 max-w-4xl rounded-xl bg-white/10 p-8 text-white">
            <h1 className="mb-2 text-2xl font-semibold">
                {url.replace("https://", "")}
            </h1>

            <p className="mb-6 text-sm text-white/60">
                Secure connection established
            </p>

            <div className="space-y-4 text-sm text-white/80">
                <p>This page is part of a restricted internal network.</p>
                <p>
                    Content is currently unavailable or requires authentication.
                </p>
                <p>Please contact your system administrator for access.</p>
            </div>
        </div>
    );
}
