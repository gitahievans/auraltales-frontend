const CollectionOverview = ({ collections }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-lg font-semibold mb-4">Collections</h3>
    <div className="grid grid-cols-2 gap-3">
      {collections?.map((collection, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg">
          <p className="font-medium text-blue-600">{collection.name}</p>
        </div>
      ))}
    </div>
  </div>
);

export default CollectionOverview;
