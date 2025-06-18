'use client'

import { useEffect, useState } from "react";
import {getPrevStockDESTest, getPrevStockMATest, getPrevStockSESTest, getVentesProduitTest} from "../../services/prevStock.service";
import Header from "../../components/Header";
import NavBar from "../../components/Navbar";
import style from "../../style/stockPrevTest.module.css";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line} from "recharts";

interface PrevisionData {
  id: number;
  nom: string;
  stock: number;
  ventes7j: number;
  forecastDemandeProchainJour: number;
  joursRestants: number;
}

interface VenteSemaineProdTest {
  date: string;
  salesCount: number;
}

export default function getPrevisionStock() {
  const [dataMA, setDataMA] = useState<PrevisionData>();
  const [dataSES, setDataSES] = useState<PrevisionData>();
  const [dataDES, setDataDES] = useState<PrevisionData>();
  const [venteSemaineProdTest, setVenteSemaineProdTest] = useState<VenteSemaineProdTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const MAData = await getPrevStockMATest();
      setDataMA(MAData);
      const SESData = await getPrevStockSESTest();
      setDataSES(SESData);
      const DESData = await getPrevStockDESTest();
      setDataDES(DESData);
      const venteProdTest = await getVentesProduitTest();
      setVenteSemaineProdTest(venteProdTest);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <h1>Chargement...</h1>;
  }

  const chartForecastData = [
    {
      méthode: "Moving Average",
      forecast: dataMA?.forecastDemandeProchainJour,
    },
    {
      méthode: "Simple Exp. Smoothing",
      forecast: dataSES?.forecastDemandeProchainJour,
    },
    {
      méthode: "Double Exp. Smoothing",
      forecast: dataDES?.forecastDemandeProchainJour,
    },
  ];

  return (
    <>
      <Header />
      <NavBar />

      <div className={style.mainContent}>
        <div className={style.container}>
          <h2>Historique des ventes – {dataMA?.nom}</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={venteSemaineProdTest} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="salesCount" stroke="#82ca9d" name="Ventes journalières" />
            </LineChart>
          </ResponsiveContainer>

          <h2>Prévision de la demande (J+1) – {dataMA?.nom}</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartForecastData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="méthode" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="forecast" fill="#8884d8" name="Demande prévue (J+1)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
