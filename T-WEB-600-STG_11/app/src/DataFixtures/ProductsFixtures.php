<?php

namespace App\DataFixtures;

use App\Entity\Product;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ProductsFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $images = glob(__DIR__ . '/images/products/*.png');

        $productsDescriptions = [
            "The best pal! You won't find a more loyal companion than this one. With exceptional quality and unmatched durability, this pal is your perfect partner in all life's adventures. Whether accompanying you on travels, at parties with friends, or simply by your side day-to-day, this pal is always there to bring joy and reliability to your life.",
            "With this one, you will be the king of the party. This isn't just any pal - it's the life of the party! With its charm, charisma, and endless fun, this pal will ensure that every gathering you attend becomes an unforgettable event. From its witty banter to its infectious energy, this pal knows how to make every moment shine.",
            "The best one for the best price. Don't settle for less when you can have the best without breaking the bank. This pal offers top-notch quality at an unbeatable price, giving you the satisfaction of knowing you've made a smart investment. From its superior craftsmanship to its affordable price tag, this pal delivers excellence without compromise.",
            "The most beautiful one. Prepare to be dazzled by the sheer beauty of this pal. With its stunning design, elegant features, and graceful presence, this pal is a true work of art. Whether displayed as a centerpiece in your home or admired for its aesthetic appeal, this pal is sure to capture the admiration of all who behold it.",
            "The most expensive one. Luxury knows no bounds with this pal. Crafted from the finest materials and adorned with exquisite details, this pal exudes opulence and sophistication. While its price may be steep, the unparalleled quality and prestige it offers make it a worthwhile investment for those who demand nothing but the best.",
            "A special one. This pal is more than just a companion - it's a cherished treasure. With its unique charm, endearing personality, and undeniable allure, this pal holds a special place in the hearts of all who encounter it. Whether as a gift for a loved one or a treat for yourself, this pal is sure to bring joy and warmth to any occasion.",
            "Elevate your experience with this exceptional pal. Designed to exceed your expectations, this pal combines innovation with elegance to deliver a truly remarkable companion. From its sleek design to its advanced features, this pal sets the standard for excellence in quality and performance.",
            "Unleash your inner adventurer with this adventurous pal by your side. With its rugged durability and adventurous spirit, this pal is always ready to embark on new journeys and explore uncharted territories. Whether hiking through the wilderness or conquering urban jungles, this pal is the perfect companion for any expedition.",
            "Ignite your creativity with this inspiring pal. With its vibrant personality and boundless imagination, this pal sparks creativity and fuels your artistic passions. Whether brainstorming new ideas or bringing your vision to life, this pal is your creative muse, always ready to inspire and support your artistic endeavors.",
            "Experience the epitome of comfort and coziness with this cuddly pal. Soft, plush, and oh-so-huggable, this pal wraps you in warmth and affection whenever you need it most. Whether snuggled up on the couch or nestled in bed, this pal is the perfect companion for relaxation and serenity.",
            "Step into the spotlight with this charismatic pal. With its outgoing personality and natural charm, this pal steals the show wherever it goes. Whether dazzling crowds with its wit and humor or captivating audiences with its charisma, this pal is the ultimate entertainer, always ready to shine in the spotlight.",
            "Unleash the power of positivity with this optimistic pal. With its sunny disposition and infectious optimism, this pal brightens even the darkest of days. Whether offering words of encouragement or spreading joy with its infectious laughter, this pal is a beacon of positivity in a world that sometimes needs a little extra sunshine.",
            "Embrace elegance and sophistication with this refined pal. With its timeless style and graceful demeanor, this pal exudes sophistication and class. Whether attending formal events or simply enjoying a quiet evening at home, this pal adds a touch of elegance to every occasion.",
            "Indulge in luxury with this lavish pal. With its extravagant design and opulent features, this pal is a symbol of luxury and refinement. Whether lounging in luxury or indulging in extravagance, this pal brings a touch of decadence to your life that is simply irresistible.",
            "Experience the thrill of the unknown with this mysterious pal. With its enigmatic aura and magnetic charm, this pal keeps you guessing and leaves you intrigued. Whether unraveling mysteries or exploring new horizons, this pal adds an element of excitement and adventure to every moment."
        ];


        foreach ($images as $image) {
            $product = new Product();
            $name = pathinfo($image, PATHINFO_FILENAME);
            $product->setName($name);
            $product->setDescription(
                $productsDescriptions[array_rand($productsDescriptions)]
            );
            $product->setPrice(rand(1000, 10000));
            $product->setImage(base64_encode(file_get_contents($image)));

            $manager->persist($product);
        }

        $accessories = glob(__DIR__ . '/images/accessories/*.png');

        $accessoriesDescriptions = [
            "The best for your pal! Ensure your pal is always at its best with this top-notch accessory. Designed for ultimate functionality and style, this accessory enhances your pal's performance and appearance, making it the envy of all who see it. From its sleek design to its superior craftsmanship, this accessory is a must-have for any discerning pal owner.",
            "With this one, your pal will be the king of the party. Elevate your pal's party game with this accessory that brings fun and excitement to any gathering. From its vibrant colors to its playful design, this accessory ensures your pal stands out from the crowd and commands attention wherever it goes. Get ready to turn heads and be the life of the party with this must-have accessory for your pal.",
            "The best one for the best price. Don't compromise on quality or affordability when it comes to accessorizing your pal. This accessory offers unbeatable value without sacrificing performance or style. With its durable construction and budget-friendly price tag, this accessory is the perfect combination of quality and affordability, ensuring your pal looks and performs its best without breaking the bank.",
            "The most beautiful one. Enhance your pal's beauty with this accessory that exudes elegance and sophistication. From its exquisite design to its delicate details, this accessory adds a touch of glamour to your pal's appearance, making it a true standout. Whether dressing up for a special occasion or simply adding a touch of luxury to everyday life, this accessory is sure to impress.",
            "The most expensive one. Treat your pal to the ultimate luxury with this accessory crafted from the finest materials and adorned with exquisite details. While its price may be steep, the unparalleled quality and prestige it offers make it a worthwhile investment for those who demand nothing but the best for their pal. Elevate your pal's status and style with this exclusive accessory that redefines luxury.",
            "A special one. Make your pal feel truly special with this accessory that adds a personal touch to its appearance. Whether customizing with a monogram or adding a unique embellishment, this accessory allows you to express your pal's individuality and personality. With its sentimental value and heartfelt sentiment, this accessory is sure to become a cherished keepsake for you and your pal."
        ];


        foreach ($accessories as $accessory) {
            $product = new Product();
            $name = pathinfo($accessory, PATHINFO_FILENAME);
            $product->setName($name);
            $product->setDescription(
                $accessoriesDescriptions[array_rand($accessoriesDescriptions)]
            );
            $product->setPrice(rand(399, 999));
            $product->setImage(base64_encode(file_get_contents($accessory)));
            $product->setAccessory(true);
            $manager->persist($product);
        }

        $manager->flush();
    }
}
