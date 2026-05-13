import { HomeView } from "@/modules/home/ui/view/home-view";
import { HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const Home = () => {
  return (
    <HydrationBoundary>
      <Suspense fallback={<p>Loading...</p>}>
        <ErrorBoundary fallback={<p>Error</p>}>
          <HomeView/>
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
};

export default Home