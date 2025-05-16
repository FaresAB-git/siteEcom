'use client';
import { getPrevisionStock } from '../services/dashboardServices';
import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import style from "../style/VenteSemaineChart.module.css";

interface PrevisionData {
  id: number;
  nom: string;
  stock: number;
  ventes7j: number;
  joursRestants: number;
}

export default function StockForecast() {
  const [data, setData] = useState<PrevisionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getPrevisionStock();
        // Remplacer Infinity par une valeur max fixe pour l'affichage, ex: 100
        const sanitizedData = result.map((item: PrevisionData) => ({
          ...item,
          joursRestants: item.joursRestants === Infinity ? 100 : item.joursRestants,
          joursRestantsLabel: item.joursRestants === Infinity ? '∞' : item.joursRestants,
        }));
        setData(sanitizedData);
      } catch (error) {
        console.error('Erreur lors du chargement des prévisions :', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  

  return (
    <div className={style.chartContainer}>
      <h3>Prévisions de stock (en jours restants)</h3>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nom" angle={-45} textAnchor="end" interval={0} height={80} />
            <YAxis label={{ value: 'Jours restants', angle: -90, position: 'insideLeft' }} />
            <Bar dataKey="joursRestants" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
