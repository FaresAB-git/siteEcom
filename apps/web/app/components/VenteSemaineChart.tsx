'use client';
import { getVenteSemaineData } from '../services/dashboardServices';
import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  ResponsiveContainer,
} from 'recharts';
import style from "../style/VenteSemaineChart.module.css";  // Import du CSS module

interface SalesData {
  date: string;
  salesCount: number;
}

export default function VenteSemaineChart() {
  const [data, setData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getVenteSemaineData();
        setData(result);
      } catch (error) {
        console.error('Erreur lors du chargement des ventes :', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
   
      <div className={style.cardWrapper}>
        <h2 className={style.chartTitle}> Vente de la semaine </h2>
        <div className={style.chartInner}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} label={{ value: 'Ventes', angle: -90 }} />
              <Tooltip />
              <Line type="monotone" dataKey="salesCount" stroke="#123499" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    
  );
}
