export default function TestPage() {
  return (
    <div className="p-8 bg-white dark:bg-black">
      <h1 className="text-3xl font-bold text-primary mb-4">Tailwind Test Page</h1>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-black dark:text-white">This should have styling if Tailwind is working</p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="bg-primary text-white p-4 rounded">Primary</div>
        <div className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-4 rounded">Secondary</div>
        <div className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white p-4 rounded">Accent</div>
      </div>
    </div>
  )
}

