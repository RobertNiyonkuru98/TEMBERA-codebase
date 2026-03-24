import { Link } from "react-router-dom";
import { useI18n } from "@/core/i18n";
import { CheckCircle2, Shield, Award, TrendingUp, ArrowRight } from "lucide-react";
import volcanoImg from "@/assets/forigners_on_top_of_volcano.jpg";
import lakeKivuImg from "@/assets/lake_kivu.jpg";
import akageraNpImg from "@/assets/akagera_np.jpeg";

function VisitorShowcasePage() {
  const { t } = useI18n();

  const features = [
    { icon: CheckCircle2, text: t("showcase.feature1") },
    { icon: Shield, text: t("showcase.feature2") },
    { icon: Award, text: t("showcase.feature3") },
  ];

  const reasons = [
    {
      icon: TrendingUp,
      title: t("showcase.reason1Title"),
      description: t("showcase.reason1Desc"),
      image: volcanoImg,
    },
    {
      icon: Shield,
      title: t("showcase.reason2Title"),
      description: t("showcase.reason2Desc"),
      image: lakeKivuImg,
    },
    {
      icon: Award,
      title: t("showcase.reason3Title"),
      description: t("showcase.reason3Desc"),
      image: akageraNpImg,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto w-[95%] max-w-[1920px] space-y-20 py-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            <Award className="h-4 w-4" />
            {t("showcase.title")}
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
            {t("showcase.subtitle")}
          </h1>
          <div className="mx-auto max-w-3xl space-y-4">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 text-left transition-all hover:border-emerald-500/50 hover:shadow-lg"
                >
                  <div className="rounded-xl bg-emerald-100 dark:bg-emerald-900/20 p-3">
                    <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-lg text-slate-700 dark:text-slate-300">{feature.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
              {t("showcase.whyChooseUs")}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              {t("showcase.whySubtitle")}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {reasons.map((reason, idx) => {
              const Icon = reason.icon;
              return (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 transition-all hover:shadow-2xl hover:-translate-y-2"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={reason.image}
                      alt={reason.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="rounded-xl bg-emerald-500 p-2">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {reason.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-500 to-emerald-600 p-12 text-center shadow-2xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
          <div className="relative space-y-6">
            <h2 className="text-4xl font-bold text-white sm:text-5xl">
              {t("showcase.ctaTitle")}
            </h2>
            <p className="text-xl text-emerald-50 max-w-2xl mx-auto">
              {t("showcase.ctaSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                to="/itineraries"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-emerald-600 shadow-lg transition-all hover:shadow-xl hover:scale-105"
              >
                {t("showcase.ctaButton")}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white hover:text-emerald-600"
              >
                {t("nav.getStarted")}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default VisitorShowcasePage;
