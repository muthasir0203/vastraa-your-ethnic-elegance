import { motion } from "framer-motion";

interface CategoryBannerProps {
    category: string;
}

const categoryInfo: Record<string, { title: string; subtitle: string; bg: string }> = {
    "Sarees": {
        title: "Timeless Sarees",
        subtitle: "Experience the elegance of traditional weaves and modern designs.",
        bg: "bg-primary/20"
    },
    "Kurtis": {
        title: "Chic Kurtis",
        subtitle: "Comfortable and stylish kurtis for every occasion.",
        bg: "bg-secondary/20"
    },
    "Kurta Sets": {
        title: "Elegant Kurta Sets",
        subtitle: "Complete ethnic looks for parties and celebrations.",
        bg: "bg-accent/20"
    },
    "Lehengas": {
        title: "Grand Lehengas",
        subtitle: "Majestic lehenga cholis for weddings and grand events.",
        bg: "bg-primary/10"
    },
    "Dress Materials": {
        title: "Custom Dress Materials",
        subtitle: "Create your own style with our premium unstitched fabrics.",
        bg: "bg-muted"
    },
    "Dupattas": {
        title: "Vibrant Dupattas",
        subtitle: "The perfect finishing touch for your ethnic ensemble.",
        bg: "bg-secondary/10"
    },
    "New Arrivals": {
        title: "Fresh Collection",
        subtitle: "Discover the latest trends in ethnic elegance.",
        bg: "bg-primary/30"
    },
    "Festive Collection": {
        title: "Festive Splendor",
        subtitle: "Glitter and glow with our stunning festive wear.",
        bg: "bg-accent/30"
    },
    "Wedding Collection": {
        title: "Bridal & Wedding",
        subtitle: "Celebrate your special day with our exquisite wedding attire.",
        bg: "bg-primary/40"
    }
};

const CategoryBanner = ({ category }: CategoryBannerProps) => {
    const info = categoryInfo[category] || {
        title: category || "All Products",
        subtitle: "Explore our wide range of ethnic elegance.",
        bg: "bg-muted"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full rounded-2xl p-8 md:p-12 mb-8 ${info.bg} flex flex-col items-center text-center overflow-hidden relative shadow-soft`}
        >
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <h1 className="font-heading text-3xl md:text-5xl font-extrabold text-foreground mb-4">
                {info.title}
            </h1>
            <p className="font-body text-sm md:text-lg text-muted-foreground max-w-2xl">
                {info.subtitle}
            </p>
        </motion.div>
    );
};

export default CategoryBanner;
