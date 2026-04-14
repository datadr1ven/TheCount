"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Using native label element

// Assuming we have a Label component; if not, use a simple label

interface LogMeasurementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LogMeasurementModal({
  open,
  onOpenChange,
}: LogMeasurementModalProps) {
  const [measurementType, setMeasurementType] = useState("weight");
  const [value, setValue] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = async () => {
    if (!measurementType || !value || !date) return;

    let formattedValue = value;
    if (measurementType === "bp") {
      // For BP, store as 'systolic/diastolic'
      formattedValue = value;
    }

    const { error } = await supabase
      .from("measurements")
      .insert({ type: measurementType, value: formattedValue, date });

    if (error) {
      console.error("Error inserting measurement:", error);
      setError("Failed to save measurement");
      return;
    }

    console.log("Measurement saved:", {
      measurementType,
      value: formattedValue,
      date,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{
          display: open ? "block" : "none",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <DialogHeader>
          <DialogTitle>Log Measurement</DialogTitle>
          <DialogDescription>
            Enter your health measurements below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="type">Measurement Type</label>
            <select
              id="type"
              value={measurementType}
              onChange={(e) => setMeasurementType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="weight">Weight (lbs)</option>
              <option value="bp">Blood Pressure (systolic/diastolic)</option>
              <option value="calories">Calories</option>
            </select>
          </div>
          <div>
            <label htmlFor="value">Value</label>
            <Input
              id="value"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value"
            />
          </div>
          <div>
            <label htmlFor="date">Date</label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Log
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
