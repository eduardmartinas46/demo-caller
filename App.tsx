import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { Phone, Globe, Linkedin, Twitter, MessageSquare, Sparkles } from 'lucide-react';
import Vapi from '@vapi-ai/web';
import PhoneInput, { getCountryCallingCode } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

// Initialize Vapi with the public key
const vapi = new Vapi('0db23f6b-f488-4db0-987f-47d90189ffc9');

// Define popular countries to show at the top
const popularCountries = ['US', 'GB', 'CA', 'AU'];

// Custom country compare function to sort popular countries first
const compareCountries = (a: string, b: string) => {
  const aPopular = popularCountries.includes(a);
  const bPopular = popularCountries.includes(b);
  
  if (aPopular && !bPopular) return -1;
  if (!aPopular && bPopular) return 1;
  return a.localeCompare(b);
};

function App() {
  const [visitorName, setVisitorName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [system, setSystem] = useState<string>('');
  const [firstMessage, setFirstMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchVisitor() {
      setLoading(true);
      const currentSlug = window.location.pathname.slice(1) || 'default';
      setSlug(currentSlug);

      const { data, error } = await supabase
        .from('visitors')
        .select('name, system, first_message, slug')
        .eq('slug', currentSlug)
        .maybeSingle();

      if (error) {
        console.error('Error fetching visitor:', error);
        setNotFound(true);
        setLoading(false);
        return;
      }

      if (data) {
        setVisitorName(data.name);
        setSystem(data.system || '');
        setFirstMessage(data.first_message || '');
        setNotFound(false);
        // Update page title when visitor name is fetched
        document.title = `Demo for ${data.name}`;
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }

    vapi.on('call-start', () => {
      console.log('Call has started');
      setIsCalling(true);
      setIsSubmitting(false);
    });

    vapi.on('call-end', () => {
      console.log('Call has ended');
      setIsCalling(false);
      setIsSubmitting(false);
    });

    vapi.on('error', (e) => {
      console.error('Vapi error:', e);
      setIsCalling(false);
      setIsSubmitting(false);
    });

    fetchVisitor();

    return () => {
      vapi.removeAllListeners();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    if (!phoneNumber) {
      setError('Please enter a valid phone number');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('<Webhook_URL>', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phone: phoneNumber,
          slug: slug
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate call');
      }

      setSuccess("Great! You'll receive a call within the next 15 seconds.");
      setPhoneNumber('');
    } catch (error) {
      console.error('Error making call:', error);
      setError('Failed to initiate call. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBrowserTest = async () => {
    try {
      setIsSubmitting(true);
      if (isCalling) {
        await vapi.stop();
      } else {
        const assistantOverrides = {
          firstMessage: firstMessage || undefined,
          model: {
            provider: "openai",
            model: "gpt-4o-mini",
            emotionRecognitionEnabled: true,
            maxTokens: 250,
            messages: [
              {
                role: "system",
                content: system || undefined
              }
            ]
          }
        };
        await vapi.start('a284262b-7dcb-4c87-8409-d97ccae6fb2c', assistantOverrides);
      }
    } catch (error) {
      console.error('Error with browser call:', error);
      setIsCalling(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePhoneForm = () => {
    setShowPhoneForm(!showPhoneForm);
    if (showPhoneForm) {
      setPhoneNumber('');
      setError('');
      setSuccess('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-xl font-medium text-slate-600">
          <div className="w-6 h-6 border-2 border-[#0095C7] border-t-transparent rounded-full animate-spin"></div>
          Loading...
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-8 max-w-md mx-auto px-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-rose-100 to-orange-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-rose-500" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-black font-antonio">Page Not Found</h1>
            <p className="text-xl text-gray-600 font-dm-sans">The requested page does not exist.</p>
          </div>
          <a
            href="<My_Website_URL>"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0095C7] text-white rounded-2xl font-semibold hover:bg-[#007BA3] transition-all duration-300 shadow-lg shadow-[#0095C7]/25 hover:shadow-xl hover:shadow-[#0095C7]/30 transform hover:-translate-y-0.5"
          >
            <Globe size={20} />
            Go back to main page
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 font-dm-sans">
      <div className="relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-slate-50/90"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-gray-200/30 to-slate-200/30 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-32 sm:px-6 lg:px-8 text-center">
          <div className="space-y-12 max-w-4xl mx-auto">
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl font-bold leading-tight text-black font-sora">
                Hey{' '}
                <span className="text-[#0095C7]">
                  {visitorName ? visitorName : '...'}
                </span>
                <span className="text-gray-400">,</span>
              </h1>
              <div className="w-24 h-1 bg-[#0095C7] mx-auto rounded-full"></div>
            </div>
            
            <div className="space-y-8 max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl leading-relaxed text-gray-700 font-medium">
                I built a tool that{' '}
                <span className="text-[#0095C7] font-semibold">
                  answers your customer calls
                </span>{' '}
                for you.
              </p>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-white/50">
                <p className="text-lg leading-relaxed text-gray-600">
                  It's a robot that talks to your customers on the phone, answers their questions, and helps them get what they need — automatically.
                </p>
              </div>
              
              <p className="text-xl font-semibold text-black">
                Choose how you'd like to try it:
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-lg mx-auto">
              <button
                onClick={togglePhoneForm}
                className={`group w-full sm:w-1/2 px-8 py-5 bg-[#0095C7] text-white rounded-2xl font-semibold flex items-center justify-center gap-3 hover:bg-[#007BA3] transition-all duration-300 shadow-lg shadow-[#0095C7]/25 hover:shadow-xl hover:shadow-[#0095C7]/30 transform hover:-translate-y-0.5 ${showPhoneForm ? 'ring-2 ring-[#0095C7] ring-offset-2' : ''}`}
              >
                <Phone size={22} className="group-hover:rotate-12 transition-transform duration-300" />
                Call Me
              </button>
              <button
                onClick={handleBrowserTest}
                disabled={isSubmitting}
                className="group w-full sm:w-1/2 px-8 py-5 bg-black text-white rounded-2xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-800 transition-all duration-300 shadow-lg shadow-black/25 hover:shadow-xl hover:shadow-black/30 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <MessageSquare size={22} className="group-hover:scale-110 transition-transform duration-300" />
                {isSubmitting ? 'Connecting...' : isCalling ? 'Stop Call' : 'Test in Browser'}
              </button>
            </div>

            {showPhoneForm && (
              <div className="animate-fade-in">
                <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6 bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-white/50">
                  <div className="space-y-4">
                    <div className="phone-input-container">
                      <PhoneInput
                        international
                        countryCallingCodeEditable={false}
                        defaultCountry="US"
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        className="w-full"
                        countries={Object.keys(getCountryCallingCode).sort(compareCountries)}
                      />
                    </div>
                    {error && (
                      <div className="flex items-center gap-2 text-red-600 text-sm font-medium bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                        <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="flex items-center gap-2 text-[#0095C7] text-sm font-medium bg-blue-50 px-4 py-3 rounded-xl border border-blue-200">
                        <div className="w-1 h-4 bg-[#0095C7] rounded-full"></div>
                        {success}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group w-full px-8 py-4 bg-[#0095C7] text-white rounded-2xl font-semibold flex items-center justify-center gap-3 hover:bg-[#007BA3] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#0095C7]/25 hover:shadow-xl hover:shadow-[#0095C7]/30 transform hover:-translate-y-0.5 disabled:transform-none"
                    >
                      <Phone size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                      {isSubmitting ? 'Initiating Call...' : 'Call Now'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        <footer className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto flex justify-center items-center space-x-8">
            <a 
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group text-gray-500 hover:text-[#0095C7] transition-all duration-300 flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/80 hover:shadow-lg hover:shadow-slate-200/50"
            >
              <Linkedin size={20} className="group-hover:scale-110 transition-transform duration-300" />
              <span className="hidden sm:inline font-medium">LinkedIn</span>
            </a>
            <a 
              href="<My_Website_URL>"
              target="_blank"
              rel="noopener noreferrer"
              className="group text-gray-500 hover:text-[#0095C7] transition-all duration-300 flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/80 hover:shadow-lg hover:shadow-slate-200/50"
            >
              <Globe size={20} className="group-hover:scale-110 transition-transform duration-300" />
              <span className="hidden sm:inline font-medium">Website</span>
            </a>
            <a 
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group text-gray-500 hover:text-[#0095C7] transition-all duration-300 flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/80 hover:shadow-lg hover:shadow-slate-200/50"
            >
              <Twitter size={20} className="group-hover:scale-110 transition-transform duration-300" />
              <span className="hidden sm:inline font-medium">Twitter</span>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;