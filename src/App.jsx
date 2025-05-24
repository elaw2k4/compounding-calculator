import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function calculateCompoundGrowth({ principal, rate, rateGrowth, monthlyContribution, years }) {
  let balance = principal;
  let rateDecimal = rate / 100;
  const rateGrowthDecimal = rateGrowth / 100;
  const monthlyGrowth = [];

  for (let year = 0; year < years; year++) {
    for (let month = 0; month < 12; month++) {
      balance *= (1 + rateDecimal / 12);
      balance += monthlyContribution;
      monthlyGrowth.push({ year: year + month / 12, value: balance });
    }
    rateDecimal *= (1 + rateGrowthDecimal);
  }

  return { futureValue: balance, monthlyGrowth };
}

export default function App() {
  const [form, setForm] = useState({
    principal: 10000,
    rate: 5,
    rateGrowth: 0,
    monthlyContribution: 100,
    years: 20
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const calc = calculateCompoundGrowth(form);
    setResult(calc);
  };

  return (
    <div className="p-6 max-w-xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">Compounding Calculator</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        {['principal', 'rate', 'rateGrowth', 'monthlyContribution', 'years'].map((field) => (
          <div key={field}>
            <label className="block capitalize">{field.replace(/([A-Z])/g, ' $1')}:</label>
            <input
              type="number"
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="border p-2 w-full"
              step="any"
            />
          </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Calculate
        </button>
      </form>

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">
            Future Value: ${result.futureValue.toFixed(2)}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={result.monthlyGrowth}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}