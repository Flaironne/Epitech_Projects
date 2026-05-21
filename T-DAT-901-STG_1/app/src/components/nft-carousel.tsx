import Autoplay from "embla-carousel-autoplay";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { useNFT } from "../hooks/use-nft.tsx";
import type { Asset } from "../contexts/nft-context.tsx";
import { Skeleton } from "./ui/skeleton.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function NFTCarousel() {
  const { nfts, loading } = useNFT();

  return (
    <Carousel
      className="w-full"
      opts={{ loop: true }}
      plugins={[
        Autoplay({
          delay: 1500,
        }),
      ]}
    >
      <CarouselContent className="py-2">
        <AnimatePresence>
          {loading || !nfts || nfts.length === 0
            ? [...Array(12)].map((_, i) => (
              <SkeletonNFTCarouselItem key={i} />
            ))
            : nfts.map((nft) => (
              <NFTCarouselItem key={nft.symbol} nft={nft} />
            ))}
        </AnimatePresence>
      </CarouselContent>
    </Carousel>
  );
}

interface NFTCarouselItemProps {
  nft: Asset;
}

export function NFTCarouselItem({ nft }: NFTCarouselItemProps & { nft: Asset & { justUpdated?: boolean } }) {
  const color = nft.pct_change_24h >= 0 ? "text-green-500" : "text-red-500";
  const priceFormatted = `$${nft.price_usd?.toFixed(3)}`;

  return (
    <CarouselItem
      className="shrink-0 grow-0 basis-[280px] max-w-[280px]"
      title={nft.name}
    >
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ scale: 1.03 }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
          delay: Math.random() * 0.2,
        }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Card
              className={`rounded-2xl transition w-full 
                ${nft.justUpdated ? "bg-gray-50 animate-pulse" : "hover:bg-gray-50"}`}
            >
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={nft.thumb_url}
                    alt={nft.name}
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-800 max-w-[80px] overflow-hidden text-ellipsis whitespace-nowrap">
                      {nft.name}
                    </p>
                    <p className="text-sm text-gray-500">{nft.symbol}</p>
                  </div>
                </div>

                <div className="text-right">
                  <motion.p
                    className="font-semibold text-gray-800"
                    key={priceFormatted}
                    initial={{ y: -5, opacity: 0.5 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {priceFormatted}
                  </motion.p>

                  <motion.p
                    key={nft.pct_change_24h}
                    className={`text-sm ${color}`}
                    initial={{ scale: 0.9, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {nft.pct_change_24h >= 0 ? "▲" : "▼"}{" "}
                    {Math.abs(nft.pct_change_24h).toFixed(2)}%
                  </motion.p>
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>

          <TooltipContent>
            <p>
              {nft.name} ({nft.symbol}) — {priceFormatted},{" "}
              {nft.pct_change_24h >= 0 ? "▲" : "▼"}{" "}
              {Math.abs(nft.pct_change_24h).toFixed(2)}%
            </p>
          </TooltipContent>
        </Tooltip>
      </motion.div>
    </CarouselItem>
  );
}


function SkeletonNFTCarouselItem() {
  return (
    <CarouselItem className="shrink-0 grow-0 basis-[280px] max-w-[280px]">
      <Card className="rounded-2xl">
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          </div>

          <div className="text-right space-y-2">
            <Skeleton className="h-4 w-14 rounded ml-auto" />
            <Skeleton className="h-3 w-10 rounded ml-auto" />
          </div>
        </CardContent>
      </Card>
    </CarouselItem>
  );
}