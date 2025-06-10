'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getVenteParCollection } from '../services/dashboardServices';
import style from '../style/VenteSemaineChart.module.css';

interface CollectionVente {
  collectionId: number;
  nom: string;
  totalQuantite: number;
  totalVentes: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#D65DB1'];

export default function VenteParCollection() {
  const [data, setData] = useState<CollectionVente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getVenteParCollection();
        
        setData(result);
      } catch (error) {
        console.error('Erreur lors du chargement des ventes par collection :', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className={style.cardWrapper}>
      <h2 className={style.chartTitle}>Ventes par collection</h2>
      <div className={style.chartInner}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="totalVentes"
              nameKey="nom"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label={({ name }) => `${name}`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${value.toFixed(2)} €`}
              labelFormatter={(label) => `Collection : ${label}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
