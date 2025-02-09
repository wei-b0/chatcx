import { Bot, Brain, TrendingUp, MessageSquare, Zap, Twitter, ArrowRight, Database, Newspaper, Users } from 'lucide-react';
import Logo from "./images/logo-no-bg.png"
import CryptoParrot from "./images/crypto-parrot.jpeg"
import Autonome from "./images/autonome.png"
import Hyperbolic from "./images/hyperbolic.png"

function App() {
  return (
    <div className="min-h-screen animated-bg text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <img src={Logo} className="w-12 h-8 md:w-14 md:h-10" alt="Logo" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-cassio">ChatCX</h1>
          </div>
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 max-w-3xl mb-4 font-cassio leading-relaxed px-4">
            The Only AI Agent You Need for Web3 Twitter Intelligence
          </p>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mb-8 px-4 leading-relaxed">
            Web3 Twitter is a goldmine of alpha, yet most of it disappears into the void. Track, analyze, and act on it in real-time.
          </p>
          <div className='flex flex-col space-y-4 md:flex-row md:space-x-5 md:space-y-0'>
            <button onClick={() => window.open('https://t.me/ChatCXAI_Bot', '_blank', 'noopener,noreferrer')} className="bg-blue-800 hover:bg-blue-500 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-all font-cassio w-full sm:w-auto justify-center">
              Get Started <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => window.open('https://chatcx.gitbook.io/chatcx-docs', '_blank', 'noopener,noreferrer')}
              className="bg-blue-500 hover:bg-blue-800 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-all font-cassio w-full sm:w-auto justify-center">
              Documentation <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 md:mb-20">
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


        {/* Products */}
        <div className="mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 font-cassio">Available Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProductCard
              icon={<img src={Logo} className="w-10 h-10 object-contain" alt="ChatCX Logo" />}
              title="ChatCX Chat"
              description="Get instant insights directly through our Telegram bot. Just ask and receive."
              link="https://t.me/ChatCXAI_Bot"
            />
            <ProductCard
              icon={<img src={CryptoParrot} className="w-10 h-10 object-contain rounded-full" alt="Crypto Parrot" />}
              title="Crypto Parrot"
              description="AI-powered newsfeed delivering curated insights on Telegram. Stay informed 24/7."
              link="https://t.me/CryptoParrotAI_Bot"
            />
            <ProductCard
              icon={<MessageSquare className="w-10 h-10" />}
              title="API Access"
              description="Integrate ChatCX insights into your own agents, tools and dashboards."
              link="https://chatcx.gitbook.io/chatcx-docs/"
            />
          </div>
        </div>

        {/* Who is it for */}
        <div className="mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 font-cassio">
            Who is ChatCX for?
          </h2>

          {/* First Grid - 3 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <UserCard
              icon={<Bot className="w-6 h-6 text-blue-500" />}
              title="DeFAI Agents"
              description="Use real-time insights in your DeFAI Agent pipeline to make more informed decisions."
            />
            <UserCard
              icon={<Users className="w-6 h-6 text-blue-500" />}
              title="Marketers & Growth Hackers"
              description="Find the hottest narratives and trends before they go viral. Ride the meta. Win the game."
            />
            <UserCard
              icon={<Newspaper className="w-6 h-6 text-blue-500" />}
              title="Newsletter Writers"
              description="Stop manual curation. Auto-generate the freshest, most relevant insights for your next issue."
            />
          </div>

          {/* Second Grid - Centered 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-center mt-6">
            <UserCard
              icon={<Users className="w-6 h-6 text-blue-500" />}
              title="Community Owners & DAO Leaders"
              description="Empower your ecosystem with a dedicated intelligence agent that tracks only top voices in your DAO, L2, or NFT community."
            />
            <UserCard
              icon={<TrendingUp className="w-6 h-6 text-blue-500" />}
              title="Traders & Investors"
              description="Get alpha on narratives in real-time. Don't just follow the hype—catch it before it happens."
            />
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 font-cassio">How ChatCX Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <WorkCard
              icon={<Twitter className="w-6 h-6 text-blue-500" />}
              title="Real-time Data Tracking"
              description="We continuously monitor and analyze posts from top Web3 influencers, analysts, and builders, building a comprehensive knowledge base."
            />
            <WorkCard
              icon={<Zap className="w-6 h-6 text-blue-500" />}
              title="Intelligent Filtering"
              description="Our RAG and Reinforcement Learning algorithms process the data to extract actionable insights and identify emerging trends."
            />
            <WorkCard
              icon={<Brain className="w-6 h-6 text-blue-500" />}
              title="Actionable Results"
              description="Get instant, data-backed answers about trending tokens, narratives, and strategies to inform your decisions."
            />
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-cassio px-4">Be the First to Know.<br className="sm:hidden" /> Be the First to Act.</h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto px-4">
            Don't wait for the next bull run to pass you by. Get the edge you need to stay ahead of the market.
          </p>
          <button onClick={() => window.open('https://t.me/chatcxdotfun', '_blank', 'noopener,noreferrer')} className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-all mx-auto font-cassio w-full sm:w-auto justify-center">
            Join the Future of Crypto Intelligence <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Powered By */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 font-cassio">Powered By</h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
            <a href="https://autonome.fun" target="_blank" rel="noopener noreferrer"
              className="group flex flex-col items-center hover:opacity-80 transition-opacity">
              <img src={Autonome} alt="Autonome" className="w-32 h-12 mb-2" />
              <span className="text-blue-500 group-hover:text-blue-400 transition-colors">autonome.fun</span>
            </a>
            <span className="text-gray-500 hidden sm:block">×</span>
            <a href="https://www.hyperbolic.xyz" target="_blank" rel="noopener noreferrer"
              className="group flex flex-col items-center hover:opacity-80 transition-opacity">
              <img src={Hyperbolic} alt="Hyperbolic" className="w-32 h-12 mb-2" />
              <span className="text-blue-500 group-hover:text-blue-400 transition-colors">hyperbolic.xyz</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src={Logo} className="w-8 h-6" alt="Logo" />
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
    <div className="bg-gray-800 rounded-xl p-6 md:p-8 hover:transform hover:-translate-y-1 transition-all h-full">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-4 font-cassio">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

function UserCard({ icon, title, description }: any) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 md:p-8 h-full">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 font-cassio">
        {icon}
        {title}
      </h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

function WorkCard({ icon, title, description }: any) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 md:p-8 h-full">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 font-cassio">
        {icon}
        {title}
      </h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

function ProductCard({ icon, title, description, link }: any) {
  return (
    <a
      href={link}
      target='_blank'
      className={`block bg-gray-800 rounded-xl p-6 md:p-8 hover:transform hover:-translate-y-1 transition-all h-full`}
    >
      <div className="mb-4 text-blue-500">{icon}</div>
      <h3 className="text-xl font-semibold mb-4 font-cassio">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      <div className="flex items-center gap-2 text-blue-500">
        <ArrowRight className="w-4 h-4" />
      </div>
    </a>
  );
}

export default App;