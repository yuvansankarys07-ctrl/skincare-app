import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    bodyType: '',
    height: '',
    skinType: '',
    skinConcerns: [],
    climate: '',
    routine: '',
    sleep: '',
    water: '',
    outdoor: '',
    grooming: '',
    fashion: '',
    occasion: '',
    facePhoto: null,
    bodyPhoto: null,
  });

  const steps = [
    'Basic Info',
    'Skin Profile',
    'Lifestyle',
    'Grooming & Style',
    'Image Upload'
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Save data
      localStorage.setItem('userData', JSON.stringify(formData));
      navigate('/dashboard');
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const updateForm = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleFileChange = (key: string, file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      updateForm(key, url);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Basic Info</h2>
            <input type="number" placeholder="Age" className="w-full p-2 border rounded mb-2" onChange={(e) => updateForm('age', e.target.value)} />
            <select className="w-full p-2 border rounded mb-2" onChange={(e) => updateForm('gender', e.target.value)}>
              <option value="">Gender (optional)</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <select className="w-full p-2 border rounded mb-2" onChange={(e) => updateForm('bodyType', e.target.value)}>
              <option value="">Body Type</option>
              <option value="slim">Slim</option>
              <option value="athletic">Athletic</option>
              <option value="average">Average</option>
              <option value="heavy">Heavy</option>
            </select>
            <input type="text" placeholder="Height range (optional)" className="w-full p-2 border rounded" onChange={(e) => updateForm('height', e.target.value)} />
          </div>
        );
      case 1:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Skin Profile</h2>
            <select className="w-full p-2 border rounded mb-2" onChange={(e) => updateForm('skinType', e.target.value)}>
              <option value="">Skin Type</option>
              <option value="oily">Oily</option>
              <option value="dry">Dry</option>
              <option value="combination">Combination</option>
              <option value="sensitive">Sensitive</option>
              <option value="normal">Normal</option>
            </select>
            <div className="mb-4">
              <label className="block mb-2">Skin Concerns (multiple)</label>
              {['Acne', 'Pigmentation', 'Dullness', 'Dark circles', 'Aging', 'Sun damage'].map(concern => (
                <label key={concern} className="block">
                  <input type="checkbox" className="mr-2" onChange={(e) => {
                    const concerns = formData.skinConcerns;
                    if (e.target.checked) {
                      updateForm('skinConcerns', [...concerns, concern]);
                    } else {
                      updateForm('skinConcerns', concerns.filter(c => c !== concern));
                    }
                  }} />
                  {concern}
                </label>
              ))}
            </div>
            <select className="w-full p-2 border rounded" onChange={(e) => updateForm('climate', e.target.value)}>
              <option value="">Climate/Location</option>
              <option value="hot">Hot</option>
              <option value="cold">Cold</option>
              <option value="humid">Humid</option>
              <option value="moderate">Moderate</option>
            </select>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Lifestyle</h2>
            <select className="w-full p-2 border rounded mb-2" onChange={(e) => updateForm('routine', e.target.value)}>
              <option value="">Daily Routine</option>
              <option value="busy">Busy</option>
              <option value="moderate">Moderate</option>
              <option value="relaxed">Relaxed</option>
            </select>
            <select className="w-full p-2 border rounded mb-2" onChange={(e) => updateForm('sleep', e.target.value)}>
              <option value="">Sleep Duration</option>
              <option value="less">Less than 6 hours</option>
              <option value="normal">6-8 hours</option>
              <option value="more">More than 8 hours</option>
            </select>
            <select className="w-full p-2 border rounded mb-2" onChange={(e) => updateForm('water', e.target.value)}>
              <option value="">Water Intake</option>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
            <select className="w-full p-2 border rounded" onChange={(e) => updateForm('outdoor', e.target.value)}>
              <option value="">Outdoor Exposure</option>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Grooming & Style Preferences</h2>
            <select className="w-full p-2 border rounded mb-2" onChange={(e) => updateForm('grooming', e.target.value)}>
              <option value="">Grooming Preference</option>
              <option value="clean">Clean</option>
              <option value="stylish">Stylish</option>
              <option value="natural">Natural</option>
              <option value="bold">Bold</option>
            </select>
            <select className="w-full p-2 border rounded mb-2" onChange={(e) => updateForm('fashion', e.target.value)}>
              <option value="">Fashion Preference</option>
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
              <option value="streetwear">Streetwear</option>
              <option value="ethnic">Ethnic</option>
              <option value="minimal">Minimal</option>
            </select>
            <select className="w-full p-2 border rounded" onChange={(e) => updateForm('occasion', e.target.value)}>
              <option value="">Occasion Focus</option>
              <option value="daily">Daily wear</option>
              <option value="office">Office</option>
              <option value="party">Party</option>
              <option value="festive">Festive</option>
            </select>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Image Upload</h2>
            <p className="mb-2">Upload a clear face photo for analysis.</p>
            <input type="file" accept="image/*" className="mb-4" onChange={(e) => handleFileChange('facePhoto', e.target.files ? e.target.files[0] : null)} />
            <p className="mb-2">Upload a full-body photo for outfit try-on.</p>
            <input type="file" accept="image/*" onChange={(e) => handleFileChange('bodyPhoto', e.target.files ? e.target.files[0] : null)} />
            <p className="text-sm text-gray-600 mt-4">Privacy: Images are used only for analysis and try-on, not stored permanently.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-100 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">GlowUp</h1>
        <p className="text-center mb-6">Your personal self-care, grooming & style assistant</p>
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            {steps.map((_, i) => (
              <div key={i} className={`flex-1 h-2 mx-1 rounded ${i <= step ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            ))}
          </div>
          <p className="text-center">Step {step + 1} of {steps.length}: {steps[step]}</p>
        </div>
        {renderStep()}
        <div className="flex justify-between mt-6">
          {step > 0 && <button onClick={handlePrev} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Previous</button>}
          <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-auto">{step === steps.length - 1 ? 'Finish' : 'Next'}</button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;