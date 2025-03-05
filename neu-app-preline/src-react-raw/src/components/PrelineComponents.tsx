import TuSelect from "./TuSelect";

const PrelineComponents = () => {
    return (
        <div className="p-4 flex flex-col gap-4 m-auto" style={{ width: 500 }}>
            <h1 className="text-lg">#Preline components</h1>
            <div className="mt-4"></div>
            <button
                type="button"
                className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            >
                Solid
            </button>
            <button
                type="button"
                className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 focus:outline-none focus:border-blue-600 focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-blue-500 dark:hover:border-blue-600 dark:focus:text-blue-500 dark:focus:border-blue-600"
            >
                Outline
            </button>
            <button
                type="button"
                className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent text-blue-600 hover:bg-blue-100 hover:text-blue-800 focus:outline-none focus:bg-blue-100 focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:bg-blue-800/30 dark:hover:text-blue-400 dark:focus:bg-blue-800/30 dark:focus:text-blue-400"
            >
                Ghost
            </button>
            <button
                type="button"
                className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-none focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-400 dark:hover:bg-blue-900 dark:focus:bg-blue-900"
            >
                Soft
            </button>
            <button
                type="button"
                className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            >
                White
            </button>
            <button
                type="button"
                className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400"
            >
                Link
            </button>
        <Inputs/>
        <TuSelect/>
        </div>
    );
};

export default PrelineComponents;

const Inputs = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="max-w-sm space-y-3">
  {/* Floating Input */}
  <div className="relative">
    <input
      type="email"
      id="hs-floating-input-email"
      className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
    focus:pt-6
    focus:pb-2
    [&:not(:placeholder-shown)]:pt-6
    [&:not(:placeholder-shown)]:pb-2
    autofill:pt-6
    autofill:pb-2"
      placeholder="you@email.com"
    />
    <label
      htmlFor="hs-floating-input-email"
      className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent  origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
peer-focus:scale-90
peer-focus:translate-x-0.5
peer-focus:-translate-y-1.5
peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
peer-[:not(:placeholder-shown)]:scale-90
peer-[:not(:placeholder-shown)]:translate-x-0.5
peer-[:not(:placeholder-shown)]:-translate-y-1.5
peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500"
    >
      Email
    </label>
  </div>
  {/* End Floating Input */}
  {/* Floating Input */}
  <div className="relative">
    <input
      type="password"
      id="hs-floating-input-passowrd"
      className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
    focus:pt-6
    focus:pb-2
    [&:not(:placeholder-shown)]:pt-6
    [&:not(:placeholder-shown)]:pb-2
    autofill:pt-6
    autofill:pb-2"
      placeholder="********"
    />
    <label
      htmlFor="hs-floating-input-passowrd"
      className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent  origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
peer-focus:scale-90
peer-focus:translate-x-0.5
peer-focus:-translate-y-1.5
peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
peer-[:not(:placeholder-shown)]:scale-90
peer-[:not(:placeholder-shown)]:translate-x-0.5
peer-[:not(:placeholder-shown)]:-translate-y-1.5
peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500"
    >
      Password
    </label>
  </div>
  {/* End Floating Input */}
  {/* Floating Input */}
  <div className="relative">
    <input
      type="email"
      id="hs-floating-gray-input-email"
      className="peer p-4 block w-full bg-gray-100 border-transparent rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:focus:ring-neutral-600
    focus:pt-6
    focus:pb-2
    [&:not(:placeholder-shown)]:pt-6
    [&:not(:placeholder-shown)]:pb-2
    autofill:pt-6
    autofill:pb-2"
      placeholder="you@email.com"
    />
    <label
      htmlFor="hs-floating-gray-input-email"
      className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent  origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
peer-focus:scale-90
peer-focus:translate-x-0.5
peer-focus:-translate-y-1.5
peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
peer-[:not(:placeholder-shown)]:scale-90
peer-[:not(:placeholder-shown)]:translate-x-0.5
peer-[:not(:placeholder-shown)]:-translate-y-1.5
peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500"
    >
      Email
    </label>
  </div>
  {/* End Floating Input */}
  {/* Floating Input */}
  <div className="relative">
    <input
      type="password"
      id="hs-floating-gray-input-passowrd"
      className="peer p-4 block w-full bg-gray-100 border-transparent rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:focus:ring-neutral-600
    focus:pt-6
    focus:pb-2
    [&:not(:placeholder-shown)]:pt-6
    [&:not(:placeholder-shown)]:pb-2
    autofill:pt-6
    autofill:pb-2"
      placeholder="********"
    />
    <label
      htmlFor="hs-floating-gray-input-passowrd"
      className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent  origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
peer-focus:scale-90
peer-focus:translate-x-0.5
peer-focus:-translate-y-1.5
peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
peer-[:not(:placeholder-shown)]:scale-90
peer-[:not(:placeholder-shown)]:translate-x-0.5
peer-[:not(:placeholder-shown)]:-translate-y-1.5
peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500"
    >
      Password
    </label>
  </div>
  {/* End Floating Input */}
  {/* Floating Input */}
  <div className="relative">
    <input
      type="email"
      id="hs-floating-underline-input-email"
      className="peer py-4 px-0 block w-full bg-transparent border-t-transparent border-b-2 border-x-transparent border-b-gray-200 text-sm placeholder:text-transparent focus:border-t-transparent focus:border-x-transparent focus:border-b-blue-500 focus:ring-0 disabled:opacity-50 disabled:pointer-events-none dark:border-b-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600 dark:focus:border-b-neutral-600
    focus:pt-6
    focus:pb-2
    [&:not(:placeholder-shown)]:pt-6
    [&:not(:placeholder-shown)]:pb-2
    autofill:pt-6
    autofill:pb-2"
      placeholder="you@email.com"
    />
    <label
      htmlFor="hs-floating-underline-input-email"
      className="absolute top-0 start-0 py-4 px-0 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent  origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
peer-focus:scale-90
peer-focus:translate-x-0.5
peer-focus:-translate-y-1.5
peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
peer-[:not(:placeholder-shown)]:scale-90
peer-[:not(:placeholder-shown)]:translate-x-0.5
peer-[:not(:placeholder-shown)]:-translate-y-1.5
peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500"
    >
      Email
    </label>
  </div>
  {/* End Floating Input */}
  {/* Floating Input */}
  <div className="relative">
    <input
      type="password"
      id="hs-floating-underline-input-passowrd"
      className="peer py-4 px-0 block w-full bg-transparent border-t-transparent border-b-2 border-x-transparent border-b-gray-200 text-sm placeholder:text-transparent focus:border-t-transparent focus:border-x-transparent focus:border-b-blue-500 focus:ring-0 disabled:opacity-50 disabled:pointer-events-none dark:border-b-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600 dark:focus:border-b-neutral-600
    focus:pt-6
    focus:pb-2
    [&:not(:placeholder-shown)]:pt-6
    [&:not(:placeholder-shown)]:pb-2
    autofill:pt-6
    autofill:pb-2"
      placeholder="********"
    />
    <label
      htmlFor="hs-floating-underline-input-passowrd"
      className="absolute top-0 start-0 py-4 px-0 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent  origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
peer-focus:scale-90
peer-focus:translate-x-0.5
peer-focus:-translate-y-1.5
peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
peer-[:not(:placeholder-shown)]:scale-90
peer-[:not(:placeholder-shown)]:translate-x-0.5
peer-[:not(:placeholder-shown)]:-translate-y-1.5
peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500"
    >
      Password
    </label>
  </div>
  {/* End Floating Input */}
</div>

        </div>
    );
};
