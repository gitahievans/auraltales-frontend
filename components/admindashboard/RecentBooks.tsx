const RecentBooks = ({ books }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-lg font-semibold mb-4">Recently Added Books</h3>
    <div className="space-y-3">
      {books?.map((book, index) => (
        <div
          key={index}
          className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md"
        >
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-blue-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <p className="font-medium">{book.title}</p>
            <p className="text-sm text-gray-600">
              {new Date(book.date_published).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default RecentBooks;