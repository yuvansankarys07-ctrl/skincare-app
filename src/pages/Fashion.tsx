import { useEffect, useState } from 'react';

const Fashion = () => {
  const [userData, setUserData] = useState<any>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('userData');
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  if (!userData) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const outfits = [
    { name: 'Casual Jeans & Tee', occasion: 'Daily', desc: 'Comfortable and versatile, suits all body types' },
    { name: 'Office Blazer Set', occasion: 'Office', desc: 'Professional look, slimming for average builds' },
    { name: 'Party Dress', occasion: 'Party', desc: 'Elegant and fun, flattering for all shapes' },
    { name: 'Streetwear Hoodie', occasion: 'Casual', desc: 'Trendy and relaxed' },
    { name: 'Ethnic Kurta', occasion: 'Festive', desc: 'Cultural and stylish' },
    { name: 'Minimal White Shirt', occasion: 'Formal', desc: 'Clean and sophisticated' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 to-green-50 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Fashion & Outfits</h1>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Outfit Suggestions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {outfits.map(outfit => (
              <div key={outfit.name} className={`border-2 p-4 rounded cursor-pointer transition ${selectedOutfit === outfit.name ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`} onClick={() => setSelectedOutfit(outfit.name)}>
                <h3 className="font-semibold">{outfit.name}</h3>
                <p className="text-sm text-blue-600">{outfit.occasion}</p>
                <p className="text-sm text-gray-600">{outfit.desc}</p>
              </div>
            ))}
          </div>
        </div>
        {userData.bodyPhoto && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Virtual Try-On</h2>
            <div className="flex flex-col items-center">
              <img src={userData.bodyPhoto} alt="Your Body" className="w-48 h-96 object-cover rounded-lg mb-4" />
              <p className="text-gray-700">Selected Outfit: <span className="font-semibold">{selectedOutfit || 'None'}</span></p>
              <p className="text-sm text-gray-500 mt-2">This is a visual simulation for styling reference.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Fashion;