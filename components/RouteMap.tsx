"use client";

type RouteMapProps = {
  pickup?: string;
  dropoff?: string;
  profit?: number;
};

export default function RouteMap({
  pickup = "Almaty",
  dropoff = "Astana",
  profit = 0,
}: RouteMapProps) {
  return (
    <div className="mt-6 rounded-xl bg-slate-800 p-5 border border-slate-700">
      <h2 className="text-2xl font-bold mb-4">
        Route Visualization
      </h2>

      <div className="h-64 rounded-lg bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🚛</p>

          <div className="flex items-center gap-4 justify-center text-xl font-bold">
            <span>{pickup}</span>

            <span className="text-blue-400">
              ─────────▶
            </span>

            <span>{dropoff}</span>
          </div>

          <p className="text-slate-400 mt-4">
            Optimized return cargo route
          </p>

          <div className="mt-4 text-green-400 font-bold">
            +{profit.toLocaleString()} ₸ Additional Revenue
          </div>
        </div>
      </div>
    </div>
  );
}