import { Bot, Brain, TrendingUp, MessageSquare, Zap, Twitter, ArrowRight, Database, Newspaper, Users, Book } from 'lucide-react';
import Logo from "./images/logo-no-bg.png"
import CryptoParrot from "./images/crypto-parrot.jpeg"
import Autonome from "./images/autonome.png"
import Hyperbolic from "./images/hyperbolic.png"

function App() {
  return (
    <div className="min-h-screen animated-bg text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 mb-6">
            <img src={Logo} className='w-18 h-12' />
            {/* <Brain className="w-12 h-12 text-blue-500" /> */}
            <h1 className="text-4xl md:text-6xl font-bold font-cassio">ChatCX</h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-4 font-cassio">
            The Only AI Agent You Need for Web3 Twitter Intelligence
          </p>
          <p className="text-lg text-gray-400 max-w-3xl mb-8">
            Web3 Twitter is a goldmine of alpha, yet most of it disappears into the void. Track, analyze, and act on it in real-time.
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-all font-cassio">
            Get Started <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8 text-blue-500" />}
            title="Stay Ahead of the Curve"
            description="Get real-time updates on emerging trends, narratives, and market-shifting conversations before they explode."
          />
          <FeatureCard
            icon={<Database className="w-8 h-8 text-blue-500" />}
            title="Pure, Actionable Insights"
            description="No noise. No distractions. Just data-backed answers about trending tokens, narratives, and strategies."
          />
          <FeatureCard
            icon={<Brain className="w-8 h-8 text-blue-500" />}
            title="AI-Powered Intelligence"
            description="Advanced RAG and Reinforcement Learning algorithms ensure you get only the most relevant insights."
          />
        </div>

        {/* Who is it for */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 font-cassio">Who is ChatCX for?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-800 rounded-xl p-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 font-cassio">
                <Bot className="w-6 h-6 text-blue-500" />
                DeFAI Agents
              </h3>
              <p className="text-gray-300">
                Use real-time insights in your DeFAI Agent pipeline to make more informed decisions.
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 font-cassio">
                <Users className="w-6 h-6 text-blue-500" />
                Marketers & Growth Hackers
              </h3>
              <p className="text-gray-300">
                Find the hottest narratives and trends before they go viral. Ride the meta. Win the game.
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 font-cassio">
                <Newspaper className="w-6 h-6 text-blue-500" />
                Newsletter Writers
              </h3>
              <p className="text-gray-300">
                Stop manual curation. Auto-generate the freshest, most relevant insights for your next issue.
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 font-cassio">
                <TrendingUp className="w-6 h-6 text-blue-500" />
                Traders & Investors
              </h3>
              <p className="text-gray-300">
                Get alpha on narratives in real-time. Don't just follow the hype—catch it before it happens.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 font-cassio">How ChatCX Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-gray-800 rounded-xl p-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 font-cassio">
                <Twitter className="w-6 h-6 text-blue-500" />
                Real-time Data Tracking
              </h3>
              <p className="text-gray-300">
                We continuously monitor and analyze posts from top Web3 influencers, analysts, and builders, building a comprehensive knowledge base.
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 font-cassio">
                <Zap className="w-6 h-6 text-blue-500" />
                Intelligent Filtering
              </h3>
              <p className="text-gray-300">
                Our RAG and Reinforcement Learning algorithms process the data to extract actionable insights and identify emerging trends.
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 font-cassio">
                <Brain className="w-6 h-6 text-blue-500" />
                Actionable Results
              </h3>
              <p className="text-gray-300">
                Get instant, data-backed answers about trending tokens, narratives, and strategies to inform your decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 font-cassio">Available Products</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <ProductCard
              icon={<Bot className="w-8 h-8" />}
              title="ChatCX Chat"
              description="Get instant insights directly through our Telegram bot. Just ask and receive."
              link="#"
            />
            <ProductCard
              icon={<img src={CryptoParrot} className='w-8 h-8' />}
              title="Crypto Parrot"
              description="AI-powered newsfeed delivering curated insights on Telegram. Stay informed 24/7."
              link="#"
            />
            <ProductCard
              icon={<MessageSquare className="w-8 h-8" />}
              title="API Access"
              description="Coming Soon - Integrate ChatCX insights into your own agents, tools and dashboards."
              link="#"
              soon
            />
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold mb-4 font-cassio">Be the First to Know. Be the First to Act.</h2>
          <p className="text-xl text-gray-300 mb-8">
            Don't wait for the next bull run to pass you by. Get the edge you need to stay ahead of the market.
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-all mx-auto font-cassio">
            Join the Future of Crypto Intelligence <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Powered By */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold mb-8 font-cassio">Powered By</h2>
          <div className="flex justify-center items-center gap-8">
            <div>
              <a href="https://autonome.fun" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors">
                autonome.fun
                <img src={Autonome} />
              </a>
            </div>
            <span className="text-gray-500">×</span>
            <div>
              <a href="https://www.hyperbolic.xyz" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors">
                hyperbolic.xyz
                <img src={Hyperbolic} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src={Logo} className='w-8 h-6' />
            <span className="font-bold font-cassio">ChatCX</span>
          </div>
          <p>© 2024 ChatCX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="bg-gray-800 rounded-xl p-8 hover:transform hover:-translate-y-1 transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-4 font-cassio">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

function ProductCard({ icon, title, description, link, soon = false }: any) {
  return (
    <a
      href={link}
      className={`block bg-gray-800 rounded-xl p-8 hover:transform hover:-translate-y-1 transition-all ${soon ? 'opacity-75' : ''
        }`}
    >
      <div className="mb-4 text-blue-500">{icon}</div>
      <h3 className="text-xl font-semibold mb-4 font-cassio">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      <div className="flex items-center gap-2 text-blue-500">
        {soon ? 'Coming Soon' : 'Learn More'} <ArrowRight className="w-4 h-4" />
      </div>
    </a>
  );
}

export default App;