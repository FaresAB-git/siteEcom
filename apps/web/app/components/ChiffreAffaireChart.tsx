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
import style from "../style/VenteSemaineChart.module.css";  

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
    <div className={style.cardWrapper}>
  <h2 className={style.chartTitle}> Chiffre d'affaire de la semaine </h2>
  <div className={style.chartInner}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date"/>
        <YAxis
          allowDecimals={true}
          label={{value: "Chiffre d'affaire",angle: -90, position: 'insideLeft',offset: 15}}
        />
        <Tooltip />
        <Line type="monotone" dataKey="total" stroke="#123499" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>
  );
}
