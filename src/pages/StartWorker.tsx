import { useState, useEffect, useRef } from 'react';
import { Play, Check, X, Timer, Dumbbell, ChevronRight, Trophy, Flame, Volume2, VolumeX, ArrowLeft } from 'lucide-react';

interface WorkoutInterfaceProps {
  onBack?: () => void;
}

export default function WorkoutInterface({ onBack }: WorkoutInterfaceProps = {}) {
  const [currentView, setCurrentView] = useState('ready'); // 'ready', 'workout', 'rest', 'complete'
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [restTimer, setRestTimer] = useState(60);
  const [isResting, setIsResting] = useState(false);
  const timerStartRef = useRef<number | null>(null);
  const restEndRef = useRef<number | null>(null);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);

  const workoutPlan = {
    name: 'Strength Foundation',
    duration: '40 min',
    difficulty: 'Beginner',
    caloriesEstimate: 350,
    exercises: [
      { id: 1, name: 'Goblet Squats', sets: 4, reps: 12, rest: 60, calories: 8, instructions: 'Hold dumbbell at chest, squat down keeping back straight' },
      { id: 2, name: 'Dumbbell Press', sets: 4, reps: 10, rest: 60, calories: 7, instructions: 'Press dumbbells overhead, control the movement' },
      { id: 3, name: 'Bent-over Rows', sets: 4, reps: 10, rest: 60, calories: 7, instructions: 'Bend at hips, pull dumbbells to chest, squeeze shoulder blades' },
      { id: 4, name: 'Shoulder Press', sets: 3, reps: 10, rest: 60, calories: 6, instructions: 'Press dumbbells overhead from shoulder height' },
      { id: 5, name: 'Bicep Curls', sets: 3, reps: 12, rest: 45, calories: 5, instructions: 'Curl dumbbells up, keep elbows stationary' }
    ]
  };

  const currentExercise = workoutPlan.exercises[currentExerciseIndex];

  // Accurate timer using timestamps (avoids interval drift)
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isTimerRunning && timerStartRef.current) {
      interval = setInterval(() => {
        const start = timerStartRef.current as number;
        const elapsed = Math.floor((Date.now() - start) / 1000);
        setTimer(elapsed);
      }, 250);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Accurate rest timer using end timestamp
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isResting && restEndRef.current) {
      interval = setInterval(() => {
        const remainingMs = (restEndRef.current as number) - Date.now();
        const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));
        setRestTimer(remainingSec);
        if (remainingSec <= 0) {
          setIsResting(false);
          // move back to workout view
          setCurrentView('workout');
          // reset rest timer to default for UI
          setRestTimer(currentExercise.rest ?? 0);
        }
      }, 200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isResting, currentExercise]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartWorkout = () => {
    setCurrentView('workout');
    // start accurate timer
    timerStartRef.current = Date.now();
    setTimer(0);
    setIsTimerRunning(true);
  };

  const handleCompleteSet = () => {
    const key = `${currentExerciseIndex}-${currentSet}`;
    setCompletedSets({ ...completedSets, [key]: true });
    setTotalCaloriesBurned(prev => prev + currentExercise.calories);

    if (currentSet < currentExercise.sets) {
      // More sets remaining
      setCurrentSet(prev => prev + 1);
      // set rest end timestamp for accurate countdown
      restEndRef.current = Date.now() + currentExercise.rest * 1000;
      setRestTimer(currentExercise.rest);
      setIsResting(true);
      setCurrentView('rest');
    } else {
      // Exercise complete, move to next
      if (currentExerciseIndex < workoutPlan.exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSet(1);
        // next exercise rest duration
        const nextRest = workoutPlan.exercises[currentExerciseIndex + 1]?.rest ?? 60;
        restEndRef.current = Date.now() + nextRest * 1000;
        setRestTimer(nextRest);
        setIsResting(true);
        setCurrentView('rest');
      } else {
        // Workout complete
        setIsTimerRunning(false);
        setCurrentView('complete');
      }
    }
  };

  const handleSkipExercise = () => {
    if (currentExerciseIndex < workoutPlan.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      setIsResting(false);
      setCurrentView('workout');
    } else {
      setIsTimerRunning(false);
      setCurrentView('complete');
    }
  };

  const handleSkipRest = () => {
    setIsResting(false);
    restEndRef.current = null;
    setRestTimer(currentExercise.rest);
    setCurrentView('workout');
  };

  // Ready Screen - Purple gradient hero card style (matches dashboard Today's Workout)
  const ReadyScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 lg:p-6 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 lg:mb-6 transition-colors text-sm lg:text-base"
          >
            <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="font-semibold">Back to Dashboard</span>
          </button>
        )}

        {/* Hero Card - Purple Gradient like Dashboard */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl lg:rounded-3xl p-5 lg:p-8 mb-4 lg:mb-6 relative overflow-hidden">
          {/* Decorative icon */}
          <div className="absolute top-3 right-3 lg:top-4 lg:right-4 w-12 h-12 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-xl lg:rounded-2xl flex items-center justify-center">
            <Dumbbell className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
          </div>
          
          <p className="text-white/80 text-xs lg:text-sm font-medium uppercase tracking-wider mb-1 lg:mb-2">TODAY'S WORKOUT</p>
          <h1 className="text-2xl lg:text-4xl font-bold text-white mb-3 lg:mb-4 pr-14 lg:pr-20">{workoutPlan.name}</h1>
          
          <div className="flex items-center gap-4 lg:gap-6 text-white/90 mb-4 lg:mb-6 text-sm lg:text-base">
            <div className="flex items-center gap-1.5 lg:gap-2">
              <Timer className="w-4 h-4 lg:w-5 lg:h-5" />
              <span>{workoutPlan.duration}</span>
            </div>
            <div className="flex items-center gap-1.5 lg:gap-2">
              <Dumbbell className="w-4 h-4 lg:w-5 lg:h-5" />
              <span>{workoutPlan.exercises.length} exercises</span>
            </div>
          </div>
          
          {/* Start Button inside hero */}
          <button
            onClick={handleStartWorkout}
            className="w-full py-3 lg:py-4 bg-white text-purple-600 font-bold text-base lg:text-lg rounded-xl flex items-center justify-center gap-2 lg:gap-3 hover:bg-white/90 transition-all shadow-lg"
          >
            <Play className="w-5 h-5 lg:w-6 lg:h-6" />
            Start Workout
          </button>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-3 gap-2 lg:gap-4 mb-4 lg:mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-5 text-center border border-white/10">
            <Timer className="w-5 h-5 lg:w-6 lg:h-6 text-teal-400 mx-auto mb-1 lg:mb-2" />
            <p className="text-lg lg:text-2xl font-bold text-white">{workoutPlan.duration}</p>
            <p className="text-xs lg:text-sm text-white/60">Duration</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-5 text-center border border-white/10">
            <Flame className="w-5 h-5 lg:w-6 lg:h-6 text-orange-400 mx-auto mb-1 lg:mb-2" />
            <p className="text-lg lg:text-2xl font-bold text-white">{workoutPlan.caloriesEstimate}</p>
            <p className="text-xs lg:text-sm text-white/60">Calories</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-5 text-center border border-white/10">
            <Dumbbell className="w-5 h-5 lg:w-6 lg:h-6 text-purple-400 mx-auto mb-1 lg:mb-2" />
            <p className="text-lg lg:text-2xl font-bold text-white">{workoutPlan.exercises.length}</p>
            <p className="text-xs lg:text-sm text-white/60">Exercises</p>
          </div>
        </div>

        {/* Exercise List */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/10">
          <h3 className="font-bold text-white mb-3 lg:mb-4 text-sm lg:text-base">Today's Exercises</h3>
          <div className="space-y-2 lg:space-y-3">
            {workoutPlan.exercises.map((exercise, idx) => (
              <div key={exercise.id} className="flex items-center justify-between p-3 lg:p-4 bg-white/5 rounded-lg lg:rounded-xl border border-white/5">
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="w-7 h-7 lg:w-8 lg:h-8 bg-teal-500 rounded-md lg:rounded-lg flex items-center justify-center text-white font-bold text-xs lg:text-sm">
                    {idx + 1}
                  </div>
                  <span className="font-medium text-white text-sm lg:text-base truncate max-w-[150px] sm:max-w-none">{exercise.name}</span>
                </div>
                <span className="text-xs lg:text-sm text-white/60">{exercise.sets} × {exercise.reps}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Workout Screen
  const WorkoutScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 text-white">
      {/* Glassy Hero Header */}
      <div className="relative sticky top-0 z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/40 to-emerald-600/40 backdrop-blur-3xl" />
        <div className="relative bg-white/10 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-4xl mx-auto px-4 lg:px-6 py-3 lg:py-4">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <button 
                onClick={() => setCurrentView('ready')}
                className="p-2 lg:p-3 bg-white/10 hover:bg-white/20 rounded-lg lg:rounded-xl backdrop-blur-sm transition-all"
              >
                <X className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl px-5 lg:px-8 py-2 lg:py-3">
                <p className="text-teal-200 text-xs font-medium">Workout Time</p>
                <p className="text-2xl lg:text-3xl font-bold text-white">{formatTime(timer)}</p>
              </div>
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 lg:p-3 bg-white/10 hover:bg-white/20 rounded-lg lg:rounded-xl backdrop-blur-sm transition-all"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 lg:w-5 lg:h-5" /> : <VolumeX className="w-4 h-4 lg:w-5 lg:h-5" />}
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-2.5 backdrop-blur-sm">
              <div 
                className="bg-gradient-to-r from-teal-400 to-emerald-400 h-2.5 rounded-full transition-all duration-500 shadow-lg shadow-teal-500/30"
                style={{ width: `${((currentExerciseIndex + 1) / workoutPlan.exercises.length) * 100}%` }}
              />
            </div>
            <p className="text-center text-teal-200 text-sm mt-3 font-medium">
              Exercise {currentExerciseIndex + 1} of {workoutPlan.exercises.length}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        {/* Exercise Info */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/20 p-5 lg:p-8 mb-4 lg:mb-6 text-center">
          <div className="w-20 h-20 lg:w-28 lg:h-28 bg-gradient-to-br from-teal-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-xl shadow-teal-500/30">
            <Dumbbell className="w-10 h-10 lg:w-14 lg:h-14" />
          </div>
          <h2 className="text-2xl lg:text-4xl font-bold mb-2 lg:mb-4 bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">{currentExercise.name}</h2>
          <p className="text-white/60 text-sm lg:text-lg mb-5 lg:mb-8">{currentExercise.instructions}</p>
          
          {/* Set Counter */}
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl px-6 lg:px-10 py-3 lg:py-5 border border-white/20">
            <p className="text-teal-300 text-xs lg:text-sm mb-1 font-medium">Current Set</p>
            <p className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">{currentSet}/{currentExercise.sets}</p>
          </div>

          {/* Reps */}
          <div className="mt-5 lg:mt-8 flex items-center justify-center gap-4 lg:gap-8">
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-lg lg:rounded-xl px-4 lg:px-6 py-3 lg:py-4 border border-white/10">
              <p className="text-white/50 text-xs lg:text-sm mb-1">Target Reps</p>
              <p className="text-2xl lg:text-4xl font-bold">{currentExercise.reps}</p>
            </div>
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-lg lg:rounded-xl px-4 lg:px-6 py-3 lg:py-4 border border-white/10">
              <p className="text-white/50 text-xs lg:text-sm mb-1">Rest Time</p>
              <p className="text-2xl lg:text-4xl font-bold">{currentExercise.rest}s</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 lg:gap-4">
          <button
            onClick={handleSkipExercise}
            className="flex-1 py-3 lg:py-4 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-bold rounded-xl lg:rounded-2xl transition-all text-sm lg:text-base"
          >
            Skip Exercise
          </button>
          <button
            onClick={handleCompleteSet}
            className="flex-1 py-3 lg:py-4 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 text-white font-bold rounded-xl lg:rounded-2xl shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition-all text-sm lg:text-base"
          >
            <Check className="w-5 h-5 lg:w-6 lg:h-6" />
            Complete Set
          </button>
        </div>

        {/* Completed Sets Indicator */}
        <div className="mt-6 lg:mt-8 flex justify-center gap-2 lg:gap-3">
          {[...Array(currentExercise.sets)].map((_, idx) => (
            <div
              key={idx}
              className={`w-10 h-10 lg:w-14 lg:h-14 rounded-lg lg:rounded-xl flex items-center justify-center font-bold transition-all border text-sm lg:text-base ${
                completedSets[`${currentExerciseIndex}-${idx + 1}`]
                  ? 'bg-gradient-to-br from-teal-500 to-emerald-400 text-white border-transparent shadow-lg shadow-teal-500/25'
                  : idx + 1 === currentSet
                  ? 'bg-teal-400/30 text-teal-300 border-teal-400/50'
                  : 'bg-white/10 text-white/40 border-white/10'
              }`}
            >
              {idx + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Rest Screen - Teal/Green gradient theme (matches Workout Screen - Image 4)
  const RestScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 text-white">
      {/* Glassy Header - Same style as workout screen */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/40 to-emerald-600/40 backdrop-blur-3xl" />
        <div className="relative bg-white/10 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-4xl mx-auto px-4 lg:px-6 py-3 lg:py-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setCurrentView('workout')}
                className="p-2 lg:p-3 bg-white/10 hover:bg-white/20 rounded-lg lg:rounded-xl backdrop-blur-sm transition-all"
              >
                <X className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl px-5 lg:px-8 py-2 lg:py-3">
                <p className="text-teal-200 text-xs font-medium">Workout Time</p>
                <p className="text-2xl lg:text-3xl font-bold text-white">{formatTime(timer)}</p>
              </div>
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 lg:p-3 bg-white/10 hover:bg-white/20 rounded-lg lg:rounded-xl backdrop-blur-sm transition-all"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 lg:w-5 lg:h-5" /> : <VolumeX className="w-4 h-4 lg:w-5 lg:h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rest Content */}
      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/20 p-5 lg:p-8 text-center">
          {/* Timer Icon */}
          <div className="w-20 h-20 lg:w-28 lg:h-28 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 border border-white/20">
            <Timer className="w-10 h-10 lg:w-14 lg:h-14 text-teal-300" />
          </div>
          
          <h1 className="text-2xl lg:text-4xl font-bold mb-1 lg:mb-2 bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">Rest Time</h1>
          <p className="text-white/60 text-sm lg:text-base mb-5 lg:mb-8">Take a breather — next set starts soon.</p>

          {/* Rest Timer - Large Display */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl lg:rounded-3xl p-6 lg:p-10 mb-4 lg:mb-6 border border-white/20">
            <p className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent mb-1 lg:mb-2">{restTimer}</p>
            <p className="text-xs lg:text-sm text-white/60">seconds</p>
          </div>

          {/* Next Exercise Preview */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl lg:rounded-2xl p-4 lg:p-6 mb-5 lg:mb-8 border border-white/20">
            <p className="text-teal-300 text-xs lg:text-sm mb-1 lg:mb-2">Up Next</p>
            <p className="text-lg lg:text-2xl font-bold">
              {currentSet < currentExercise.sets 
                ? `${currentExercise.name} - Set ${currentSet + 1}` 
                : currentExerciseIndex < workoutPlan.exercises.length - 1
                ? workoutPlan.exercises[currentExerciseIndex + 1].name
                : 'Workout Complete!'}
            </p>
          </div>

          {/* Skip Rest Button - Same gradient as workout buttons */}
          <button
            onClick={handleSkipRest}
            className="w-full max-w-md mx-auto py-3 lg:py-4 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 text-white font-bold rounded-xl lg:rounded-2xl shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 lg:gap-3 transition-all text-sm lg:text-base"
          >
            Skip Rest
            <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="mt-6">
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-teal-400 to-emerald-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentExercise.rest - restTimer) / currentExercise.rest) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Complete Screen - Teal/Green gradient theme (consistent with workout flow)
  const CompleteScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 text-white">
      {/* Glassy Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/40 to-emerald-600/40 backdrop-blur-3xl" />
        <div className="relative bg-white/10 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-4xl mx-auto px-4 lg:px-6 py-3 lg:py-4">
            <div className="flex items-center justify-between">
              <div className="w-10 lg:w-12" /> {/* Spacer */}
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl px-5 lg:px-8 py-2 lg:py-3">
                <p className="text-teal-200 text-xs font-medium">Completed</p>
                <p className="text-2xl lg:text-3xl font-bold text-white">{formatTime(timer)}</p>
              </div>
              <div className="w-10 lg:w-12" /> {/* Spacer */}
            </div>
          </div>
        </div>
      </div>

      {/* Complete Content */}
      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/20 p-5 lg:p-8 text-center">
          {/* Trophy Icon */}
          <div className="w-20 h-20 lg:w-28 lg:h-28 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-xl shadow-orange-500/30">
            <Trophy className="w-10 h-10 lg:w-14 lg:h-14 text-white" />
          </div>
          
          <h1 className="text-2xl lg:text-4xl font-bold mb-1 lg:mb-2 bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">Amazing Work!</h1>
          <p className="text-base lg:text-lg text-white/60 mb-5 lg:mb-8">You crushed that workout! 💪</p>

          {/* Workout Stats */}
          <div className="grid grid-cols-3 gap-2 lg:gap-4 mb-5 lg:mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-5 text-center border border-white/20">
              <Timer className="w-5 h-5 lg:w-6 lg:h-6 text-teal-400 mx-auto mb-1 lg:mb-2" />
              <p className="text-lg lg:text-2xl font-bold text-white">{formatTime(timer)}</p>
              <p className="text-xs lg:text-sm text-white/60">Duration</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-5 text-center border border-white/20">
              <Flame className="w-5 h-5 lg:w-6 lg:h-6 text-orange-400 mx-auto mb-1 lg:mb-2" />
              <p className="text-lg lg:text-2xl font-bold text-white">{totalCaloriesBurned}</p>
              <p className="text-xs lg:text-sm text-white/60">Calories</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-5 text-center border border-white/20">
              <Dumbbell className="w-5 h-5 lg:w-6 lg:h-6 text-purple-400 mx-auto mb-1 lg:mb-2" />
              <p className="text-lg lg:text-2xl font-bold text-white">{workoutPlan.exercises.length}</p>
              <p className="text-xs lg:text-sm text-white/60">Exercises</p>
            </div>
          </div>

          {/* Motivational Message */}
          <div className="bg-white/10 backdrop-blur-sm border-l-4 border-teal-400 rounded-lg lg:rounded-xl p-4 lg:p-5 mb-5 lg:mb-8">
            <p className="text-white/80 text-sm lg:text-base">
              "The only bad workout is the one that didn't happen. Great job showing up today!"
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex-1 py-3 lg:py-4 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-bold rounded-xl lg:rounded-2xl transition-all text-sm lg:text-base"
              >
                Back to Dashboard
              </button>
            )}
            <button
              onClick={() => {
                setCurrentView('ready');
                setCurrentExerciseIndex(0);
                setCurrentSet(1);
                setTimer(0);
                timerStartRef.current = null;
                setCompletedSets({});
                setTotalCaloriesBurned(0);
              }}
              className="flex-1 py-3 lg:py-4 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 text-white font-bold rounded-xl lg:rounded-2xl shadow-lg shadow-teal-500/25 transition-all text-sm lg:text-base"
            >
              Start New Workout
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render based on current view
  return (
    <>
      {currentView === 'ready' && <ReadyScreen />}
      {currentView === 'workout' && <WorkoutScreen />}
      {currentView === 'rest' && <RestScreen />}
      {currentView === 'complete' && <CompleteScreen />}
    </>
  );
}
