import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDarkMode } from './hooks/useDarkMode';
import { useNotifications } from './hooks/useNotifications';
import { useWorkoutStreak } from './hooks/useWorkoutStreak';
import { SocialView } from './components/social/SocialView';
import { onAuthStateChanged, getCurrentUser, isNewUser } from './services/firebaseAuthService';
import { User as FirebaseUser } from 'firebase/auth';
import { DashboardView } from './components/dashboard/DashboardView';

// Components
import { Header } from './components/common/Header';
import { TabNavigation } from './components/common/TabNavigation';
import { ToastContainer } from './components/common/Toast';
import LoginScreen from './components/auth/LoginScreen';

// Onboarding Steps
import { NameStep } from './components/onboarding/steps/NameStep';
import { HeightStep } from './components/onboarding/steps/HeightStep';
import { WeightStep } from './components/onboarding/steps/WeightStep';
import { AgeStep } from './components/onboarding/steps/AgeStep';
import { GenderStep } from './components/onboarding/steps/GenderStep';
import { GoalStep } from './components/onboarding/steps/GoalStep';
import { ActivityStep } from './components/onboarding/steps/ActivityStep';

// Tab Components
import { ChatInterface } from './components/chat/ChatInterface';
import { MealsList } from './components/meals/MealsList';
import { WorkoutsList } from './components/gym/WorkoutsList';
import { ProfileView } from './components/profile/ProfileView';

// Types and Services
import { User, OnboardingStep, AppTab, ChatMessage, MacroTargets, Meal, Workout, WorkoutPreset, MealPreset, SocialTab } from './types';
import { PreferenceLearnedEvent } from './types/preferences';
import { authService, chatService, mealService, workoutService } from './services/api';
import { MacroCalculator } from './services/macroCalculator';

