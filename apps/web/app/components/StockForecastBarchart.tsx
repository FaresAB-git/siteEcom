'use client';
import { getPrevisionStock, getPrevisionStockDES, getPrevisionStockSES } from '../services/dashboardServices';
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
  const [dataMA, setDataMA] = useState<PrevisionData[]>([]); //moving average 
  const [dataSES, setDataSES] = useState<PrevisionData[]>([]);  //Simple Exponential Smoothing
  const [dataDES, setDataDES] = useState<PrevisionData[]>([]); //Double Exponential Smoothing

  const [graphOption, setGraphOption] = useState("Moving average");
  

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getPrevisionStock();
        setDataMA(result);
        const ses = await getPrevisionStockSES();
        console.log("ses")
        console.log(ses);
        setDataDES(ses);
        const des = await getPrevisionStockDES();
        console.log(des);
        setDataDES(des);
      } catch (error) {
        console.error('Erreur lors du chargement des prévisions :', error);
      } 
    }

    loadData();
  }, []);

  

  return (
    <div className={style.cardWrapper}>
      <select value={graphOption} onChange={e => setGraphOption(e.target.value)}> 
        <option value="Moving average"> Moving average </option>
        <option value="Lissage exponentiel simple"> Lissage exponentiel simple </option>
        <option value="Double Exponential Smoothing"> Double Exponential Smoothing </option>
      </select>
      <h3 className={style.chartTitle}>Prévisions de stock (en jours restants)</h3>

      { graphOption == "Moving average" &&
        <ResponsiveContainer width="100%" height='100%'>
          <BarChart data={dataMA} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nom" angle={-45} textAnchor="end" interval={0} height={80}/>
            <YAxis label={{ value: 'Jours restants', angle: -90, position: 'insideLeft' }} />
            <Bar dataKey="joursRestants" fill="#8884d8" />
            <Tooltip />
          </BarChart>
        </ResponsiveContainer>  
      }

      { graphOption == "Lissage exponentiel simple" &&
        <ResponsiveContainer width="100%" height='100%'>
          <BarChart data={dataSES} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nom" angle={-45} textAnchor="end" interval={0} height={80}/>
            <YAxis label={{ value: 'Jours restants', angle: -90, position: 'insideLeft' }} />
            <Bar dataKey="joursRestants" fill="#8884d8" />
            <Tooltip />
          </BarChart>
        </ResponsiveContainer>  
      }

      { graphOption == "Double Exponential Smoothing" &&
        <ResponsiveContainer width="100%" height='100%'>
          <BarChart data={dataDES} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nom" angle={-45} textAnchor="end" interval={0} height={80}/>
            <YAxis label={{ value: 'Jours restants', angle: -90, position: 'insideLeft' }} />
            <Bar dataKey="joursRestants" fill="#8884d8" />
            <Tooltip />
          </BarChart>
        </ResponsiveContainer>  
      }
           
    </div>
  );
}
