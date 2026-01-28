import { useState, useRef, useEffect } from 'react';

type Message = {
  id: number;
  type: 'bot' | 'user';
  text: string;
};

type Step =
  | 'ask_an'
  | 'ask_a'
  | 'ask_um'
  | 'show_name'
  | 'ask_ingredients'
  | 'ask_more_ingredients'
  | 'show_recipe'
  | 'done';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function CocktailChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      type: 'bot',
      text: 'Welcome to the an I Cocktail Recipe Generator! How many "an"s are in the name of the cocktail you\'d like? (enter any integer)',
    },
  ]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState<Step>('ask_an');
  const [anCount, setAnCount] = useState(0);
  const [aCount, setACount] = useState(0);
  const [cocktailName, setCocktailName] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (type: 'bot' | 'user', text: string) => {
    setMessages((prev) => [...prev, { id: prev.length, type, text }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userInput = input.trim();
    addMessage('user', userInput);
    setInput('');

    setTimeout(() => processInput(userInput), 300);
  };

  const processInput = (userInput: string) => {
    switch (step) {
      case 'ask_an': {
        const num = parseInt(userInput);
        if (isNaN(num)) {
          addMessage('bot', 'That\'s not a number! Please enter an integer.');
          break;
        }
        setAnCount(Math.abs(num) % 20);
        addMessage('bot', 'How many "a"s are in the name of the cocktail you\'d like? (enter any integer)');
        setStep('ask_a');
        break;
      }
      case 'ask_a': {
        const num = parseInt(userInput);
        if (isNaN(num)) {
          addMessage('bot', 'That\'s not a number! Please enter an integer.');
          break;
        }
        setACount(Math.abs(num) % 20);
        addMessage('bot', 'How many "um"s are in the name of the cocktail you\'d like? (enter any integer)');
        setStep('ask_um');
        break;
      }
      case 'ask_um': {
        const num = parseInt(userInput);
        if (isNaN(num)) {
          addMessage('bot', 'That\'s not a number! Please enter an integer.');
          break;
        }
        const finalUmCount = Math.abs(num) % 20;

        const nameParts = [
          ...Array(anCount).fill('an'),
          ...Array(aCount).fill('a'),
          ...Array(finalUmCount).fill('um'),
        ];
        const shuffled = shuffleArray(nameParts);
        const name = shuffled.join(' ') + ' the drink';
        setCocktailName(name);

        addMessage(
          'bot',
          `Ok, copy that. It sounds like you want ${name}. Let's see what you have for ingredients and I bet we can figure out how to cook up ${name}.`
        );
        setTimeout(() => {
          addMessage('bot', 'What ingredients do you have? (list them separated by commas)');
          setStep('ask_ingredients');
        }, 500);
        setStep('show_name');
        break;
      }
      case 'ask_ingredients': {
        const newIngredients = userInput.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
        if (newIngredients.length === 0) {
          addMessage('bot', 'Please enter at least one ingredient, separated by commas.');
          break;
        }
        setIngredients(newIngredients);
        addMessage('bot', 'Any more ingredients? (comma separated, or just say "no")');
        setStep('ask_more_ingredients');
        break;
      }
      case 'ask_more_ingredients': {
        const lowerInput = userInput.toLowerCase().trim();
        let allIngredients = [...ingredients];

        if (lowerInput !== 'no' && lowerInput !== 'n' && lowerInput !== 'nope' && lowerInput !== '') {
          const moreIngredients = userInput.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
          allIngredients = [...ingredients, ...moreIngredients];
        }

        const shuffled = shuffleArray(allIngredients);
        const quantity = Math.floor(Math.random() * Math.min(4, shuffled.length));
        const selectedIngredients = shuffled.slice(quantity);

        addMessage('bot', `Ok sweet. These ingredients actually set you up perfectly for making ${cocktailName}.`);
        setTimeout(() => {
          addMessage(
            'bot',
            `Based on the ingredients that you have available, I'd recommend using the following to make ${cocktailName}:`
          );
          setTimeout(() => {
            addMessage('bot', selectedIngredients.join(', '));
            setTimeout(() => {
              addMessage('bot', 'Good luck.');
              setStep('done');
            }, 300);
          }, 300);
        }, 500);
        setStep('show_recipe');
        break;
      }
      default:
        break;
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 0,
        type: 'bot',
        text: 'Welcome to the an I Cocktail Recipe Generator! How many "an"s are in the name of the cocktail you\'d like? (enter any integer)',
      },
    ]);
    setStep('ask_an');
    setAnCount(0);
    setACount(0);
    setCocktailName('');
    setIngredients([]);
    setInput('');
  };

  const isWaiting = step === 'show_name' || step === 'show_recipe';

  return (
    <div className="flex flex-col h-[500px] max-w-md mx-auto bg-black/50 rounded-lg border border-pink-500/50">
      <div className="p-3 border-b border-pink-500/50 flex justify-between items-center">
        <h2 className="text-pink-400 font-bold text-lg">AI Cocktail Recipe Generator</h2>
        <button
          onClick={handleReset}
          className="text-xs px-2 py-1 bg-pink-600 hover:bg-pink-500 rounded text-white transition-colors"
        >
          Start Over
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] px-3 py-2 rounded-lg ${
                msg.type === 'user'
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-800 text-cyan-300 border border-cyan-500/30'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {step !== 'done' && (
        <form onSubmit={handleSubmit} className="p-3 border-t border-pink-500/50 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isWaiting}
            placeholder={isWaiting ? 'Please wait...' : 'Type your answer...'}
            className="flex-1 px-3 py-2 bg-gray-900 border border-pink-500/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-pink-400"
          />
          <button
            type="submit"
            disabled={isWaiting || !input.trim()}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded text-white transition-colors"
          >
            Send
          </button>
        </form>
      )}

      {step === 'done' && (
        <div className="p-3 border-t border-pink-500/50 text-center">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white transition-colors"
          >
            Make Another Cocktail
          </button>
        </div>
      )}
    </div>
  );
}
