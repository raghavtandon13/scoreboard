"use client";

export default function NewsPage() {
    const news = [
        {
            id: 1,
            title: "Premier League Title Race Heats Up",
            category: "Analysis",
            time: "2 hours ago",
            image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
        },
        {
            id: 2,
            title: "Champions League Quarter-Final Draw Results",
            category: "News",
            time: "4 hours ago",
            image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800",
        },
        {
            id: 3,
            title: "Top Scorers Update: Who Leads the Race?",
            category: "Stats",
            time: "6 hours ago",
            image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800",
        },
    ];

    return (
        <div className="space-y-8">
            <section className="py-8">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="font-black font-headline text-3xl uppercase tracking-tighter">
                        HOT{" "}
                        <span className="text-primary italic">THIS WEEK</span>
                    </h2>
                    <button
                        type="button"
                        className="font-label text-primary text-xs uppercase transition-all hover:underline"
                    >
                        View All News
                    </button>
                </div>
                <div className="grid h-auto grid-cols-1 gap-4 md:h-[500px] md:grid-cols-12">
                    <div className="group relative overflow-hidden rounded-xl bg-surface-container-high md:col-span-8">
                        <img
                            src={news[0].image}
                            alt={news[0].title}
                            className="h-64 w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105 md:h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 w-full p-8">
                            <div className="mb-3 flex items-center gap-2">
                                <span className="rounded bg-primary px-2 py-0.5 font-bold font-label text-[10px] text-on-primary uppercase">
                                    {news[0].category}
                                </span>
                                <span className="font-label text-[10px] text-on-surface-variant uppercase">
                                    {news[0].time}
                                </span>
                            </div>
                            <h3 className="mb-4 max-w-2xl font-black font-headline text-4xl text-on-surface uppercase leading-none tracking-tighter">
                                {news[0].title}
                            </h3>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 md:col-span-4">
                        {news.slice(1).map((item) => (
                            <div
                                key={item.id}
                                className="group relative flex-1 overflow-hidden rounded-xl bg-surface-container-high"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-full w-full object-cover opacity-40 transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-surface-container-low to-transparent" />
                                <div className="absolute inset-0 flex flex-col justify-end p-6">
                                    <span className="mb-1 font-bold font-label text-[10px] text-tertiary uppercase tracking-widest">
                                        {item.category}
                                    </span>
                                    <h4 className="font-bold font-headline text-xl uppercase tracking-tight">
                                        {item.title}
                                    </h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-10 border-outline-variant/10 border-t py-12 lg:grid-cols-12">
                <div className="space-y-8 lg:col-span-8">
                    <div className="flex items-center justify-between">
                        <h3 className="font-black font-headline text-2xl uppercase tracking-tighter">
                            THE FEED
                        </h3>
                    </div>
                    <div className="space-y-6">
                        {news.map((item) => (
                            <div
                                key={item.id}
                                className="group grid grid-cols-1 items-start gap-6 md:grid-cols-4"
                            >
                                <div className="aspect-video overflow-hidden rounded-lg border border-outline-variant/10 bg-surface-container-high md:aspect-square">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-full w-full object-cover opacity-80 transition-transform group-hover:scale-105"
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <div className="mb-2 flex items-center gap-3">
                                        <span className="font-bold font-label text-[10px] text-primary uppercase tracking-widest">
                                            {item.category}
                                        </span>
                                        <span className="h-1 w-1 rounded-full bg-outline-variant" />
                                        <span className="font-label text-[10px] text-on-surface-variant uppercase">
                                            {item.time}
                                        </span>
                                    </div>
                                    <h4 className="cursor-pointer font-bold font-headline text-2xl uppercase leading-7 tracking-tight transition-colors group-hover:text-primary">
                                        {item.title}
                                    </h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-8 lg:col-span-4">
                    <div className="overflow-hidden rounded-xl bg-surface-container-high shadow-2xl">
                        <div className="border-outline-variant/10 border-b bg-surface-container-highest p-6">
                            <h3 className="flex items-center gap-2 font-bold font-headline text-lg uppercase tracking-tight">
                                <span className="material-symbols-outlined text-primary">
                                    trending_up
                                </span>
                                Trending Topics
                            </h3>
                        </div>
                        <div className="space-y-4 p-6">
                            {[
                                "#PremierLeague",
                                "#ChampionsLeague",
                                "#TransferWindow",
                                "#xGAnalysis",
                            ].map((topic, index) => (
                                <span
                                    key={index}
                                    className={`${
                                        index === 0
                                            ? "rounded-lg border border-primary/20 bg-primary/10 px-4 py-2 text-primary"
                                            : "rounded-lg border border-outline-variant/20 bg-surface-container-high px-4 py-2"
                                    } mr-2 mb-2 inline-block cursor-pointer rounded-lg border border-outline-variant/20 px-4 py-2 font-label text-[10px] text-on-surface-variant uppercase transition-all hover:border-primary`}
                                >
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
