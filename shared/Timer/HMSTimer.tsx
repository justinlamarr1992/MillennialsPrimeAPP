import { View, Text } from "react-native";
import React, { useState, useMemo, useEffect } from "react";
import NumberCard from "./NumberCard";
import { globalStyles } from "@/constants/global";

interface HMSTimerProps {
  startDate: string;
  // onTimerFinished?: () => void;
}

export default function HMSTimer({
  startDate,
  // onTimerFinished
}: HMSTimerProps) {
  const targetTime = new Date(startDate).getTime();
  const [currentTime, setCurrentTime] = useState(Date.now());
  const timeBetween = useMemo(
    () => targetTime - currentTime,
    [currentTime, targetTime]
  );
  const days = Math.floor(timeBetween / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeBetween % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeBetween % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeBetween % (1000 * 60)) / 1000);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeBetween <= 0) {
        clearInterval(interval);
        // onTimerFinished();
      } else {
        setCurrentTime(Date.now());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [
    timeBetween,
    // onTimerFinished
  ]);
  return (
    <View style={[globalStyles.timerContainer]}>
      <NumberCard number={days} unit="days" />
      <Text style={globalStyles.timerDivider}>:</Text>
      <NumberCard number={hours} unit="hrs" />
      <Text style={globalStyles.timerDivider}>:</Text>
      <NumberCard number={minutes} unit="min" />
      <Text style={globalStyles.timerDivider}>:</Text>
      <NumberCard number={seconds} unit="sec" />
    </View>
  );
}
