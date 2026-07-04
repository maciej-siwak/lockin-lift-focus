import { useState } from "react";
import { Home } from "@/components/Home";
import { WorkoutBuilder } from "@/components/WorkoutBuilder";
import { Session } from "@/components/Session";
import { SettingsScreen } from "@/components/SettingsScreen";
import { History } from "@/components/History";
import { Records } from "@/components/Records";
import { ExerciseSuggestions } from "@/components/ExerciseSuggestions";
import { ExerciseDetail } from "@/components/ExerciseDetail";

type View =
  | { name: "home" }
  | { name: "builder"; workoutId?: string }
  | { name: "session"; workoutId: string; startAtIndex?: number }
  | { name: "settings" }
  | { name: "history" }
  | { name: "records" }
  | { name: "suggestions" }
  | { name: "exercise"; exerciseName: string; source: View; workoutId?: string; startAtIndex?: number };

const Index = () => {
  const [view, setView] = useState<View>({ name: "home" });

  const goBack = () => {
    if (view.name === "exercise") {
      setView(view.source);
      return;
    }
    setView({ name: "home" });
  };

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
    return (
      <Session
        workoutId={view.workoutId}
        startAtIndex={view.startAtIndex}
        onExit={() => setView({ name: "home" })}
        onViewExercise={(exerciseName, index) =>
          setView({
            name: "exercise",
            exerciseName,
            source: { name: "session", workoutId: view.workoutId, startAtIndex: view.startAtIndex },
            workoutId: view.workoutId,
            startAtIndex: index,
          })
        }
      />
    );
  }
  if (view.name === "settings") {
    return <SettingsScreen onBack={() => setView({ name: "home" })} />;
  }
  if (view.name === "history") {
    return <History onBack={() => setView({ name: "home" })} />;
  }
  if (view.name === "records") {
    return <Records onBack={() => setView({ name: "home" })} />;
  }
  if (view.name === "suggestions") {
    return (
      <ExerciseSuggestions
        onBack={() => setView({ name: "home" })}
        onViewExercise={(exerciseName) =>
          setView({
            name: "exercise",
            exerciseName,
            source: { name: "suggestions" },
          })
        }
      />
    );
  }
  if (view.name === "exercise") {
    return (
      <ExerciseDetail
        exerciseName={view.exerciseName}
        onBack={goBack}
        onStart={
          view.workoutId != null
            ? () => setView({ name: "session", workoutId: view.workoutId, startAtIndex: view.startAtIndex })
            : undefined
        }
      />
    );
  }
  return (
    <Home
      onNewWorkout={() => setView({ name: "builder" })}
      onEditWorkout={(id) => setView({ name: "builder", workoutId: id })}
      onStartWorkout={(id) => setView({ name: "session", workoutId: id })}
      onOpenSettings={() => setView({ name: "settings" })}
      onOpenHistory={() => setView({ name: "history" })}
      onOpenRecords={() => setView({ name: "records" })}
      onOpenSuggestions={() => setView({ name: "suggestions" })}
    />
  );
};

export default Index;
