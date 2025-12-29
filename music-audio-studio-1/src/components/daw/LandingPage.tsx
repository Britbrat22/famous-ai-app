import React, { useState } from 'react';
import {
  Play,
  Mic2,
  Wand2,
  Music,
  Sliders,
  Download,
  Upload,
  Sparkles,
  Zap,
  Volume2,
  Radio,
  ChevronRight,
  Check,
  ArrowRight,
  Headphones,
  Layers,
  Share2,
} from 'lucide-react';

interface LandingPageProps {
  onStartProject: () => void;
  heroImage: string;
  waveImage: string;
}

const FEATURES = [
  {
    icon: Layers,
    title: 'Multi-Track Timeline',
    description: 'Edit up to 12 tracks with full waveform visualization, snap-to-grid, and infinite zoom.',
    color: '#00d4ff',
  },
  {
    icon: Mic2,
    title: 'Browser Recording',
    description: 'Record vocals directly in your browser with count-in metronome and punch-in recording.',
    color: '#7fff00',
  },
  {
    icon: Wand2,
    title: 'AI Vocal Cleanup',
    description: 'One-click noise removal, de-essing, auto-leveling, and clarity enhancement.',
    color: '#b24bf3',
  },
  {
    icon: Music,
    title: 'AI Beat Generation',
    description: 'Generate beats that match your vocals\' tempo, key, and mood across 8 genres.',
    color: '#ff6b6b',
  },
  {
    icon: Sliders,
    title: 'Smart Mixing',
    description: 'Auto-balance levels, detect frequency conflicts, and optimize stereo width.',
    color: '#ffd93d',
  },
  {
    icon: Volume2,
    title: 'AI Mastering',
    description: 'One-click mastering with presets for Spotify, Apple Music, YouTube, and more.',
    color: '#20c997',
  },
];

const WORKFLOW_STEPS = [
  {
    step: 1,
    title: 'Upload or Record',
    description: 'Drag and drop your audio files or record vocals directly in your browser.',
    icon: Upload,
  },
  {
    step: 2,
    title: 'Edit & Arrange',
    description: 'Cut, trim, move, and loop clips on a professional timeline with waveform display.',
    icon: Layers,
  },
  {
    step: 3,
    title: 'AI Enhancement',
    description: 'Clean vocals, generate matching beats, and let AI handle the technical mixing.',
    icon: Sparkles,
  },
  {
    step: 4,
    title: 'Master & Export',
    description: 'Apply one-click mastering and export radio-ready tracks in WAV or MP3.',
    icon: Download,
  },
];

const TESTIMONIALS = [
  {
    name: 'Alex Rivera',
    role: 'Independent Artist',
    quote: 'I went from raw vocals to a finished track in under an hour. The AI beat generation is incredible.',
    avatar: 'AR',
  },
  {
    name: 'Sarah Chen',
    role: 'Producer',
    quote: 'The smart mixing feature saved me hours of work. It\'s like having a professional engineer on call.',
    avatar: 'SC',
  },
  {
    name: 'Marcus Johnson',
    role: 'Podcaster',
    quote: 'The vocal cleanup is magic. Background noise gone, voice crystal clear. Game changer.',
    avatar: 'MJ',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartProject,
  heroImage,
  waveImage,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b24bf3] to-[#00d4ff] flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              StudioAI
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#workflow" className="text-gray-400 hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              Sign In
            </button>
            <button
              onClick={onStartProject}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#b24bf3] to-[#00d4ff] text-white font-medium hover:opacity-90 transition-opacity"
            >
              Open Studio
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#b24bf3]/10 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#b24bf3]/20 rounded-full blur-[128px]" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#00d4ff]/20 rounded-full blur-[128px]" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Sparkles className="w-4 h-4 text-[#b24bf3]" />
              <span className="text-sm text-gray-300">AI-Powered Music Production</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
                Studio-Quality Music
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00d4ff] via-[#b24bf3] to-[#ff6b6b] bg-clip-text text-transparent">
                In Your Browser
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              From raw vocals to radio-ready tracks. Upload, edit, and let AI handle the beat creation, 
              mixing, and mastering. No downloads, no experience required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onStartProject}
                className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#b24bf3] to-[#00d4ff] text-white font-semibold text-lg hover:opacity-90 transition-all shadow-lg shadow-[#b24bf3]/25"
              >
                <Play className="w-5 h-5" />
                Start Creating Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center gap-2 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors">
                <Headphones className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10" />
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-[#b24bf3]/10">
              <img
                src={heroImage}
                alt="StudioAI Interface"
                className="w-full"
              />
            </div>

            {/* Floating elements */}
            <div className="absolute -left-4 top-1/4 bg-[#1a1a1a] rounded-xl p-4 border border-white/10 shadow-xl animate-float hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#7fff00]/20 flex items-center justify-center">
                  <Wand2 className="w-5 h-5 text-[#7fff00]" />
                </div>
                <div>
                  <div className="text-sm font-medium">Vocals Cleaned</div>
                  <div className="text-xs text-gray-500">Noise removed, clarity enhanced</div>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 top-1/3 bg-[#1a1a1a] rounded-xl p-4 border border-white/10 shadow-xl animate-float-delayed hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#b24bf3]/20 flex items-center justify-center">
                  <Music className="w-5 h-5 text-[#b24bf3]" />
                </div>
                <div>
                  <div className="text-sm font-medium">Beat Generated</div>
                  <div className="text-xs text-gray-500">Trap • 128 BPM • A minor</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to Create
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Professional tools powered by AI, designed for creators of all skill levels.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.04]"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-24 bg-gradient-to-b from-transparent via-[#b24bf3]/5 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              From Idea to Release in Minutes
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our streamlined workflow gets you from raw audio to finished track faster than ever.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WORKFLOW_STEPS.map((step, index) => (
              <div key={index} className="relative">
                {index < WORKFLOW_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-[#b24bf3]/50 to-transparent" />
                )}
                <div className="text-center">
                  <div className="relative inline-flex mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#b24bf3]/20 to-[#00d4ff]/20 flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-[#b24bf3]" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#b24bf3] text-white text-sm font-bold flex items-center justify-center">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waveform visual section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img src={waveImage} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Make Your First Track?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Join thousands of creators using AI to produce professional music.
          </p>
          <button
            onClick={onStartProject}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-white text-black font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            <Zap className="w-5 h-5" />
            Launch Studio
          </button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Loved by Creators
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5"
              >
                <p className="text-gray-300 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#b24bf3] to-[#00d4ff] flex items-center justify-center text-sm font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-gradient-to-b from-transparent to-[#0f0f0f]">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-400 mb-8">
            Get notified about new features and updates.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#b24bf3]"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-[#b24bf3] text-white font-medium hover:bg-[#9b3dd3] transition-colors flex items-center gap-2"
            >
              {subscribed ? <Check className="w-5 h-5" /> : 'Subscribe'}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b24bf3] to-[#00d4ff] flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">StudioAI</span>
              </div>
              <p className="text-gray-500 text-sm">
                AI-powered music production in your browser.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Updates</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 StudioAI. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite 1.5s;
        }
      `}</style>
    </div>
  );
};
