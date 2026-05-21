import { CryptoCarouselSelector } from "./components/crypto-carousel-selector.tsx";
import { CryptocurrencyProvider } from "./contexts/cryptocurrency-context.tsx";
import { Brand } from "./components/brand.tsx";
import { NFTCarousel } from "./components/nft-carousel.tsx";
import { CryptocurrenciesCompareGraph } from "./components/cryptocurrencies-compare-graph.tsx";
import { NFTProvider } from "./contexts/nft-context.tsx";
import { Footer } from "./components/footer.tsx";
import { CryptocurrencyCombinedChart } from "./components/cryptocurrency-combined-chart.tsx";

export function App() {
  return (
    <div className="w-full">
      <Brand />

      <main className="mt-18 px-8 max-w-6xl mx-auto min-h-screen overflow-x-hidden">
        <div className="mb-6">
          <NFTProvider>
            <NFTCarousel />
          </NFTProvider>
        </div>

        <CryptocurrencyProvider>
          <CryptoCarouselSelector />

          <div className="grid grid-cols-1 gap-6">
            <CryptocurrenciesCompareGraph />
          </div>

          <div className="my-10">
            <CryptocurrencyCombinedChart />
          </div>
        </CryptocurrencyProvider>
      </main>

      <Footer />
    </div>
  );
}
