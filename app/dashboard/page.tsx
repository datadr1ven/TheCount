"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
  Legend,
} from "recharts";
import LogMeasurementModal from "@/components/LogMeasurementModal";
import { supabase } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [measurements, setMeasurements] = useState<any[]>([]);

  const fetchMeasurements = async () => {
    const { data, error } = await supabase
      .from("measurements")
      .select("*")
      .order("date", { ascending: true });
    if (data) {
      setMeasurements(data);
    }
  };

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const weightData = measurements
    .filter((m) => m.type === "weight")
    .map((m) => ({
      date: new Date(m.date).toISOString().split("T")[0],
      value: parseFloat(m.value),
    }))
    .slice(0, 30);

  const bpData = measurements
    .filter((m) => m.type === "bp")
    .map((m) => {
      const [systolic, diastolic] = m.value.split("/").map(Number);
      return {
        date: new Date(m.date).toISOString().split("T")[0],
        systolic,
        diastolic,
      };
    })
    .slice(0, 30);

  const caloriesMap: { [key: string]: number } = {};
  measurements
    .filter((m) => m.type === "calories")
    .forEach((m) => {
      const date = new Date(m.date).toISOString().split("T")[0];
      const value = parseFloat(m.value);
      caloriesMap[date] = (caloriesMap[date] || 0) + value;
    });
  const caloriesData = Object.keys(caloriesMap)
    .map((date) => ({
      date,
      value: caloriesMap[date],
    }))
    .slice(0, 30);

  const latestWeight =
    weightData.length > 0 ? weightData[weightData.length - 1] : { value: 0 };
  const latestBP =
    bpData.length > 0
      ? bpData[bpData.length - 1]
      : { systolic: 0, diastolic: 0 };
  const todayCalories =
    caloriesData.length > 0
      ? caloriesData[caloriesData.length - 1]
      : { value: 0 };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <h1 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-black">
        Health Dashboard
      </h1>
      <Button
        onClick={() => setModalOpen(true)}
        className="mb-8 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        ➕ Add Measurement
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <Card className="shadow-xl rounded-xl hover:shadow-2xl transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">
              Latest: {latestWeight.value} lbs
            </p>
            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={weightData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-xl rounded-xl hover:shadow-2xl transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Blood Pressure</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">
              Latest: {latestBP.systolic}/{latestBP.diastolic} mmHg
            </p>
            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={bpData}>
                <Line
                  type="monotone"
                  dataKey="systolic"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="diastolic"
                  stroke="#ffc658"
                  strokeWidth={2}
                  dot={false}
                />
                <Tooltip />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-xl rounded-xl hover:shadow-2xl transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">
              Today: {todayCalories.value} kcal
            </p>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={caloriesData}>
                <Bar dataKey="value" fill="#8884d8" />
                <Tooltip />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Placeholder for the fourth card if needed, or make it responsive */}
        <Card className="shadow-xl rounded-xl hover:shadow-2xl transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Coming soon...</p>
          </CardContent>
        </Card>
      </div>
      <LogMeasurementModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
