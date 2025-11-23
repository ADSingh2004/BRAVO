import { useState, useEffect } from 'react';
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

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Rest timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            setCurrentView('workout');
            return currentExercise.rest;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isResting, restTimer, currentExercise]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartWorkout = () => {
    setCurrentView('workout');
    setIsTimerRunning(true);
  };

  const handleCompleteSet = () => {
    const key = `${currentExerciseIndex}-${currentSet}`;
    setCompletedSets({ ...completedSets, [key]: true });
    setTotalCaloriesBurned(prev => prev + currentExercise.calories);

    if (currentSet < currentExercise.sets) {
      // More sets remaining
      setCurrentSet(prev => prev + 1);
      setRestTimer(currentExercise.rest);
      setIsResting(true);
      setCurrentView('rest');
    } else {
      // Exercise complete, move to next
      if (currentExerciseIndex < workoutPlan.exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSet(1);
        setRestTimer(60);
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
    setRestTimer(currentExercise.rest);
    setCurrentView('workout');
  };

  // Ready Screen
  const ReadyScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Dashboard</span>
          </button>
        )}
        
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{workoutPlan.name}</h1>
          <p className="text-gray-600">Ready to crush your workout?</p>
        </div>

        {/* Workout Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-teal-50 rounded-xl p-4 text-center">
            <Timer className="w-6 h-6 text-teal-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-teal-600">{workoutPlan.duration}</p>
            <p className="text-sm text-gray-600">Duration</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <Flame className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{workoutPlan.caloriesEstimate}</p>
            <p className="text-sm text-gray-600">Calories</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <Dumbbell className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{workoutPlan.exercises.length}</p>
            <p className="text-sm text-gray-600">Exercises</p>
          </div>
        </div>

        {/* Exercise List */}
        <div className="mb-8">
          <h3 className="font-bold text-gray-800 mb-4">Today's Exercises</h3>
          <div className="space-y-2">
            {workoutPlan.exercises.map((exercise, idx) => (
              <div key={exercise.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold">
                    {idx + 1}
                  </div>
                  <span className="font-medium text-gray-800">{exercise.name}</span>
                </div>
                <span className="text-sm text-gray-500">{exercise.sets} × {exercise.reps}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartWorkout}
          className="w-full py-5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-xl rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all"
        >
          <Play className="w-6 h-6" />
          Start Workout
        </button>
      </div>
    </div>
  );

  // Workout Screen
  const WorkoutScreen = () => (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
              <X className="w-6 h-6" onClick={() => setCurrentView('ready')} />
            </button>
            <div className="text-center">
              <p className="text-teal-100 text-sm">Workout Time</p>
              <p className="text-2xl font-bold">{formatTime(timer)}</p>
            </div>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentExerciseIndex + 1) / workoutPlan.exercises.length) * 100}%` }}
            />
          </div>
          <p className="text-center text-teal-100 text-sm mt-2">
            Exercise {currentExerciseIndex + 1} of {workoutPlan.exercises.length}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Exercise Info */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-6 text-center">
          <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Dumbbell className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-bold mb-4">{currentExercise.name}</h2>
          <p className="text-gray-400 text-lg mb-6">{currentExercise.instructions}</p>
          
          {/* Set Counter */}
          <div className="inline-block bg-gray-700 rounded-full px-8 py-4">
            <p className="text-gray-400 text-sm mb-1">Current Set</p>
            <p className="text-5xl font-bold text-teal-400">{currentSet}/{currentExercise.sets}</p>
          </div>

          {/* Reps */}
          <div className="mt-6 flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Target Reps</p>
              <p className="text-4xl font-bold">{currentExercise.reps}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Rest Time</p>
              <p className="text-4xl font-bold">{currentExercise.rest}s</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSkipExercise}
            className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all"
          >
            Skip Exercise
          </button>
          <button
            onClick={handleCompleteSet}
            className="flex-1 py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
          >
            <Check className="w-6 h-6" />
            Complete Set
          </button>
        </div>

        {/* Completed Sets Indicator */}
        <div className="mt-6 flex justify-center gap-2">
          {[...Array(currentExercise.sets)].map((_, idx) => (
            <div
              key={idx}
              className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold transition-all ${
                completedSets[`${currentExerciseIndex}-${idx + 1}`]
                  ? 'bg-teal-500 text-white'
                  : idx + 1 === currentSet
                  ? 'bg-teal-300 text-gray-800'
                  : 'bg-gray-700 text-gray-500'
              }`}
            >
              {idx + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Rest Screen
  const RestScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center text-white">
        <div className="mb-8">
          <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Timer className="w-16 h-16" />
          </div>
          <h1 className="text-5xl font-bold mb-4">Rest Time</h1>
          <p className="text-blue-100 text-xl">Take a breather, you're doing great!</p>
        </div>

        {/* Rest Timer */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-12 mb-8">
          <p className="text-8xl font-bold mb-4">{restTimer}</p>
          <p className="text-2xl text-blue-100">seconds</p>
        </div>

        {/* Next Exercise Preview */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 mb-8">
          <p className="text-blue-100 mb-2">Up Next</p>
          <p className="text-2xl font-bold">
            {currentSet < currentExercise.sets 
              ? `${currentExercise.name} - Set ${currentSet + 1}` 
              : currentExerciseIndex < workoutPlan.exercises.length - 1
              ? workoutPlan.exercises[currentExerciseIndex + 1].name
              : 'Workout Complete!'}
          </p>
        </div>

        {/* Skip Rest Button */}
        <button
          onClick={handleSkipRest}
          className="w-full max-w-md mx-auto py-5 bg-white text-blue-600 font-bold text-xl rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-3"
        >
          Skip Rest
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );

  // Complete Screen
  const CompleteScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-16 h-16 text-white" />
        </div>
        
        <h1 className="text-5xl font-bold text-gray-800 mb-2">Amazing Work!</h1>
        <p className="text-xl text-gray-600 mb-8">You crushed that workout! 💪</p>

        {/* Workout Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-teal-50 rounded-xl p-6">
            <Timer className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-teal-600">{formatTime(timer)}</p>
            <p className="text-sm text-gray-600">Duration</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-6">
            <Flame className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-orange-600">{totalCaloriesBurned}</p>
            <p className="text-sm text-gray-600">Calories</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-6">
            <Dumbbell className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-purple-600">{workoutPlan.exercises.length}</p>
            <p className="text-sm text-gray-600">Exercises</p>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-l-4 border-teal-500 rounded-lg p-6 mb-8">
          <p className="text-lg text-gray-700">
            "The only bad workout is the one that didn't happen. Great job showing up today!"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="flex-1 py-4 border-2 border-teal-500 text-teal-600 font-bold rounded-xl hover:bg-teal-50 transition-all"
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
              setCompletedSets({});
              setTotalCaloriesBurned(0);
            }}
            className="flex-1 py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg transition-all"
          >
            Start New Workout
          </button>
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
