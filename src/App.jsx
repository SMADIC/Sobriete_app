import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { AlertCircle, Plus, Activity, BookOpen, Settings, ArrowUp, ArrowDown, Mail, Heart, Smile, Star, Coffee, Sparkles, Send, Droplets, Download, FileText, Book } from 'lucide-react';

export default function SobrietyApp() {
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [showNamePrompt, setShowNamePrompt] = useState(!localStorage.getItem('userName'));
  const [activeTab, setActiveTab] = useState('dashboard');
  const [doctorEmail, setDoctorEmail] = useState(localStorage.getItem('doctorEmail') || '');
  const [waterGoal, setWaterGoal] = useState(Number(localStorage.getItem('waterGoal')) || 2);
  const [weeklyBudget, setWeeklyBudget] = useState(Number(localStorage.getItem('weeklyBudget')) || 50);

  const defaultDrinks = [
    { id: 'b25', name: 'Bière (25cl)', price: 3.5, isAlcohol: true, waterCl: 25 },
    { id: 'b50', name: 'Bière (50cl)', price: 7, isAlcohol: true, waterCl: 50 },
    { id: 'v10', name: 'Vin (10cl)', price: 4, isAlcohol: true, waterCl: 10 },
    { id: 's3', name: 'Spiritueux (3cl)', price: 5, isAlcohol: true, waterCl: 3 },
    { id: 'c', name: 'Cocktail', price: 8, isAlcohol: true, waterCl: 20 },
    { id: 'caf', name: 'Café', price: 2, isAlcohol: false, waterCl: 15 },
    { id: 'the', name: 'Thé', price: 3, isAlcohol: false, waterCl: 25 },
    { id: 'eaup', name: 'Eau plate', price: 0, isAlcohol: false, waterCl: 25 },
    { id: 'eaupet', name: 'Eau pétillante', price: 0, isAlcohol: false, waterCl: 25 },
    { id: 'mock', name: 'Mocktail', price: 6, isAlcohol: false, waterCl: 20 },
    { id: 'soda', name: 'Soda', price: 3, isAlcohol: false, waterCl: 33 },
  ];

  const [drinksCatalog, setDrinksCatalog] = useState(
    JSON.parse(localStorage.getItem('drinksCatalog')) || defaultDrinks
  );
  
  const [dailyEntries, setDailyEntries] = useState(JSON.parse(localStorage.getItem('dailyEntries')) || []);
  
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentEntry, setCurrentEntry] = useState({
    drinks: [],
    sleepQuality: 5,
    wakeQuality: 5,
    dayForm: 5,
    cravingIntensity: 0,
    context: '',
    feelings: ''
  });
  
  const [selectedDrinkToAdd, setSelectedDrinkToAdd] = useState(drinksCatalog[0]?.id || '');
  const [newDrink, setNewDrink] = useState({ name: '', price: 0, isAlcohol: true, waterCl: 0 });

  const [personalPros, setPersonalPros] = useState(localStorage.getItem('personalPros') || '');
  const [personalCons, setPersonalCons] = useState(localStorage.getItem('personalCons') || '');
  
  const [showCravingModal, setShowCravingModal] = useState(false);
  const [cravingStrategies, setCravingStrategies] = useState([]);
  
  const [toastMessage, setToastMessage] = useState(null);

  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const allStrategies = [
    "Passez-vous le visage sous l'eau très froide pendant 30 secondes.",
    "Faites 20 squats ou pompes pour faire monter le rythme cardiaque autrement.",
    "Appelez une personne de confiance sans forcément parler d'alcool.",
    "Mangez quelque chose de très sucré ou très acide (un bonbon, un citron).",
    "Prenez une douche bien chaude et concentrez-vous sur la sensation de l'eau.",
    "Écrivez sur un papier ce que vous ressentez, puis déchirez-le.",
    "Lisez à voix haute vos 'Avantages à rester sobre'.",
    "Faites un jeu vidéo ou un puzzle sur votre téléphone pour occuper vos mains.",
    "Préparez une boisson non alcoolisée complexe (thé, mocktail, kombucha).",
    "Allez marcher 15 minutes en écoutant un podcast ou de la musique forte.",
    "Brossez-vous les dents (le goût de la menthe coupe souvent l'envie).",
    "Faites l'exercice de respiration 4-7-8 (inspirez 4s, bloquez 7s, soufflez 8s).",
    "Faites le tri dans un tiroir ou une pièce pendant 10 minutes.",
    "Regardez une vidéo humoristique ou captivante sur YouTube.",
    "Acceptez que l'envie soit là. Imaginez-la comme une vague qui va redescendre."
  ];

  useEffect(() => { localStorage.setItem('dailyEntries', JSON.stringify(dailyEntries)); }, [dailyEntries]);
  useEffect(() => { localStorage.setItem('personalPros', personalPros); }, [personalPros]);
  useEffect(() => { localStorage.setItem('personalCons', personalCons); }, [personalCons]);
  useEffect(() => { localStorage.setItem('doctorEmail', doctorEmail); }, [doctorEmail]);
  useEffect(() => { 
    localStorage.setItem('drinksCatalog', JSON.stringify(drinksCatalog)); 
    if(!drinksCatalog.find(d => d.id === selectedDrinkToAdd) && drinksCatalog.length > 0) {
      setSelectedDrinkToAdd(drinksCatalog[0].id);
    }
  }, [drinksCatalog]);
  useEffect(() => { localStorage.setItem('waterGoal', waterGoal.toString()); }, [waterGoal]);
  useEffect(() => { localStorage.setItem('weeklyBudget', weeklyBudget.toString()); }, [weeklyBudget]);

  useEffect(() => {
    const existingEntry = dailyEntries.find(e => e.date === entryDate);
    if (existingEntry) {
      setCurrentEntry(existingEntry);
    } else {
      setCurrentEntry({
        drinks: [],
        sleepQuality: 5,
        wakeQuality: 5,
        dayForm: 5,
        cravingIntensity: 0,
        context: '',
        feelings: ''
      });
    }
  }, [entryDate, dailyEntries]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const rollStrategies = () => {
    const shuffled = [...allStrategies].sort(() => 0.5 - Math.random());
    setCravingStrategies(shuffled.slice(0, 3));
  };

  useEffect(() => {
    if (showCravingModal && cravingStrategies.length === 0) {
      rollStrategies();
    }
  }, [showCravingModal]);

  const saveName = (e) => {
    e.preventDefault();
    const name = e.target.elements.name.value;
    setUserName(name);
    localStorage.setItem('userName', name);
    setShowNamePrompt(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 18 && hour < 23) return "Bonsoir";
    if (hour >= 23 || hour < 5) return "Bonne nuit";
    return "Bonjour";
  };

  const handleAddDrinkToCatalog = () => {
    if (newDrink.name.trim() === '') return;
    setDrinksCatalog([...drinksCatalog, { ...newDrink, id: Date.now().toString() }]);
    setNewDrink({ name: '', price: 0, isAlcohol: true, waterCl: 0 });
    showToast("Boisson ajoutée au catalogue !");
  };

  const removeDrinkFromCatalog = (id) => {
    setDrinksCatalog(drinksCatalog.filter(d => d.id !== id));
  };

  const addDrinkToEntry = () => {
    const drinkDef = drinksCatalog.find(d => d.id === selectedDrinkToAdd);
    if (drinkDef) {
      setCurrentEntry({
        ...currentEntry,
        drinks: [...currentEntry.drinks, { 
          id: drinkDef.id,
          name: drinkDef.name, 
          isAlcohol: drinkDef.isAlcohol,
          waterCl: drinkDef.waterCl,
          price: drinkDef.price,
          festive: false 
        }]
      });
    }
  };

  const toggleFestive = (index) => {
    const newDrinks = [...currentEntry.drinks];
    newDrinks[index].festive = !newDrinks[index].festive;
    setCurrentEntry({ ...currentEntry, drinks: newDrinks });
  };

  const moveDrink = (index, direction) => {
    const newDrinks = [...currentEntry.drinks];
    if (direction === 'up' && index > 0) {
      [newDrinks[index - 1], newDrinks[index]] = [newDrinks[index], newDrinks[index - 1]];
    } else if (direction === 'down' && index < newDrinks.length - 1) {
      [newDrinks[index + 1], newDrinks[index]] = [newDrinks[index], newDrinks[index + 1]];
    }
    setCurrentEntry({ ...currentEntry, drinks: newDrinks });
  };

  const removeDrink = (index) => {
    const newDrinks = currentEntry.drinks.filter((_, i) => i !== index);
    setCurrentEntry({ ...currentEntry, drinks: newDrinks });
  };

  const saveDailyEntry = () => {
    const newEntries = dailyEntries.filter(e => e.date !== entryDate);
    setDailyEntries([...newEntries, { ...currentEntry, date: entryDate }]);
    showToast("Journée enregistrée avec succès ! 🎉");
  };

  const filteredEntries = dailyEntries
    .filter(e => e.date >= startDate && e.date <= endDate)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData = filteredEntries.map(e => {
    let alcCount = 0;
    let nonAlcCount = 0;
    let waterTotalCl = 0;
    
    e.drinks.forEach(d => {
      if (d.isAlcohol) alcCount++;
      else nonAlcCount++;
      waterTotalCl += (d.waterCl || 0);
    });

    return {
      date: new Date(e.date).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit'}),
      sleepQuality: e.sleepQuality,
      dayForm: e.dayForm,
      cravingIntensity: e.cravingIntensity,
      alcDrinksCount: alcCount,
      nonAlcDrinksCount: nonAlcCount,
      waterLiters: waterTotalCl / 100
    };
  });

  const generateWeeklyReport = () => {
    if (!doctorEmail) {
      alert("Veuillez d'abord renseigner l'email de votre médecin dans les réglages.");
      return;
    }
    
    let totalDrinks = 0;
    let festiveDrinks = 0;
    let cravingDrinks = 0;
    
    filteredEntries.forEach(entry => {
      entry.drinks.forEach(d => {
        if (d.isAlcohol) {
           totalDrinks++;
           if (d.festive) festiveDrinks++;
           else cravingDrinks++;
        }
      });
    });

    const subject = encodeURIComponent(`Bilan Hebdomadaire Sobriété - ${userName} (${startDate} au ${endDate})`);
    const body = encodeURIComponent(
      `Bonjour Docteur,\n\nVoici mon bilan pour la période du ${startDate} au ${endDate} :\n\n` +
      `- Jours enregistrés : ${filteredEntries.length}\n` +
      `- Total des verres d'alcool consommés : ${totalDrinks}\n` +
      `   dont consommations festives (sociales) : ${festiveDrinks}\n` +
      `   dont consommations isolées/craving : ${cravingDrinks}\n\n` +
      `Cordialement,\n${userName}`
    );
    
    window.location.href = `mailto:${doctorEmail}?subject=${subject}&body=${body}`;
  };

  const handleGeneratePDF = () => {
    window.print();
  };

  if (showNamePrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4 font-sans">
        <form onSubmit={saveName} className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border-4 border-white">
          <div className="flex justify-center mb-4"><Sparkles className="text-yellow-400" size={48} /></div>
          <h2 className="text-3xl font-black text-indigo-800 mb-2">Bienvenue !</h2>
          <p className="text-slate-500 mb-8 font-medium">Comment souhaitez-vous être appelé(e) ?</p>
          <input type="text" name="name" required className="w-full border-2 border-indigo-100 p-4 rounded-xl mb-6 focus:border-indigo-400 focus:outline-none text-center text-lg font-bold text-indigo-700 bg-indigo-50" placeholder="Votre prénom..." />
          <button type="submit" className="w-full bg-indigo-500 text-white font-black py-4 rounded-xl hover:bg-indigo-600 shadow-lg transform transition active:scale-95">
            Commencer mon parcours
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans print:bg-white print:pb-0">
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm px-4 py-4 rounded-b-3xl mb-4 border-b border-indigo-100 print:hidden">
        <div className="flex flex-col items-center justify-center mb-4 text-center">
          <p className="text-sm font-bold text-indigo-400 capitalize mb-1">
             {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-2xl font-black text-indigo-900 flex items-center gap-2">
            {getGreeting()}, <span className="text-pink-500">{userName}</span> <Smile className="text-yellow-400" size={24} />
          </h1>
        </div>
        <button onClick={() => setShowCravingModal(true)} className="w-full bg-gradient-to-r from-red-500 to-rose-500 text-white font-black py-4 rounded-2xl shadow-xl hover:from-red-600 hover:to-rose-600 flex items-center justify-center gap-3 text-lg animate-pulse border-2 border-red-400">
          <AlertCircle size={28} /> URGENCE / ENVIE FORTE
        </button>
      </div>

      <main className="px-4 max-w-xl mx-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in print:block">
            <h2 className="text-2xl font-black text-slate-800 mb-2 flex items-center gap-2 print:hidden">
               <Activity className="text-indigo-500" /> Mon Bilan
            </h2>
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-3 print:hidden">
                <div className="flex items-center justify-between text-sm font-bold text-slate-600">
                    <span>Du :</span>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border rounded-xl bg-slate-50"/>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-slate-600">
                    <span>Au :</span>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 border rounded-xl bg-slate-50"/>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-teal-100 to-emerald-100 p-5 rounded-3xl shadow-sm border border-white text-center flex flex-col items-center">
                <Heart className="text-teal-500 mb-2" size={28} />
                <p className="text-teal-800 text-sm font-bold mb-1">Jours Sobres</p>
                <p className="text-4xl font-black text-teal-600">{filteredEntries.filter(e => !e.drinks.some(d => d.isAlcohol)).length}</p>
              </div>
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-5 rounded-3xl shadow-sm border border-white text-center flex flex-col items-center">
                <Star className="text-amber-500 mb-2" size={28} />
                <p className="text-amber-800 text-sm font-bold mb-1">Économies</p>
                <p className="text-4xl font-black text-amber-600">
                   {Math.max(0, Math.round(((weeklyBudget / 7) * filteredEntries.length) - filteredEntries.reduce((sum, e) => sum + e.drinks.reduce((s,d)=>s+(d.price||0),0), 0)))} €
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-indigo-50">
              <h3 className="font-black text-slate-800 text-lg mb-2">Consommations et Hydratation</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{fill: '#94a3b8', fontSize: 10}} />
                    <YAxis yAxisId="left" tick={{fill: '#94a3b8', fontSize: 10}} />
                    <YAxis yAxisId="right" orientation="right" tick={{fill: '#3b82f6', fontSize: 10}} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Line yAxisId="left" type="monotone" dataKey="alcDrinksCount" stroke="#f43f5e" name="Alcool (verres)" strokeWidth={3} dot={{r: 3}} />
                    <Line yAxisId="left" type="monotone" dataKey="nonAlcDrinksCount" stroke="#10b981" name="Sans alcool (verres)" strokeWidth={3} dot={{r: 3}} />
                    <Line yAxisId="right" type="monotone" dataKey="waterLiters" stroke="#3b82f6" name="Eau (L)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    <ReferenceLine y={waterGoal} yAxisId="right" stroke="#60a5fa" strokeDasharray="3 3" label={{position: 'insideTopRight', value: 'Objectif Eau', fill:'#60a5fa', fontSize:10}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

             <div className="bg-white p-6 rounded-3xl shadow-sm border border-indigo-50">
              <h3 className="font-black text-slate-800 text-lg mb-2">Forme, Sommeil et Envies</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{fill: '#94a3b8', fontSize: 10}} />
                    <YAxis domain={[0, 10]} tick={{fill: '#94a3b8', fontSize: 10}} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Line type="monotone" dataKey="sleepQuality" stroke="#8b5cf6" name="Sommeil (1-10)" strokeWidth={3} dot={{r: 3}} />
                    <Line type="monotone" dataKey="dayForm" stroke="#f59e0b" name="Forme (1-10)" strokeWidth={3} dot={{r: 3}} />
                    <Line type="step" dataKey="cravingIntensity" stroke="#ef4444" name="Envie / Craving (1-10)" strokeWidth={2} dot={{r: 3}} strokeDasharray="4 2" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex gap-4 print:hidden">
                 <button onClick={handleGeneratePDF} className="flex-1 bg-slate-800 text-white font-black py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-slate-900 shadow-md transition active:scale-95 text-sm">
                  <Download size={18} /> Générer le PDF
                </button>
                <button onClick={generateWeeklyReport} className="flex-1 bg-blue-600 text-white font-black py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-blue-700 shadow-md transition active:scale-95 text-sm">
                  <Send size={18} /> Envoyer à mon médecin
                </button>
            </div>
          </div>
        )}

        {activeTab === 'entry' && (
          <div className="space-y-6 animate-fade-in print:hidden">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-indigo-50">
              <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <BookOpen className="text-indigo-500" /> Mon Journal
              </h2>
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-600 mb-2">Sélectionnez la date à renseigner :</label>
                <input type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} className="w-full p-4 border-2 border-slate-200 rounded-xl font-bold text-slate-800 bg-slate-50"/>
              </div>
              <div className="mb-8 bg-blue-50 p-5 rounded-2xl">
                <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2"><Coffee size={20}/> 1. Consommations</h3>
                <div className="flex gap-2 mb-4">
                  <select className="flex-1 border-2 border-blue-200 rounded-xl p-3 bg-white font-medium text-slate-700" value={selectedDrinkToAdd} onChange={(e) => setSelectedDrinkToAdd(e.target.value)}>
                    {drinksCatalog.map(drink => ( <option key={drink.id} value={drink.id}>{drink.name}</option> ))}
                  </select>
                  <button onClick={addDrinkToEntry} className="bg-blue-600 text-white p-3 rounded-xl shadow hover:bg-blue-700 transition">
                    <Plus size={24} />
                  </button>
                </div>
                <div className="space-y-3">
                  {currentEntry.drinks.map((drinkObj, index) => (
                    <div key={index} className={`flex flex-col p-4 rounded-xl shadow-sm border ${drinkObj.isAlcohol ? 'bg-white border-blue-100' : 'bg-emerald-50 border-emerald-100'}`}>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-slate-700 text-lg">
                           {index + 1}. {drinkObj.name} {drinkObj.isAlcohol ? '' : '💧'}
                        </span>
                        <div className="flex gap-1">
                          <button onClick={() => moveDrink(index, 'up')} className="text-slate-400 hover:text-indigo-600 p-1 bg-white rounded"><ArrowUp size={18}/></button>
                          <button onClick={() => moveDrink(index, 'down')} className="text-slate-400 hover:text-indigo-600 p-1 bg-white rounded"><ArrowDown size={18}/></button>
                          <button onClick={() => removeDrink(index)} className="text-red-500 font-black ml-2 p-1 bg-red-50 rounded">X</button>
                        </div>
                      </div>
                      {drinkObj.isAlcohol && (
                        <label className="flex items-center gap-3 text-sm font-bold text-slate-600 cursor-pointer w-fit p-2 bg-pink-50 rounded-lg pr-4 border border-pink-100 hover:bg-pink-100 transition">
                          <input type="checkbox" checked={drinkObj.festive} onChange={() => toggleFestive(index)} className="w-5 h-5 accent-pink-500 rounded cursor-pointer" />
                          🎉 Consommation festive (sociale)
                        </label>
                      )}
                    </div>
                  ))}
                  {currentEntry.drinks.length === 0 && ( <p className="text-sm text-slate-400 italic text-center py-2">Aucun verre ajouté.</p> )}
                </div>
              </div>
              <div className="mb-8 bg-purple-50 p-5 rounded-2xl">
                <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2"><Activity size={20}/> 2. Contexte & Émotions</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-purple-800 mb-2">Envie de boire la plus forte (0 à 10)</label>
                    <input type="range" min="0" max="10" value={currentEntry.cravingIntensity} onChange={(e) => setCurrentEntry({...currentEntry, cravingIntensity: e.target.value})} className="w-full accent-purple-600" />
                    <div className="text-center font-black text-xl text-purple-600 mt-1">{currentEntry.cravingIntensity} / 10</div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-purple-800 mb-2">Ressentis (avant de boire ou à jeun)</label>
                    <textarea className="w-full border-2 border-purple-200 rounded-xl p-3 bg-white" rows="2" value={currentEntry.feelings} onChange={(e) => setCurrentEntry({...currentEntry, feelings: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-purple-800 mb-2">Situation (où, avec qui, pourquoi)</label>
                    <textarea className="w-full border-2 border-purple-200 rounded-xl p-3 bg-white" rows="2" value={currentEntry.context} onChange={(e) => setCurrentEntry({...currentEntry, context: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="mb-8 bg-indigo-50 p-5 rounded-2xl">
                <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2"><Star size={20}/> 3. Sommeil et Forme</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-indigo-800 mb-2">Qualité du sommeil (1 à 10)</label>
                    <input type="range" min="1" max="10" value={currentEntry.sleepQuality} onChange={(e) => setCurrentEntry({...currentEntry, sleepQuality: e.target.value})} className="w-full accent-indigo-600" />
                     <div className="text-center font-black text-indigo-600 mt-1">{currentEntry.sleepQuality} / 10</div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-indigo-800 mb-2">Forme de la journée (1 à 10)</label>
                    <input type="range" min="1" max="10" value={currentEntry.dayForm} onChange={(e) => setCurrentEntry({...currentEntry, dayForm: e.target.value})} className="w-full accent-indigo-600" />
                     <div className="text-center font-black text-indigo-600 mt-1">{currentEntry.dayForm} / 10</div>
                  </div>
                </div>
              </div>
              <button onClick={saveDailyEntry} className="w-full bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg hover:from-emerald-500 hover:to-emerald-700 text-lg flex justify-center items-center gap-2">
                <Heart /> Enregistrer ma journée
              </button>
            </div>
          </div>
        )}

        {activeTab === 'tcc' && (
          <div className="space-y-6 animate-fade-in print:hidden">
            <div className="bg-gradient-to-br from-lime-50 to-green-50 p-6 rounded-3xl shadow-sm border border-green-100">
              <h2 className="text-2xl font-black text-green-900 mb-2">Balance Décisionnelle</h2>
              <div className="space-y-5 mt-4">
                <div>
                  <label className="block font-black text-green-700 mb-2 flex items-center gap-2"><Smile size={20}/> Mes avantages à rester sobre :</label>
                  <textarea className="w-full border-2 border-green-200 rounded-xl p-4 min-h-[120px] bg-white text-slate-700 font-medium" value={personalPros} onChange={(e) => setPersonalPros(e.target.value)} />
                </div>
                <div>
                  <label className="block font-black text-red-700 mb-2 flex items-center gap-2"><AlertCircle size={20}/> Mes inconvénients à boire :</label>
                  <textarea className="w-full border-2 border-red-200 rounded-xl p-4 min-h-[120px] bg-white text-slate-700 font-medium" value={personalCons} onChange={(e) => setPersonalCons(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2"><FileText size={24} className="text-indigo-500" /> Évaluations Cliniques</h2>
              <button className="w-full bg-slate-50 text-slate-700 font-bold py-4 rounded-xl border-2 border-slate-200 mb-3 hover:bg-slate-100 transition shadow-sm">
                Évaluation des troubles de l'alcool (AUDIT / CIM-11)
              </button>
              <button className="w-full bg-slate-50 text-slate-700 font-bold py-4 rounded-xl border-2 border-slate-200 hover:bg-slate-100 transition shadow-sm">
                Questionnaire FACE
              </button>
            </div>

            <div className="bg-blue-50 p-6 rounded-3xl shadow-sm border border-blue-100">
              <h2 className="text-xl font-black text-blue-900 mb-4 flex items-center gap-2"><Book size={24} /> Lectures Recommandées</h2>
              <div className="space-y-4 text-sm text-slate-700">
                <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm">
                  <h3 className="font-bold text-blue-800 text-base mb-1">Comment arrêter l'alcool</h3>
                  <p className="italic text-slate-500 mb-2">de Pierluigi Graziani</p>
                  <p><strong>Idées clés :</strong> Utilisation des Thérapies Comportementales et Cognitives (TCC). Mise en place de l'analyse fonctionnelle pour repérer les déclencheurs (lieux, émotions, moments). Stratégie d'évitement et création de nouvelles habitudes (remplacement) pour casser la routine de consommation.</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm">
                  <h3 className="font-bold text-blue-800 text-base mb-1">Surmonter un problème avec l'alcool</h3>
                  <p className="italic text-slate-500 mb-2">de Lucia Romo</p>
                  <p><strong>Idées clés :</strong> Basé sur l'entretien motivationnel. Comprendre et gérer le "Craving" (l'envie irrépressible) en l'acceptant comme une vague qui finit par redescendre. Importance de la balance décisionnelle et déculpabilisation de la rechute, vue comme une étape d'apprentissage.</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm">
                  <h3 className="font-bold text-blue-800 text-base mb-1">La méthode simple pour maîtriser sa consommation d'alcool</h3>
                  <p className="italic text-slate-500 mb-2">de Allen Carr</p>
                  <p><strong>Idées clés :</strong> Déconstruction psychologique. Détruire l'illusion que l'alcool détend, aide à dormir ou donne de l'énergie. Changer de perspective : ne plus voir l'arrêt comme une privation ou un sacrifice, mais comme une libération et un soulagement.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fade-in print:hidden">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2"><Settings className="text-slate-500" /> Réglages</h2>
              
              <div className="bg-slate-50 p-5 rounded-2xl mb-6 border border-slate-200">
                <h3 className="font-black text-slate-700 mb-4">Objectifs personnels</h3>
                <div className="space-y-4">
                   <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">Objectif d'eau par jour (Litres)</label>
                    <input type="number" step="0.1" value={waterGoal} onChange={e=>setWaterGoal(Number(e.target.value))} className="w-full p-3 border rounded-xl" />
                   </div>
                   <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">Budget hebdomadaire (Alcool) en €</label>
                    <input type="number" value={weeklyBudget} onChange={e=>setWeeklyBudget(Number(e.target.value))} className="w-full p-3 border rounded-xl" />
                   </div>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl mb-6 border border-slate-200">
                <h3 className="font-black text-slate-700 mb-4 flex items-center gap-2"><Coffee size={18}/> Catalogue des boissons</h3>
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
                  {drinksCatalog.map(drink => (
                    <div key={drink.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                      <div>
                        <p className="font-bold text-slate-700 text-sm">{drink.name} {drink.isAlcohol ? '' : '💧'}</p>
                        <p className="text-xs text-slate-500">{drink.price}€ - {drink.waterCl}cl d'eau</p>
                      </div>
                      <button onClick={() => removeDrinkFromCatalog(drink.id)} className="text-red-500 font-black p-2 bg-red-50 rounded-lg hover:bg-red-100">X</button>
                    </div>
                  ))}
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-600 mb-3">Ajouter une boisson</h4>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input type="text" placeholder="Nom (ex: Mojito)" value={newDrink.name} onChange={e=>setNewDrink({...newDrink, name: e.target.value})} className="p-2 border rounded-lg text-sm bg-slate-50" />
                    <input type="number" placeholder="Prix (€)" value={newDrink.price} onChange={e=>setNewDrink({...newDrink, price: Number(e.target.value)})} className="p-2 border rounded-lg text-sm bg-slate-50" />
                    <input type="number" placeholder="Eau (cl)" value={newDrink.waterCl} onChange={e=>setNewDrink({...newDrink, waterCl: Number(e.target.value)})} className="p-2 border rounded-lg text-sm bg-slate-50" />
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-600">
                      <input type="checkbox" checked={newDrink.isAlcohol} onChange={e=>setNewDrink({...newDrink, isAlcohol: e.target.checked})} className="w-4 h-4 accent-indigo-600" />
                      Alcool ?
                    </label>
                  </div>
                  <button onClick={handleAddDrinkToCatalog} className="w-full bg-indigo-100 text-indigo-700 font-bold py-3 rounded-lg hover:bg-indigo-200 transition">Ajouter au catalogue</button>
                </div>
              </div>

               <div className="bg-slate-50 p-5 rounded-2xl mb-6 border border-slate-200">
                <h3 className="font-black text-slate-700 mb-4 flex items-center gap-2"><Mail size={18}/> Contact Médecin</h3>
                <input type="email" placeholder="docteur@email.com" value={doctorEmail} onChange={(e) => setDoctorEmail(e.target.value)} className="w-full p-3 border rounded-xl" />
              </div>
            </div>
          </div>
        )}
      </main>

      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl z-[200] font-bold text-sm animate-fade-in flex items-center gap-2">
           <Smile className="text-yellow-400" size={18} /> {toastMessage}
        </div>
      )}

      {showCravingModal && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-[100] flex flex-col p-6 text-white overflow-y-auto">
          <div className="text-center mb-8 mt-6">
            <h2 className="text-4xl font-black text-red-500 mb-2 uppercase tracking-wide">Surfer sur la vague</h2>
            <p className="text-xl font-medium text-slate-300">L'envie va redescendre d'ici 15 minutes.</p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700 p-8 rounded-3xl mb-6 shadow-2xl">
            <h3 className="font-black text-2xl mb-4 text-indigo-400 text-center">1. Cohérence Cardiaque</h3>
            <div className="h-32 w-32 mx-auto bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full animate-ping opacity-75 shadow-[0_0_50px_rgba(99,102,241,0.5)]"></div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700 p-8 rounded-3xl mb-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-2xl text-amber-400">2. Stratégies Actives</h3>
              <button onClick={rollStrategies} className="text-sm font-bold bg-slate-700 px-4 py-2 rounded-xl">Changer d'idées</button>
            </div>
            <ul className="space-y-4">
              {cravingStrategies.map((strategy, i) => (
                <li key={i} className="bg-slate-700/50 p-4 rounded-2xl border border-slate-600 flex items-start gap-3">
                   <span className="text-amber-400 font-black">→</span> {strategy}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-auto pt-4 pb-8 flex flex-col gap-4">
            <button onClick={() => setShowCravingModal(false)} className="w-full bg-emerald-500 text-white font-black py-5 rounded-2xl text-xl shadow-[0_0_30px_rgba(16,185,129,0.3)]">Je tiens bon 💪</button>
            <button onClick={() => {setShowCravingModal(false); setActiveTab('entry');}} className="w-full border-2 border-slate-600 text-slate-400 font-bold py-4 rounded-2xl text-lg">J'ai craqué / Saisie</button>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 w-full bg-white/90 backdrop-blur-lg border-t border-slate-200 flex justify-around p-2 z-40 pb-6 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] print:hidden">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center p-3 rounded-2xl transition-all ${activeTab === 'dashboard' ? 'text-teal-600 bg-teal-50' : 'text-slate-400 hover:text-slate-600'}`}>
          <Activity size={24} strokeWidth={activeTab==='dashboard'?3:2} />
          <span className="text-[11px] font-black mt-1">Bilan</span>
        </button>
        <button onClick={() => setActiveTab('entry')} className={`flex flex-col items-center p-3 rounded-2xl transition-all ${activeTab === 'entry' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600'}`}>
          <Plus size={24} strokeWidth={activeTab==='entry'?3:2} />
          <span className="text-[11px] font-black mt-1">Saisie</span>
        </button>
        <button onClick={() => setActiveTab('tcc')} className={`flex flex-col items-center p-3 rounded-2xl transition-all ${activeTab === 'tcc' ? 'text-green-600 bg-green-50' : 'text-slate-400 hover:text-slate-600'}`}>
          <BookOpen size={24} strokeWidth={activeTab==='tcc'?3:2} />
          <span className="text-[11px] font-black mt-1">Outils</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center p-3 rounded-2xl transition-all ${activeTab === 'settings' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600'}`}>
          <Settings size={24} strokeWidth={activeTab==='settings'?3:2} />
          <span className="text-[11px] font-black mt-1">Réglages</span>
        </button>
      </nav>
    </div>
  );
}
