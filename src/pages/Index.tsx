import { useState } from "react";
import { Home } from "@/components/Home";
import { WorkoutBuilder } from "@/components/WorkoutBuilder";
import { Session } from "@/components/Session";
import { SettingsScreen } from "@/components/SettingsScreen";

type View =
  | { name: "home" }
  | { name: "builder"; workoutId?: string }
  | { name: "session"; workoutId: string }
  | { name: "settings" };

const Index = () => {
  const [view, setView] = useState<View>({ name: "home" });

  if (view.name === "builder") {
    return (
      <WorkoutBuilder
        workoutId={view.workoutId}
        onBack={() => setView({ name: "home" })}
        onSaved={() => setView({ name: "home" })}
      />
    );
  }
  if (view.name === "session") {
    return <Session workoutId={view.workoutId} onExit={() => setView({ name: "home" })} />;
  }
  if (view.name === "settings") {
    return <SettingsScreen onBack={() => setView({ name: "home" })} />;
  }
  return (
    <Home
      onNewWorkout={() => setView({ name: "builder" })}
      onEditWorkout={(id) => setView({ name: "builder", workoutId: id })}
      onStartWorkout={(id) => setView({ name: "session", workoutId: id })}
      onOpenSettings={() => setView({ name: "settings" })}
    />
  );
};

export default Index;
