import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-primary">
              {title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              This page is coming soon! We're building something amazing here.
            </p>
          </div>

          <div className="bg-gradient-to-br from-lavender/10 to-mint/10 rounded-2xl p-12 border border-lavender/20">
            <div className="text-6xl mb-6">🚀</div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Keep an eye on this space. In the meantime, explore other sections
              or start your financial learning journey on our homepage.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link
              to="/"
              className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all inline-flex items-center justify-center gap-2"
            >
              Back to Home <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-all">
              Notify Me
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
