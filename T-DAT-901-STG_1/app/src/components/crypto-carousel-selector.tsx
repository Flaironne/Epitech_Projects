import { Bitcoin } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { useCryptocurrency } from "../hooks/use-cryptocurrency.tsx";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel.tsx";
import { Badge } from "./ui/badge.tsx";
import type { Asset } from "../contexts/nft-context.tsx";
import { Skeleton } from "./ui/skeleton.tsx";
import { useState } from "react";
import { motion } from "framer-motion";

export function CryptoCarouselSelector() {
  const { cryptocurrencies } = useCryptocurrency();

  return (
    <div className="my-10">
      <Button
        className="
          flex items-center size-14 rounded-full mx-auto
          bg-[#3b82f6] text-white text-md font-semibold 
          shadow-xl hover:bg-[#2563eb] hover:cursor-pointer
        "
      >
        <Bitcoin className="size-8" />
      </Button>

      <div className="mt-8 overflow-hidden">
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent className="py-1 flex gap-2">
            {(!cryptocurrencies || cryptocurrencies.length === 0
              ? [...Array(12)]
              : cryptocurrencies
            ).map((crypto, i) =>
              crypto ? (
                <CryptoBadgeCarouselItem
                  key={(crypto as Asset).symbol}
                  crypto={crypto as Asset}
                />
              ) : (
                <SkeletonCryptoBadgeCarouselItem key={i} />
              )
            )}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}

function CryptoBadgeCarouselItem({ crypto }: { crypto: Asset }) {
  const { selectedCryptocurrencies, toggleSelectedCryptocurrency } =
    useCryptocurrency();
  const [imgError, setImgError] = useState(false);

  const isSelected = selectedCryptocurrencies.some(
    (c) => c.symbol === crypto.symbol
  );

  return (
    <CarouselItem className="shrink-0 grow-0 basis-[150px] min-w-[150px]">
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={() => toggleSelectedCryptocurrency(crypto)}
      >
        <Badge
          variant="outline"
          className={`flex flex-row justify-between items-center h-12 gap-2 px-2 py-2 min-w-full transition-colors cursor-pointer ${
            isSelected ? "bg-blue-50 border-blue-400" : "hover:bg-gray-100"
          }`}
        >
          {imgError || !crypto.thumb_url ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <Bitcoin className="size-5 text-gray-400" />
            </div>
          ) : (
            <img
              src={crypto.thumb_url}
              alt={crypto.name}
              className="w-8 h-8 rounded-full"
              onError={() => setImgError(true)}
            />
          )}
          <div className="flex-1 text-start ml-2">
            <span className="text-sm font-medium">{crypto.symbol}</span>
          </div>
        </Badge>
      </motion.div>
    </CarouselItem>
  );
}

function SkeletonCryptoBadgeCarouselItem() {
  return (
    <CarouselItem className="shrink-0 grow-0 basis-[135px] max-w-[135px]">
      <Badge
        variant="outline"
        className="flex flex-row items-center gap-2 px-2 py-2"
      >
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-16 h-4 rounded-md" />
      </Badge>
    </CarouselItem>
  );
}
