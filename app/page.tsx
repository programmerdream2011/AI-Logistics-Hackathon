"use client";

import { useState, useEffect } from "react";
import { cargos } from "../data/cargos";
import RouteMap from "@/components/RouteMap";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [currentCity, setCurrentCity] = useState("");
  const [destination, setDestination] = useState("");
  
  const [availableSpace, setAvailableSpace] = useState("");

  const [selectedCargo, setSelectedCargo] = useState<any>(null);
  const [explanation, setExplanation] = useState("");

  const [fuelSaved, setFuelSaved] = useState(0);
  const [co2Reduction, setCo2Reduction] = useState(0);
  const [emptyMilesReduced, setEmptyMilesReduced] = useState(0);

  const [loading, setLoading] = useState(false);
  const [dbCargos, setDbCargos] = useState<any[]>([]);
  

  useEffect(() => {
    
  async function loadCargos() {

  const { data, error } = await supabase
    .from("cargos")
    .select("*");

  console.log("DATA =", data);
  console.log("ERROR =", error);

  if (error) {
    console.error(error);
    return;
  }

  setDbCargos(data || []);
}

  loadCargos();
}, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 p-8 shadow-2xl border border-slate-800">

        <h1 className="text-4xl font-bold mb-2">
          AI Logistics
        </h1>

        <p className="text-slate-400 mb-8">
          Smart Return Cargo Optimization
        </p>

        <div className="space-y-5">

          {/* Current City */}
          <div>
            <label className="block mb-2 font-medium">Current City</label>
            <input
              type="text"
              placeholder="Almaty"
              value={currentCity}
              onChange={(e) => setCurrentCity(e.target.value)}
              className="w-full rounded-lg bg-slate-800 p-3 outline-none border border-slate-700"
            />
          </div>

          {/* Destination */}
          <div>
            <label className="block mb-2 font-medium">Destination</label>
            <input
              type="text"
              placeholder="Aktau"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full rounded-lg bg-slate-800 p-3 outline-none border border-slate-700"
            />
          </div>


          {/* Available Space */}
          <div>
            <label className="block mb-2 font-medium">Available Space (tons)</label>
            <input
              type="number"
              placeholder="15"
              value={availableSpace}
              onChange={(e) => setAvailableSpace(e.target.value)}
              className="w-full rounded-lg bg-slate-800 p-3 outline-none border border-slate-700"
            />
          </div>

          {/* Button */}
          <button
            onClick={async () => {
              setLoading(true);
              await new Promise((resolve) =>
  setTimeout(resolve, 1500)
);
              const space = Number(availableSpace);
            

              const filtered = dbCargos.filter((cargo) => {
  

  const weightMatch = cargo.weight <= space;

  const currentCityMatch =
    currentCity === "" ||
    cargo.pickup.toLowerCase() === currentCity.toLowerCase();

  const destinationMatch =
    destination === "" ||
    cargo.dropoff.toLowerCase().trim() ===
      destination.toLowerCase().trim();

  console.log({
    weightMatch,
    currentCityMatch,
    destinationMatch,
  });

  return (
    weightMatch &&
    currentCityMatch &&
    destinationMatch
  );
});





if (filtered.length === 0) {
  setSelectedCargo(null);
  setExplanation("No suitable cargo found for current capacity.");
  setFuelSaved(0);
  setCo2Reduction(0);
  setEmptyMilesReduced(0);
  setLoading(false);
  return;
}

              const best = filtered.reduce((best, current) =>
                current.profit > best.profit ? current : best
              );
                
              setSelectedCargo(best);
              

setExplanation(
  `AI selected ${best.company}'s cargo.

Reasoning:
• Cargo weight (${best.weight} tons) fits available capacity (${space} tons)
• Destination matches selected route
• Highest profit among all suitable cargos

Expected outcome:
• Increased vehicle utilization
• Reduced empty return mileage
• Higher transportation profitability`
);
if (filtered.length === 0) {
  setSelectedCargo(null);

  setExplanation(
    "No suitable cargo found for current capacity."
  );

  setFuelSaved(0);
  setCo2Reduction(0);
  setEmptyMilesReduced(0);

  setLoading(false);
  return;
}
              setFuelSaved(Math.floor(best.profit / 2000));
              setCo2Reduction(Math.floor(best.profit / 25000));
              setEmptyMilesReduced(Math.floor(best.profit / 1000));
              setLoading(false);
            }}
            className="w-full rounded-lg bg-blue-600 p-4 font-bold hover:bg-blue-500 transition"
          >
            {loading ? "Analyzing..." : "Find Best Cargo"}
          </button>
          {!selectedCargo && explanation && (
  <div className="mt-4 rounded-lg border border-red-500 p-4">
    <p className="text-red-400">
      {explanation}
    </p>
  </div>
)}

          {/* RESULT */}
          {selectedCargo && (
  <div className="grid grid-cols-3 gap-4">
    <div className="rounded-lg bg-slate-800 p-4 border border-slate-700">
      <p className="text-slate-400 text-sm">Fuel Saved</p>
      <p className="text-2xl font-bold text-green-400">
        {fuelSaved} L
      </p>
    </div>

    <div className="rounded-lg bg-slate-800 p-4 border border-slate-700">
      <p className="text-slate-400 text-sm">CO₂ Reduction</p>
      <p className="text-2xl font-bold text-blue-400">
        {co2Reduction}%
      </p>
    </div>

    <div className="rounded-lg bg-slate-800 p-4 border border-slate-700">
      <p className="text-slate-400 text-sm">Empty Miles</p>
      <p className="text-2xl font-bold text-yellow-400">
        {emptyMilesReduced} km
      </p>
    </div>
  </div>
)}
          {selectedCargo && (






  <div className="mt-6 rounded-2xl bg-slate-800 border border-slate-700 p-6 shadow-lg">

    <div className="flex items-center justify-between mb-6">
      <h2 className="text-3xl font-bold text-white">
        Recommended Cargo
      </h2>
      


      <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full font-bold">
        AI Selected
      </span>
    </div>

    <div className="grid md:grid-cols-2 gap-4 mb-6">

      <div className="bg-slate-900 rounded-xl p-4">
        <p className="text-slate-400 text-sm">Company</p>
        <p className="text-xl font-bold">
          {selectedCargo.company}
        </p>
      </div>

      <div className="bg-slate-900 rounded-xl p-4">
        <p className="text-slate-400 text-sm">Cargo Type</p>
        <p className="text-xl font-bold">
          {selectedCargo.cargo}
        </p>
      </div>

      <div className="bg-slate-900 rounded-xl p-4">
        <p className="text-slate-400 text-sm">Pickup</p>
        <p className="text-xl font-bold">
          {selectedCargo.pickup}
        </p>
      </div>

      <div className="bg-slate-900 rounded-xl p-4">
        <p className="text-slate-400 text-sm">Destination</p>
        <p className="text-xl font-bold">
          {selectedCargo.dropoff}
        </p>
      </div>

    </div>

    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5 mb-6">
      <p className="text-slate-300 mb-2">
        Estimated Additional Profit
      </p>

      <p className="text-4xl font-extrabold text-green-400">
        +{selectedCargo.profit.toLocaleString()} ₸
      </p>
    </div>

    <div className="bg-slate-900 rounded-xl p-5">
      <h3 className="font-bold text-blue-400 mb-3">
        AI Decision Explanation
      </h3>

      <ul className="space-y-2 text-slate-300">
        <li>✓ Cargo fits available truck capacity</li>
        <li>✓ Highest profit among available options</li>
        <li>✓ Reduces empty return trips</li>
        <li>✓ Improves fleet utilization</li>
      </ul>
    </div>

  </div>

)
}


          {selectedCargo && <RouteMap
  pickup={selectedCargo?.pickup}
  dropoff={selectedCargo?.dropoff}
  profit={selectedCargo?.profit || 0}
  />
}

        </div>
      </div>
    </main>
  );
}