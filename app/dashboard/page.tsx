"use client";

import { useState } from "react";
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

// Static mock data
const generateMockData = (days: number, min: number, max: number) => {
  const now = new Date();
  const baseValues = [
    152, 155, 158, 160, 162, 165, 163, 161, 159, 157, 155, 154, 156, 158, 160,
    162, 164, 166, 168, 170, 168, 166, 164, 162, 160, 158, 156, 154, 152, 150,
  ];
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    data.push({
      date: date.toISOString().split("T")[0],
      value: baseValues[(days - 1 - i) % baseValues.length],
    });
  }
  return data;
};

const generateBPMockData = (days: number) => {
  const now = new Date();
  const baseBP = [
    { systolic: 120, diastolic: 80 },
    { systolic: 125, diastolic: 85 },
    { systolic: 118, diastolic: 78 },
    { systolic: 122, diastolic: 82 },
    { systolic: 127, diastolic: 87 },
    { systolic: 115, diastolic: 75 },
    { systolic: 130, diastolic: 88 },
    { systolic: 123, diastolic: 83 },
    { systolic: 119, diastolic: 79 },
    { systolic: 126, diastolic: 86 },
    { systolic: 121, diastolic: 81 },
    { systolic: 128, diastolic: 88 },
    { systolic: 117, diastolic: 77 },
    { systolic: 124, diastolic: 84 },
    { systolic: 129, diastolic: 89 },
    { systolic: 116, diastolic: 76 },
    { systolic: 131, diastolic: 91 },
    { systolic: 122, diastolic: 82 },
    { systolic: 118, diastolic: 78 },
    { systolic: 126, diastolic: 86 },
    { systolic: 123, diastolic: 83 },
    { systolic: 130, diastolic: 90 },
    { systolic: 119, diastolic: 79 },
    { systolic: 125, diastolic: 85 },
    { systolic: 127, diastolic: 87 },
    { systolic: 121, diastolic: 81 },
    { systolic: 124, diastolic: 84 },
    { systolic: 128, diastolic: 88 },
    { systolic: 116, diastolic: 76 },
    { systolic: 132, diastolic: 92 },
  ];
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const bp = baseBP[(days - 1 - i) % baseBP.length];
    data.push({
      date: date.toISOString().split("T")[0],
      systolic: bp.systolic,
      diastolic: bp.diastolic,
    });
  }
  return data;
};

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const weightData = generateMockData(30, 150, 180);
  const bpData = generateBPMockData(30);
  const caloriesData = [
    { date: new Date().toISOString().split("T")[0], value: 2100 },
    {
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      value: 1950,
    },
    {
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      value: 2300,
    },
    {
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      value: 1800,
    },
    {
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      value: 2200,
    },
    {
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      value: 1700,
    },
    {
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      value: 2400,
    },
  ];

  const latestWeight = weightData[weightData.length - 1];
  const latestBP = bpData[bpData.length - 1];
  const todayCalories = caloriesData[caloriesData.length - 1];

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Health Dashboard</h1>
      <Button onClick={() => setModalOpen(true)} className="mb-6">
        Add Measurement
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <Card>
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

        <Card>
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

        <Card>
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
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
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
