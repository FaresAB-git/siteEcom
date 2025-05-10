'use client';
import { getChiffreAfaireSemaine, getVenteSemaineData } from '../services/dashboardServices';
import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import style from "../style/VenteSemaineChart.module.css";  // Import du CSS module

interface SalesData {
  date: string;
  salesCount: number;
}

export default function ChiffreAffaireChart() {
  const [data, setData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getChiffreAfaireSemaine();
        setData(result);
      } catch (error) {
        console.error('Erreur lors du chargement des ventes :', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <p>Chargement du graphique...</p>;

  return (
    <div className={style.chartContainer}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis allowDecimals={true} />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#123499" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
