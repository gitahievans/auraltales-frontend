interface NarratorStat {
  name: string;
  count: number;
  bio: string;
}
const NarratorStats = ({ narrators }: { narrators: NarratorStat[] }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-lg font-semibold mb-4">Top Narrators</h3>
    <div className="space-y-4">
      {narrators?.slice(0, 3).map((narrator, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">{index + 1}</span>
          </div>
          <div className="flex-1">
            <p className="font-medium">{narrator.name}</p>
            <p className="text-sm text-gray-600">{narrator.bio}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default NarratorStats;