function App() {
  // Import useWorkoutStreak at the top level
  
  // Date reviver function to convert createdAt string back to Date object
  const userReviver = (key: string, value: any) => {
    if (key === 'createdAt' && typeof value === 'string') {
      return new Date(value);
    }
    // Ensure numeric properties are properly converted to numbers
    if (key === 'height' || key === 'weight' || key === 'age') {
      return typeof value === 'string' ? parseFloat(value) || 0 : value;
    }
    return value;
  };

  // Meal reviver function to convert date string back to Date object
  const mealReviver = (key: string, value: any) => {
    if (key === 'date' && typeof value === 'string') {
      return new Date(value);
    }
    return value;
  };

  // Workout reviver function to convert date string back to Date object
  const workoutReviver = (key: string, value: any) => {
    if (key === 'date' && typeof value === 'string') {
      return new Date(value);
    }
    return value;
  };

  // Preset reviver function to convert date string back to Date object
  const presetReviver = (key: string, value: any) => {
    if (key === 'createdAt' && typeof value === 'string') {
      return new Date(value);
    }
    return value;
  };

  // Firebase auth state
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Core state
  const [user, setUser] = useLocalStorage<User | null>('user', null, userReviver);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('name');
  const [activeTab, setActiveTab] = useState<AppTab>('chat');
  const [activeSocialTab, setActiveSocialTab] = useState<SocialTab>('friends');
  const [darkMode, toggleDarkMode] = useDarkMode();
  const { notifications, addNotification, removeNotification } = useNotifications();

  // Macro targets
  const [macroTargets, setMacroTargets] = useState<MacroTargets>({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 67,
    fiber: 28,
    sugar: 50,
  });

  // Meals state for editing
  const [meals, setMeals] = useLocalStorage<Meal[]>('meals', [], mealReviver);
  
  // Workouts state for editing
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>('workouts', [], workoutReviver);

  // Workout presets state
  const [workoutPresets, setWorkoutPresets] = useLocalStorage<WorkoutPreset[]>('workoutPresets', [], presetReviver);

  // Meal presets state
  const [mealPresets, setMealPresets] = useLocalStorage<MealPreset[]>('mealPresets', [], presetReviver);

  // Onboarding data
  const [onboardingData, setOnboardingData] = useState({
    name: '',
    height: 175,
    weight: 70,
    age: 25,
    gender: 'male' as User['gender'],
    goal: 'maintain' as User['goal'],
    activityLevel: 'moderate' as User['activityLevel'],
  });

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  // Date filters
  const [selectedMealDate, setSelectedMealDate] = useState(new Date());
  const [selectedWorkoutDate, setSelectedWorkoutDate] = useState(new Date());

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      console.log("Auth state changed:", user ? user.email : "No user");
      setFirebaseUser(user);
      setAuthLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Handle user profile creation or retrieval when Firebase user changes
  useEffect(() => {
    const handleUserProfile = async () => {
      console.log("handleUserProfile called - Firebase user:", firebaseUser?.email, "Local user:", user?.email);
      if (firebaseUser && !user) {
        try {
          console.log("Firebase user exists but no local user profile, checking if new user");
          // Check if this is a new user or returning user with no local storage
          const isUserNew = isNewUser(firebaseUser);
          console.log("Is new user:", isUserNew);
          
          if (isUserNew) {
            // New user - will go through onboarding
            console.log("New user will go through onboarding");
            // No need to do anything here, the onboarding flow will handle it
          } else {
            // Returning user but no local storage - try to fetch profile
            console.log("Returning user, fetching profile");
            try {
              // In a real app, this would be an API call to your backend
              // For now, we'll create a basic profile
              console.log("Creating user profile with data:", {
                name: firebaseUser.displayName || 'User',
                email: firebaseUser.email || '',
                firebaseUid: firebaseUser.uid,
                height: 175,
                weight: 70,
                age: 25,
                gender: 'male',
                goal: 'maintain',
                activityLevel: 'moderate',
              });
              const userProfile = await authService.register({
                name: firebaseUser.displayName || 'User',
                email: firebaseUser.email || '',
                firebaseUid: firebaseUser.uid,
                height: 175,
                weight: 70,
                age: 25,
                gender: 'male',
                goal: 'maintain',
                activityLevel: 'moderate',
              });
              console.log("User profile created successfully:", userProfile);
              
              setUser(userProfile);
              console.log("User state updated with profile");
              addNotification('Welcome back!', 'success');
            } catch (error) {
              console.error("Failed to fetch user profile:", error instanceof Error ? error.message : error);
              addNotification('Failed to load your profile. Please try again.', 'error');
            }
          }
        } catch (error) {
          console.error("Error handling user profile:", error instanceof Error ? error.message : error);
        }
      }
    };
    
    handleUserProfile();
  }, [firebaseUser, user, addNotification, setUser]);

  // Calculate macro targets when user changes
  useEffect(() => {
    if (user) {
      const targets = MacroCalculator.calculateMacroTargets(user);
      setMacroTargets(targets);
    }
  }, [user]);

  // Initialize chat messages
  useEffect(() => {
    if (user && chatMessages.length === 0) {
      setChatMessages(chatService.getChatHistory());
    }
  }, [user, chatMessages.length]);

  // Onboarding handlers
  const handleOnboardingNext = () => {
    const steps: OnboardingStep[] = ['name', 'height', 'weight', 'age', 'gender', 'goal', 'activity'];
    const currentIndex = steps.indexOf(onboardingStep);
    
    if (currentIndex < steps.length - 1) {
      setOnboardingStep(steps[currentIndex + 1]);
    } else {
      completeOnboarding();
    }
  };

  const handleOnboardingBack = () => {
    const steps: OnboardingStep[] = ['name', 'height', 'weight', 'age', 'gender', 'goal', 'activity'];
    const currentIndex = steps.indexOf(onboardingStep);
    
    if (currentIndex > 0) {
      setOnboardingStep(steps[currentIndex - 1]);
    }
  };

  const completeOnboarding = async () => {
    try {
      if (!firebaseUser) {
        addNotification('Authentication error. Please sign in again.', 'error');
        return;
      }

      // In a real app, this would be an API call to your PostgreSQL backend
      // to create or update the user profile with the onboarding data
      console.log('Sending user profile data to backend:', {
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        ...onboardingData
      });
      
      // For now, we'll simulate the backend response with our local mock service
      const newUser = await authService.register({
        name: onboardingData.name,
        email: firebaseUser.email || 'user@example.com',
        firebaseUid: firebaseUser.uid,
        ...onboardingData,
      });
      
      setUser(newUser);
      addNotification('Welcome to your fitness journey! 🎉', 'success');
    } catch (error) {
      addNotification('Failed to complete setup. Please try again.', 'error');
    }
  };

  // Enhanced chat handler with preference learning
  const handleSendMessage = async (content: string): Promise<{ learnedPreferences?: PreferenceLearnedEvent[] }> => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsLoadingChat(true);

    try {
      const response = await chatService.sendMessage(content);
      const { learnedPreferences, ...aiMessage } = response;
      
      setChatMessages(prev => [...prev, aiMessage]);
      
      if (aiMessage.type === 'food') {
        addNotification('Meal logged successfully! 🍽️', 'success');
      } else if (aiMessage.type === 'workout') {
        addNotification('Workout logged successfully! 💪', 'success');
      }

      return { learnedPreferences };
    } catch (error) {
      addNotification('Failed to get AI response. Please try again.', 'error');
      return {};
    } finally {
      setIsLoadingChat(false);
    }
  };

  // User update handler
  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    addNotification('Profile updated successfully! ✅', 'success');
  };

  // Meal handlers
  const handleAddMeal = (newMeal: Omit<Meal, 'id'>) => {
    const meal: Meal = {
      ...newMeal,
      id: Date.now().toString(),
    };
    setMeals(prevMeals => [...prevMeals, meal]);
    addNotification('Meal logged successfully! 🍽️', 'success');

    // Create or update meal preset
    const existingPreset = mealPresets.find(preset => 
      preset.name.toLowerCase() === meal.name.toLowerCase() && 
      preset.mealType === meal.mealType
    );

    if (existingPreset) {
      // Update usage count
      setMealPresets(prevPresets => 
        prevPresets.map(preset => 
          preset.id === existingPreset.id 
            ? { ...preset, usageCount: preset.usageCount + 1 }
            : preset
        )
      );
    } else {
      // Create new preset
      const newPreset: MealPreset = {
        id: `preset-${Date.now()}`,
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        fiber: meal.fiber,
        sugar: meal.sugar,
        mealType: meal.mealType,
        image: meal.image,
        createdAt: new Date(),
        usageCount: 1,
      };
      setMealPresets(prevPresets => [...prevPresets, newPreset]);
    }
  };

  const handleUpdateMeal = (updatedMeal: Meal) => {
    setMeals(prevMeals => 
      prevMeals.map(meal => meal.id === updatedMeal.id ? updatedMeal : meal)
    );
    addNotification('Meal updated successfully! ✅', 'success');
  };

  const handleDeleteMeal = (mealId: string) => {
    setMeals(prevMeals => prevMeals.filter(meal => meal.id !== mealId));
    addNotification('Meal deleted successfully! 🗑️', 'success');
  };

  // Meal preset handlers
  const handleAddMealFromPreset = (preset: MealPreset, selectedDate: Date) => {
    const newMeal: Omit<Meal, 'id'> = {
      name: preset.name,
      calories: preset.calories,
      protein: preset.protein,
      carbs: preset.carbs,
      fat: preset.fat,
      fiber: preset.fiber,
      sugar: preset.sugar,
      mealType: preset.mealType,
      image: preset.image,
      date: selectedDate,
    };
    
    handleAddMeal(newMeal);
    
    // Update usage count
    setMealPresets(prevPresets => 
      prevPresets.map(p => 
        p.id === preset.id 
          ? { ...p, usageCount: p.usageCount + 1 }
          : p
      )
    );
  };

  const handleDeleteMealPreset = (presetId: string) => {
    setMealPresets(prevPresets => prevPresets.filter(preset => preset.id !== presetId));
    addNotification('Meal preset deleted! 🗑️', 'success');
  };

  // Workout handlers
  const handleAddWorkout = (newWorkout: Omit<Workout, 'id'>) => {
    const workout: Workout = {
      ...newWorkout,
      id: Date.now().toString(),
    };
    setWorkouts(prevWorkouts => [...prevWorkouts, workout]);
    addNotification('Workout logged successfully! 💪', 'success');
  };

  const handleUpdateWorkout = (updatedWorkout: Workout) => {
    setWorkouts(prevWorkouts => 
      prevWorkouts.map(workout => workout.id === updatedWorkout.id ? updatedWorkout : workout)
    );
    addNotification('Workout updated successfully! ✅', 'success');
  };

  const handleDeleteWorkout = (workoutId: string) => {
    setWorkouts(prevWorkouts => prevWorkouts.filter(workout => workout.id !== workoutId));
    addNotification('Workout deleted successfully! 🗑️', 'success');
  };

  // Workout preset handlers
  const handleAddPreset = (newPreset: Omit<WorkoutPreset, 'id' | 'createdAt'>) => {
    const preset: WorkoutPreset = {
      ...newPreset,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setWorkoutPresets(prevPresets => [...prevPresets, preset]);
    addNotification('Workout preset created! 📋', 'success');
  };

  const handleUpdatePreset = (updatedPreset: WorkoutPreset) => {
    setWorkoutPresets(prevPresets => 
      prevPresets.map(preset => preset.id === updatedPreset.id ? updatedPreset : preset)
    );
    addNotification('Preset updated successfully! ✅', 'success');
  };

  const handleDeletePreset = (presetId: string) => {
    setWorkoutPresets(prevPresets => prevPresets.filter(preset => preset.id !== presetId));
    addNotification('Preset deleted successfully! 🗑️', 'success');
  };

  // Get filtered meals for selected date
  const filteredMeals = useMemo(() => {
    const storedMeals = mealService.getMeals(selectedMealDate);
    const userMeals = meals.filter(meal => 
      meal.date.toDateString() === selectedMealDate.toDateString()
    );
    return [...storedMeals, ...userMeals];
  }, [meals, selectedMealDate]);

  // Get filtered workouts for selected date
  const filteredWorkouts = useMemo(() => {
    const storedWorkouts = workoutService.getWorkouts(selectedWorkoutDate);
    const userWorkouts = workouts.filter(workout => 
      workout.date.toDateString() === selectedWorkoutDate.toDateString()
    );
    return [...storedWorkouts, ...userWorkouts];
  }, [workouts, selectedWorkoutDate]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-purple-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // If not signed in, show login screen
  if (!firebaseUser) {
    return <LoginScreen />;
  }

  // If no user profile, show onboarding
  if (!user) {
    const updateOnboardingData = (key: keyof typeof onboardingData, value: any) => {
      setOnboardingData(prev => ({ ...prev, [key]: value }));
    };

    switch (onboardingStep) {
      case 'name':
        return (
          <NameStep
            value={onboardingData.name}
            onChange={(name) => updateOnboardingData('name', name)}
            onNext={handleOnboardingNext}
          />
        );
      case 'height':
        return (
          <HeightStep
            value={onboardingData.height}
            onChange={(height) => updateOnboardingData('height', height)}
            onNext={handleOnboardingNext}
            onBack={handleOnboardingBack}
          />
        );
      case 'weight':
        return (
          <WeightStep
            value={onboardingData.weight}
            onChange={(weight) => updateOnboardingData('weight', weight)}
            onNext={handleOnboardingNext}
            onBack={handleOnboardingBack}
          />
        );
      case 'age':
        return (
          <AgeStep
            value={onboardingData.age}
            onChange={(age) => updateOnboardingData('age', age)}
            onNext={handleOnboardingNext}
            onBack={handleOnboardingBack}
          />
        );
      case 'gender':
        return (
          <GenderStep
            value={onboardingData.gender}
            onChange={(gender) => updateOnboardingData('gender', gender)}
            onNext={handleOnboardingNext}
            onBack={handleOnboardingBack}
          />
        );
      case 'goal':
        return (
          <GoalStep
            value={onboardingData.goal}
            onChange={(goal) => updateOnboardingData('goal', goal)}
            onNext={handleOnboardingNext}
            onBack={handleOnboardingBack}
          />
        );
      case 'activity':
        return (
          <ActivityStep
            value={onboardingData.activityLevel}
            onChange={(activityLevel) => updateOnboardingData('activityLevel', activityLevel)}
            onNext={handleOnboardingNext}
            onBack={handleOnboardingBack}
          />
        );
      default:
        return null;
    }
  }

  // Main app content
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'chat': return 'AI Assistant';
      case 'meals': return 'Meal Tracker';
      case 'gym': return 'Workout Log';
      case 'social': return 'Friends & Social';
      default: return 'Vital Sync';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            user={user}
            macroTargets={macroTargets}
            meals={filteredMeals}
            workouts={filteredWorkouts}
          />
        );
      case 'chat':
        return (
          <ChatInterface
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            isLoading={isLoadingChat}
          />
        );
      case 'meals':
        return (
          <MealsList
            meals={filteredMeals}
            selectedDate={selectedMealDate}
            onDateChange={setSelectedMealDate}
            macroTargets={macroTargets}
            onAddMeal={handleAddMeal}
            onUpdateMeal={handleUpdateMeal}
            onDeleteMeal={handleDeleteMeal}
            mealPresets={mealPresets}
            onAddMealFromPreset={handleAddMealFromPreset}
            onDeleteMealPreset={handleDeleteMealPreset}
          />
        );
      case 'gym':
        return (
          <WorkoutsList
            workouts={filteredWorkouts}
            selectedDate={selectedWorkoutDate}
            onDateChange={setSelectedWorkoutDate}
            onAddWorkout={handleAddWorkout}
            onUpdateWorkout={handleUpdateWorkout}
            onDeleteWorkout={handleDeleteWorkout}
            presets={workoutPresets}
            onAddPreset={handleAddPreset}
            onUpdatePreset={handleUpdatePreset}
            onDeletePreset={handleDeletePreset}
          />
        );
      case 'social':
        return (
          <SocialView 
            activeSocialTab={activeSocialTab}
            onSocialTabChange={setActiveSocialTab}
            onBack={() => setActiveTab('chat')}
          />
        );
      case 'profile':
        return (
          <ProfileView
            user={user}
            macroTargets={macroTargets}
            onEditProfile={() => {}}
            onUpdateUser={handleUpdateUser}
            workouts={filteredWorkouts}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex justify-center">
      <div className="w-full max-w-md relative border-x border-gray-200 dark:border-gray-700 min-h-screen">
      <Header
        title={getTabTitle()}
        user={user}
        onProfileClick={() => setActiveTab('profile')}
      />
      
      <main className="pb-0">
        {renderTabContent()}
      </main>
      </div>
      
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <ToastContainer
        notifications={notifications}
        onClose={removeNotification}
      />
    </div>
  );
}

export default App;