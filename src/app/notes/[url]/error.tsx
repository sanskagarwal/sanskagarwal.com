"use client";

const Error = ({ reset }: { error: Error; reset: () => void }) => (
    <div className="grid grid-cols-6">
        <div className="py-10 bg-white md:col-start-2 md:col-span-4 col-span-6 px-5 md:px-10 lg:px-20 border-l border-r border-dotted shadow-2xl md:shadow-lg text-center">
            <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
                Failed to load this note. Please try again.
            </p>
            <button
                onClick={reset}
                className="inline-flex items-center px-6 py-2 rounded-md bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
            >
                Retry
            </button>
        </div>
    </div>
);

export default Error;
