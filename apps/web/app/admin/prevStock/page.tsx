'use client'

import { useEffect, useState } from "react";
import { getPrevStockDESTest, getPrevStockMATest, getPrevStockSESTest, getVentesProduitTest } from "../../services/prevStock.service";
import Header from "../../components/Header";
import NavBar from "../../components/Navbar";
import style from "../../style/stockPrevTest.module.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

type Prevision = {
  ventes7j: number;
  forecastDemandeProchainJour: number;
  joursRestants: number | null;
};

type PrevisionsResponse = {
  id: number;
  nom: string;
  stock: number;
  previsions: {
    croissant: Prevision;
    stable: Prevision;
    decroissant: Prevision;
  };
};

interface VenteJour {
  date: string;
  salesCount: number;
}

interface VentesSemaineParProfil {
  croissant: VenteJour[];
  stable: VenteJour[];
  decroissant: VenteJour[];
}

export default function getPrevisionStock() {
  const [dataMA, setDataMA] = useState<PrevisionsResponse>();
  const [dataSES, setDataSES] = useState<PrevisionsResponse>();
  const [dataDES, setDataDES] = useState<PrevisionsResponse>();
  const [venteSemaineProdTest, setVenteSemaineProdTest] = useState<VentesSemaineParProfil>();
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

  const generateChartForecastData = (profile: 'croissant' | 'stable' | 'decroissant') => [
    {
      méthode: "Moving Average",
      forecast: dataMA?.previsions[profile].forecastDemandeProchainJour,
    },
    {
      méthode: "Simple Exp. Smoothing",
      forecast: dataSES?.previsions[profile].forecastDemandeProchainJour,
    },
    {
      méthode: "Double Exp. Smoothing",
      forecast: dataDES?.previsions[profile].forecastDemandeProchainJour,
    },
  ];

  return (
    <>
      <Header />
      <NavBar />

      <div className={style.mainContent}>
        <div className={style.container}>
          <div>
            <h2> Comparaison entre les trois méthodes de prévision :</h2>
            <p>
              Les trois méthodes de prévision comparées ici sont :
              <br /><br />
              <strong>Moving Average (MA)</strong> : calcule la moyenne des ventes passées sur une période donnée. Il est utile dans des contextes où la demande est relativement stable, mais il réagit lentement aux changements soudains.
              <br /><br />
              <strong>Simple Exponential Smoothing (SES)</strong> : pondère les ventes passées en donnant plus d’importance aux données récentes. Il est plus réactif que MA et convient aux séries stables avec un peu de bruit.
              <br /><br />
              <strong>Double Exponential Smoothing (DES)</strong> : prend en compte les tendances dans les données (croissantes ou décroissantes). Il est plus pertinent lorsqu’il existe une dynamique d'évolution marquée dans les ventes.
            </p>
            <h2>Exemple sur la semaine passées dans 3 cas, un cas ou les ventes sont stables, un autre ou les ventes sont croissantes et un derniers ou les ventes sont décroissantes</h2>
          </div>


          {/* STABLE */}
          <h2>Historique des ventes – {dataMA?.nom} (stable)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={venteSemaineProdTest?.stable} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="salesCount" stroke="#8884d8" name="Ventes journalières" />
            </LineChart>
          </ResponsiveContainer>
          
          <h2>Prévision de la demande (J+1) – {dataMA?.nom} (stable)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={generateChartForecastData('stable')} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="méthode" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="forecast" fill="#82ca9d" name="Demande prévue (J+1)" />
            </BarChart>
          </ResponsiveContainer>

          <p>Dans un contexte stable, les trois méthodes donnent le même résultat de 4 unités de vente prévues par jour.</p>
          <p>C’est logique : les ventes étant constantes, MA, SES et DES convergent vers la même valeur.</p>
          <p>MA utilise une moyenne des 7 derniers jours : 28 / 7 = 4. SES et DES détectent aussi l’absence de variation.</p>
          <p>Dans ce cas, la méthode MA est suffisante, car la demande ne change pas.</p>

          {/* CROISSANT */}
          <h2>Historique des ventes – {dataMA?.nom} (croissant)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={venteSemaineProdTest?.croissant} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="salesCount" stroke="#82ca9d" name="Ventes journalières" />
            </LineChart>
          </ResponsiveContainer>

          <h2>Prévision de la demande (J+1) – {dataMA?.nom} (croissant)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={generateChartForecastData('croissant')} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="méthode" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="forecast" fill="#8884d8" name="Demande prévue (J+1)" />
            </BarChart>
          </ResponsiveContainer>

          <p>Lorsque la demande augmente, MA reste bloquée à 4 car elle ne tient pas compte des tendances.</p>
          <p>SES commence à réagir : elle prévoit environ 4.94 unités grâce à la pondération des données récentes.</p>
          <p>DES anticipe fortement la hausse et prévoit 8 unités. Il ajoute une estimation de la tendance à la prévision.</p>
          <p>Plus formellement : Prévision = niveau + tendance. Ici, la tendance estimée augmente la prévision.</p>
          <p>DES est donc plus réactif dans un contexte de croissance de la demande.</p>

          {/* DÉCROISSANT */}
          <h2>Historique des ventes – {dataMA?.nom} (décroissant)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={venteSemaineProdTest?.decroissant} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="salesCount" stroke="#ff7300" name="Ventes journalières" />
            </LineChart>
          </ResponsiveContainer>

          <h2>Prévision de la demande (J+1) – {dataMA?.nom} (décroissant)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={generateChartForecastData('decroissant')} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="méthode" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="forecast" fill="#ff7300" name="Demande prévue (J+1)" />
            </BarChart>
          </ResponsiveContainer>

          <p>Dans un contexte de baisse, MA ne réagit pas et reste à 4.</p>
          <p>SES commence à baisser la prévision à environ 3.06, car les dernières valeurs sont plus faibles.</p>
          <p>DES détecte une forte tendance à la baisse et prédit une demande proche de 0.</p>
          <p>Il applique la formule : Prévision = niveau + tendance, avec une tendance ici négative.</p>
          <p>DES est donc la méthode la plus prudente et la plus adaptée en cas de chute de la demande.</p>

          <h2> Synthèse</h2>
          <p>MA est simple et efficace pour une demande stable, mais elle réagit mal aux changements.</p>
          <p>SES est un bon compromis pour des évolutions légères, mais il reste limité face à des tendances marquées.</p>
          <p>DES est le plus performant quand la demande évolue fortement, car il modélise les tendances dans le temps.</p>


        </div>
      </div>
    </>
  );
}
