import { useEffect, useState } from 'react';

const Grooming = () => {
  const [userData, setUserData] = useState<any>(null);
  const [selectedHairstyle, setSelectedHairstyle] = useState<string | null>(null);
  const [selectedBeard, setSelectedBeard] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('userData');
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  if (!userData) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const hairstyles = [
    { name: 'Short Crop', desc: 'Clean and professional, suits oval and round faces' },
    { name: 'Medium Waves', desc: 'Stylish and versatile, great for square faces' },
    { name: 'Long Layers', desc: 'Bold and trendy, ideal for heart-shaped faces' },
    { name: 'Buzz Cut', desc: 'Low maintenance, suits all face shapes' },
    { name: 'Side Part', desc: 'Classic look, professional' },
    { name: 'Messy Waves', desc: 'Casual and fun' },
    { name: 'Pompadour', desc: 'Retro style, bold' },
    { name: 'Faux Hawk', desc: 'Edgy and stylish' }
  ];

  const beardStyles = [
    { name: 'Clean Shave', desc: 'Smooth and neat, clean look' },
    { name: 'Light Stubble', desc: 'Casual, easy maintenance' },
    { name: 'Heavy Stubble', desc: 'Rugged, masculine' },
    { name: 'Full Beard', desc: 'Bold, requires grooming' },
    { name: 'Goatee', desc: 'Classic, defined' },
    { name: 'Corporate Beard', desc: 'Trimmed, professional' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 to-green-50 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Grooming & Styles</h1>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Hairstyles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {hairstyles.map(style => (
              <div key={style.name} className={`border-2 p-4 rounded cursor-pointer transition ${selectedHairstyle === style.name ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`} onClick={() => setSelectedHairstyle(style.name)}>
                <h3 className="font-semibold">{style.name}</h3>
                <p className="text-sm text-gray-600">{style.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Beard Styles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {beardStyles.map(style => (
              <div key={style.name} className={`border-2 p-4 rounded cursor-pointer transition ${selectedBeard === style.name ? 'border-green-500 bg-green-50' : 'border-gray-300'}`} onClick={() => setSelectedBeard(style.name)}>
                <h3 className="font-semibold">{style.name}</h3>
                <p className="text-sm text-gray-600">{style.desc}</p>
              </div>
            ))}
          </div>
        </div>
        {userData.facePhoto && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Virtual Try-On</h2>
            <div className="flex flex-col items-center">
              <img src={userData.facePhoto} alt="Your Face" className="w-48 h-48 object-cover rounded-lg mb-4" />
              <p className="text-gray-700">Selected Hairstyle: <span className="font-semibold">{selectedHairstyle || 'None'}</span></p>
              <p className="text-gray-700">Selected Beard: <span className="font-semibold">{selectedBeard || 'None'}</span></p>
              <p className="text-sm text-gray-500 mt-2">This is a visual simulation for styling reference.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grooming;