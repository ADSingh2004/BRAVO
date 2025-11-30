import { Sparkles, Dumbbell, Apple, Brain, ChevronRight, Star, Users, Target, Zap } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-400 rounded-lg sm:rounded-xl p-1.5 sm:p-2">
              <Sparkles className="text-white" size={20} />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-white">BRAVO</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <a href="#features" className="hidden sm:block text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#about" className="hidden sm:block text-gray-300 hover:text-white transition-colors">About</a>
            <button 
              onClick={onLogin}
              className="bg-white/10 hover:bg-white/20 text-white px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl font-semibold transition-all border border-white/20 text-sm sm:text-base"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                <Zap className="text-yellow-400" size={14} />
                <span className="text-xs sm:text-sm text-gray-300">AI-Powered Fitness Coaching</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                Your Personal
                <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent"> AI Fitness </span>
                Coach
              </h1>
              <p className="text-base sm:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                <strong>B</strong>io-Adaptive <strong>R</strong>ecommendation <strong>A</strong>ssistant for <strong>V</strong>itality and <strong>O</strong>ptimization. 
                Get personalized workout plans, nutrition guidance, and real-time AI coaching to achieve your fitness goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <button 
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-teal-500 to-emerald-400 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-teal-500/25 transition-all flex items-center justify-center gap-2"
                >
                  Get Started Free
                  <ChevronRight size={20} />
                </button>
                <button 
                  onClick={onLogin}
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all border border-white/20"
                >
                  I Have an Account
                </button>
              </div>
              
              {/* Stats */}
              <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-8 mt-8 sm:mt-12">
                <div className="text-center">
                  <p className="text-xl sm:text-3xl font-bold text-white">10K+</p>
                  <p className="text-gray-400 text-xs sm:text-sm">Active Users</p>
                </div>
                <div className="w-px h-8 sm:h-12 bg-white/20"></div>
                <div className="text-center">
                  <p className="text-xl sm:text-3xl font-bold text-white">2.9K+</p>
                  <p className="text-gray-400 text-xs sm:text-sm">Exercises</p>
                </div>
                <div className="w-px h-8 sm:h-12 bg-white/20"></div>
                <div className="text-center">
                  <p className="text-xl sm:text-3xl font-bold text-white">8.7K+</p>
                  <p className="text-gray-400 text-xs sm:text-sm">Food Items</p>
                </div>
              </div>
            </div>
            
            {/* Hero Image/Graphic */}
            <div className="relative hidden lg:block">
              <div className="bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-sm border border-white/10">
                <div className="bg-white/10 rounded-2xl p-4 sm:p-6 mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full flex items-center justify-center">
                      <Brain className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-white font-semibold">BRAVO AI Coach</p>
                      <p className="text-gray-400 text-sm">Online • Ready to help</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded-xl p-3">
                      <p className="text-gray-300 text-sm">"What's a good alternative to push-ups?"</p>
                    </div>
                    <div className="bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-xl p-3">
                      <p className="text-white text-sm">Great question! Try wall push-ups, incline push-ups, or chest press with dumbbells. These target similar muscle groups... ✓ Verified</p>
                    </div>
                  </div>
                </div>
                
                {/* Floating Cards */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-xl">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="text-teal-500" size={24} />
                    <div>
                      <p className="font-bold text-gray-800">Today's Workout</p>
                      <p className="text-sm text-gray-500">45 min • 6 exercises</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-xl">
                  <div className="flex items-center gap-2">
                    <Apple className="text-red-500" size={24} />
                    <div>
                      <p className="font-bold text-gray-800">Nutrition Plan</p>
                      <p className="text-sm text-gray-500">2,400 cal • Balanced</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-20 px-4 sm:px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent"> Transform </span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto px-4">
              Powered by advanced RAG (Retrieval-Augmented Generation) technology for accurate, personalized fitness guidance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Feature 1 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-teal-500/50 transition-all group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-teal-500 to-emerald-400 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Brain className="text-white" size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">AI-Powered Coaching</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Get instant answers to your fitness questions with our RAG-powered AI that uses verified exercise and nutrition databases.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-teal-500/50 transition-all group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-500 to-pink-400 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Dumbbell className="text-white" size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Personalized Workouts</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Custom workout plans based on your goals, fitness level, and available time. From weight loss to muscle building.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-teal-500/50 transition-all group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-orange-500 to-red-400 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Apple className="text-white" size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Smart Nutrition</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Detailed meal plans with macro tracking. Get food alternatives and substitutes tailored to your dietary preferences.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-teal-500/50 transition-all group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Target className="text-white" size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Goal Tracking</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Set fitness goals and track your progress. Visual dashboards to keep you motivated on your journey.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-teal-500/50 transition-all group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-yellow-500 to-orange-400 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Star className="text-white" size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Verified Information</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                All recommendations are backed by our verified database of 2,900+ exercises and 8,700+ food items.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-teal-500/50 transition-all group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-green-500 to-teal-400 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Users className="text-white" size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Indian & Global Diets</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Nutrition plans that include Indian cuisine options alongside international diets. Dal, paneer, and more!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
            Built with Modern AI Technology
          </h2>
          <p className="text-gray-400 text-sm sm:text-lg mb-6 sm:mb-8 px-2">
            BRAVO uses Retrieval-Augmented Generation (RAG) with Google's Gemini AI to provide accurate, 
            contextual fitness advice. Our vector database contains thousands of verified exercises and 
            nutritional information to ensure you get the best recommendations.
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            <span className="bg-white/10 text-gray-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm">React + TypeScript</span>
            <span className="bg-white/10 text-gray-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm">Gemini AI</span>
            <span className="bg-white/10 text-gray-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm">ChromaDB</span>
            <span className="bg-white/10 text-gray-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm">Supabase</span>
            <span className="bg-white/10 text-gray-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm">TailwindCSS</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-r from-teal-600 to-emerald-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Transform Your Fitness Journey?
          </h2>
          <p className="text-teal-100 text-sm sm:text-lg mb-6 sm:mb-8 px-2">
            Join thousands of users who are achieving their fitness goals with BRAVO's AI-powered coaching.
          </p>
          <button 
            onClick={onGetStarted}
            className="bg-white text-teal-600 px-6 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
          >
            Start Your Journey
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 bg-black/40 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-teal-400" size={18} />
            <span className="text-white font-bold">BRAVO</span>
            <span className="text-gray-500">© 2025</span>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm text-center">
            Bio-Adaptive Recommendation Assistant for Vitality and Optimization
          </p>
        </div>
      </footer>
    </div>
  );
}
