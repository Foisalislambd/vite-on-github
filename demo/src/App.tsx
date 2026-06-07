import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { ProblemSolution } from './components/ProblemSolution';
import { QuickStart } from './components/QuickStart';
import { HowItWorks } from './components/HowItWorks';
import { RouterGuide } from './components/RouterGuide';
import { GitHubPagesGuide } from './components/GitHubPagesGuide';
import { ApiReference } from './components/ApiReference';
import { Faq } from './components/Faq';
import { SiteFooter } from './components/SiteFooter';

export default function App() {
  return (
    <Layout>
      <Hero />
      <ProblemSolution />
      <QuickStart />
      <HowItWorks />
      <RouterGuide />
      <GitHubPagesGuide />
      <ApiReference />
      <Faq />
      <SiteFooter />
    </Layout>
  );
}
